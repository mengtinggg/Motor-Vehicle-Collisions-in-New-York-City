# Team 6 VA Project
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="prerequisites-&-installation">Prerequisites & Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

## About The Project
This repository contains the source code for the project titled: `Motor Vehicle Collisions in New York City`. This project is for the course IS428 - Visual Analytics for Bus. Int. - G1 AY 2021 - 2022. 

These visualisations aim to answer this problem statements: `How can we produce useful visualisations to identify critical collisions dedicated to improving traffic safety?`

### Built With
* [D3 Javascript](https://d3js.org/)
* [Python](https://www.python.org/downloads/)

### Prerequisites & Installation
The followings folders are crucial for the deployment of the visualization website:
+ assets (contains the background of the homepage)
+ data (contains raw and processed data files needed for the visualisations)
+ css (contains css for the homepage as well as loading icon)
+ visulisation (stores the codes for each visualisations)
+ index.html (homepage/ landing page)

Before running the codes, you will need to download the raw Vehicle Collisions dataset which is too big to be pushed to Github.

1. Download `Motor_Vehicle_Collisions_-_Crashes.csv` from: https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95
   ```sh
   Export > CSV
   ```
2. Place the file in the `data` folder.
3. Run `visualisation/vehiclenet/pyscript/FDG_eda.py` to generate `nodeLinks.json`, `relationship.json` and `vehicle_influence.json`. These 3 json files will be generated in the data/json folder thereafter and are required for the visualization of the VehicleNet. This process may be skipped if the json files are already present in the data/json folder.


### Usage
* From the home directory, open localhost port via:
   ```sh
   python -m http.server <PORT NUMBER e.g. 8001>
   ```

## Contributors
+ Emmanuel Tan Sheng Wei
+ Gan Shao Hong
+ Wang Shurui
+ Yong Wei Theen
+ Yu Mengting
