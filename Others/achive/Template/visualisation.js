// ------------------------------------------------ Start Coding -------------------------------------------------
// REUSED FUNCTIONS AND VARIABLES => dataset, MONTH, DAY, unique_value(d, column_name) find_count(d, column_name, target), find_count(d, column_name, target)

/*
Reusable variables:
1. dataset
2. MONTH => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
3. DAY => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

Reusable Functions:
1. unique_value(d, column_name) => Return unique value of a particular column
2. find_count(d, column_name, target) => Return the count of each unique value in a particular column


*/
load_data.then(() => {
    // write your code here

    console.log(unique_value(dataset, 'CONTRIBUTING FACTOR VEHICLE 1'))
    console.log(unique_value(dataset, 'VEHICLE TYPE CODE 1'))
    console.log(unique_value(dataset, 'BOROUGH'))
    console.log(find_count(dataset, 'CRASH YEAR'))

})