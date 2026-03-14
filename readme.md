# TrichoGuard

An AI-Powered Hair Health Analysis application that helps you predict and prevent hair loss based on Scalp Visuals and Lifestyle Habits.

## Project Structure

- `frontend/`: Next.js 15 application with TailwindCSS and Framer Motion. Contains the beautiful multi-step Analyze UI and the Results dashboard.
- `backend/`: FastAPI Python application. Serves the predictions utilizing Convolutional Neural Networks and Random Forest Classifiers.

## Showing The Machine Learning Model & Dataset to Externals / Investors

If you need to demonstrate how the platform is trained or show the underlying data, you can navigate to the `backend` folder where the ML training scripts and datasets live:

1. **Viewing the Dataset**
   - The primary lifestyle data used for training the Random Forest AI is located at: `backend/data/hair_fall_dataset.csv`.
   - You can open this file in Excel or any CSV viewer to show the raw features (Age, Genetics, Diet Quality, Stress, etc.).

2. **How to Retrain the Model**
   - If you acquire more patient data (more rows in the CSV), you can easily retrain the AI:
   - Navigate to `backend/` in your terminal.
   - Run: `python train_lifestyle_model.py`
   - This will instantly read the new data, train a new `RandomForestClassifier`, calculate its accuracy, and save the updated `.pkl` model into the `backend/models/` folder.

3. **How Predictions Work**
   - When users fill out the Lifestyle Form on the frontend, `backend/main.py` receives the data and correctly maps the text categorical variables (e.g. "Healthy - Balanced Diet") into the exact numeric scales the ML model was trained on (e.g., `2`).
   - It then passes these inputs into `lifestyle_model.pkl` to compute the risk stage.

## Running the App Locally

### 1. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the TrichoGuard platform. 
