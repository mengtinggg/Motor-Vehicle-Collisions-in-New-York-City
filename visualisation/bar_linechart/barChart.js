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
const TIME = [...Array(24).keys()];

load_data.then(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mapviz").style.display = "block";
    makeChart1(dataset);
});

function makeChart1(data) {
    console.log(data);

    // Button Active Status
    document.getElementById("1_but").setAttribute("class", "btn btn-outline-dark active");
    document.getElementById("2_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("3_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("4_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("5_but").setAttribute("class", "btn btn-outline-dark");

    // Chart Title 
    document.getElementById("title1").innerHTML = "Total Collisions Monthly (STATEN ISLAND)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH MONTH"]
    );

    console.log(sumstats)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 60;

    // append the svg object to the body of the page
    d3.selectAll('#chart1').remove()
    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("id", "chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
        .scaleBand()
        .domain(MONTH)
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Month");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update1(sumstats, 'STATEN ISLAND', svg, x, y, height)

    // Chart Title 
    document.getElementById("title2").innerHTML = "Total Collisions Daily (STATEN ISLAND)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats2 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH DAY_v2"]
    );

    // append the svg object to the body of the page
    d3.selectAll('#chart2').remove()
    var svg2 = d3.select("#barchart2")
        .append("svg")
        .attr("id", "chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x2 = d3
        .scaleBand()
        .domain(DAY)
        .range([0, width - padding]);
    svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Weekday");

    // Add Y axis
    var y2 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats2, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update2(sumstats2, 'STATEN ISLAND', svg2, x2, y2, height)

    // Chart Title 
    document.getElementById("title3").innerHTML = "Total Collisions Hourly (STATEN ISLAND)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats3 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH TIME"].split(':')[0]
    );

    console.log(sumstats3)

    // append the svg object to the body of the page
    d3.selectAll('#chart3').remove()
    var svg3 = d3.select("#barchart3")
        .append("svg")
        .attr("id", "chart3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x3 = d3
        .scaleBand()
        .domain(TIME)
        .range([0, width - padding]);
    svg3
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Hour");

    // Add Y axis
    var y3 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats3, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update3(sumstats3, 'STATEN ISLAND', svg3, x3, y3, height)
}

function makeChart2(data) {
    console.log(data);

    // Button Active Status
    document.getElementById("2_but").setAttribute("class", "btn btn-outline-dark active");
    document.getElementById("1_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("3_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("4_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("5_but").setAttribute("class", "btn btn-outline-dark");

    // Chart Title 
    document.getElementById("title1").innerHTML = "Total Collisions Monthly (BROOKLYN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH MONTH"]
    );

    console.log(sumstats)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 60;

    // append the svg object to the body of the page
    d3.selectAll('#chart1').remove()
    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("id", "chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
        .scaleBand()
        .domain(MONTH)
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Month");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update1(sumstats, 'BROOKLYN', svg, x, y, height)

    // Chart Title 
    document.getElementById("title2").innerHTML = "Total Collisions Daily (BROOKLYN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats2 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH DAY_v2"]
    );

    // append the svg object to the body of the page
    d3.selectAll('#chart2').remove()
    var svg2 = d3.select("#barchart2")
        .append("svg")
        .attr("id", "chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x2 = d3
        .scaleBand()
        .domain(DAY)
        .range([0, width - padding]);
    svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Weekday");

    // Add Y axis
    var y2 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats2, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update2(sumstats2, 'BROOKLYN', svg2, x2, y2, height)

    // Chart Title 
    document.getElementById("title3").innerHTML = "Total Collisions Hourly (BROOKLYN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats3 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH TIME"].split(':')[0]
    );

    console.log(sumstats3)

    // append the svg object to the body of the page
    d3.selectAll('#chart3').remove()
    var svg3 = d3.select("#barchart3")
        .append("svg")
        .attr("id", "chart3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x3 = d3
        .scaleBand()
        .domain(TIME)
        .range([0, width - padding]);
    svg3
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Hour");

    // Add Y axis
    var y3 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats3, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update3(sumstats3, 'BROOKLYN', svg3, x3, y3, height)
}

