# =============================================================================
# ASSIGNMENT CBA - Exercise 1: Tensor Creation
# =============================================================================
import numpy as np
import torch

print("=" * 60)
print("       EXERCISE 1: TENSOR CREATION")
print("=" * 60)

# --- TensorFlow Equivalent (NumPy) ---
print("\n[TensorFlow Equivalent - NumPy]")
print("   Note: TF not supported on Python 3.13, NumPy equivalent shown\n")

tf_tensor = np.array([[1, 2, 3],
                       [4, 5, 6]])
print("Tensor:\n", tf_tensor)
print("Shape          :", tf_tensor.shape)
print("Data Type      :", tf_tensor.dtype)
print("Num Dimensions :", tf_tensor.ndim)

# --- PyTorch ---
print("\n[PyTorch]")

pt_tensor = torch.tensor([[1, 2, 3],
                           [4, 5, 6]])
print("\nTensor:\n", pt_tensor.numpy())
print("Shape          :", pt_tensor.shape)
print("Data Type      :", pt_tensor.dtype)
print("Num Dimensions :", pt_tensor.ndim)

print("\n" + "=" * 60)
print("Exercise 1 Complete!")
print("=" * 60)
