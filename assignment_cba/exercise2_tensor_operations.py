# =============================================================================
# ASSIGNMENT CBA - Exercise 2: Basic Tensor Operations
# =============================================================================

import numpy as np
import torch

print("=" * 60)
print("       EXERCISE 2: BASIC TENSOR OPERATIONS")
print("=" * 60)

A_data = [[1, 2], [3, 4]]
B_data = [[5, 6], [7, 8]]

# ─── TensorFlow Equivalent ────────────────────────────────────────────────────
print("\n📦 ─── TensorFlow Equivalent (NumPy) ───")
print("   [TF not available on Python 3.13 — equivalent shown]\n")

A_np = np.array(A_data, dtype=np.float32)
B_np = np.array(B_data, dtype=np.float32)

print("Matrix A:\n", A_np)
print("Matrix B:\n", B_np)
print("\n✅ A + B (Addition):\n",                    A_np + B_np)
print("\n✅ A - B (Subtraction):\n",                  A_np - B_np)
print("\n✅ A * B (Element-wise Multiplication):\n",  A_np * B_np)
print("\n✅ A @ B (Matrix Multiplication):\n",        A_np @ B_np)
print("   Expected: [[19, 22], [43, 50]]")

# ─── PyTorch ──────────────────────────────────────────────────────────────────
print("\n🔥 ─── PyTorch ───")

A_pt = torch.tensor(A_data, dtype=torch.float32)
B_pt = torch.tensor(B_data, dtype=torch.float32)

print("\nMatrix A:\n", A_pt.numpy())
print("Matrix B:\n", B_pt.numpy())
print("\n✅ A + B (Addition):\n",                   (A_pt + B_pt).numpy())
print("\n✅ A - B (Subtraction):\n",                 (A_pt - B_pt).numpy())
print("\n✅ A * B (Element-wise Multiplication):\n", (A_pt * B_pt).numpy())
print("\n✅ A @ B (Matrix Multiplication):\n",       torch.matmul(A_pt, B_pt).numpy())
print("   Expected: [[19, 22], [43, 50]]")

print("\n" + "=" * 60)
print("Exercise 2 Complete ✅")
print("=" * 60)
