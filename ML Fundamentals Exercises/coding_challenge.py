# %%
# Coding Challenge - Python Implementation
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# %%
print("--- 1. Calculate Mean and Median ---")
salaries = [25000, 30000, 35000, 40000, 45000]
print(f"Salaries: {salaries}")
print(f"Mean: {np.mean(salaries)}")
print(f"Median: {np.median(salaries)}")

# %%
print("\n--- 2. Build simple Linear Regression ---")
# Example: Predicting salary based on years of experience
experience = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
salary_data = np.array([25000, 30000, 35000, 40000, 45000])

lin_reg = LinearRegression()
lin_reg.fit(experience, salary_data)
print(f"Linear Regression Equation: Salary = {lin_reg.coef_[0]:.2f} * Experience + {lin_reg.intercept_:.2f}")

# %%
print("\n--- 3. Perform K-Means clustering ---")
# Example: Customer income vs spending score
# Grouping customers into distinct clusters
customer_data = np.array([
    [15, 39], [15, 81], [16, 6], [16, 77], [17, 40],
    [80, 20], [82, 10], [85, 25], [90, 15], [95, 30],
    [75, 80], [78, 85], [80, 90], [85, 95], [90, 85]
])

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(customer_data)
print("K-Means Cluster Centers (Income, Spending Score):")
print(kmeans.cluster_centers_)

# %%
print("\n--- 4. Create Logistic Regression model ---")
# Example: Predict exam pass (1) or fail (0) based on hours studied
study_hours = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
pass_fail = np.array([0, 0, 0, 0, 1, 1, 1, 1, 1, 1])

X_train, X_test, y_train, y_test = train_test_split(study_hours, pass_fail, test_size=0.3, random_state=42)
log_reg = LogisticRegression()
log_reg.fit(X_train, y_train)

preds = log_reg.predict(X_test)
print(f"Logistic Regression Accuracy on Test Data: {accuracy_score(y_test, preds) * 100:.2f}%")
print(f"Test Hours: {X_test.flatten()}, Predictions: {preds}")

# %%
print("\n--- 5. Plot data using matplotlib ---")
plt.figure(figsize=(12, 5))

# Plot 1: Linear Regression
plt.subplot(1, 2, 1)
plt.scatter(experience, salary_data, color='blue', label='Data Points')
plt.plot(experience, lin_reg.predict(experience), color='red', label='Regression Line')
plt.title('Linear Regression: Salary vs Experience')
plt.xlabel('Years of Experience')
plt.ylabel('Salary')
plt.legend()

# Plot 2: K-Means Clusters
plt.subplot(1, 2, 2)
plt.scatter(customer_data[:, 0], customer_data[:, 1], c=kmeans.labels_, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], color='red', marker='X', s=200, label='Centroids')
plt.title('K-Means Clustering: Customers')
plt.xlabel('Income')
plt.ylabel('Spending Score')
plt.legend()

plt.tight_layout()
plt.show()
print("Plots displayed!")
