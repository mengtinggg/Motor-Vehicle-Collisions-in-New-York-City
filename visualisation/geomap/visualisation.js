/*
Reusable variables:
1. dataset
2. MONTH => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
3. DAY => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

Reusable Functions:
1. unique_value(d, column_name) => Return unique value of a particular column
2. find_count(d, column_name, target) => Return the count of each unique value in a particular column

// console.log(unique_value(dataset, 'CONTRIBUTING FACTOR VEHICLE 1'))
// console.log(unique_value(dataset, 'VEHICLE TYPE CODE 1'))
// console.log(unique_value(dataset, 'BOROUGH'))
// console.log(find_count(dataset, 'CRASH YEAR'))
*/

// ------------------------------------------------ Start Coding -------------------------------------------------

// MAP_URL = '../data/ny.json'
MAP_URL = '../../data/Borough Boundaries.geojson'
// MAP_URL = '../data/NYC Street Centerline (CSCL).geojson'
var geojson;
var color
var projection
var path
var tooltip
var mouseover
var mousemove
var mouseleave
var legendLinear
var first = true

var calculate_BOROUGH_casualities = function(min_value, max_value) {
    var borough_array = unique_value(dataset, 'BOROUGH')
    var casualities_obj_array = []
    var dataset_filtered = dataset.filter((x) => {return x['CRASH YEAR'] <= max_value && x['CRASH YEAR'] >= min_value})
    for (var i = 0; i < borough_array.length; i++){
        var target_array = dataset_filtered.filter((x) => {return x.BOROUGH == borough_array[i]})
        var injuried_count = target_array.reduce(function(accumulator,current) {return accumulator + current['NUMBER OF PERSONS INJURED']},0)
        var killed_count = target_array.reduce(function(accumulator,current) {return accumulator + current['NUMBER OF PERSONS KILLED']},0)

        casualities_obj_array.push({'borough': borough_array[i], 'injuried': injuried_count, 'killed': killed_count, 'value': injuried_count+killed_count, 'total':target_array.length})
    }
    console.log(casualities_obj_array)
    return casualities_obj_array
}

var sliderloader = function(min_value, max_value) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mapviz").style.display = "block";
    var mySlider = new rSlider({
        target: '#sampleSlider',
        values: {"min": min_value, "max": max_value},
        step: 1,
        range: true,
        tooltip: true,
        scale: true,
        labels: false,
        set: [min_value, max_value],
        onChange: function (vals) {
            val_split = vals.split(',')
            if (!first){ // parseInt(val_split[0]) != min_value || parseInt(val_split[1]) != max_value &&
                var casualities_obj = calculate_BOROUGH_casualities(parseInt(val_split[0]), parseInt(val_split[1]));
                update_viz(casualities_obj)
            }
            first = false
        }
    });
}

var update_viz = function(casualities_obj) {
    var svg = d3.select("#mapviz")
    // var color = d3.scaleQuantile()
    //             .range(["#d2f2d4", "#7be382", "#26cc00", "#22b600","#009c1a"])
    color.domain([
        d3.min(casualities_obj, function(d){ return d.total}),
        d3.max(casualities_obj, function(d){ return d.total})
    ]);

    for (var i = 0; i < geojson.features.length; i++){
        var target_borough = geojson.features[i].properties.boro_name
        
        for (var j = 0; j < casualities_obj.length; j++) {
            if (casualities_obj[j].borough == target_borough.toUpperCase()){
                geojson.features[i].properties.casualty = casualities_obj[j]
            }
        }
        
    }
    console.log(geojson)

    svg.selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", path)
    .on("mouseover", function (d,i){ return mouseover(d,i)})
    .on("mousemove", function (d,i) { return mousemove(d,i)})
    .on("mouseleave", mouseleave)
    .transition()
    .style("fill", function(d) {
        var value = d.properties.casualty.total;

        if (value) {
                //If value exists…
                return color(value);
        } else {
                //If value is undefined…
                return "#ccc";
        }
    });

    var highest_value = Math.max(...casualities_obj.map((d) => d.value/d.total))
    console.log(casualities_obj.map((d) => d.value/d.total))

    svg.select("#circledata")
    .selectAll("circle")
    .data(geojson.features)
    .join("circle")
    .on("mouseover", function (d,i){ return mouseover(d,i)})
    .on("mousemove", function (d,i) { return mousemove(d,i)})
    .on("mouseleave", mouseleave)
    .transition()
    .attr("r", function(d){
        var size_value = parseFloat(d.properties.casualty.value/d.properties.casualty.total)
        return size_value/highest_value * 30
    })
    .attr("transform", function(d){
        var centroid = path.centroid(d)
        return "translate(" + centroid +")"
    });


    legendLinear = d3.
    legendColor().
    shapeWidth(25).
    cells(12).
    orient("vertical").
    labelAlign("end").
    scale(color);

    svg.select("#legend").call(legendLinear);

}

