import json
from collections import defaultdict

# Load the city-wise count data
with open('wd_individual_city_counts.json', 'r') as file:
    city_counts = json.load(file)

# Dictionary to map cities to states
city_to_state = {
    "noida": "uttar pradesh",
    "bengaluru": "karnataka",
    "kolkata": "west bengal",
    "mumbai": "maharashtra",
    "new delhi": "delhi",
    "hyderabad": "telangana",
    "pune": "maharashtra",
    "chennai": "tamil nadu",
    "gurugram": "haryana",
    "indore": "madhya pradesh",
    "remote": "remote",
    "lucknow": "uttar pradesh",
    "jaipur": "rajasthan",
    "nagpur": "maharashtra",
    "coimbatore": "tamil nadu",
    "surat": "gujarat",
    "kochi": "kerala",
    "faridabad": "haryana",
    "hyderabad/ secunderabad": "telangana",
    "bangalore/bengaluru(whitefield)": "karnataka",
    "gurgaon": "haryana",
    "nashik": "maharashtra",
    "hubli": "karnataka",
    "moradabad": "uttar pradesh",
    "madurai": "tamil nadu",
    "hyderabad/secunderabad": "telangana",
    "bangalore/bengaluru": "karnataka",
    "thane": "maharashtra",
    "varanasi": "uttar pradesh",
    "mohali": "punjab",
    "navi mumbai": "maharashtra",
    "mysuru": "karnataka",
    "delhi": "delhi",
    "ranchi": "jharkhand",
    "shimla": "himachal pradesh",
    "bhiwadi": "rajasthan",
    "delhi / ncr": "delhi ncr",
    "ahmedabad": "gujarat",
    "anand": "gujarat",
    "mumbai (all areas)(dadar)": "maharashtra",
    "thrissur": "kerala",
    "asansol": "west bengal",
    "hyderabad(madhapur)": "telangana",
    "jodhpur": "rajasthan",
    "chandigarh": "chandigarh",
    "kozhikode": "kerala",
    "bengaluru(jp nagar)": "karnataka",
    "noida(sector 63a noida)": "uttar pradesh",
    "hybrid - noida": "uttar pradesh",
    "bhubaneshwar": "odisha",
    "cuddalore": "tamil nadu",
    "dehradun": "uttarakhand",
    "mangaluru": "karnataka",
    "amritsar": "punjab",
    "kolhapur": "maharashtra",
    "mangalore": "karnataka",
    "tiruchirapalli": "tamil nadu",
    "puducherry": "puducherry",
    "uttrakhand": "uttarakhand",
    "erode": "tamil nadu"
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
with open('wd_state_wise_counts.json', 'w') as file:
    json.dump(state_counts_dict, file, indent=4)