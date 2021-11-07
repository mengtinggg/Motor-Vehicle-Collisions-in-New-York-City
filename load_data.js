// ------------------------------------------------ Helper Function ----------------------------------------------
function unique_value(d, column_name) {
    var column_array = d.map(x => x[column_name])
    var result = [... new Set(column_array)]
    return result
}

function find_count(d, column_name){
    var unique_array = unique_value(d, column_name)
    var result = {}
    for (var i = 0; i < unique_array.length; i++){
        var column_array = d.filter(x => x[column_name] == unique_array[i])
        result[unique_array[i]] = column_array.length
    }
    return result
}

// ---------------------------------------- Mapping for Contributing Factors ----------------------------------------------
// Improper driving
var factor1 = ["Driver Inexperience", "Passing or Lane Usage Improper", "Failure to Yield Right-of-Way", "Following Too Closely",
 "Turning Improperly", "Unsafe Speed", "Backing Unsafely", "Passing Too Closely", "Traffic Control Disregarded", "Unsafe Lane Changing",
"Failure to Keep Right", "Aggressive Driving/Road Rage"]
// Distraction from external vehicle and people
var factor2 = ["Driver Inattention/Distraction", "Reaction to Uninvolved Vehicle", "Reaction to Other Uninvolved Vehicle",
 "Outside Car Distraction", "Passenger Distraction", "Pedestrian/Bicyclist/Other Pedestrian Error/Confusion"]
// Disability and illness
var factor3 = ["Illnes", "Illness", "Physical Disability"]
// Under influence of illegal drugs and alcohol
var factor4 = ["Drugs (illegal)", "Drugs (Illegal)", "Alcohol Involvement"]
// Under medication
var factor5 = ["Prescription Medication"]
// Driver unconscious
var factor6 = ["Fell Asleep", "Lost Consciousness", "Fatigued/Drowsy"]
// Distraction from use of devices and food consumption
var factor7 = ["Eating or Drinking", "Cell Phone (hands-free)", "Using On Board Navigation Device", "Listening/Using Headphones",
 "Cell Phone (hand-held)", "Cell Phone (hand-Held)", "Other Electronic Device", "Texting"]
// Poor road conditions
var factor8 = ["View Obstructed/Limited", "Pavement Slippery", "Animals Action", "Pavement Defective", 
"Obstruction/Debris", "Traffic Control Device Improper/Non-Working", "Shoulders Defective/Improper", "Glare", 
"Lane Marking Improper/Inadequate"]
// Defects in vehicle
var factor9 = ["Steering Failure", "Brakes Defective", "Other Vehicular", "Tire Failure/Inadequate", "Accelerator Defective", 
"Headlights Defective", "Tinted Windows", "Vehicle Vandalism", "Driverless/Runaway Vehicle", "Tow Hitch Defective", 
"Windshield Inadequate", "Other Lighting Defects", "Oversized Vehicle"]
// Unknown
var factor10 = ["Unspecified", "80", "1"]

var factor_map = {
    ...Object.fromEntries(
        factor1.map(key => [key, "Improper Driving"]),
    ),
    ...Object.fromEntries(
        factor2.map(key => [key, "Distraction from external vehicles and persons"])
    ),
    ...Object.fromEntries(
        factor3.map(key => [key, "Disability and illness"])
    ),
    ...Object.fromEntries(
        factor4.map(key => [key, "Under influence of illegal drugs and alcohol"])
    ),
    ...Object.fromEntries(
        factor5.map(key => [key, "Prescription Medication"])
    ),
    ...Object.fromEntries(
        factor6.map(key => [key, "Driver unconscious"])
    ),
    ...Object.fromEntries(
        factor7.map(key => [key, "Distraction from use of devices and food consumption"])
    ),
    ...Object.fromEntries(
        factor8.map(key => [key, "Poor road conditions"])
    ),
    ...Object.fromEntries(
        factor9.map(key => [key, "Defects in vehicle"])
    ),
    ...Object.fromEntries(
        factor10.map(key => [key, "Unknown"])
    )
}
var word_map_data = {}
var myWords = []
var boroughs = ["BROOKLYN", "BRONX", "STATEN ISLAND", "QUEENS", "MANHATTAN"]
for (let borough of boroughs) {
    word_map_data[borough] = {}
    for (let i = 2012; i <= 2021; i++) {
        word_map_data[borough][i] = []
    }
}

const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DATA_URL = "data/Motor_Vehicle_Collisions_-_Crashes.csv";
var dataset = []

