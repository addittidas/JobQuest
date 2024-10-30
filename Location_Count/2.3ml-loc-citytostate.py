import json
from collections import defaultdict

# Load the city-wise count data
with open('ml_individual_city_counts.json', 'r') as file:
    city_counts = json.load(file)

# Dictionary to map cities to states
city_to_state = {
    "bengaluru": "karnataka",
    "kolkata": "west bengal",
    "mumbai": "maharashtra",
    "new delhi": "delhi",
    "hyderabad": "telangana",
    "pune": "maharashtra",
    "chennai": "tamil nadu",
    "remote": "remote",
    "gurugram": "haryana",
    "ahmedabad": "gujarat",
    "noida": "uttar pradesh",
    "delhi": "delhi",
    "hybrid - panaji": "goa",
    "delhi / ncr": "delhi ncr",
    "bengaluru(bellandur)": "karnataka",
    "hybrid - gurugram": "haryana",
    "hybrid - bengaluru": "karnataka",
    "hybrid - chennai": "tamil nadu",
    "surat": "gujarat",
    "chandigarh": "chandigarh",
    "hybrid - hyderabad": "telangana",
    "hybrid - madurai": "tamil nadu",
    "coimbatore": "tamil nadu",
    "hyderabad(madhapur)": "telangana",
    "bhubaneswar": "odisha",
    "bengaluru(bagalur +3)": "karnataka",
    "indore": "madhya pradesh",
    "hybrid - pune": "maharashtra",
    "thane": "maharashtra",
    "navi mumbai": "maharashtra",
    "gurgaon": "haryana",
    "hyderabad(gachibowli)": "telangana",
    "bengaluru(devarabeesana halli)": "karnataka",
    "patna": "bihar",
    "kanpur": "uttar pradesh",
    "supaul": "bihar",
    "bhopal": "madhya pradesh",
    "panchkula": "haryana",
    "hybrid - kochi": "kerala",
    "kochi": "kerala",
    "hybrid - chandigarh": "chandigarh",
    "mumbai (all areas)": "maharashtra"
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
with open('ml_state_wise_counts.json', 'w') as file:
    json.dump(state_counts_dict, file, indent=4)