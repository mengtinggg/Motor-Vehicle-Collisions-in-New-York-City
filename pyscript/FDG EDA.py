#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import numpy as np
import json
from itertools import combinations as c

# ===== READ CSV ===== #
df = pd.read_csv("/data/Motor_Vehicle_Collisions_-_Crashes.csv")

# ===== Get just vehicles collided, borough and number of injuries/deaths ===== #
filtered = df[['BOROUGH']].join(df.loc[:, "VEHICLE TYPE CODE 1":"VEHICLE TYPE CODE 5"]).join(df.loc[:, "NUMBER OF PERSONS INJURED":"NUMBER OF MOTORIST KILLED"])

# ===== Drop NA for borough, Vehicle Type Code 1 & Vehicle Type Code 2 ===== #
# NA for Vehicle Type Code 1 meant that no vehicles were involved in the collison, and hence removed as incorect data record
# NA for Vehicle Type Code 2 meant that only 1 vehicle was involved in the collison, and hence removed as we want to identify relationship between vehicles
filtered = filtered[filtered['BOROUGH'].notna() & filtered['VEHICLE TYPE CODE 1'].notna() & filtered['VEHICLE TYPE CODE 2'].notna()]

# ===== Find weights (impact of injuries/death) ===== #
# Sum of all injuries and death recorded
filtered['weight'] = filtered.loc[:,"NUMBER OF PERSONS INJURED":"NUMBER OF MOTORIST KILLED"].sum(axis=1)

# ===== Drop columns where weight = 0. ===== #
# Note that there are records with weight = 0. However, since we want to visualise the relationship of collisions, we take them out.
print(filtered['weight'].value_counts())

# drop weight = 0
filtered = filtered[filtered['weight'] > 0]

# ===== Stratified sampling ===== #
# Take 5% of the 1.8mil dataset by using stratified sampling with sklearn library
# Dataset is stratified by borough to ensure no biasness
# Sampling is done because when producing the relastionships between the collided vehicles, not only is it computationally expensive, it also takes very long for the visualisation to load
from sklearn.model_selection import train_test_split
filtered, _ = train_test_split(filtered, test_size=0.95, stratify=filtered[['BOROUGH']], random_state = 42)

print(filtered['weight'].unique())


# ===== VEHICLE INFLUENCE ===== #
# get only borough and vehicle type codes
vehicles = filtered.loc[:, "BOROUGH":"VEHICLE TYPE CODE 5"]

# ===== Convert header into row entries. This step is important in assigning IDs to vehicles based on borough and type codes. ===== #
# For instance: 
# | BOROUGH  | VEHICLE TYPE CODE 1 | VEHICLE TYPE CODE 2 | VEHICLE TYPE CODE 3 | VEHICLE TYPE CODE 4 | VEHICLE TYPE CODE 5 | 
# | Brooklyn |       Sedan         |      Ambulance      |         NaN         |         NaN         |         NaN         |

# will be converted to 
# | BOROUGH  |         type        |       vehicle       |
# | Brooklyn | VEHICLE TYPE CODE 1 |        Sedan        |
# | Brooklyn | VEHICLE TYPE CODE 2 |        Ambulance        |
vehicles_melt = vehicles.melt('BOROUGH', var_name='type', value_name='vehicle').dropna()

# ===== Get frequency of each vehicle happening in each Borough and Type ===== #
print(vehicles_melt.groupby(["BOROUGH", "type", "vehicle"]).size())
# initiate by creating a 'freq' column
vehicles_melt['freq'] = 1
vehicles_melt = vehicles_melt.groupby(["BOROUGH", "type", "vehicle"])['freq'].count().reset_index()

## Note that the disparity between the frequencies are too high
print(f'max: {vehicles_melt["freq"].max()} & min: {vehicles_melt["freq"].min()}')

