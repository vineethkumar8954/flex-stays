# %%
# Task 1: Load employee dataset using pandas
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Generating a mock dataset since no CSV was provided
data = {
    'Age': [30, 45, 25, 35, 28, 50, 40, 32, 29, 38, 26, 42, 31, 27, 48],
    'Salary': [60000, 95000, 45000, 75000, 50000, 110000, 85000, 65000, 55000, 80000, 42000, 88000, 62000, 48000, 105000],
    'Department': ['IT', 'Sales', 'HR', 'IT', 'Sales', 'HR', 'IT', 'Sales', 'HR', 'IT', 'IT', 'Sales', 'HR', 'Sales', 'HR'],
    'YearsAtCompany': [5, 15, 2, 8, 3, 20, 12, 6, 4, 10, 1, 14, 5, 2, 18],
    'JobSatisfaction': [3, 4, 2, 5, 1, 4, 3, 5, 2, 4, 1, 3, 4, 2, 5],
    'Overtime': ['No', 'Yes', 'Yes', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'No', 'Yes', 'No', 'No', 'Yes', 'No'],
    'WorkLifeBalance': [3, 2, 1, 4, 2, 3, 2, 4, 2, 3, 1, 3, 3, 2, 4],
    'Attrition': ['No', 'No', 'Yes', 'No', 'Yes', 'No', 'No', 'No', 'Yes', 'No', 'Yes', 'No', 'No', 'Yes', 'No']
}

df = pd.DataFrame(data)
print("--- Task 1: Dataset Loaded ---")
print(df.head())

# %%
# Task 3: Check missing values (Moved before Encoding as usually done in EDA)
print("\n--- Task 3: Check Missing Values ---")
print(df.isnull().sum())

# %%
# Task 2: Handle categorical columns (Department, Overtime)
print("\n--- Task 2: Handle Categorical Columns ---")
le_dept = LabelEncoder()
le_overtime = LabelEncoder()
le_attrition = LabelEncoder()

df['Department'] = le_dept.fit_transform(df['Department'])
df['Overtime'] = le_overtime.fit_transform(df['Overtime'])
# Also encode target variable (Yes -> 1, No -> 0)
df['Attrition'] = le_attrition.fit_transform(df['Attrition']) 

print("Categorical columns encoded successfully using LabelEncoder.")
print(df[['Department', 'Overtime', 'Attrition']].head())

# %%
# Task 4: Train Logistic Regression model
print("\n--- Task 4: Train Logistic Regression model ---")
X = df.drop('Attrition', axis=1)
y = df['Attrition']

# We split the data into training and testing sets to properly evaluate it
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

print("Logistic Regression model trained successfully.")

# %%
# Task 5: Evaluate using Accuracy, Precision, Recall, F1-score
print("\n--- Task 5: Evaluate Model ---")
y_pred = model.predict(X_test)

# zero_division=0 prevents warnings on small sample testing
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)

print(f"Accuracy:  {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall:    {recall:.2f}")
print(f"F1-score:  {f1:.2f}")

# %%
# Task 6: Find most important attrition factors
print("\n--- Task 6: Most Important Attrition Factors ---")
# Feature importance in Logistic Regression can be checked via the absolute values of the coefficients
coefficients = pd.DataFrame({
    'Feature': X.columns,
    'Coefficient': model.coef_[0]
})
coefficients['Absolute Importance'] = coefficients['Coefficient'].abs()
coefficients = coefficients.sort_values(by='Absolute Importance', ascending=False)

print(coefficients[['Feature', 'Coefficient']])

most_important = coefficients.iloc[0]['Feature']
print(f"\nThe most important factor for attrition in this model is: '{most_important}'")

# %%
# Task 7: Predict attrition for new employee
print("\n--- Task 7: Predict Attrition for New Employee ---")
# Example new employee profile: Age 26, Salary 48000, IT Dept, 1 year, low satisfaction, works overtime, poor work-life balance
new_employee_data = {
    'Age': [26],
    'Salary': [48000],
    'Department': le_dept.transform(['IT']),
    'YearsAtCompany': [1],
    'JobSatisfaction': [2],
    'Overtime': le_overtime.transform(['Yes']),
    'WorkLifeBalance': [2]
}

new_df = pd.DataFrame(new_employee_data)
prediction = model.predict(new_df)
predicted_class = le_attrition.inverse_transform(prediction)

print("New Employee Features:")
print("Age: 26, Salary: 48000, Department: IT, YearsAtCompany: 1")
print("JobSatisfaction: 2, Overtime: Yes, WorkLifeBalance: 2")

print(f"\nPredicted Attrition Output: {prediction[0]}")
if prediction[0] == 1:
    print("Result: This employee is likely to LEAVE the company (Attrition = Yes).")
else:
    print("Result: This employee is likely to STAY in the company (Attrition = No).")
