import tensorflow as tf
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# SETTINGS
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20  # Increased for transfer learning

train_path = "../data/scalp_images"

# DATA AUGMENTATION (PRO GRADE)
datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest',
    validation_split=0.2
)

# ENSURING CLASS ORDER: 0:Severe, 1:Moderate, 2:Mild, 3:Healthy
class_order = ["severe_scalp", "moderate_scalp", "mild_scalp", "healthy_scalp"]

train_data = datagen.flow_from_directory(
    train_path,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    classes=class_order,
    shuffle=True
)

val_data = datagen.flow_from_directory(
    train_path,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    classes=class_order,
    shuffle=True
)

# TRANSFER LEARNING: MobileNetV2 (Pre-trained on ImageNet)
# This is much smaller (14MB vs 134MB) and more accurate.
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base layers for initial training

model = tf.keras.Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(4, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("🚀 Starting Professional AI Retraining with MobileNetV2...")
model.fit(train_data, validation_data=val_data, epochs=EPOCHS)

# Fine-tuning: Unfreeze top layers (Optional but good for accuracy)
# base_model.trainable = True
# model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), ...)
# model.fit(...)

# SAVE FINAL UPGRADED MODEL
model.save("../scalp_model.h5")
print("✅ IMAGE MODEL UPGRADED: Scalp model saved to root as backend/scalp_model.h5")
print(f"Class Mapping: {train_data.class_indices}")
