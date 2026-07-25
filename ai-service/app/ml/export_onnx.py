"""
Exports the trained PyTorch checkpoint to ONNX format for faster/portable
inference (e.g. onnxruntime, mobile, edge devices).

Usage:
    python -m app.ml.export_onnx --checkpoint checkpoints/best_model.pt --output checkpoints/model.onnx
"""

import argparse

import torch

from app.ml.model import build_model


def parse_args():
    parser = argparse.ArgumentParser(description="Export trained model to ONNX")
    parser.add_argument("--checkpoint", default="checkpoints/best_model.pt")
    parser.add_argument("--output", default="checkpoints/model.onnx")
    parser.add_argument("--opset", type=int, default=17)
    return parser.parse_args()


def main():
    args = parse_args()

    checkpoint = torch.load(args.checkpoint, map_location="cpu")
    num_classes = checkpoint["num_classes"]
    image_size = checkpoint.get("image_size", 224)

    model = build_model(num_classes=num_classes, pretrained=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    dummy_input = torch.randn(1, 3, image_size, image_size)

    torch.onnx.export(
        model,
        dummy_input,
        args.output,
        input_names=["input"],
        output_names=["logits"],
        dynamic_axes={"input": {0: "batch_size"}, "logits": {0: "batch_size"}},
        opset_version=args.opset,
    )

    print(f"[Export] ONNX model saved to {args.output}")


if __name__ == "__main__":
    main()
