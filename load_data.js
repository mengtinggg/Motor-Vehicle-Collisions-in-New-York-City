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
            dataset.push(d[i])
        }
    }

    console.log('Sample output (can reference column from below): ')
    console.log(dataset[0])
    console.log(`Imported Done!!! Original Length: ${ORI_LENGTH}; Filtered Length: ${dataset.length}`)    
})
