import json
from collections import defaultdict

# Load the city-wise count data
with open('ds_individual_city_counts.json', 'r') as file:
    city_counts = json.load(file)

# Dictionary to map cities to states
city_to_state = {
    "bengaluru": "karnataka",
    "pune": "maharashtra",
    "chennai": "tamil nadu",
    "hyderabad": "telangana",
    "gurugram": "haryana",
    "remote": "remote",
    "noida": "uttar pradesh",
    "kolkata": "west bengal",
    "mumbai": "maharashtra",
    "new delhi": "delhi",
    "hybrid - chennai": "tamil nadu",
    "hybrid - hyderabad": "telangana",
    "maharashtra": "maharashtra",
    "kochi": "kerala",
    "mumbai (all areas)": "maharashtra",
    "hybrid - bengaluru": "karnataka",
    "hybrid - noida": "uttar pradesh",
    "bangalore rural": "karnataka",
    "gurgaon/ gurugram": "haryana",
    "delhi / ncr": "delhi",
    "visakhapatnam": "andhra pradesh",
    "hybrid - gurugram": "haryana",
    "nagar": "maharashtra",
    "chennai(taramani)": "tamil nadu",
    "tirupati": "andhra pradesh",
    "hybrid - nashik": "maharashtra",
    "hyderabad/secunderabad(jubilee hills)": "telangana",
    "gurugram(wazirabad)": "haryana",
    "dehradun": "uttarakhand",
    "sonipat/sonepat": "haryana",
    "gurugram(cyber city)": "haryana",
    "nagpur": "maharashtra",
    "saudi arabia": "international",
    "ahmedabad": "gujarat",
    "hybrid - kolkata": "west bengal",
    "faridabad": "haryana",
    "mohali": "punjab"
}

# Initialize a dictionary to store state-wise counts
state_counts = defaultdict(int)

# Aggregate counts by state
for city, count in city_counts.items():
    state = city_to_state.get(city, "unknown")
    state_counts[state] += count

# Convert defaultdict to a regular dictionary for JSON export
state_counts_dict = dict(state_counts)

# Save the state-wise counts to a JSON file
with open('ds_state_wise_counts.json', 'w') as file:
    json.dump(state_counts_dict, file, indent=4)