// Function to show the menu page
function showMenu() {
    // Change the background color to white
    document.body.style.background = "#ffffff";
    
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('menu-page').style.display = 'block';
}

// Function to display content based on the selected category
function showContent(category) {
    const content = document.getElementById('content');

    // Category: Data Science
    if (category === 'dataScience') {
        content.innerHTML = `
            <h2 class="text-3xl font-bold mb-8">Data Science Jobs Analysis</h2>
            <div class="chart-row">
                <div class="chart-container">
                    <h3>Education Levels Analysis</h3>
                    <canvas id="eduCanvas" width ="60" height ="60"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Experience Requirements Analysis</h3>
                    <canvas id="expCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Top Skills</h3>
                    <canvas id="skillsCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Must Have Skills</h3>
                    <canvas id="mustHaveSkillsCanvas" height="400"></canvas>
                </div>
                <div>
                    <h3 style="margin-top: 15px; margin-bottom: 20px; color: #333; font-size: 1.4rem;">Job Location Analysis</h3>
                    <div id="chartContainer" style="width: 700px; height: 500px;"></div>
                </div>
            </div>
        `;

        // Fetch JSON data and create the Education Pie Chart
        fetch('new-data-science-skills.json')
            .then(response => response.json())
            .then(data => {
                const educationCounts = {
                    'UG': 0,
                    'PG': 0,
                    'PhD': 0,
                    'Other': 0
                };

                data.forEach(item => {
                    const education = item.Education.toLowerCase();
                    if (/b\.?tech|b\.?e\.?|b\.?sc\.?/i.test(education)) educationCounts['UG']++;
                    else if (/m\.?tech|m\.?s\.?/i.test(education)) educationCounts['PG']++;
                    else if (/phd|doctorate|d\.?sc\.?/i.test(education)) educationCounts['PhD']++;
                    else educationCounts['Other']++;
                });

                // Prepare data for the Education Pie Chart
                const eduLabels = Object.keys(educationCounts);
                const eduDataValues = Object.values(educationCounts);

                const eduCtx = document.getElementById('eduCanvas').getContext('2d');
                if (window.eduChart) window.eduChart.destroy();

                window.eduChart = new Chart(eduCtx, {
                    type: 'doughnut',
                    data: {
                        labels: eduLabels,
                        datasets: [{
                            label: 'Education Levels',
                            data: eduDataValues,
                            backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true, // Allows the chart to resize as per canvas dimensions
                        plugins: {
                            title: { display: true, text: 'Education Levels Distribution' },
                            legend: { position: 'bottom', labels: {padding: 20}},
                            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                            datalabels: {
                                color: '#fff',
                                anchor: 'center',
                                align: 'center',
                                formatter: (value, context) => context.chart.data.labels[context.dataIndex],
                                font: {
                                    size: 13,
                                    weight: 'bold'
                                },
                                padding: 6
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Use the datalabels plugin
                });

                // Create the Experience Requirements chart
                const experienceRanges = {
                    '0-2 years': 0,
                    '2-5 years': 0,
                    '5-8 years': 0,
                    '8-10 years': 0,
                    '10-12 years': 0,
                    '13-15 years': 0,
                    '15+ years': 0
                };

                data.forEach(item => {
                    const minExp = parseFloat(item.min_exp);
                    const maxExp = parseFloat(item.max_exp);

                    if (maxExp <= 2) experienceRanges['0-2 years']++;
                    else if (maxExp <= 5) experienceRanges['2-5 years']++;
                    else if (maxExp <= 8) experienceRanges['5-8 years']++;
                    else if (maxExp <= 10) experienceRanges['8-10 years']++;
                    else if (maxExp <= 12) experienceRanges['10-12 years']++;
                    else if (maxExp <= 15) experienceRanges['13-15 years']++;
                    else experienceRanges['15+ years']++;
                });

                // Prepare data for the Experience Chart
                const expLabels = Object.keys(experienceRanges);
                const expDataValues = Object.values(experienceRanges);

                const expCtx = document.getElementById('expCanvas').getContext('2d');
                if (window.expChart) window.expChart.destroy();

                window.expChart = new Chart(expCtx, {
                    type: 'bar',
                    data: {
                        labels: expLabels,
                        datasets: [{
                            label: 'Number of Vacancies',
                            data: expDataValues,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Experience Requirements' },
                            legend: { position: 'bottom', labels: {padding: 20}}
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'No. of Vacancies' }},
                            x: { title: { display: true, text: 'Experience' }}
                        }
                    }
                });

                // Create skills bar chart when it comes into view
                const loadSkillsChart = () => {
                    const skillCounts = {};
                
                    data.forEach(item => {
                        const skills = JSON.parse(item.Skills.replace(/'/g, '"')); // Convert string to array
                        skills.forEach(skill => {
                            skillCounts[skill] = (skillCounts[skill] || 0) + 1; // Count occurrences of each skill
                        });
                    });

                    // Prepare data for Skills Chart
                    const topSkills = Object.entries(skillCounts)
                        .sort((a, b) => b[1] - a[1]) // Sort by count
                        .slice(0, 32); // Get top 32 skills
                
                    const skillLabels = topSkills.map(item => item[0]);
                    const skillDataValues = topSkills.map(item => item[1]);

                    const skillsCtx = document.getElementById('skillsCanvas').getContext('2d');
                    if (window.skillsChart) window.skillsChart.destroy();

                    window.skillsChart = new Chart(skillsCtx, {
                        type: 'bar',
                        data: {
                            labels: skillLabels,
                            datasets: [{
                                label: 'No. of Vacancies',
                                data: skillDataValues,
                                backgroundColor: 'rgba(255, 99, 132, 0.8)'
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: { display: true, text: 'Top Skills for Data Science' },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: { beginAtZero: true, title: { display: true, text: 'No. of Vacancies' } },
                                x: { title: { display: true, text: 'Skills' } }
                            }
                        }
                    });
                };

                // Create the Must Have Skills chart when it comes into view
                const loadMustHaveSkillsChart = () => {
                    const mhskillCounts = {
                        'Statistics': 0,
                        'Machine Learning': 0,
                        'Data Analysis': 0,
                        'Data Mining': 0,
                        'NLP': 0,
                        'Computer Vision': 0,
                        'Deep Learning': 0,
                        'Big Data': 0
                    };

                    // Count occurrences of must-have skills
                    data.forEach(item => {
                        const skills = Array.isArray(item.Skills) ? item.Skills : JSON.parse(item.Skills.replace(/'/g, '"')); // Ensure Skills is an array

                        if (skills.some(skill => skill.toLowerCase().includes('stat'))) {
                            mhskillCounts['Statistics'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('machine') || skill.toLowerCase().startsWith('ml'))) {
                            mhskillCounts['Machine Learning'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('data ana'))) {
                            mhskillCounts['Data Analysis'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('mining'))) {
                            mhskillCounts['Data Mining'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('nlp') || skill.toLowerCase().includes('natural'))) {
                            mhskillCounts['NLP'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('computer vision'))) {
                            mhskillCounts['Computer Vision'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('deep learning'))) {
                            mhskillCounts['Deep Learning'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('big'))) {
                            mhskillCounts['Big Data'] += item.count || 1;
                        }
                    });

                    // Prepare data for the Must Have Skills Chart
                    const labels = Object.keys(mhskillCounts);
                    const counts = Object.values(mhskillCounts);

                    const ctx = document.getElementById('mustHaveSkillsCanvas').getContext('2d');
                    if (window.mustHaveSkillsChart) window.mustHaveSkillsChart.destroy();

                    window.mustHaveSkillsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Proportion',
                                data: counts,
                                backgroundColor: ['rgba(255, 206, 86, 0.8)']
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Must Have Skills for Data Science'
                                },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Proportion'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Skills'
                                    }
                                }
                            }
                        }
                    });
                };

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('skillsCanvas'));

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadMustHaveSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('mustHaveSkillsCanvas'));
            })
            .catch(error => console.error('Error fetching data:', error));
        
        // Location Map
        // Mapping of state names to FusionCharts region codes
        const city_to_code = {
            "andaman and nicobar islands": "001",
            "andhra pradesh": "002",
            "arunachal pradesh": "003",
            "assam": "004",
            "bihar": "005",
            "chandigarh": "006",
            "chhattisgarh": "007",
            "dadra and nagar haveli": "008",
            "daman and diu": "009",
            "delhi": "010",
            "goa": "011",
            "gujarat": "012",
            "haryana": "013",
            "himachal pradesh": "014",
            "jammu and kashmir": "015",
            "jharkhand": "016",
            "karnataka": "017",
            "kerala": "018",
            "ladakh": "019",
            "lakshadweep": "020",
            "madhya pradesh": "021",
            "maharashtra": "022",
            "manipur": "023",
            "meghalaya": "024",
            "mizoram": "025",
            "nagaland": "026",
            "odisha": "027",
            "puducherry": "028",
            "punjab": "029",
            "rajasthan": "030",
            "sikkim": "031",
            "tamil nadu": "032",
            "telangana": "033",
            "tripura": "034",
            "uttar pradesh": "035",
            "uttarakhand": "036",
            "west bengal": "037"
        };

        // Load data from JSON file
        fetch('ds_state_wise_counts.json')
            .then(response => response.json())
            .then(stateCounts => {
                // Calculate total job count
                const totalJobs = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);

                // Prepare data array for FusionCharts with percentage calculation
                const data = Object.entries(stateCounts).map(([state, count]) => {
                    const percentage = ((count / totalJobs) * 100).toFixed(1);  // Percentage calculation with one decimal
                    const code = city_to_code[state.toLowerCase()];
                    return code ? { 
                        "id": code, 
                        "value": `${percentage}%`
                    } : null;
                }).filter(entry => entry);  // Filter out null entries

                // Initialize and render the chart
                FusionCharts.ready(function () {
                    var jobDensityMap = new FusionCharts({
                        type: 'maps/india',
                        renderAt: 'chartContainer',
                        width: '700',
                        height: '500',
                        dataFormat: 'json',
                        dataSource: {
                            "chart": {
                                "caption": "Job Percentage Across India",
                                "captionFontSize": "12",
                                "captionFont": "Arial",
                                "theme": "fusion",
                                "showLabels": "0",  // Hide state codes
                                "formatNumberScale": "0",
                                "entityFillHoverColor": "#B3E5FC",
                                "showEntityHoverEffect": "1",
                                "toolTipBorderColor": "#01579B",
                                "toolTipBgColor": "#FFFFFF"
                            },
                            "colorrange": {
                                "minvalue": "0",
                                "startlabel": "Low",
                                "endlabel": "High",
                                "code": "#B3E5FC",
                                "gradient": "1",
                                "color": [{
                                    "maxvalue": "10",
                                    "code": "#B3E5FC",
                                    "displayValue": "Low"
                                }, {
                                    "maxvalue": "30",
                                    "code": "#4FC3F7",
                                    "displayValue": "Moderate"
                                }, {
                                    "maxvalue": "60",
                                    "code": "#0288D1",
                                    "displayValue": "High"
                                }, {
                                    "maxvalue": "100",
                                    "code": "#01579B",
                                    "displayValue": "Very High"
                                }]
                            },
                            "data": data
                        }
                    });
                    jobDensityMap.render();
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }

    // Category: Machine Learning
    else if (category === 'ml') {
        content.innerHTML = `
            <h2 class="text-3xl font-bold mb-8">Machine Learning Jobs Analysis</h2>
            <div class="chart-row">
                <div class="chart-container">
                    <h3>Education Levels Analysis</h3>
                    <canvas id="eduCanvas" width ="60" height ="60"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Experience Requirements Analysis</h3>
                    <canvas id="expCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Top Skills</h3>
                    <canvas id="skillsCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Must Have Skills</h3>
                    <canvas id="mustHaveSkillsCanvas" height="400"></canvas>
                </div>
                <div>
                    <h3 style="margin-top: 15px; margin-bottom: 20px; color: #333; font-size: 1.4rem;">Job Location Analysis</h3>
                    <div id="chartContainer" style="width: 700px; height: 500px;"></div>
                </div>
            </div>
        `;

        // Fetch JSON data and create the Education Pie Chart
        fetch('new-machine-learning-skills.json')
            .then(response => response.json())
            .then(data => {
                const educationCounts = {
                    'UG': 0,
                    'PG': 0,
                    'PhD': 0,
                    'Other': 0
                };

                data.forEach(item => {
                    const education = item.Education.toLowerCase();
                    if (/b\.?tech|b\.?e\.?|b\.?sc\.?/i.test(education)) educationCounts['UG']++;
                    else if (/m\.?tech|m\.?s\.?/i.test(education)) educationCounts['PG']++;
                    else if (/phd|doctorate|d\.?sc\.?/i.test(education)) educationCounts['PhD']++;
                    else educationCounts['Other']++;
                });

                // Prepare data for the Education Pie Chart
                const eduLabels = Object.keys(educationCounts);
                const eduDataValues = Object.values(educationCounts);

                const eduCtx = document.getElementById('eduCanvas').getContext('2d');
                if (window.eduChart) window.eduChart.destroy();

                window.eduChart = new Chart(eduCtx, {
                    type: 'doughnut',
                    data: {
                        labels: eduLabels,
                        datasets: [{
                            label: 'Education Levels',
                            data: eduDataValues,
                            backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true, // Allows the chart to resize as per canvas dimensions
                        plugins: {
                            title: { display: true, text: 'Education Levels Distribution' },
                            legend: { position: 'bottom', labels: {padding: 20}},
                            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                            datalabels: {
                                color: '#fff',
                                anchor: 'center',
                                align: 'center',
                                formatter: (value, context) => context.chart.data.labels[context.dataIndex],
                                font: {
                                    size: 13,
                                    weight: 'bold'
                                },
                                padding: 6
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Use the datalabels plugin
                });

                // Create the Experience Requirements chart
                const experienceRanges = {
                    '0-2 years': 0,
                    '2-5 years': 0,
                    '5-8 years': 0,
                    '8-10 years': 0,
                    '10-12 years': 0,
                    '13-15 years': 0,
                    '15+ years': 0
                };

                data.forEach(item => {
                    const minExp = parseFloat(item.min_exp);
                    const maxExp = parseFloat(item.max_exp);

                    if (maxExp <= 2) experienceRanges['0-2 years']++;
                    else if (maxExp <= 5) experienceRanges['2-5 years']++;
                    else if (maxExp <= 8) experienceRanges['5-8 years']++;
                    else if (maxExp <= 10) experienceRanges['8-10 years']++;
                    else if (maxExp <= 12) experienceRanges['10-12 years']++;
                    else if (maxExp <= 15) experienceRanges['13-15 years']++;
                    else experienceRanges['15+ years']++;
                });

                // Prepare data for the Experience Chart
                const expLabels = Object.keys(experienceRanges);
                const expDataValues = Object.values(experienceRanges);

                const expCtx = document.getElementById('expCanvas').getContext('2d');
                if (window.expChart) window.expChart.destroy();

                window.expChart = new Chart(expCtx, {
                    type: 'bar',
                    data: {
                        labels: expLabels,
                        datasets: [{
                            label: 'Number of Vacancies',
                            data: expDataValues,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Experience Requirements' },
                            legend: { position: 'bottom', labels: {padding: 20}}
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'No. of Vacancies' }},
                            x: { title: { display: true, text: 'Experience' }}
                        }
                    }
                });

                // Create skills bar chart when it comes into view
                const loadSkillsChart = () => {
                    const skillCounts = {};
                
                    data.forEach(item => {
                        const skills = JSON.parse(item.Skills.replace(/'/g, '"')); // Convert string to array
                        skills.forEach(skill => {
                            skillCounts[skill] = (skillCounts[skill] || 0) + 1; // Count occurrences of each skill
                        });
                    });

                    // Prepare data for Skills Chart
                    const topSkills = Object.entries(skillCounts)
                        .sort((a, b) => b[1] - a[1]) // Sort by count
                        .slice(0, 32); // Get top 32 skills
                
                    const skillLabels = topSkills.map(item => item[0]);
                    const skillDataValues = topSkills.map(item => item[1]);

                    const skillsCtx = document.getElementById('skillsCanvas').getContext('2d');
                    if (window.skillsChart) window.skillsChart.destroy();

                    window.skillsChart = new Chart(skillsCtx, {
                        type: 'bar',
                        data: {
                            labels: skillLabels,
                            datasets: [{
                                label: 'No. of Vacancies',
                                data: skillDataValues,
                                backgroundColor: 'rgba(255, 99, 132, 0.8)'
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: { display: true, text: 'Top Skills for Machine Learning' },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: { beginAtZero: true, title: { display: true, text: 'No. of Vacancies' } },
                                x: { title: { display: true, text: 'Skills' } }
                            }
                        }
                    });
                };

                // Create the Must Have Skills chart when it comes into view
                const loadMustHaveSkillsChart = () => {
                    const mhskillCounts = {
                        'Tensorflow': 0,
                        'Predictive Modelling': 0,
                        'Data Science': 0,
                        'Python': 0,
                        'Computer Vision': 0,
                        'NLP': 0,
                        'AI': 0,
                        'LLMs': 0
                    };

                    // Count occurrences of must-have skills
                    data.forEach(item => {
                        const skills = Array.isArray(item.Skills) ? item.Skills : JSON.parse(item.Skills.replace(/'/g, '"')); // Ensure Skills is an array

                        if (skills.some(skill => skill.toLowerCase().includes('tensorflow'))) {
                            mhskillCounts['Tensorflow'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('predictive modelling') || skill.toLowerCase().startsWith('ml'))) {
                            mhskillCounts['Predictive Modelling'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('data science'))) {
                            mhskillCounts['Data Science'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('python'))) {
                            mhskillCounts['Python'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('computer vision') || skill.toLowerCase().includes('natural'))) {
                            mhskillCounts['Computer Vision'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('natural language processing'))) {
                            mhskillCounts['NLP'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('artificial intelligence'))) {
                            mhskillCounts['AI'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('llm'))) {
                            mhskillCounts['LLMs'] += item.count || 1;
                        }
                    });

                    // Prepare data for the Must Have Skills Chart
                    const labels = Object.keys(mhskillCounts);
                    const counts = Object.values(mhskillCounts);

                    const ctx = document.getElementById('mustHaveSkillsCanvas').getContext('2d');
                    if (window.mustHaveSkillsChart) window.mustHaveSkillsChart.destroy();

                    window.mustHaveSkillsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Proportion',
                                data: counts,
                                backgroundColor: ['rgba(255, 206, 86, 0.8)']
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Must Have Skills for Machine Learning'
                                },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Proportion'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Skills'
                                    }
                                }
                            }
                        }
                    });
                };

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('skillsCanvas'));

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadMustHaveSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('mustHaveSkillsCanvas'));
            })
            .catch(error => console.error('Error fetching data:', error));
        
        // Location Map
        // Mapping of state names to FusionCharts region codes
        const city_to_code = {
            "andaman and nicobar islands": "001",
            "andhra pradesh": "002",
            "arunachal pradesh": "003",
            "assam": "004",
            "bihar": "005",
            "chandigarh": "006",
            "chhattisgarh": "007",
            "dadra and nagar haveli": "008",
            "daman and diu": "009",
            "delhi": "010",
            "goa": "011",
            "gujarat": "012",
            "haryana": "013",
            "himachal pradesh": "014",
            "jammu and kashmir": "015",
            "jharkhand": "016",
            "karnataka": "017",
            "kerala": "018",
            "ladakh": "019",
            "lakshadweep": "020",
            "madhya pradesh": "021",
            "maharashtra": "022",
            "manipur": "023",
            "meghalaya": "024",
            "mizoram": "025",
            "nagaland": "026",
            "odisha": "027",
            "puducherry": "028",
            "punjab": "029",
            "rajasthan": "030",
            "sikkim": "031",
            "tamil nadu": "032",
            "telangana": "033",
            "tripura": "034",
            "uttar pradesh": "035",
            "uttarakhand": "036",
            "west bengal": "037"
        };

        // Load data from JSON file
        fetch('ml_state_wise_counts.json')
            .then(response => response.json())
            .then(stateCounts => {
                // Calculate total job count
                const totalJobs = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);

                // Prepare data array for FusionCharts with percentage calculation
                const data = Object.entries(stateCounts).map(([state, count]) => {
                    const percentage = ((count / totalJobs) * 100).toFixed(1);  // Percentage calculation with one decimal
                    const code = city_to_code[state.toLowerCase()];
                    return code ? { 
                        "id": code, 
                        "value": `${percentage}%`
                    } : null;
                }).filter(entry => entry);  // Filter out null entries

                // Initialize and render the chart
                FusionCharts.ready(function () {
                    var jobDensityMap = new FusionCharts({
                        type: 'maps/india',
                        renderAt: 'chartContainer',
                        width: '700',
                        height: '500',
                        dataFormat: 'json',
                        dataSource: {
                            "chart": {
                                "caption": "Job Percentage Across India",
                                "captionFontSize": "12",
                                "captionFont": "Arial",
                                "theme": "fusion",
                                "showLabels": "0",  // Hide state codes
                                "formatNumberScale": "0",
                                "entityFillHoverColor": "#B3E5FC",
                                "showEntityHoverEffect": "1",
                                "toolTipBorderColor": "#01579B",
                                "toolTipBgColor": "#FFFFFF"
                            },
                            "colorrange": {
                                "minvalue": "0",
                                "startlabel": "Low",
                                "endlabel": "High",
                                "code": "#B3E5FC",
                                "gradient": "1",
                                "color": [{
                                    "maxvalue": "10",
                                    "code": "#B3E5FC",
                                    "displayValue": "Low"
                                }, {
                                    "maxvalue": "30",
                                    "code": "#4FC3F7",
                                    "displayValue": "Moderate"
                                }, {
                                    "maxvalue": "60",
                                    "code": "#0288D1",
                                    "displayValue": "High"
                                }, {
                                    "maxvalue": "100",
                                    "code": "#01579B",
                                    "displayValue": "Very High"
                                }]
                            },
                            "data": data
                        }
                    });
                    jobDensityMap.render();
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
    
    }

    // Category: Web Development
    else if (category === 'webDev') {
        content.innerHTML = `
            <h2 class="text-3xl font-bold mb-8">Web Development Jobs Analysis</h2>
            <div class="chart-row">
                <div class="chart-container">
                    <h3>Education Levels Analysis</h3>
                    <canvas id="eduCanvas" width ="60" height ="60"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Experience Requirements Analysis</h3>
                    <canvas id="expCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Top Skills</h3>
                    <canvas id="skillsCanvas" height="400"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Must Have Skills</h3>
                    <canvas id="mustHaveSkillsCanvas" height="400"></canvas>
                </div>
                <div>
                    <h3 style="margin-top: 15px; margin-bottom: 20px; color: #333; font-size: 1.4rem;">Job Location Analysis</h3>
                    <div id="chartContainer" style="width: 700px; height: 500px;"></div>
                </div>
            </div>
        `;

        // Fetch JSON data and create the Education Pie Chart
        fetch('new-web-dev-skills.json')
            .then(response => response.json())
            .then(data => {
                const educationCounts = {
                    'UG': 0,
                    'PG': 0,
                    'PhD': 0,
                    'Other': 0
                };

                data.forEach(item => {
                    const education = item.Education.toLowerCase();
                    if (/b\.?tech|b\.?e\.?|b\.?sc\.?/i.test(education)) educationCounts['UG']++;
                    else if (/m\.?tech|m\.?s\.?/i.test(education)) educationCounts['PG']++;
                    else if (/phd|doctorate|d\.?sc\.?/i.test(education)) educationCounts['PhD']++;
                    else educationCounts['Other']++;
                });

                // Prepare data for the Education Pie Chart
                const eduLabels = Object.keys(educationCounts);
                const eduDataValues = Object.values(educationCounts);

                const eduCtx = document.getElementById('eduCanvas').getContext('2d');
                if (window.eduChart) window.eduChart.destroy();

                window.eduChart = new Chart(eduCtx, {
                    type: 'doughnut',
                    data: {
                        labels: eduLabels,
                        datasets: [{
                            label: 'Education Levels',
                            data: eduDataValues,
                            backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true, // Allows the chart to resize as per canvas dimensions
                        plugins: {
                            title: { display: true, text: 'Education Levels Distribution' },
                            legend: { position: 'bottom', labels: {padding: 20}},
                            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                            datalabels: {
                                color: '#fff',
                                anchor: 'center',
                                align: 'center',
                                formatter: (value, context) => context.chart.data.labels[context.dataIndex],
                                font: {
                                    size: 13,
                                    weight: 'bold'
                                },
                                padding: 6
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Use the datalabels plugin
                });

                // Create the Experience Requirements chart
                const experienceRanges = {
                    '0-2 years': 0,
                    '2-5 years': 0,
                    '5-8 years': 0,
                    '8-10 years': 0,
                    '10-12 years': 0,
                    '13-15 years': 0,
                    '15+ years': 0
                };

                data.forEach(item => {
                    const minExp = parseFloat(item.min_exp);
                    const maxExp = parseFloat(item.max_exp);

                    if (maxExp <= 2) experienceRanges['0-2 years']++;
                    else if (maxExp <= 5) experienceRanges['2-5 years']++;
                    else if (maxExp <= 8) experienceRanges['5-8 years']++;
                    else if (maxExp <= 10) experienceRanges['8-10 years']++;
                    else if (maxExp <= 12) experienceRanges['10-12 years']++;
                    else if (maxExp <= 15) experienceRanges['13-15 years']++;
                    else experienceRanges['15+ years']++;
                });

                // Prepare data for the Experience Chart
                const expLabels = Object.keys(experienceRanges);
                const expDataValues = Object.values(experienceRanges);

                const expCtx = document.getElementById('expCanvas').getContext('2d');
                if (window.expChart) window.expChart.destroy();

                window.expChart = new Chart(expCtx, {
                    type: 'bar',
                    data: {
                        labels: expLabels,
                        datasets: [{
                            label: 'Number of Vacancies',
                            data: expDataValues,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: { display: true, text: 'Experience Requirements' },
                            legend: { position: 'bottom', labels: {padding: 20}}
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'No. of Vacancies' }},
                            x: { title: { display: true, text: 'Experience' }}
                        }
                    }
                });

                // Create skills bar chart when it comes into view
                const loadSkillsChart = () => {
                    const skillCounts = {};
                
                    data.forEach(item => {
                        const skills = JSON.parse(item.Skills.replace(/'/g, '"')); // Convert string to array
                        skills.forEach(skill => {
                            skillCounts[skill] = (skillCounts[skill] || 0) + 1; // Count occurrences of each skill
                        });
                    });

                    // Prepare data for Skills Chart
                    const topSkills = Object.entries(skillCounts)
                        .sort((a, b) => b[1] - a[1]) // Sort by count
                        .slice(0, 32); // Get top 32 skills
                
                    const skillLabels = topSkills.map(item => item[0]);
                    const skillDataValues = topSkills.map(item => item[1]);

                    const skillsCtx = document.getElementById('skillsCanvas').getContext('2d');
                    if (window.skillsChart) window.skillsChart.destroy();

                    window.skillsChart = new Chart(skillsCtx, {
                        type: 'bar',
                        data: {
                            labels: skillLabels,
                            datasets: [{
                                label: 'No. of Vacancies',
                                data: skillDataValues,
                                backgroundColor: 'rgba(255, 99, 132, 0.8)'
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: { display: true, text: 'Top Skills for Web Development' },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: { beginAtZero: true, title: { display: true, text: 'No. of Vacancies' } },
                                x: { title: { display: true, text: 'Skills' } }
                            }
                        }
                    });
                };

                // Create the Must Have Skills chart when it comes into view
                const loadMustHaveSkillsChart = () => {
                    const mhskillCounts = {
                        'HTML': 0,
                        'CSS': 0,
                        'JavaScript': 0,
                        'php': 0,
                        'MySQL': 0,
                        'Ajax': 0,
                        'Python': 0,
                        'Bootstrap': 0
                    };

                    // Count occurrences of must-have skills
                    data.forEach(item => {
                        const skills = Array.isArray(item.Skills) ? item.Skills : JSON.parse(item.Skills.replace(/'/g, '"')); // Ensure Skills is an array

                        if (skills.some(skill => skill.toLowerCase().includes('html'))) {
                            mhskillCounts['HTML'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('css') || skill.toLowerCase().startsWith('ml'))) {
                            mhskillCounts['CSS'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('java'))) {
                            mhskillCounts['JavaScript'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('php'))) {
                            mhskillCounts['php'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('sql') || skill.toLowerCase().includes('natural'))) {
                            mhskillCounts['MySQL'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('ajax'))) {
                            mhskillCounts['Ajax'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('python'))) {
                            mhskillCounts['Python'] += item.count || 1;
                        }
                        if (skills.some(skill => skill.toLowerCase().includes('bootstrap'))) {
                            mhskillCounts['Bootstrap'] += item.count || 1;
                        }
                    });

                    // Prepare data for the Must Have Skills Chart
                    const labels = Object.keys(mhskillCounts);
                    const counts = Object.values(mhskillCounts);

                    const ctx = document.getElementById('mustHaveSkillsCanvas').getContext('2d');
                    if (window.mustHaveSkillsChart) window.mustHaveSkillsChart.destroy();

                    window.mustHaveSkillsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Proportion',
                                data: counts,
                                backgroundColor: ['rgba(255, 206, 86, 0.8)']
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Must Have Skills for Web Development'
                                },
                                legend: { position: 'bottom', labels: {padding: 20}},
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Proportion'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Skills'
                                    }
                                }
                            }
                        }
                    });
                };

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('skillsCanvas'));

                new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadMustHaveSkillsChart();
                            observer.unobserve(entry.target);
                        }
                    });
                }).observe(document.getElementById('mustHaveSkillsCanvas'));
            })
            .catch(error => console.error('Error fetching data:', error));
        
        // Location Map
        // Mapping of state names to FusionCharts region codes
        const city_to_code = {
            "andaman and nicobar islands": "001",
            "andhra pradesh": "002",
            "arunachal pradesh": "003",
            "assam": "004",
            "bihar": "005",
            "chandigarh": "006",
            "chhattisgarh": "007",
            "dadra and nagar haveli": "008",
            "daman and diu": "009",
            "delhi": "010",
            "goa": "011",
            "gujarat": "012",
            "haryana": "013",
            "himachal pradesh": "014",
            "jammu and kashmir": "015",
            "jharkhand": "016",
            "karnataka": "017",
            "kerala": "018",
            "ladakh": "019",
            "lakshadweep": "020",
            "madhya pradesh": "021",
            "maharashtra": "022",
            "manipur": "023",
            "meghalaya": "024",
            "mizoram": "025",
            "nagaland": "026",
            "odisha": "027",
            "puducherry": "028",
            "punjab": "029",
            "rajasthan": "030",
            "sikkim": "031",
            "tamil nadu": "032",
            "telangana": "033",
            "tripura": "034",
            "uttar pradesh": "035",
            "uttarakhand": "036",
            "west bengal": "037"
        };

        // Load data from JSON file
        fetch('wd_state_wise_counts.json')
            .then(response => response.json())
            .then(stateCounts => {
                // Calculate total job count
                const totalJobs = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);

                // Prepare data array for FusionCharts with percentage calculation
                const data = Object.entries(stateCounts).map(([state, count]) => {
                    const percentage = ((count / totalJobs) * 100).toFixed(1);  // Percentage calculation with one decimal
                    const code = city_to_code[state.toLowerCase()];
                    return code ? { 
                        "id": code, 
                        "value": `${percentage}%`
                    } : null;
                }).filter(entry => entry);  // Filter out null entries

                // Initialize and render the chart
                FusionCharts.ready(function () {
                    var jobDensityMap = new FusionCharts({
                        type: 'maps/india',
                        renderAt: 'chartContainer',
                        width: '700',
                        height: '500',
                        dataFormat: 'json',
                        dataSource: {
                            "chart": {
                                "caption": "Job Percentage Across India",
                                "captionFontSize": "12",
                                "captionFont": "Arial",
                                "theme": "fusion",
                                "showLabels": "0",  // Hide state codes
                                "formatNumberScale": "0",
                                "entityFillHoverColor": "#B3E5FC",
                                "showEntityHoverEffect": "1",
                                "toolTipBorderColor": "#01579B",
                                "toolTipBgColor": "#FFFFFF"
                            },
                            "colorrange": {
                                "minvalue": "0",
                                "startlabel": "Low",
                                "endlabel": "High",
                                "code": "#B3E5FC",
                                "gradient": "1",
                                "color": [{
                                    "maxvalue": "10",
                                    "code": "#B3E5FC",
                                    "displayValue": "Low"
                                }, {
                                    "maxvalue": "30",
                                    "code": "#4FC3F7",
                                    "displayValue": "Moderate"
                                }, {
                                    "maxvalue": "60",
                                    "code": "#0288D1",
                                    "displayValue": "High"
                                }, {
                                    "maxvalue": "100",
                                    "code": "#01579B",
                                    "displayValue": "Very High"
                                }]
                            },
                            "data": data
                        }
                    });
                    jobDensityMap.render();
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }
}