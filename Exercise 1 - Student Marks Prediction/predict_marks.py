# %%
# 1. Setup and Exploratory Data Analysis (EDA)
import pandas as pd
from sklearn.linear_model import LinearRegression

data = {
    'Study Hours': [2, 3, 4, 5, 6, 7, 8],
    'Attendance (%)': [60, 65, 70, 75, 80, 85, 90],
    'Previous Score': [50, 55, 60, 70, 75, 80, 85],
    'Final Marks': [55, 60, 65, 72, 80, 88, 94]
}

df = pd.DataFrame(data)

print("--- Exploratory Data Analysis (EDA) ---")
print("\nData Overview:")
print(df.to_string())

print("\nData Summary:")
print(df.describe().to_string())

# %%
# 2. Check correlation between variables
print("\n--- Correlation between variables ---")
correlation_matrix = df.corr()
print(correlation_matrix.to_string())

# %%
# 3. Train Linear Regression model
X = df[['Study Hours', 'Attendance (%)', 'Previous Score']]
y = df['Final Marks']

model = LinearRegression()
model.fit(X, y)
print("\n--- Linear Regression Model Trained Successfully ---")

# %%
# 4. Predict marks
new_data = pd.DataFrame({
    'Study Hours': [6],
    'Attendance (%)': [82],
    'Previous Score': [78]
})

predicted_marks = model.predict(new_data)
print("\n--- Prediction ---")
print(f"Predicted Final Marks for Study Hours=6, Attendance=82, Previous Score=78: {predicted_marks[0]:.2f}")

# %%
# 5. Interpret coefficients and determine most impactful feature
print("\n--- Model Coefficients Interpretation ---")
coefficients = pd.DataFrame({
    'Feature': X.columns,
    'Coefficient': model.coef_
})
print(coefficients.to_string())

print("\nInterpretation:")
for i, row in coefficients.iterrows():
    print(f"For every 1 unit increase in {row['Feature']}, the Final Marks change by {row['Coefficient']:.4f} units.")

most_impactful_idx = abs(model.coef_).argmax()
most_impactful_feature = X.columns[most_impactful_idx]
print(f"\n--- Most Impactful Feature ---")
print(f"The feature that impacts the marks the most is: '{most_impactful_feature}' with a coefficient of {model.coef_[most_impactful_idx]:.4f}")
