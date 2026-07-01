# =============================================================================
# ASSIGNMENT CBA - Exercise 9: Custom Training Loop
# =============================================================================

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

print("=" * 60)
print("       EXERCISE 9: CUSTOM TRAINING LOOP")
print("=" * 60)
print("\nTrue relationship : y = 2x + 5")
print("Expected learned  : Weight ≈ 2.0,  Bias ≈ 5.0")

np.random.seed(42)
N      = 200
x_data = np.random.uniform(-5, 5, N).astype(np.float32)
y_data = 2 * x_data + 5 + np.random.normal(0, 0.3, N).astype(np.float32)
x_pt   = torch.tensor(x_data)
y_pt   = torch.tensor(y_data)
EPOCHS = 100


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION A — TF GradientTape Equivalent (Manual PyTorch)
# ═══════════════════════════════════════════════════════════════════════════════
print("\n📦 ─── TF GradientTape Equivalent (PyTorch manual grad) ───")
print("   [TF not available on Python 3.13 — manual grad used]\n")

W1 = torch.tensor(np.random.randn(), dtype=torch.float32, requires_grad=True)
b1 = torch.tensor(np.random.randn(), dtype=torch.float32, requires_grad=True)

print(f"  Initial  — Weight: {W1.item():.4f},  Bias: {b1.item():.4f}\n")

LR = 0.01
for epoch in range(EPOCHS):
    y_pred = W1 * x_pt + b1
    loss   = ((y_pred - y_pt) ** 2).mean()

    # Manual gradient computation (like GradientTape)
    loss.backward()

    with torch.no_grad():
        W1 -= LR * W1.grad
        b1 -= LR * b1.grad
        W1.grad.zero_()
        b1.grad.zero_()

    if (epoch + 1) % 10 == 0:
        print(f"  Epoch [{epoch+1:3d}/{EPOCHS}]  "
              f"Loss: {loss.item():.6f}  "
              f"Weight: {W1.item():.4f}  "
              f"Bias: {b1.item():.4f}")

print(f"\n  ✅ TF-Equivalent Final:")
print(f"     Learned Weight : {W1.item():.4f}  (expected ≈ 2.0)")
print(f"     Learned Bias   : {b1.item():.4f}  (expected ≈ 5.0)")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION B — PyTorch Manual Optimizer Loop
# ═══════════════════════════════════════════════════════════════════════════════
print("\n\n🔥 ─── PyTorch Manual Optimizer Loop ───\n")

W2 = nn.Parameter(torch.tensor(np.random.randn(), dtype=torch.float32))
b2 = nn.Parameter(torch.tensor(np.random.randn(), dtype=torch.float32))
optimizer = optim.SGD([W2, b2], lr=0.01)
criterion = nn.MSELoss()

print(f"  Initial  — Weight: {W2.item():.4f},  Bias: {b2.item():.4f}\n")

for epoch in range(EPOCHS):
    optimizer.zero_grad()
    y_pred2 = W2 * x_pt + b2
    loss2   = criterion(y_pred2, y_pt)
    loss2.backward()
    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"  Epoch [{epoch+1:3d}/{EPOCHS}]  "
              f"Loss: {loss2.item():.6f}  "
              f"Weight: {W2.item():.4f}  "
              f"Bias: {b2.item():.4f}")

print(f"\n  ✅ PyTorch Final:")
print(f"     Learned Weight : {W2.item():.4f}  (expected ≈ 2.0)")
print(f"     Learned Bias   : {b2.item():.4f}  (expected ≈ 5.0)")

print("\n" + "=" * 60)
print("Exercise 9 Complete ✅")
print("=" * 60)
