"""
Dataset loading and augmentation for training the crop disease classifier.

Expected directory layout (ImageFolder convention):

    dataset/raw/
        train/
            tomato_early_blight/
                img001.jpg
                img002.jpg
            rice_blast/
                ...
            healthy/
                ...
        val/
            tomato_early_blight/
                ...
        test/
            ...

Each subfolder name under train/val/test becomes a class label. Populate
dataset/raw/train and dataset/raw/val with your own labeled images before
running train.py -- see dataset/raw/README.md for details.
"""

import json
from pathlib import Path

import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


def build_transforms(image_size: int = 224, train: bool = True):
    if train:
        return transforms.Compose(
            [
                transforms.RandomResizedCrop(image_size, scale=(0.7, 1.0)),
                transforms.RandomHorizontalFlip(),
                transforms.RandomVerticalFlip(p=0.2),
                transforms.RandomRotation(20),
                transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05),
                transforms.ToTensor(),
                transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
                transforms.RandomErasing(p=0.1),
            ]
        )
    return transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ]
    )


def get_dataloaders(dataset_dir: str, image_size: int = 224, batch_size: int = 32, num_workers: int = 2):
    dataset_dir = Path(dataset_dir)
    train_dir = dataset_dir / "train"
    val_dir = dataset_dir / "val"

    if not train_dir.exists() or not any(train_dir.iterdir()):
        raise FileNotFoundError(
            f"No training data found at {train_dir}. "
            "Populate it with class subfolders of images before training. "
            "See dataset/raw/README.md for instructions."
        )

    train_dataset = datasets.ImageFolder(str(train_dir), transform=build_transforms(image_size, train=True))

    if val_dir.exists() and any(val_dir.iterdir()):
        val_dataset = datasets.ImageFolder(str(val_dir), transform=build_transforms(image_size, train=False))
    else:
        # Fall back to splitting the training set if no explicit val/ folder is provided.
        val_size = max(1, int(0.15 * len(train_dataset)))
        train_size = len(train_dataset) - val_size
        train_dataset, val_dataset = torch.utils.data.random_split(train_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    class_to_idx = getattr(train_dataset, "class_to_idx", None) or train_dataset.dataset.class_to_idx
    return train_loader, val_loader, class_to_idx


def save_class_map(class_to_idx: dict, path: str):
    idx_to_class = {str(v): k for k, v in class_to_idx.items()}
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(idx_to_class, f, indent=2)


def load_class_map(path: str) -> dict:
    with open(path, "r") as f:
        idx_to_class = json.load(f)
    return {int(k): v for k, v in idx_to_class.items()}
