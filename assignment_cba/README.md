# 📚 Assignment CBA — TensorFlow & PyTorch Exercises

> **10 hands-on exercises** covering tensors, neural networks, MNIST,
> transfer learning, custom training loops, and REST API deployment.

---

## 📁 Folder Structure

```
assignment_cba/
├── exercise1_tensor_creation.py        # Ex 1 : Tensor creation & properties
├── exercise2_tensor_operations.py      # Ex 2 : Add / Sub / Mul / Matmul
├── exercise3_tensor_reshaping.py       # Ex 3 : Reshape & flatten
├── exercise4_autodiff.py               # Ex 4 : Automatic differentiation
├── exercise5_neural_network.py         # Ex 5 : Build & summarize NN
├── exercise6_mnist_classification.py   # Ex 6 : MNIST > 95% accuracy
├── exercise7_save_load_model.py        # Ex 7 : Save / Load model
├── exercise8_transfer_learning.py      # Ex 8 : MobileNetV2 & ResNet50
├── exercise9_custom_training_loop.py   # Ex 9 : y = 2x + 5 regression
├── exercise10_rest_api.py              # Ex 10: FastAPI REST endpoint
├── Dockerfile                          # Bonus: Docker container
├── requirements.txt                    # All dependencies
├── requirements_api.txt                # Docker-only dependencies
└── README.md                           # This file
```

---

## ⚙️ Setup & Installation

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# 2. Install all dependencies
pip install -r requirements.txt
```

---

## 🚀 Running Each Exercise

```bash
python exercise1_tensor_creation.py
python exercise2_tensor_operations.py
python exercise3_tensor_reshaping.py
python exercise4_autodiff.py
python exercise5_neural_network.py
python exercise6_mnist_classification.py
python exercise7_save_load_model.py
python exercise8_transfer_learning.py
python exercise9_custom_training_loop.py
python exercise10_rest_api.py          # Starts FastAPI server
```

---

## 📋 Exercise Summary

| # | Topic | Libraries | Key Concepts |
|---|-------|-----------|--------------|
| 1 | Tensor Creation | TF + PT | `tf.constant`, `torch.tensor`, shape/dtype/ndim |
| 2 | Tensor Operations | TF + PT | add, subtract, element-wise mul, matmul |
| 3 | Tensor Reshaping | TF + PT | `tf.reshape`, `tensor.reshape`, `torch.flatten` |
| 4 | Auto-Differentiation | TF + PT | `GradientTape`, `autograd`, dy/dx at x=5 → 13 |
| 5 | Neural Network | Keras + nn.Module | 784→128(ReLU)→10, parameter count |
| 6 | MNIST Classification | Keras + PT | Load, normalize, train, eval >95%, predict |
| 7 | Save & Load Model | Keras + PT | `.h5`, `.pth`, `state_dict` |
| 8 | Transfer Learning | MobileNetV2 + ResNet50 | Freeze, replace head, fine-tune |
| 9 | Custom Training Loop | GradientTape + SGD | y=2x+5, Weight≈2, Bias≈5 |
| 10 | REST API | FastAPI + sklearn | POST /predict, Swagger UI |

---

## 🌐 Exercise 10 — REST API Usage

### Start the server
```bash
python exercise10_rest_api.py
```

### API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET  | `/`          | Health check |
| POST | `/predict`   | Predict Iris species |
| GET  | `/classes`   | List all classes |
| GET  | `/docs`      | Swagger UI |
| GET  | `/redoc`     | ReDoc documentation |

### Sample Request (Postman / curl)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"feature1": 5.2, "feature2": 3.8, "feature3": 1.4, "feature4": 0.3}'
```

### Sample Response
```json
{
  "prediction": "Iris-setosa",
  "class_index": 0,
  "confidence": 0.9876,
  "all_classes": {
    "Iris-setosa": 0.9876,
    "Iris-versicolor": 0.0089,
    "Iris-virginica": 0.0035
  }
}
```

---

## 🐳 Bonus: Docker Deployment

```bash
# Build image
docker build -t cba-iris-api .

# Run container
docker run -p 8000:8000 cba-iris-api

# Test
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"feature1":5.1,"feature2":3.5,"feature3":1.4,"feature4":0.2}'
```

### Cloud Deployment (AWS ECS / GCP Cloud Run / Azure Container Apps)

**AWS ECS (Fargate)**
```bash
aws ecr create-repository --repository-name cba-iris-api
docker tag cba-iris-api <account>.dkr.ecr.<region>.amazonaws.com/cba-iris-api
docker push <account>.dkr.ecr.<region>.amazonaws.com/cba-iris-api
# Then create ECS task definition & service
```

**GCP Cloud Run**
```bash
gcloud builds submit --tag gcr.io/<project>/cba-iris-api
gcloud run deploy cba-iris-api --image gcr.io/<project>/cba-iris-api --platform managed
```

---

## 📝 Key Expected Results

| Exercise | Expected Output |
|----------|----------------|
| Ex 2 | `A @ B = [[19,22],[43,50]]` |
| Ex 4 | `dy/dx at x=5 = 13.0` |
| Ex 5 | Total params = `101,770` |
| Ex 6 | MNIST accuracy `> 95%` |
| Ex 9 | Weight `≈ 2.0`, Bias `≈ 5.0` |

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `No module named tensorflow` | `pip install tensorflow` |
| `No module named torch` | `pip install torch torchvision` |
| `No module named fastapi` | `pip install fastapi uvicorn` |
| CUDA not available | All code falls back to CPU automatically |
| Port 8000 in use | Change `port=8000` in Ex10 to another port |
