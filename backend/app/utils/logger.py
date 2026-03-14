import csv
import os
from datetime import datetime

CSV_FILE = "predictions.csv"


def save_prediction(image_pred, lifestyle_pred, final_pred):
    file_exists = os.path.isfile(CSV_FILE)

    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "timestamp",
                "image_prediction",
                "lifestyle_prediction",
                "final_prediction"
            ])

        writer.writerow([
            datetime.now().isoformat(),
            image_pred,
            lifestyle_pred,
            final_pred
        ])