function makeChart3(data) {
    console.log(data);

    // Button Active Status
    document.getElementById("3_but").setAttribute("class", "btn btn-outline-dark active");
    document.getElementById("1_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("2_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("4_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("5_but").setAttribute("class", "btn btn-outline-dark");

    // Chart Title 
    document.getElementById("title1").innerHTML = "Total Collisions Monthly (BRONX)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH MONTH"]
    );

    console.log(sumstats)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 60;

    // append the svg object to the body of the page
    d3.selectAll('#chart1').remove()
    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("id", "chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
        .scaleBand()
        .domain(MONTH)
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Month");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update1(sumstats, 'BRONX', svg, x, y, height)

    // Chart Title 
    document.getElementById("title2").innerHTML = "Total Collisions Daily (BRONX)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats2 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH DAY_v2"]
    );

    // append the svg object to the body of the page
    d3.selectAll('#chart2').remove()
    var svg2 = d3.select("#barchart2")
        .append("svg")
        .attr("id", "chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x2 = d3
        .scaleBand()
        .domain(DAY)
        .range([0, width - padding]);
    svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Weekday");

    // Add Y axis
    var y2 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats2, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update2(sumstats2, 'BRONX', svg2, x2, y2, height)

    // Chart Title 
    document.getElementById("title3").innerHTML = "Total Collisions Hourly (BRONX)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats3 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH TIME"].split(':')[0]
    );

    console.log(sumstats3)

    // append the svg object to the body of the page
    d3.selectAll('#chart3').remove()
    var svg3 = d3.select("#barchart3")
        .append("svg")
        .attr("id", "chart3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x3 = d3
        .scaleBand()
        .domain(TIME)
        .range([0, width - padding]);
    svg3
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Hour");

    // Add Y axis
    var y3 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats3, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update3(sumstats3, 'BRONX', svg3, x3, y3, height)
}

function makeChart4(data) {
    console.log(data);

    // Button Active Status
    document.getElementById("4_but").setAttribute("class", "btn btn-outline-dark active");
    document.getElementById("1_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("2_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("3_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("5_but").setAttribute("class", "btn btn-outline-dark");

    // Chart Title 
    document.getElementById("title1").innerHTML = "Total Collisions Monthly (MANHATTAN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH MONTH"]
    );

    console.log(sumstats)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 60;

    // append the svg object to the body of the page
    d3.selectAll('#chart1').remove()
    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("id", "chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
        .scaleBand()
        .domain(MONTH)
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Month");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update1(sumstats, 'MANHATTAN', svg, x, y, height)

    // Chart Title 
    document.getElementById("title2").innerHTML = "Total Collisions Daily (MANHATTAN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats2 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH DAY_v2"]
    );

    // append the svg object to the body of the page
    d3.selectAll('#chart2').remove()
    var svg2 = d3.select("#barchart2")
        .append("svg")
        .attr("id", "chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x2 = d3
        .scaleBand()
        .domain(DAY)
        .range([0, width - padding]);
    svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Weekday");

    // Add Y axis
    var y2 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats2, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update2(sumstats2, 'MANHATTAN', svg2, x2, y2, height)

    // Chart Title 
    document.getElementById("title3").innerHTML = "Total Collisions Hourly (MANHATTAN)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats3 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH TIME"].split(':')[0]
    );

    console.log(sumstats3)

    // append the svg object to the body of the page
    d3.selectAll('#chart3').remove()
    var svg3 = d3.select("#barchart3")
        .append("svg")
        .attr("id", "chart3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x3 = d3
        .scaleBand()
        .domain(TIME)
        .range([0, width - padding]);
    svg3
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Hour");

    // Add Y axis
    var y3 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats3, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update3(sumstats3, 'MANHATTAN', svg3, x3, y3, height)
}

