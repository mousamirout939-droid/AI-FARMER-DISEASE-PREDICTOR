# Dataset Directory

Populate this directory with labeled crop leaf images before running
`app/ml/train.py`. The loader uses the standard `torchvision.datasets.ImageFolder`
convention: one subfolder per class, containing that class's images.

```
dataset/raw/
├── train/
│   ├── healthy/
│   │   ├── img001.jpg
│   │   └── img002.jpg
│   ├── tomato_early_blight/
│   │   ├── img001.jpg
│   │   └── ...
│   └── rice_blast/
│       └── ...
└── val/            # optional — if omitted, 15% of train/ is held out automatically
    ├── healthy/
    └── tomato_early_blight/
```

## Where to get data

This project does not ship a dataset (100+ disease classes across 50+ crops
requires tens of thousands of labeled images, too large to bundle). Good
public sources to build your dataset from:

- **PlantVillage** — ~54,000 labeled leaf images across 38 classes.
- **PlantDoc** — real-world field images across 13 crops / 27 classes.
- Your own field-collected photos, labeled by crop + disease.

## Class naming convention

Name each folder `<crop>_<disease>` in lowercase with underscores (e.g.
`tomato_early_blight`, `rice_blast`), and use `healthy` for disease-free
images. This matches the naming used in `app/ml/crops.py` for crop-name
inference and in the Node backend's `Disease.classLabel` field, so
predictions link up automatically with disease info in the database.

## Training

```bash
cd ai-service
pip install -r requirements.txt
python -m app.ml.train --epochs 20 --batch-size 32
```

This produces `checkpoints/best_model.pt` and `app/ml/class_map.json`,
which the FastAPI service (`app/main.py`) loads automatically on next
restart. Until a checkpoint is trained, the service runs in
`untrained_demo_mode` — fully functional end-to-end, but predictions are
not meaningful.
