# =============================================================================
# ASSIGNMENT CBA - Exercise 3: Tensor Reshaping
# =============================================================================

import numpy as np
import torch

print("=" * 60)
print("       EXERCISE 3: TENSOR RESHAPING")
print("=" * 60)

data = list(range(1, 13))

# ─── TensorFlow Equivalent ────────────────────────────────────────────────────
print("\n📦 ─── TensorFlow Equivalent (NumPy) ───")
print("   [TF not available on Python 3.13 — equivalent shown]\n")

np_tensor = np.array(data)
print("Original 1D:", np_tensor)
print("\n✅ Reshaped to (3, 4):\n", np_tensor.reshape(3, 4))
print("\n✅ Reshaped to (2, 6):\n", np_tensor.reshape(2, 6))
print("\n✅ Flattened back to 1D:", np_tensor.reshape(3, 4).flatten())

# ─── PyTorch ──────────────────────────────────────────────────────────────────
print("\n🔥 ─── PyTorch ───")

pt_tensor = torch.tensor(data)
print("\nOriginal 1D:", pt_tensor.numpy())
print("\n✅ Reshaped to (3, 4):\n", pt_tensor.reshape(3, 4).numpy())
print("\n✅ Reshaped to (2, 6):\n", pt_tensor.reshape(2, 6).numpy())
print("\n✅ Flattened back to 1D:", torch.flatten(pt_tensor.reshape(3, 4)).numpy())

print("\n" + "=" * 60)
print("Exercise 3 Complete ✅")
print("=" * 60)