function makeChart5(data) {
    console.log(data);

    // Button Active Status
    document.getElementById("5_but").setAttribute("class", "btn btn-outline-dark active");
    document.getElementById("1_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("2_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("3_but").setAttribute("class", "btn btn-outline-dark");
    document.getElementById("4_but").setAttribute("class", "btn btn-outline-dark");

    // Chart Title 
    document.getElementById("title1").innerHTML = "Total Collisions Monthly (QUEENS)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH MONTH"]
    );

    console.log(sumstats)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 60;

    // append the svg object to the body of the page
    d3.selectAll('#chart1').remove()
    var svg = d3.select("#barchart1")
        .append("svg")
        .attr("id", "chart1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
        .scaleBand()
        .domain(MONTH)
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Month");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update1(sumstats, 'QUEENS', svg, x, y, height)

    // Chart Title 
    document.getElementById("title2").innerHTML = "Total Collisions Daily (QUEENS)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats2 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH DAY_v2"]
    );

    // append the svg object to the body of the page
    d3.selectAll('#chart2').remove()
    var svg2 = d3.select("#barchart2")
        .append("svg")
        .attr("id", "chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x2 = d3
        .scaleBand()
        .domain(DAY)
        .range([0, width - padding]);
    svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Weekday");

    // Add Y axis
    var y2 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats2, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y2).tickSizeOuter(0));

    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update2(sumstats2, 'QUEENS', svg2, x2, y2, height)

    // Chart Title 
    document.getElementById("title3").innerHTML = "Total Collisions Hourly (QUEENS)";

    // groupby(BOROUGH, CRASH MONTH)
    var sumstats3 = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH TIME"].split(':')[0]
    );

    console.log(sumstats3)

    // append the svg object to the body of the page
    d3.selectAll('#chart3').remove()
    var svg3 = d3.select("#barchart3")
        .append("svg")
        .attr("id", "chart3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x3 = d3
        .scaleBand()
        .domain(TIME)
        .range([0, width - padding]);
    svg3
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Hour");

    // Add Y axis
    var y3 = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats3, function (d) {
            return d[2].length
        })])
        .range([height, padding]);
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y3).tickSizeOuter(0));

    svg3.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // plotting the bars
    update3(sumstats3, 'QUEENS', svg3, x3, y3, height)
}

// A function that create / update the plot for a given variable:
function update1(sumstats, borough, svg, x, y, height) {
    var data = [];

    for (let i = 0; i < sumstats.length; i++) {
        if (sumstats[i][0] == borough) {
            data.push({ "month": MONTH[sumstats[i][1]], "count": sumstats[i][2].length })
        }
    }
    var bar = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("g")

    bar.append("rect")
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.month); })
        .attr("y", function (d) { return y(d.count); })
        .attr("width", x.bandwidth() - 5)
        .attr("height", function (d) { return height - y(d.count); })
        .attr("fill", "#14d1b8")

    bar.append("text")
        .merge(bar)
        .transition()
        .duration(1000)
        .text(function (d) { return d.count })
        .attr("x", function (d) { return x(d.month) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.count) - 10; })
        .attr("text-anchor", "middle")

}

function update2(sumstats, borough, svg, x, y, height) {
    var data = [];

    for (let i = 0; i < sumstats.length; i++) {
        if (sumstats[i][0] == borough) {
            data.push({ "day": DAY[sumstats[i][1]], "count": sumstats[i][2].length })
        }
    }

    var bar = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("g")

    bar.append("rect")
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.day); })
        .attr("y", function (d) { return y(d.count); })
        .attr("width", x.bandwidth() - 5)
        .attr("height", function (d) { return height - y(d.count); })
        .attr("fill", "#14d1b8")

    bar.append("text")
        .merge(bar)
        .transition()
        .duration(1000)
        .text(function (d) { return d.count })
        .attr("x", function (d) { return x(d.day) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.count) - 10; })
        .attr("text-anchor", "middle")

}

function update3(sumstats, borough, svg, x, y, height) {
    var data = [];

    for (let i = 0; i < sumstats.length; i++) {
        if (sumstats[i][0] == borough) {
            data.push({ "hour": TIME[sumstats[i][1]], "count": sumstats[i][2].length })
        }
    }

    var bar = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("g")

    bar.append("rect")
        .merge(bar)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.hour); })
        .attr("y", function (d) { return y(d.count); })
        .attr("width", x.bandwidth() - 5)
        .attr("height", function (d) { return height - y(d.count); })
        .attr("fill", "#14d1b8")

    bar.append("text")
        .merge(bar)
        .transition()
        .duration(1000)
        .text(function (d) { return d.count })
        .attr("x", function (d) { return x(d.hour) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.count) - 10; })
        .attr("text-anchor", "middle")
}