# =============================================================================
# ASSIGNMENT CBA - Exercise 8: Transfer Learning
# =============================================================================

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from torchvision import models

print("=" * 65)
print("       EXERCISE 8: TRANSFER LEARNING")
print("=" * 65)
print("\nClasses: Cat (0) | Dog (1) | Horse (2)")

DEVICE      = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
NUM_CLASSES = 3
N_TRAIN     = 150    # 50 per class
N_TEST      = 30     # 10 per class
np.random.seed(42)
torch.manual_seed(42)

def make_data(n, img_size=224):
    X = np.random.rand(n, 3, img_size, img_size).astype("float32")
    y = np.array([i % NUM_CLASSES for i in range(n)])
    return torch.tensor(X), torch.tensor(y, dtype=torch.long)

X_train, y_train = make_data(N_TRAIN)
X_test,  y_test  = make_data(N_TEST)
train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=16, shuffle=True)
test_loader  = DataLoader(TensorDataset(X_test,  y_test),  batch_size=16)
print(f"\n  Synthetic dataset: Train {X_train.shape}, Test {X_test.shape}")


def train_and_eval(model, name, epochs=5):
    model = model.to(DEVICE)
    opt   = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)
    crit  = nn.CrossEntropyLoss()

    for epoch in range(epochs):
        model.train()
        total_loss, correct = 0.0, 0
        for Xb, yb in train_loader:
            Xb, yb = Xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            out  = model(Xb)
            loss = crit(out, yb)
            loss.backward(); opt.step()
            total_loss += loss.item()
            correct    += (out.argmax(1) == yb).sum().item()
        print(f"  [{name}] Epoch [{epoch+1}/{epochs}]  "
              f"Loss: {total_loss/len(train_loader):.4f}  "
              f"Acc: {correct/N_TRAIN*100:.1f}%")

    model.eval()
    correct = 0
    with torch.no_grad():
        for Xb, yb in test_loader:
            correct += (model(Xb.to(DEVICE)).argmax(1) == yb.to(DEVICE)).sum().item()
    acc = correct / N_TEST
    print(f"\n  ✅ [{name}] Test Accuracy: {acc*100:.2f}%")
    print(f"     (Synthetic random data — real images needed for >80%)")
    return acc


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION A — TF MobileNetV2 Equivalent: PyTorch MobileNetV2
# ═══════════════════════════════════════════════════════════════════════════════
print("\n📦 ─── TF MobileNetV2 Equivalent (PyTorch MobileNetV2) ───")
print("   [TF not available on Python 3.13]\n")

mob = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

# Freeze all layers
for p in mob.parameters():
    p.requires_grad = False

# Replace classifier head
in_feats = mob.classifier[1].in_features
mob.classifier = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(in_feats, NUM_CLASSES)
)
frozen = sum(1 for p in mob.parameters() if not p.requires_grad)
total  = sum(1 for p in mob.parameters())
print(f"  ✅ MobileNetV2 loaded | Frozen: {frozen}/{total} params")
print(f"  ✅ Replaced classifier head → {in_feats} → {NUM_CLASSES} classes")

train_and_eval(mob, "MobileNetV2")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION B — PyTorch ResNet50
# ═══════════════════════════════════════════════════════════════════════════════
print("\n\n🔥 ─── PyTorch ResNet50 ───\n")

res = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)

# Freeze all layers
for p in res.parameters():
    p.requires_grad = False

# Replace final FC layer
in_feats_res = res.fc.in_features
res.fc = nn.Sequential(
    nn.Linear(in_feats_res, 64), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(64, NUM_CLASSES)
)
frozen_res = sum(1 for p in res.parameters() if not p.requires_grad)
total_res  = sum(1 for p in res.parameters())
print(f"  ✅ ResNet50 loaded | Frozen: {frozen_res}/{total_res} params")
print(f"  ✅ Replaced FC → {in_feats_res} → 64 → {NUM_CLASSES} classes")

train_and_eval(res, "ResNet50")

print("\n" + "=" * 65)
print("Exercise 8 Complete ✅")
print("=" * 65)
