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

    makeChart(dataset);
    createLegend();
});

function makeChart(data) {
    // console.log(data);

    // groupby(BOROUGH, CRASH YEAR)
    var sumstats = d3.flatGroup(
        dataset,
        (d) => d["BOROUGH"],
        (d) => d["CRASH YEAR"]
    );

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    padding = 60;

    // append the svg object to the body of the page
    var svg = d3
        .select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    var tooltipLine = svg.append('line');

    // Add X axis
    var x = d3
        .scaleTime()
        .domain(d3.extent(sumstats, function (d) { return d[1] }))
        .range([0, width - padding]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 10)
        .attr("y", height)
        .text("Year");

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([0, d3.max(sumstats, function (d) { return d[2].length })])
        .range([height, padding]);
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 40)
        .text("Count");

    // color palette
    var c = ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"];

    // Generate value points for the line
    var borough = unique_value(dataset, "BOROUGH");
    var valuePoints = {};
    var boroughPoints = [];
    var count = 0;

    for (let i = 0; i < sumstats.length; i++) {
        var currentPoints = [];
        if (sumstats[i][0] == borough[count]) {
            currentPoints.push(x(sumstats[i][1]), y(sumstats[i][2].length));
            // currentPoints.push(sumstats[i][1], sumstats[i][2].length);
            boroughPoints.push(currentPoints);

        } else {
            valuePoints[borough[count]] = boroughPoints.sort((a, b) => d3.ascending(a[0], b[0]) || d3.ascending(a[1], b[1]));
            boroughPoints = [];

            currentPoints.push(x(sumstats[i][1]), y(sumstats[i][2].length));
            // currentPoints.push(sumstats[i][1], sumstats[i][2].length);
            boroughPoints.push(currentPoints);

            count++;
        }
    }

    valuePoints[borough[count]] = boroughPoints.sort((a, b) => d3.ascending(a[0], b[0]) || d3.ascending(a[1], b[1]));

    // Draw the line
    for (let i = 0; i < borough.length; i++) {
        drawLine(svg, i, borough, c, valuePoints)
    }

    // Add tooltip
    tipBox = svg.append('rect')
        .data(sumstats)
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', function (event) {

            var year = Math.floor((x.invert(event.pageX - 160)))

            tooltip.transition()
                .style("opacity", .9)

            tooltipLine.style("opacity", .9)
                .attr('stroke', '#808080')
                .attr("stroke-width", 3)
                .attr("stroke-dasharray", "8")
                .attr('x1', x(year))
                .attr('x2', x(year))
                .attr('y1', 0)
                .attr('y2', height);

            tooltip.html(year)
                .style('left', (event.pageX - padding) + "px")
                .style('top', (event.pageY - padding * 3) + "px")
                .html(year + "<br>" + "<br>" +
                    getText(sumstats, year, borough[0])
                    + "<br>" +
                    getText(sumstats, year, borough[1])
                    + "<br>" +
                    getText(sumstats, year, borough[2])
                    + "<br>" +
                    getText(sumstats, year, borough[3])
                    + "<br>" +
                    getText(sumstats, year, borough[4])
                );

        })
        .on('mouseout',
            function (event, d) {
                tooltip.transition()
                    .style("opacity", 0);
                tooltipLine.transition()
                    .style("opacity", 0);
            });

}

function getText(sumstats, year, borough) {
    var text = "";
    for (let i = 0; i < sumstats.length; i++) {
        if (sumstats[i][0] == borough && sumstats[i][1] == year) {
            text = borough + ": " + sumstats[i][2].length
            return text
        }
    }
}

function drawLine(svg, i, borough, c, valuePoints) {
    svg
        .selectAll(".line")
        .data(borough)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", c[i])
        .attr("stroke-width", 3)
        .attr("d", d3.line()(valuePoints[borough[i]]))
        .text([borough[i]]);
}


// Create legend 
function createLegend() {
    var c = ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"];
    var borough = unique_value(dataset, "BOROUGH");


    var legend = d3.select('#legend')
        .style('width', 1200)
        .style('height', 600)

    addRect(legend, c[0], borough[0], 0)
    addRect(legend, c[1], borough[1], 200)
    addRect(legend, c[2], borough[2], 400)
    addRect(legend, c[3], borough[3], 600)
    addRect(legend, c[4], borough[4], 800)

}

function addRect(element, fill, label, x) {
    element.append("rect")
        .attr("x", 120 + x)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", fill)

    element.append("text")
        .style("text-anchor", "start")
        .text(label)
        .attr("x", 120 + x + 40)
        .attr("y", 30)
}