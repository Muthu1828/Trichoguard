def fuse_predictions(image_pred, lifestyle_severity):

    severity_map = {
        "Low": 0,
        "Moderate": 1,
        "High": 2
    }

    img_score = severity_map.get(image_pred, 1)
    life_score = severity_map.get(lifestyle_severity, 1)

    final_score = round((img_score + life_score) / 2)

    reverse_map = {v: k for k, v in severity_map.items()}

    return reverse_map[final_score]