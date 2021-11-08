load_data.then(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mapviz").style.display = "block";
    
    // Create a new instance of the word cloud visualisation.
    myWordCloud = wordCloud('#wordcloud');

    // Start cycling through the data twice for animation starting from BRONX in 2012
    showWords("BRONX", 2012);
    showWords("BRONX", 2012);
    
    // Create bump chart
    borough_slope = word_map_data["BRONX"]
    borough_slope_array = [].concat(...Object.values(borough_slope))

    initialiseBumpChartVar();
    bumpChart = makeBumpChart()

    slopeGraph = document.getElementById("slopegraph");
    slopegraph.appendChild(bumpChart);

})

var myWordCloud;
var borough_slope;
var borough_slope_array;
var bumpChart;
var slopeGraph;

function showWords(borough, year) {
    document.getElementById("myRange").value = year;
    document.getElementById("title").innerHTML = "Vehicle Collision Contributing Factors in " + borough;
    document.getElementById("description").innerHTML = "Factors in " + year;
    document.getElementById("myRange").name = borough.toUpperCase();

    setTimeout(function () { myWordCloud.update(getWords(borough, year)) }, 1)
}

// Encapsulate the word cloud functionality
function wordCloud(selector) {

    // var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 0.8 * screen.width)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(" + 0.8 * screen.width / 2 + ",250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function (d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            // .style("fill", function(d, i) { return fill(i); })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            // .attr('font-size', 1)
            .attr('font-size', 1)
            .text(function (d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
            .duration(600)
            .style("font-size", function (d) { return d.size + "px"; })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }

    function convertRange(value, r1, r2) {
        var v = (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
        // return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
        return v;
    }

    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function (borough_data) {
            var max_size = borough_data.reduce((a, b) => a.size > b.size ? a : b).size;
            var min_size = borough_data.reduce((a, b) => a.size < b.size ? a : b).size;
            d3.layout.cloud().size([960, 600])
                .words(borough_data.map(function (d) { return { text: d.word, size: d.size }; }))
                .padding(1)
                // .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .rotate(0)
                .font("Impact")
                .fontSize(function (d) { return convertRange(d.size, [min_size, max_size], [10, 70]); })
                .on("end", draw)
                .start();
        }
    }

}

//Prepare one of the sample sentences by removing punctuation,
function getWords(borough, year) {
    return word_map_data[borough][year]
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, borough) {
    setTimeout(function () { vis.update(getWords(borough)) }, 2000)
}

var drawAxis;
var title;
var strokeWidth;
var bx;
var by;
var ax;
var y;
var toCurrency;
var words;
var years;
var chartData;
var ranking;
var color;
var seq;
var left,right,width,height,bumpRadius,padding,margin;

function initialiseBumpChartVar() {
    
    bumpRadius = 13
    padding = 25
    margin = ({left: 105, right: 105, top: 20, bottom: 50})

    words = Array.from(new Set(borough_slope_array.flatMap(d => [d.word])))
    
    years = Array.from(new Set(borough_slope_array.flatMap(d => [d.year])))

    width = years.length * 80
    height = words.length * 60

    seq = (start, length) => Array.apply(null, {length: length}).map((d, i) => i + start);

    function getChartData() {
        const ti = new Map(words.map((word, i) => [word, i]));
        const qi = new Map(years.map((year, i) => [year, i]));  
        
        const matrix = Array.from(ti, () => new Array(years.length).fill(null));  
        for (const {word, year, size} of borough_slope_array) 
          matrix[ti.get(word)][qi.get(year)] = {rank: 0, size: +size, next: null};
        
        matrix.forEach((d) => {
            for (let i = 0; i<d.length - 1; i++) 
              d[i].next = d[i + 1];
        });

        years.forEach((d, i) => {
          const array = [];
          matrix.forEach((d) => array.push(d[i]));
          array.sort((a, b) => b.size - a.size);
          array.forEach((d, j) => d.rank = j);
        });
        
        return matrix;
    }

    chartData = getChartData()
    
    function getRanking() {
        const len = years.length - 1;
        const ranking = chartData.map((d, i) => ({word: words[i], first: d[0].rank, last: d[len].rank}));
        return ranking;
    }
    ranking = getRanking()

    left = ranking.sort((a, b) => a.first - b.first).map((d) => d.word);
    
    right = ranking.sort((a, b) => a.last - b.last).map((d) => d.word);

    drawAxis = (g, x, y, axis, domain) => {
        g.attr("transform", `translate(${x},${y})`)
          .call(axis)
          .selectAll(".tick text")
          .attr("font-size", "8px");
        
        if (!domain) g.select(".domain").remove();
    }
    title = g => g.append("title")
        .text((d, i) => `${d.word} - ${years[i]}\nRank: ${d.size.rank + 1}\nCount: ${d.size.size}`)
    
    strokeWidth = d3.scaleOrdinal()
    .domain(["default", "transit", "compact"])
    .range([5, bumpRadius * 2 + 2, 2]);
    
    bx = d3.scalePoint()
    .domain(seq(0, years.length))
    .range([0, width - margin.left - margin.right - padding * 2])
    
    by = d3.scalePoint()
      .domain(seq(0, ranking.length))
      .range([margin.top, height - margin.bottom - padding])
    
    ax = d3.scalePoint()
    .domain(years)
    .range([margin.left + padding, width - margin.right - padding]); 
    
    y = d3.scalePoint()  
      .range([margin.top, height - margin.bottom - padding]);
    
    toCurrency = (num) => d3.format("$,.2f")(num)
    
    color = d3.scaleOrdinal(d3.schemeTableau10)
      .domain(seq(0, ranking.length))
}

function makeBumpChart() {
    const drawingStyle = "compact";
    const compact = drawingStyle === "compact";
    const svg = d3.create("svg")
        .attr("cursor", "default")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .attr("transform", `translate(${margin.left + padding},0)`)
        .selectAll("path")
        .data(seq(0, years.length))
        .join("path")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));

    const series = svg.selectAll(".series")
        .data(chartData)
        .join("g")
        .attr("class", "series")
        .attr("opacity", 1)
        .attr("fill", d => color(d[0].rank))
        .attr("stroke", d => color(d[0].rank))
        .attr("transform", `translate(${margin.left + padding},0)`)
        .on("mouseover", highlight)
        .on("mouseout", restore);

    series.selectAll("path")
        .data(d => d)
        .join("path")
        .attr("stroke-width", strokeWidth(drawingStyle))
        .attr("d", (d, i) => {
            if (d.next)
                return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
        });

    const bumps = series.selectAll("g")
        .data((d, i) => d.map(v => ({ word: words[i], size: v, first: d[0].rank })))
        .join("g")
        .attr("transform", (d, i) => `translate(${bx(i)},${by(d.size.rank)})`)
        //.call(g => g.append("title").text((d, i) => `${d.word} - ${years[i]}\n${toCurrency(d.size.size)}`)); 
        .call(title);

    bumps.append("circle").attr("r", compact ? 5 : bumpRadius);
    bumps.append("text")
        .attr("dy", compact ? "-0.75em" : "0.35em")
        .attr("fill", compact ? null : "white")
        .attr("stroke", "none")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text(d => d.size.rank + 1);

    svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
    const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
    const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right))));

    return svg.node();

    function highlight(e, d) {
        this.parentNode.appendChild(this);
        series.filter(s => s !== d)
            .transition().duration(500)
            .attr("fill", "#ddd").attr("stroke", "#ddd");
        markTick(leftY, 0);
        markTick(rightY, years.length - 1);

        function markTick(axis, pos) {
            axis.selectAll(".tick text").filter((s, i) => i === d[pos].rank)
                .transition().duration(500)
                .attr("font-weight", "bold")
                .attr("fill", color(d[0].rank));
        }
    }

    function restore() {
        series.transition().duration(500)
            .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));
        restoreTicks(leftY);
        restoreTicks(rightY);

        function restoreTicks(axis) {
            axis.selectAll(".tick text")
                .transition().duration(500)
                .attr("font-weight", "normal").attr("fill", "black");
        }
    }
}

function updateBumpChart(borough) {
    borough_slope = word_map_data[borough]
    borough_slope_array = [].concat(...Object.values(borough_slope))
    initialiseBumpChartVar()
    bumpChart = makeBumpChart()
    slopeGraph.removeChild(slopeGraph.childNodes[0])
    slopeGraph.appendChild(bumpChart)
}