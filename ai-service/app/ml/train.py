"""
Training pipeline for the crop disease classifier.

Usage:
    python -m app.ml.train --epochs 20 --batch-size 32 --lr 3e-4

Trains a MobileNetV3-based classifier on images found in dataset/raw/train
(and dataset/raw/val, if present). Saves the best checkpoint to
checkpoints/best_model.pt and the class-index mapping to app/ml/class_map.json.

This script is fully functional -- point it at a populated dataset/raw/
directory (see dataset/raw/README.md) and it will train a real model. No
dataset ships with this project by default because 100+ disease classes
across 50+ crops require a proper labeled dataset (e.g. PlantVillage,
PlantDoc, or your own field-collected images) which is too large to bundle.
"""

import argparse
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from tqdm import tqdm

from app.ml.dataset import get_dataloaders, save_class_map
from app.ml.model import build_model


def parse_args():
    parser = argparse.ArgumentParser(description="Train the AI Farmer crop disease classifier")
    parser.add_argument("--dataset-dir", default="dataset/raw", help="Path to dataset root (train/val subfolders)")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=3e-4)
    parser.add_argument("--image-size", type=int, default=224)
    parser.add_argument("--freeze-backbone", action="store_true", help="Freeze pretrained backbone weights")
    parser.add_argument("--checkpoint-dir", default="checkpoints")
    parser.add_argument("--class-map-path", default="app/ml/class_map.json")
    parser.add_argument("--device", default="cuda" if torch.cuda.is_available() else "cpu")
    return parser.parse_args()


def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss, correct, total = 0.0, 0, 0

    for images, labels in tqdm(loader, desc="train", leave=False):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    return running_loss / total, correct / total


@torch.no_grad()
def evaluate(model, loader, criterion, device):
    model.eval()
    running_loss, correct, total = 0.0, 0, 0

    for images, labels in tqdm(loader, desc="val", leave=False):
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)

        running_loss += loss.item() * images.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    return running_loss / total, correct / total


def main():
    args = parse_args()
    device = torch.device(args.device)
    print(f"[Train] Using device: {device}")

    train_loader, val_loader, class_to_idx = get_dataloaders(
        args.dataset_dir, image_size=args.image_size, batch_size=args.batch_size
    )
    num_classes = len(class_to_idx)
    print(f"[Train] Found {num_classes} classes: {list(class_to_idx.keys())}")

    save_class_map(class_to_idx, args.class_map_path)
    print(f"[Train] Saved class map to {args.class_map_path}")

    model = build_model(num_classes=num_classes, pretrained=True, freeze_backbone=args.freeze_backbone).to(device)

    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=args.lr, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=args.epochs)

    checkpoint_dir = Path(args.checkpoint_dir)
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    best_val_acc = 0.0

    for epoch in range(1, args.epochs + 1):
        start = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = evaluate(model, val_loader, criterion, device)
        scheduler.step()
        elapsed = time.time() - start

        print(
            f"[Epoch {epoch}/{args.epochs}] "
            f"train_loss={train_loss:.4f} train_acc={train_acc:.4f} "
            f"val_loss={val_loss:.4f} val_acc={val_acc:.4f} ({elapsed:.1f}s)"
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "num_classes": num_classes,
                    "class_to_idx": class_to_idx,
                    "image_size": args.image_size,
                    "val_acc": val_acc,
                },
                checkpoint_dir / "best_model.pt",
            )
            print(f"[Train] Saved new best checkpoint (val_acc={val_acc:.4f})")

    print(f"[Train] Training complete. Best val accuracy: {best_val_acc:.4f}")
    print(f"[Train] Checkpoint saved at: {checkpoint_dir / 'best_model.pt'}")


if __name__ == "__main__":
    main()