load_data.then(() => {
    // write your code here
    min_value = d3.min(dataset, function(d){ return d['CRASH YEAR']})
    max_value = d3.max(dataset, function(d){ return d['CRASH YEAR']})
    sliderloader(min_value, max_value)


    var casualities_obj = calculate_BOROUGH_casualities(min_value, max_value);

    // var width = 900;
    // var height = 500;
    var width = 1200;
    var height = 600;
    
    var svg = d3.select("#mapviz")
        .append("svg")
        .attr("width",width)  // apply width,height to svg
        .attr("height",height)
        .style("display", "block")
        .style("margin", "auto");
    
    projection = d3.geoMercator();
    path = d3.geoPath().projection(projection);

    color = d3.scaleQuantile()
            .range(["#d2f2d4", "#26cc00","#009c1a"])
                // .range(["#d2f2d4", "#7be382", "#26cc00", "#22b600","#009c1a"])
    // color.domain(casualities_obj.map((d) => d.total));
    color.domain([
            d3.min(casualities_obj, function(d){ return d.total}),
            d3.max(casualities_obj, function(d){ return d.total})
        ]);
    // console.log(d3.min(casualities_obj, function(d){ return d.total}),d3.max(casualities_obj, function(d){ return d.total}))

    d3.json(MAP_URL).then(function(json){
        geojson = json
        console.log(geojson)
        projection.fitSize([width,height],geojson); // adjust the projection to the features

        for (var i = 0; i < geojson.features.length; i++){
            var target_borough = geojson.features[i].properties.boro_name
            
            for (var j = 0; j < casualities_obj.length; j++) {
                if (casualities_obj[j].borough == target_borough.toUpperCase()){
                    geojson.features[i].properties.casualty = casualities_obj[j]
                }
            }
            
        }

        //  -----------------------  Tooltip Configuration -------------------------------
        tooltip = d3.select('body').append('div').attr('class', 'tip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', '#f5f5f5')
            .style('padding', '4px 9px')
            .style('border', '1px #333 solid');

        mouseover = function(d,i) {
            tooltip.style("opacity", 1)
        }
        mousemove = function(d,i) {
            tooltip
            .html("Borough: " + i.properties.boro_name + "</br>Casualty Rate: "+ parseFloat(i.properties.casualty.value/i.properties.casualty.total*100).toFixed(2) + "%" + "</br>Casualty Count: "+ i.properties.casualty.value + "</br>Collisions Count: "+ i.properties.casualty.total)
            .style("left", (d.x+70) + "px")
            .style("top", (d.y) + "px")
        }
        mouseleave = function(d) {
            tooltip.style("opacity", 0)
        }

        // --------------------------------------------- MAP visualisation --------------------------------------------
        svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            var value = d.properties.casualty.total;

            if (value) {
                    //If value exists…
                    return color(value);
            } else {
                    //If value is undefined…
                    return "#ccc";
            }
        })
        .on("mouseover", function (d,i){ return mouseover(d,i)})
        .on("mousemove", function (d,i) { return mousemove(d,i)})
        .on("mouseleave", mouseleave);


        // ---------------------------------------------  Circle for casualty size  ------------------------------------------
        var highest_value = Math.max(...casualities_obj.map((d) => d.value/d.total))
        console.log(casualities_obj.map((d) => d.value/d.total))

        svg.
            append("g").
            attr("id", "circledata")

        svg.select("#circledata")
        .selectAll("circle")
        .data(geojson.features)
        .enter()
        .append("circle")
        .attr("r", function(d){
            var size_value = parseFloat(d.properties.casualty.value/d.properties.casualty.total)
            return size_value/highest_value * 30
        })
        .attr("transform", function(d){
            var centroid = path.centroid(d)
            return "translate(" + centroid +")"
        })
        .style("fill", "purple")
        .style("opacity", 0.75)
        .on("mouseover", function (d,i){ return mouseover(d,i)})
        .on("mousemove", function (d,i) { return mousemove(d,i)})
        .on("mouseleave", mouseleave);


        // ------------------------------------------------- Create Legend and adjust position -----------------------------------
        svg.
            append("g").
            attr("id", "legend").
            style("font-size", "12px").
            attr("transform", `translate(200,200)`);
            
        // Modify shape and insert data
        legendLinear = d3.
            legendColor().
            shapeWidth(25).
            cells(12).
            orient("vertical").
            labelAlign("end").
            scale(color);

        // Legend Title
        svg.append("text")             
            .attr("x", 100)
            .attr("y",  215)
            .style("text-anchor", "middle")
            .text("Legend (Collisions Count):")
            .style("font-size", "15px");
        
        svg.append("text")             
            .attr("x", 110)
            .attr("y",  155)
            .style("text-anchor", "middle")
            .text("Legend (Casualty Rate):")
            .style("font-size", "15px");
        
        svg
        .append("circle")
        .style("fill", "purple")
        .attr('r', 5)
        .attr('transform', 'translate(200,150)');

        svg.select("#legend").call(legendLinear);

        // // Insert All data points (FAILED)
        // svg.selectAll("circles")
        // .data(dataset)
        // .enter()
        // .append("circle")
        // .attr("r",2)
        // .attr("transform", function(d) {return "translate(" + projection([d.LONGITUDE,d.LATITUDE]) + ")";});

    })    

})