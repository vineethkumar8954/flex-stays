# =============================================================================
# ASSIGNMENT CBA - Exercise 7: Save and Load Model
# =============================================================================

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

print("=" * 60)
print("       EXERCISE 7: SAVE AND LOAD MODEL")
print("=" * 60)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ─── Load MNIST ───────────────────────────────────────────────────────────────
transform    = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,),(0.3081,))])
train_data   = datasets.MNIST('./data', train=True,  download=True, transform=transform)
test_data    = datasets.MNIST('./data', train=False, download=True, transform=transform)
train_loader = DataLoader(train_data, batch_size=256, shuffle=True)
test_loader  = DataLoader(test_data,  batch_size=256)


class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(784, 128), nn.ReLU(),
            nn.Linear(128, 10)
        )
    def forward(self, x): return self.net(x)


def evaluate(model):
    model.eval()
    correct = 0
    with torch.no_grad():
        for Xb, yb in test_loader:
            Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
            correct += (model(Xb).argmax(1) == yb).sum().item()
    return correct / len(test_loader.dataset)


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION A — TF Equivalent: Save full model as .h5 (using torch.save full model)
# ═══════════════════════════════════════════════════════════════════════════════
print("\n📦 ─── TensorFlow model.save('model.h5') Equivalent ───")
print("   [Saves the entire model object, like TF .h5]\n")

model_tf = SimpleNet().to(DEVICE)
opt = optim.Adam(model_tf.parameters(), lr=1e-3)
crit = nn.CrossEntropyLoss()

print("  Training (5 epochs)...")
for epoch in range(5):
    model_tf.train()
    total_loss = 0
    for Xb, yb in train_loader:
        Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
        opt.zero_grad()
        loss = crit(model_tf(Xb), yb)
        loss.backward(); opt.step()
        total_loss += loss.item()
    print(f"  Epoch [{epoch+1}/5]  Loss: {total_loss/len(train_loader):.4f}")

# Save entire model (TF model.save equivalent)
SAVE_H5 = "model.h5"
torch.save(model_tf, SAVE_H5)
print(f"\n  ✅ Saved full model → '{SAVE_H5}'  ({os.path.getsize(SAVE_H5)/1024:.1f} KB)")

# Load full model
loaded_h5 = torch.load(SAVE_H5, map_location=DEVICE, weights_only=False)
loaded_h5.eval()
acc_h5 = evaluate(loaded_h5)
print(f"  ✅ Loaded from '{SAVE_H5}'  →  Accuracy: {acc_h5*100:.2f}%")

# Predict first 5
with torch.no_grad():
    sample_x = torch.stack([test_data[i][0] for i in range(5)]).to(DEVICE)
    preds = loaded_h5(sample_x).argmax(1).cpu().tolist()
actual = [test_data[i][1] for i in range(5)]
print(f"\n  Predictions (first 5): {preds}")
print(f"  Actual              : {actual}")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION B — PyTorch: torch.save(model.state_dict(), "model.pth")
# ═══════════════════════════════════════════════════════════════════════════════
print("\n\n🔥 ─── PyTorch torch.save(model.state_dict(), 'model.pth') ───\n")

model_pt = SimpleNet().to(DEVICE)
opt2 = optim.Adam(model_pt.parameters(), lr=1e-3)

print("  Training (5 epochs)...")
for epoch in range(5):
    model_pt.train()
    total_loss = 0
    for Xb, yb in train_loader:
        Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
        opt2.zero_grad()
        loss = crit(model_pt(Xb), yb)
        loss.backward(); opt2.step()
        total_loss += loss.item()
    print(f"  Epoch [{epoch+1}/5]  Loss: {total_loss/len(train_loader):.4f}")

# Save state dict
SAVE_PTH = "model.pth"
torch.save(model_pt.state_dict(), SAVE_PTH)
print(f"\n  ✅ Saved state_dict → '{SAVE_PTH}'  ({os.path.getsize(SAVE_PTH)/1024:.1f} KB)")

# Load state dict
loaded_pt = SimpleNet().to(DEVICE)
loaded_pt.load_state_dict(torch.load(SAVE_PTH, map_location=DEVICE, weights_only=True))
loaded_pt.eval()
acc_pt = evaluate(loaded_pt)
print(f"  ✅ Loaded from '{SAVE_PTH}'  →  Accuracy: {acc_pt*100:.2f}%")

# Predict first 5
with torch.no_grad():
    preds_pt = loaded_pt(sample_x).argmax(1).cpu().tolist()
print(f"\n  Predictions (first 5): {preds_pt}")
print(f"  Actual              : {actual}")

print("\n" + "=" * 60)
print("Exercise 7 Complete ✅")
print("=" * 60)
