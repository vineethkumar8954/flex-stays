# =============================================================================
# ASSIGNMENT CBA - Exercise 10: Build a REST API for a Trained Model
# =============================================================================

# ─── STEP 1: TRAIN & SAVE THE MODEL ──────────────────────────────────────────
import numpy as np
import joblib
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

print("=" * 65)
print("       EXERCISE 10: REST API FOR TRAINED MODEL")
print("=" * 65)

# Load Iris dataset
iris          = load_iris()
X, y          = iris.data, iris.target
class_names   = list(iris.target_names)           # ['setosa', 'versicolor', 'virginica']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalize features
scaler  = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# Train MLP classifier
model = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
model.fit(X_train, y_train)

acc = accuracy_score(y_test, model.predict(X_test))
print(f"\n  ✅ Model trained — Test accuracy: {acc * 100:.2f}%")

# Save model and scaler
joblib.dump(model,  "iris_model.pkl")
joblib.dump(scaler, "iris_scaler.pkl")
print("  ✅ Model saved  : iris_model.pkl")
print("  ✅ Scaler saved : iris_scaler.pkl")


# ─── STEP 2: FASTAPI APPLICATION ─────────────────────────────────────────────
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# ── Load artifacts ────────────────────────────────────────────────────────────
loaded_model  = joblib.load("iris_model.pkl")
loaded_scaler = joblib.load("iris_scaler.pkl")

# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="CBA Exercise 10 — Iris Classifier API",
    description=(
        "A trained ML model served via FastAPI.\n\n"
        "**Classes**: Iris-setosa | Iris-versicolor | Iris-virginica\n\n"
        "**POST** `/predict` with 4 flower measurements to get a prediction."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — allow all origins (for Postman / browser testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Schemas ────────────────────────────────────────────────
class PredictRequest(BaseModel):
    """Iris flower feature measurements."""
    feature1: float = Field(..., description="Sepal length (cm)", example=5.2)
    feature2: float = Field(..., description="Sepal width  (cm)", example=3.8)
    feature3: float = Field(..., description="Petal length (cm)", example=1.4)
    feature4: float = Field(..., description="Petal width  (cm)", example=0.3)


class PredictResponse(BaseModel):
    """Prediction result."""
    prediction:   str   = Field(..., description="Predicted class name")
    class_index:  int   = Field(..., description="Numeric class index (0/1/2)")
    confidence:   float = Field(..., description="Model confidence (0–1)")
    all_classes:  dict  = Field(..., description="Probabilities for all classes")


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/", summary="Health check")
def root():
    """Root endpoint — confirms the API is running."""
    return {
        "status":  "✅ API is running",
        "model":   "Iris MLP Classifier",
        "version": "1.0.0",
        "endpoints": {
            "predict": "POST /predict",
            "docs":    "GET  /docs"
        }
    }


@app.post("/predict", response_model=PredictResponse, summary="Predict Iris class")
def predict(request: PredictRequest):
    """
    Accepts 4 Iris flower measurements and returns the predicted species.

    **Example request body**:
    ```json
    {
        "feature1": 5.2,
        "feature2": 3.8,
        "feature3": 1.4,
        "feature4": 0.3
    }
    ```

    **Example response**:
    ```json
    {
        "prediction": "Iris-setosa",
        "class_index": 0,
        "confidence": 0.98,
        "all_classes": {
            "Iris-setosa": 0.98,
            "Iris-versicolor": 0.01,
            "Iris-virginica": 0.01
        }
    }
    ```
    """
    try:
        features   = np.array([[request.feature1,
                                 request.feature2,
                                 request.feature3,
                                 request.feature4]])
        scaled     = loaded_scaler.transform(features)
        pred_idx   = int(loaded_model.predict(scaled)[0])
        proba      = loaded_model.predict_proba(scaled)[0]
        confidence = float(proba[pred_idx])
        pred_label = f"Iris-{class_names[pred_idx]}"

        all_classes = {
            f"Iris-{class_names[i]}": round(float(p), 4)
            for i, p in enumerate(proba)
        }

        return PredictResponse(
            prediction  = pred_label,
            class_index = pred_idx,
            confidence  = round(confidence, 4),
            all_classes = all_classes
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/classes", summary="List all classes")
def get_classes():
    """Returns all possible prediction classes."""
    return {
        "classes": [f"Iris-{name}" for name in class_names],
        "total":   len(class_names)
    }


# ── Run Server ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n" + "=" * 65)
    print("  🚀 Starting FastAPI Server...")
    print("=" * 65)
    print("\n  API URL      : http://127.0.0.1:8000")
    print("  Swagger Docs : http://127.0.0.1:8000/docs")
    print("  ReDoc        : http://127.0.0.1:8000/redoc")
    print()
    print("  Test with curl:")
    print('  curl -X POST "http://127.0.0.1:8000/predict" \\')
    print('       -H "Content-Type: application/json" \\')
    print('       -d \'{"feature1":5.2,"feature2":3.8,"feature3":1.4,"feature4":0.3}\'')
    print()
    print("  Press CTRL+C to stop the server.")
    print("=" * 65)

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
