# JobQuest

This project scrapes job information related to Data Science, Machine Learning, and Web Development from online sources. The collected data is stored in CSV and JSON formats and analyzed to provide insights into job trends, including salary, experience, skills, education, and location. A web interface allows users to view these analyses in graphs and a map for location-based insights.

## Features

- **Web Scraping**: Automates data extraction from job postings related to specific fields.
- **Data Processing**: Cleans and organizes data for structured analysis.
- **Analytical Insights**: Provides insights on job requirements, salary, experience, and location distribution.
- **Web Interface**: Allows users to select job categories and view corresponding analyses in visual formats.

## Technologies Used

- **Python**
- **OpenCV**: For image processing and plate detection.
- **Tesseract OCR**: For extracting text from license plates.
- **Flask**: Backend routing and handling user requests.
- **HTML/CSS/Bootstrap**: Frontend layout and styling for user interface.
- **JavaScript**: Client-side interactivity
- **Jupyter Notebook**: For development and testing.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/addittidas/JobQuest.git
   cd JobQuest
   
2. Install the necessary dependencies:
   ```bash
   pip install -r requirements.txt

3. WebDriver Setup
    Ensure the appropriate WebDriver (e.g., ChromeDriver) is installed for Selenium. The webdriver_manager library can automate driver management:
    ```bash
   pip install webdriver_manager

4. Run the .ipynb files one by one for web scrapping and then data preprocessing and analysis.

5. The files generated after running the above files will be used for the website to show the graphs, charts and maps.

6. Open your web browser and go to http://127.0.0.1:5500/index.html to use the application or simply run the index.html file.

**Note**: - For this project, external converters have been used to convert xlsx files to csv files and csv files to json files.
          - Location_Count folder is specially for the location analysis map.
          - index.html is the main file for the website, script.js is the JavaScript file and styles.css is for layout and design of the relevant elements.

## Example Output

Here is an example output showing the web interface and analysis of jobs using graphs, charts and maps:

![Cover Page](Output_Images\output1.png)

![Cover Page](Output_Images\output2.png)

![Cover Page](Output_Images\output3.png)

![Cover Page](Output_Images\output4.png)

![Cover Page](Output_Images\output5.png)