// ----------------------------------------------- Load Data ------------------------------------------------------
console.log("Start importing data from CSV...")
const load_data = d3.csv(DATA_URL).then(function(d){
    const ORI_LENGTH = d.length
    for (var i = 0; i < d.length; i++) { 
        if (d[i]['LOCATION'] != '' && d[i]['BOROUGH'] != ''){
            d[i]['LATITUDE'] = parseFloat(d[i]['LATITUDE'])
            d[i]['LONGITUDE'] = parseFloat(d[i]['LONGITUDE'])
            d[i]['NUMBER OF CYCLIST INJURED'] = parseInt(d[i]['NUMBER OF CYCLIST INJURED'])
            d[i]['NUMBER OF CYCLIST KILLED'] = parseInt(d[i]['NUMBER OF CYCLIST KILLED'])
            d[i]['NUMBER OF MOTORIST INJURED'] = parseInt(d[i]['NUMBER OF MOTORIST INJURED'])
            d[i]['NUMBER OF MOTORIST KILLED'] = parseInt(d[i]['NUMBER OF MOTORIST KILLED'])
            d[i]['NUMBER OF PEDESTRIANS INJURED'] = parseInt(d[i]['NUMBER OF PEDESTRIANS INJURED'])
            d[i]['NUMBER OF PEDESTRIANS KILLED'] = parseInt(d[i]['NUMBER OF PEDESTRIANS KILLED'])
            d[i]['NUMBER OF PERSONS INJURED'] = parseInt(d[i]['NUMBER OF PERSONS INJURED'])
            d[i]['NUMBER OF PERSONS KILLED'] = parseInt(d[i]['NUMBER OF PERSONS KILLED'])
            d[i]['ZIP CODE'] = parseInt(d[i]['ZIP CODE'])

            let crash_date_array = d[i]['CRASH DATE'].split('/')
            let crash_time_aray = d[i]['CRASH TIME'].split(':')
            d[i]['CRASH MONTH'] = parseInt(crash_date_array[0]) - 1 // 04/28/2021 => return 4 [0-11]
            d[i]['CRASH YEAR'] = parseInt(crash_date_array[2]) // 04/28/2021 => return 2021
            d[i]['CRASH DAY_v1'] = parseInt(crash_date_array[1]) // 04/28/2021 => return 28
            var date_obj = new Date()
            d[i]['CRASH DATE_OBJECT'] = new Date(d[i]['CRASH DATE']) // 04/28/2021 => return Date object
            d[i]['CRASH TIME_COMPARE'] = date_obj.setHours(crash_time_aray[0], crash_time_aray[1], 0) // return time value
            d[i]['CRASH DAY_v2'] = d[i]['CRASH DATE_OBJECT'].getDay() // 04/28/2021 => 0-6 map to [Sunday... Friday]
            d[i]['CRASH HOUR'] = parseInt(crash_time_aray[0]) // 4:23 => return 4 [0-23]

            // start mapping each factor column to factor map and add to a single array
            var factor_cols = ["CONTRIBUTING FACTOR VEHICLE 1", "CONTRIBUTING FACTOR VEHICLE 2", "CONTRIBUTING FACTOR VEHICLE 3",
                                "CONTRIBUTING FACTOR VEHICLE 4", "CONTRIBUTING FACTOR VEHICLE 5"]
            var contributing_factors = []
            var mapped_factor;
            var factor_word_obj;
            
            for (let factor_col of factor_cols) {
                if (d[i][factor_col] !== "" ) {
                    mapped_factor = factor_map[d[i][factor_col]]
                    contributing_factors.push(mapped_factor)
                    factor_word_obj = word_map_data[d[i]['BOROUGH']][d[i]['CRASH YEAR']].find(x=>x.word == mapped_factor)
                    if (factor_word_obj === undefined) {
                        word_map_data[d[i]['BOROUGH']][d[i]['CRASH YEAR']].push({word: mapped_factor, size: 1})
                    } else {
                        factor_word_obj.size += 1
                    }
                }
            }
            // remove duplicate mapped factors from array
            contributing_factors = [... new Set(contributing_factors)]
            d[i]['CONTRIBUTING FACTORS'] = contributing_factors

            dataset.push(d[i])
        }
    }

    console.log('Sample output (can reference column from below): ')
    console.log(dataset[0])
    console.log(`Imported Done!!! Original Length: ${ORI_LENGTH}; Filtered Length: ${dataset.length}`)    
})