# ===== To penalise large values, we will log transform the `freq` column. ===== #
# We will use log(x + 1) instead to ensure small transformed values wont be rounded off to 0.
# Multiply the results by 3 to expand the differences after reducing large values
vehicles_melt['freq_log'] = round((np.log(vehicles_melt.freq) + 1) * 3, 3)

# ===== ID-ing each vehicle per Borough and vehicle type by index ===== #
vehicles_melt['id'] = vehicles_melt.index

# ===== Group 'BOROUGH as 'zone' ===== #
boroughs = list(vehicles_melt["BOROUGH"].unique())
boroughs_dict = {k: v for v, k in enumerate(boroughs)}

# map above dict to corresponding values under zone
vehicles_melt["zone"] = vehicles_melt["BOROUGH"].map(boroughs_dict)

# ===== Store relationship df in vehicle_influence.json file. Keep only 'source', 'target', 'weight' columns. ===== #
# orient=record will make each df row as an {object} by itself, instead of {vehicle:..,...,.., type:..,...,... } all tgt
vehicles_melt.loc[:, ['vehicle','freq_log','id','zone']].to_json('/json/vehicle_influence.json', orient='records')


# ===== FIND RELATIONSHIPTS: By identifying the source and target vehicles ===== #
# First, only get the Borough, Vehicle Type Codes and weight
relationship = filtered.loc[:, "BOROUGH":"VEHICLE TYPE CODE 5"].join(filtered[['weight']])

# print(vehicles_melt.loc[(vehicles_melt['BOROUGH'] == "BROOKLYN") & (vehicles_melt['type'] == "VEHICLE TYPE CODE 1") & (vehicles_melt['vehicle'] == "Sedan")].id)
# print(vehicles_melt.iloc[226])

# Work the same as vehicles.values.tolist(), but without the nan values
# Next, get each row in 'vehicles' df as a list
# Output: a list of lists in the format of [[BOROUGH, Vehicle Type Code 1, Vehicle Type Code 2...]]
per_row = [[y for y in x if pd.notna(y)] for x in vehicles.values.tolist()]

# Find all the ids of the vehicles involved in a collision by row
id_map = []
for row in per_row:
    row_ids = []
    for i in range(1, len(row)):
        vtype = "VEHICLE TYPE CODE " + str(i)
        row_ids += list(vehicles_melt.loc[(vehicles_melt["BOROUGH"] == row[0]) & (vehicles_melt['type'] == vtype) & (vehicles_melt['vehicle'] == row[i])].id)
    id_map.append(row_ids)

# ===== Link up all involved vehicles by doing combinations of their IDs ===== #
# for example, if ids = [520, 519, 327], it means vehicle 520, 519, 327 are involved in the crash
# combi(ids) = [(520, 519), (520, 327), (519, 327)] -> all vehicles can be mapped to each other
id_combis = [list(c(ids, 2)) for ids in id_map]
relationship['ids'] = id_map
relationship['ids combined'] = id_combis

# ===== Separate lists of tuples into individual rows ===== #
# For e.g. [(520, 519), (520, 327), (519, 327)] will be separated into 3 rows, each containing one tuple
relationship = relationship.explode("ids combined")

# ===== Separate tuple pair into 2 different columns to represent 'source' and 'target' respectively. ===== #
relationship[['source','target']] = pd.DataFrame(relationship["ids combined"].tolist(), index= relationship.index)

# ===== Store relationship df in relationship.json file. Keep only 'source', 'target', 'weight' columns. ===== #
# orient=record will make each df row as an {object} by itself, instead of {vehicle:..,...,.., type:..,...,... } all tgt
relationship.loc[:, ['source','target','weight']].to_json('/json/relationship.json', orient='records')

# ===== Final JSON output file with nodes and links together ===== #
import json

influence = json.load(open("/json/vehicle_influence.json", 'r'))
relationships = json.load(open("/json/relationship.json", 'r'))
data = {}
data["nodes"] = influence
data["links"] = relationships

with open('nodeLinks.json', 'w') as file:
    json.dump(data, file, indent = 4)