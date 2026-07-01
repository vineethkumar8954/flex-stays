# =============================================================================
# ASSIGNMENT CBA - Exercise 5: Build a Neural Network
# =============================================================================

import torch
import torch.nn as nn

print("=" * 60)
print("       EXERCISE 5: BUILD A NEURAL NETWORK")
print("=" * 60)
print("\nArchitecture:")
print("  Input  Layer : 784 neurons")
print("  Hidden Layer : 128 neurons (ReLU)")
print("  Output Layer : 10  neurons (Softmax)")


# ─── TensorFlow Keras Equivalent (PyTorch) ────────────────────────────────────
print("\n📦 ─── TensorFlow Keras Equivalent (PyTorch Sequential) ───")
print("   [TF not available on Python 3.13 — PyTorch used]\n")

# keras.Sequential equivalent
tf_equiv_model = nn.Sequential(
    nn.Linear(784, 128),   # Dense(128, activation='relu')
    nn.ReLU(),
    nn.Linear(128, 10),    # Dense(10, activation='softmax')
    nn.Softmax(dim=1)
)
print("Model (Keras-style Sequential equivalent):")
print(tf_equiv_model)

total_params = sum(p.numel() for p in tf_equiv_model.parameters())
print(f"\nTotal Parameters: {total_params:,}")
print(f"  784×128 + 128 = {784*128+128:,}")
print(f"  128×10  + 10  = {128*10+10:,}")
print(f"  Grand Total   = {784*128+128 + 128*10+10:,}")


# ─── PyTorch nn.Module ────────────────────────────────────────────────────────
print("\n\n🔥 ─── PyTorch nn.Module ───")

class CBANeuralNetwork(nn.Module):
    """784 → 128 (ReLU) → 10 (Softmax)"""
    def __init__(self):
        super().__init__()
        self.hidden  = nn.Linear(784, 128)
        self.relu    = nn.ReLU()
        self.output  = nn.Linear(128, 10)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        return self.softmax(self.output(self.relu(self.hidden(x))))

pt_model = CBANeuralNetwork()
print("\nModel:")
print(pt_model)

total_pt = sum(p.numel() for p in pt_model.parameters() if p.requires_grad)
print(f"\nTotal Trainable Parameters: {total_pt:,}")
for name, p in pt_model.named_parameters():
    print(f"  {name:25s}: {p.numel():,}  {list(p.shape)}")

print("\n" + "=" * 60)
print("Exercise 5 Complete ✅")
print("=" * 60)
