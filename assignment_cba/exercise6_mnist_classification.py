# =============================================================================
# ASSIGNMENT CBA - Exercise 6: MNIST Digit Classification
# =============================================================================

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

print("=" * 65)
print("       EXERCISE 6: MNIST DIGIT CLASSIFICATION")
print("=" * 65)

# ─── Config ───────────────────────────────────────────────────────────────────
BATCH_SIZE = 128
EPOCHS     = 10
DEVICE     = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"\n  Device: {DEVICE}")

# ─── Step 1 & 2: Load & Normalize MNIST ──────────────────────────────────────
print("\n  Loading MNIST dataset...")
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))    # MNIST mean/std
])

train_dataset = datasets.MNIST(root='./data', train=True,  download=True,  transform=transform)
test_dataset  = datasets.MNIST(root='./data', train=False, download=True,  transform=transform)

train_loader  = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader   = DataLoader(test_dataset,  batch_size=BATCH_SIZE)

print(f"  Train samples: {len(train_dataset):,}")
print(f"  Test  samples: {len(test_dataset):,}")


# ─────────────────────────────────────────────────────────────────────────────
# TF Keras Equivalent Model (implemented in PyTorch)
# ─────────────────────────────────────────────────────────────────────────────
print("\n📦 ─── TF Keras Equivalent (PyTorch) ───")
print("   [TF not available on Python 3.13 — PyTorch used for both]\n")


class MNISTNetTF(nn.Module):
    """Equivalent to Keras: Dense(256,relu) → Dropout(0.2) → Dense(128,relu) → Dropout(0.2) → Dense(10)"""
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(784, 256), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(128, 10)
        )
    def forward(self, x): return self.net(x)


def train_model(model, name="Model"):
    model = model.to(DEVICE)
    opt   = optim.Adam(model.parameters(), lr=1e-3)
    crit  = nn.CrossEntropyLoss()

    for epoch in range(EPOCHS):
        model.train()
        correct, total_loss = 0, 0.0
        for Xb, yb in train_loader:
            Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            out  = model(Xb)
            loss = crit(out, yb)
            loss.backward()
            opt.step()
            total_loss += loss.item() * Xb.size(0)
            correct    += (out.argmax(1) == yb).sum().item()
        acc  = correct / len(train_loader.dataset)
        ep_loss = total_loss / len(train_loader.dataset)
        print(f"  [{name}] Epoch [{epoch+1:02d}/{EPOCHS}]  Loss: {ep_loss:.4f}  Acc: {acc*100:.2f}%")

    # Evaluate
    model.eval()
    correct = 0
    with torch.no_grad():
        for Xb, yb in test_loader:
            Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
            correct += (model(Xb).argmax(1) == yb).sum().item()
    test_acc = correct / len(test_loader.dataset)
    print(f"\n  ✅ [{name}] Test Accuracy: {test_acc*100:.2f}%  (target >95%)")
    print(f"     Goal Met: {'✅ Yes' if test_acc > 0.95 else '❌ Close, try more epochs'}")
    return model, test_acc


# Train TF-equivalent model
tf_model, tf_acc = train_model(MNISTNetTF(), name="TF-Equiv")


# ─────────────────────────────────────────────────────────────────────────────
# PyTorch Native Model
# ─────────────────────────────────────────────────────────────────────────────
print("\n\n🔥 ─── PyTorch Native ───\n")


class MNISTNetPT(nn.Module):
    """PyTorch native MNIST classifier"""
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(784, 256), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(128, 10)
        )
    def forward(self, x): return self.net(x)


pt_model, pt_acc = train_model(MNISTNetPT(), name="PyTorch")


# ─── Step 5: Predict a Single Image ──────────────────────────────────────────
print("\n  📸 Single Image Prediction:")
pt_model.eval()
sample_x, sample_y = test_dataset[0]
with torch.no_grad():
    pred = pt_model(sample_x.unsqueeze(0).to(DEVICE)).argmax(1).item()
print(f"     Predicted: {pred}  |  Actual: {sample_y}  |  {'✅ Correct' if pred==sample_y else '❌ Wrong'}")

# Save sample image
plt.figure(figsize=(3, 3))
plt.imshow(sample_x.squeeze().numpy(), cmap='gray')
plt.title(f"Predicted: {pred}  |  Actual: {sample_y}")
plt.axis('off')
plt.tight_layout()
plt.savefig("mnist_prediction.png", dpi=100)
plt.close()
print("     Saved: mnist_prediction.png")

print("\n" + "=" * 65)
print("Exercise 6 Complete ✅")
print("=" * 65)
