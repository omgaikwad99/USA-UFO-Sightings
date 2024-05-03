// Load data
d3.csv("data/ufo_sightings_NMV.csv")
  .then(function(data) {
    // Parse date_time field as Date object
    data.forEach(function(d) {
      d.date_time = new Date(d.date_time);
    });
  
    // Call function to create hourly trends visualization
    createHourlyTrends(data);
  })
  .catch(function(error) {
    console.log("Error loading the data: " + error);
  });

// Function to create hourly trends visualization
function createHourlyTrends(data) {
  // Group sightings by hour of the day
  const sightingsByHour = d3.group(data, d => d.date_time.getHours());

  // Calculate counts for each hour
  const hourlyCounts = Array.from(sightingsByHour, ([hour, sightings]) => ({ hour, count: sightings.length }));

  // Set up SVG dimensions
  const margin = { top: 50, right: 30, bottom: 60, left: 200 }; // Adjusted margins
  const width = 1200 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom; // Adjusted height

  // Create SVG element
  const svg = d3.select("#hourly-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X scale (hours)
  const x = d3.scaleLinear()
    .domain([0, 24])
    .range([0, width])


  // Y scale (count)
  const y = d3.scaleLinear()
    .domain([0, d3.max(hourlyCounts, d => d.count)])
    .nice()
    .range([height, 0]);

    svg.selectAll("rect")
    .data(hourlyCounts)
    .enter().append("rect")
    .attr("x", d => x(d.hour))
    .attr("y", d => y(d.count))
    .attr("width", (width / 24)) // Divide width equally among 24 hours
    .attr("height", d => height - y(d.count))
    .attr("fill", "#20C593")
    .attr("stroke", "#000") // Add outline color
    .attr("stroke-width", 1); // Specify outline width

    svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .text("Sightings Throughout The Day");

  // Add X axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d => d + ":00"));

  // Add Y axis
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  // Add labels for axes
  svg.append("text")
    .attr("x", width / 2 + 10)
    .attr("y", height + margin.top)
    .attr("text-anchor", "middle")
    .text("Time of the Day (Hours)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 130-margin.left)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text("Sightings (Number)");

  // Tooltip
  const tooltip = d3.select("#tooltip");

  // Add event listeners for tooltips
  svg.selectAll("rect")
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut);

  // Tooltip functions
  function handleMouseOver(event, d) {
    tooltip.style("display", "block");
  }

  function handleMouseMove(event, d) {
    const [xPos, yPos] = d3.pointer(event);
    tooltip
      .style("left", xPos + 10 + "px")
      .style("top", yPos + 10 + "px")
      .html(`Hour: ${d.hour}<br>Count: ${d.count}`);
  }

  function handleMouseOut(event, d) {
    tooltip.style("display", "none");
  }

  // Add brushing functionality to the bar chart
  const brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("end", brushed);

  // Append the brush to the SVG element
  svg.append("g")
    .attr("class", "brush")
    .call(brush);

    function brushed(event) {
        console.log("Event selection:", event.selection);
    
        // Check if event.selection is defined and is an array
        if (!event.selection || !Array.isArray(event.selection)) return;
    
        // Get the brushed range of hours
        const [x0, x1] = event.selection.map(x.invert);
    
        // Filter data based on the brushed range of hours
        const brushedData = data.filter(d => {
            const hour = d.date_time.getHours();
            return hour >= x0 && hour <= x1;
        });
    
        // Update the map with the filtered data
        leafletMap.updateMapWithFilteredData(brushedData);
    }
    

  
  
}
