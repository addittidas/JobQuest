import json
from collections import Counter
import re

# Load the JSON data
with open('ds_city_counts.json', 'r') as file:
    data = json.load(file)

# Initialize a Counter to count each city individually
city_counter = Counter()

# Iterate through each city entry
for key, count in data.items():
    # Remove brackets and split by commas, then strip any whitespace
    cities = re.findall(r"'([^']+)'", key)
    for city in cities:
        city_counter[city.strip()] += count

# Convert the Counter to a dictionary and save it as a JSON file
city_counts_dict = dict(city_counter)
with open('ds_individual_city_counts.json', 'w') as file:
    json.dump(city_counts_dict, file, indent=4)