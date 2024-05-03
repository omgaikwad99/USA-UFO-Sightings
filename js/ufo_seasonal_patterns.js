// Load the data
d3.csv("data/ufo_sightings_NMV.csv").then(function(data) {
    // Parse dates
    const parseDate = d3.timeParse("%m/%d/%Y %H:%M");

    // Pre-process data - aggregate sightings by month
    const sightingsByMonth = d3.rollup(data, 
        v => v.length, 
        d => d3.timeMonth(parseDate(d.date_time)).getMonth()
    );

    // Convert map to array for easier manipulation
    const timelineData = Array.from(sightingsByMonth, ([key, value]) => ({ month: key, sightings: value }));
    console.log(timelineData);
    // Sort timelineData by month
    timelineData.sort((a, b) => a.month - b.month);

    const sightingsByMonthWithCoords = timelineData.map(monthData => {
    // Filter original data for sightings in this month
    const sightingsInMonth = data.filter(d => {
        const sightingMonth = d3.timeMonth(parseDate(d.date_time)).getMonth();
        return sightingMonth === monthData.month;
    });

    // Extract latitude and longitude for each sighting
    const sightingsCoords = sightingsInMonth.map(sighting => ({
        latitude: sighting.latitude,
        longitude: sighting.longitude
    }));

    return {
        month: monthData.month,
        sightingsCoords: sightingsCoords
    };
});

console.log(sightingsByMonthWithCoords);

    // Set up SVG and margins for bar graph
    const marginBarGraph = { top: 50, right: 20, bottom: 70, left: 200 };
    const widthBarGraph = 800 - marginBarGraph.left - marginBarGraph.right;
    const heightBarGraph = 400 - marginBarGraph.top - marginBarGraph.bottom;

    const svgBarGraph = d3.select("#scatter-plot")
        .attr("width", widthBarGraph + marginBarGraph.left + marginBarGraph.right)
        .attr("height", heightBarGraph + marginBarGraph.top + marginBarGraph.bottom)
        .append("g")
        .attr("transform", "translate(" + marginBarGraph.left + "," + marginBarGraph.top + ")");

    // Define xScaleBarGraph using scaleBand

    const xScaleBarGraph = d3.scaleBand()
        .domain(timelineData.map(d => d.month+1)) // Assuming timelineData contains months
        .range([0, widthBarGraph])
        .padding(0.1);


    const yScaleBarGraph = d3.scaleLinear()
        .domain([0, d3.max(timelineData, d => d.sightings)])
        .nice()
        .range([heightBarGraph, 0]);

    // Draw bars for bar graph
    svgBarGraph.selectAll("rect")
    .data(timelineData)
    .enter().append("rect")
    .attr("x", d => xScaleBarGraph(d.month + 1))
    .attr("y", d => yScaleBarGraph(d.sightings))
    .attr("width", xScaleBarGraph.bandwidth())
    .attr("height", d => heightBarGraph - yScaleBarGraph(d.sightings))
    .attr("fill", "steelblue")
    .attr("stroke", "black") // Add outline color
    .attr("stroke-width", 1); // Specify outline width

    // Append title to the graph
svgBarGraph.append("text")
.attr("x", (widthBarGraph / 2))             
.attr("y", 0 - (marginBarGraph.top / 2))
.attr("text-anchor", "middle")  
.style("font-size", "22px") 
.text("Sightings by Months (Seasons)");

    // Draw x-axis for bar graph
    svgBarGraph.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + heightBarGraph + ")")
        .call(d3.axisBottom(xScaleBarGraph));

    // Draw y-axis for bar graph
    svgBarGraph.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScaleBarGraph));

    // Add labels for bar graph
    svgBarGraph.append("text")
        .attr("x", widthBarGraph / 2)
        .attr("y", heightBarGraph + marginBarGraph.top )
        .attr("text-anchor", "middle")
        .text("Month");

    svgBarGraph.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -heightBarGraph / 2)
        .attr("y", 120-marginBarGraph.left)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Sightings (Number)");

    // Inside the d3.csv callback function in ufo_seasonal_patterns.js

    // Define a brush
    const brush = d3.brushX()
        .extent([[0, 0], [widthBarGraph, heightBarGraph]])
        .on("end", brushed);

    // Append the brush to the SVG
    const gBrush = svgBarGraph.append("g")
        .attr("class", "brush")
        .call(brush);


    function brushed(event) {
        const selection = event.selection; // Access the brush selection
    
        if (!selection) return; // If no selection, return
    
        // Get the pixel coordinates of the brush selection
        const [x0, x1] = selection;
    
        // Calculate the domain values based on pixel coordinates
        const domainX0 = xScaleBarGraph.domain()[Math.round(x0 / xScaleBarGraph.step())];
        const domainX1 = xScaleBarGraph.domain()[Math.round(x1 / xScaleBarGraph.step())];
        console.log(domainX0, domainX1);

        if (typeof domainX1 === 'undefined') {
            domainX1 = 12;
        }
    
        // Find the corresponding month data in sightingsByMonthWithCoords
        const filteredMonthData = sightingsByMonthWithCoords.filter(d => d.month >= domainX0 && d.month <= domainX1);
    
        // Extract latitude and longitude coordinates from the filtered month data
        const filteredCoords = filteredMonthData.flatMap(d => d.sightingsCoords);
    
        // Update the Leaflet map with filtered data
        leafletMap.NewupdateMapWithFilteredData(filteredCoords);
    }
    






}).catch(function(error) {
    console.log("Error loading the data: " + error);
});
