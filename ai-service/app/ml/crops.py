"""
Static metadata describing crops supported by the platform and helpers to
infer the crop name from a predicted class label (e.g.
"tomato_early_blight" -> "Tomato").

This list defines the 50+ crop types the product is designed to support.
Actual disease-detection coverage for a given crop depends on what classes
the deployed model checkpoint was trained on -- see class_map.json.
"""

SUPPORTED_CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tomato", "Potato", "Onion",
    "Brinjal", "Chilli", "Banana", "Papaya", "Apple", "Mango", "Orange",
    "Groundnut", "Soybean", "Millets", "Ragi", "Turmeric", "Ginger", "Coconut",
    "Arecanut", "Coffee", "Tea", "Barley", "Bajra", "Jowar", "Mustard",
    "Sunflower", "Sesame", "Castor", "Jute", "Tobacco", "Grapes", "Guava",
    "Pomegranate", "Watermelon", "Muskmelon", "Cucumber", "Pumpkin",
    "Bottle Gourd", "Bitter Gourd", "Cabbage", "Cauliflower", "Carrot",
    "Radish", "Spinach", "Okra", "Peas", "Chickpea", "Lentil", "Black Gram",
    "Green Gram", "Pigeon Pea", "Cashew", "Cardamom", "Black Pepper", "Betel Leaf",
]


def infer_crop_from_label(class_label: str) -> str:
    """Best-effort extraction of a crop name from a class_label like
    'tomato_early_blight' or 'healthy'."""
    if class_label == "healthy":
        return "General"
    token = class_label.split("_")[0]
    for crop in SUPPORTED_CROPS:
        if crop.lower().replace(" ", "") == token.lower():
            return crop
    return token.capitalize()
