// Load data
d3.csv("data/ufo_sightings_NMV.csv").then(function(data) {
    // Parse encounter_length as numbers
    data.forEach(function(d) {
        d.encounter_length = +d.encounter_length;
    });

    // Define encounter length ranges (in seconds)
    const lengthRanges = [
        { range: [0, 60], label: "0-60s" },
        { range: [61, 300], label: "1-5m" },
        { range: [301, 600], label: "5-10m" },
        { range: [601, 1800], label: "10-30m" },
        { range: [1801, 3600], label: "30m-1h" },
        { range: [3601, 7200], label: "1-2h" },
        { range: [7201, 10800], label: "2-3h" },
        { range: [10801, 21600], label: "3-6h" },
        { range: [21601, 43200], label: "6-12h" },
        { range: [43201, 86400], label: "12-24h" },
        { range: [86401, Infinity], label: "24h+" }
    ];

    // Count sightings within each range
    const counts = lengthRanges.map(range => ({
        label: range.label,
        count: data.filter(d => d.encounter_length >= range.range[0] && d.encounter_length <= range.range[1]).length
    }));

    // Set up SVG dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 200 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#encounter-length-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define x scale
    const x = d3.scaleLinear()
        .domain([0, counts.length - 1])
        .range([0, width])
        .nice();

    // Y scale (counts)
    const y = d3.scaleLinear()
        .domain([0, d3.max(counts, d => d.count)])
        .nice()
        .range([height, 0]);

        svg.selectAll(".bar")
        .data(counts)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(i))
        .attr("width", width / counts.length)
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("fill", "steelblue") // Change the fill color here
        .attr("stroke", "black") // Add outline color
        .attr("stroke-width", 1); // Specify outline width
    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(i => counts[i].label));

    // Add Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Add X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 10)
        .style("text-anchor", "middle")
        .text("Encounter Length Ranges (Time)");

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 120-margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "22px") 
        .text("Frequency of Sightings by Encounter Length");

    // Create a brush
    const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", event => brushed(x, data, event)); // Pass x scale and data to brushed function

    // Append the brush to the svg
    svg.append("g")
        .attr("class", "brush")
        .call(brush);

}).catch(function(error) {
    console.log("Error loading the data: " + error);
});

// Define brushed function to accept x scale and data as arguments
function brushed(x, data, event) {
    if (!event.selection) return; // Ignore empty selections.

    // Get the selected range
    const selection = event.selection;
    console.log("Selection:", selection);
    console.log("x scale:", x);
    if (!selection) return;

    // Check if the invert method is defined
    if (typeof x.invert !== 'function') {
        console.error("x scale invert method is not defined:", x);
        return;
    }

    const [x0, x1] = selection.map(x.invert);
    console.log("x0:", x0, "x1:", x1);

    // Filter data based on the selected range
    const filteredData = data.filter(d => {
        const encounterLength = +d.encounter_length;
        return encounterLength >= x0 && encounterLength <= x1;
    });

    // Update Leaflet map with filtered data
    leafletMap.updateMapWithFilteredData(filteredData);
}
