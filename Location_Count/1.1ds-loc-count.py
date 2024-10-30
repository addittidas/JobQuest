import pandas as pd
import json
# Load the JSON file into a DataFrame
data_df = pd.read_json('new-data-science-skills.json')

# Count occurrences of each city
city_counts = data_df['City'].apply(pd.Series).stack().str.strip().value_counts()

# Store the results in a dictionary or save to a CSV
city_counts_dict = city_counts.to_dict()

# Save the top 10 city counts to a JSON file
with open('ds_city_counts.json', 'w') as json_file:
    json.dump(city_counts_dict, json_file)