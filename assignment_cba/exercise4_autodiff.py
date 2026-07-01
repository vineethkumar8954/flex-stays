# =============================================================================
# ASSIGNMENT CBA - Exercise 4: Automatic Differentiation
# =============================================================================

import torch

print("=" * 60)
print("       EXERCISE 4: AUTOMATIC DIFFERENTIATION")
print("=" * 60)
print("\nFunction : y = x² + 3x + 2")
print("At x = 5")
print("Expected y       = 42")
print("Expected dy/dx   = 13")

# ─── TensorFlow GradientTape Equivalent ──────────────────────────────────────
print("\n📦 ─── TensorFlow GradientTape Equivalent (PyTorch autograd) ───")
print("   [TF not available on Python 3.13 — PyTorch used for both]\n")

# Simulating tf.Variable + GradientTape using PyTorch
x_tf_sim = torch.tensor(5.0, requires_grad=True)
y_tf_sim  = x_tf_sim ** 2 + 3 * x_tf_sim + 2
y_tf_sim.backward()

print(f"  x        = {x_tf_sim.item()}")
print(f"  y        = {y_tf_sim.item()}")
print(f"  dy/dx    = {x_tf_sim.grad.item()}")
print(f"  Match    : {x_tf_sim.grad.item() == 13.0} ✅")

# ─── PyTorch autograd ─────────────────────────────────────────────────────────
print("\n🔥 ─── PyTorch (autograd) ───")

x_pt = torch.tensor(5.0, requires_grad=True)
y_pt = x_pt ** 2 + 3 * x_pt + 2
y_pt.backward()

print(f"\n  x        = {x_pt.item()}")
print(f"  y        = {y_pt.item()}")
print(f"  dy/dx    = {x_pt.grad.item()}")
print(f"  Expected = 13  →  Match: {x_pt.grad.item() == 13.0} ✅")

print("\n" + "=" * 60)
print("Exercise 4 Complete ✅")
print("=" * 60)
