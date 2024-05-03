// // JavaScript file for UFO sightings visualization

// // Load the data
// d3.csv("ufo_sightings_NMV.csv").then(data => {
//     // Aggregate data by UFO shape
//     const sightingsByShape = d3.rollup(data,
//         v => v.length,
//         d => d.ufo_shape
//     );


// // // Pre-process data - aggregate sightings by month
// // const sightingsByMonth = d3.rollup(data, 
// //     v => v.length, 
// //     d => d3.timeMonth(parseDate(d.date_time)).getMonth()
// // );

// // // Convert map to array for easier manipulation
// // const timelineData = Array.from(sightingsByMonth, ([key, value]) => ({ month: key, sightings: value }));
// // console.log(timelineData);
// // // Sort timelineData by month
// // timelineData.sort((a, b) => a.month - b.month);



// // Create array for filtering latitude and longitude
// const allSightingsCoords = data.map(sighting => ({
//     latitude: sighting.latitude,
//     longitude: sighting.longitude
// }));

// // Define a function to filter coordinates based on brushed shapes
// function filterCoords(selectedShapes) {
//     // Filter the data based on selected shapes
//     const filteredCoords = allSightingsCoords.filter(sighting => {
//         // Check if the UFO shape of the sighting matches any of the selected shapes
//         const sightingShape = data.find(d => d.latitude === sighting.latitude && d.longitude === sighting.longitude).ufo_shape;
//         return selectedShapes.includes(sightingShape);
//     });
//     return filteredCoords;
// }


//     // Define the order of UFO shapes
//     const ufoShapes = ["light", "triangle", "circle", "fireball", "other", "unknown", "sphere", "disk", "oval", "formation", "cigar", "changing", "flash", "rectangle", "cylinder", "diamond", "chevron", "egg", "teardrop", "cone", "cross", "delta", "round", "crescent", "pyramid", "flare", "hexagon", "dome", "changed"];

//     // Convert map to array with specified order
//     const sightingsArray = ufoShapes.map(shape => ({ shape, count: sightingsByShape.get(shape) || 0 }));

//     // Define the dimensions for the chart
//     const margin = { top: 20, right: 20, bottom: 100, left: 200 }; // Adjusted bottom margin to accommodate axis labels
//     const width = 1200 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     // Append the SVG
//     const svg = d3.select("#bar-chart") // Changed the ID to match the SVG container for the bar chart
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Define x and y scales
//     const xScale = d3.scaleBand()
//         .domain(sightingsArray.map(d => d.shape))
//         .range([0, width])
//         .padding(0.1);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(sightingsArray, d => d.count)])
//         .nice()
//         .range([height, 0]);

//     // Create bars with custom shapes
//     svg.selectAll(".bar")
//         .data(sightingsArray)
//         .enter()
//         .append("path")
//         .attr("class", "bar")
//         .attr("d", d => getShapePath(d.shape)) // Call function to get the custom shape path
//         .attr("transform", d => `translate(${xScale(d.shape) + xScale.bandwidth() / 2},${yScale(d.count) - 50}) scale(0.2)`) // Scale and position the shape
//         .style("fill", "#20C593");

//         svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", margin.top / 2)
//     .attr("text-anchor", "middle")
//     .style("font-size", "22px")
//     .text("Sightings by Shape");

//     // Add x axis
//     svg.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(xScale))
//         .selectAll("text")
//         .attr("transform", "rotate(-45)")
//         .style("text-anchor", "end");

//     // Add y axis
//     svg.append("g")
//         .attr("class", "y-axis")
//         .call(d3.axisLeft(yScale));

//     // Add axis labels
//     svg.append("text")
//         .attr("transform", `translate(${width / 2},${height + margin.top + 60})`) // Adjusted margin top for x-axis label
//         .style("text-anchor", "middle")
//         .text("UFO Shape");

//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 130 - margin.left)
//         .attr("x", 0 - (height / 2))
//         .attr("dy", "1em")
//         .style("text-anchor", "middle")
//         .text("Sightings (Number)");

//         const brushG = svg.append("g")
//         .attr("class", "brush")
//         .call(d3.brushX()
//             .extent([[0, 0], [width, height]])
//             .on("brush", brushings)
//         );
    
// });

// // // Brush function
// // function brushed(event) {
// //     const selection = event.selection;

// //     if (selection) {
// //         // Get the selected shapes based on the brush selection
// //         const selectedShapes = [];
// //         const [x0, x1] = selection;
// //         xScale.domain().forEach(shape => {
// //             const xPos = xScale(shape) + xScale.bandwidth() / 2;
// //             if (xPos >= x0 && xPos <= x1) {
// //                 selectedShapes.push(shape);
// //             }
// //         });

// //         // Filter the coordinates based on selected shapes
// //         const filteredCoords = filterCoords(selectedShapes);

// //         // Update the Leaflet map with filtered data
// //         leafletMap.NewupdateMapWithFilteredData(filteredCoords);
// //     }
// // }




// function brushings(event) {
//     const selection = event.selection;

//     if (selection) {
//         // Get the selected shapes based on the brush selection
//         const selectedShapes = [];
//         const [x0, x1] = selection;
//         xScale.domain().forEach(shape => {
//             const xPos = xScale(shape) + xScale.bandwidth() / 2;
//             if (xPos >= x0 && xPos <= x1) {
//                 selectedShapes.push(shape);
//             }
//         });

//         // Filter the coordinates based on selected shapes
//         const filteredCoords = filterCoords(selectedShapes);
//         console.log(filteredCoords);
//         // Update the Leaflet map with filtered data
//         //leafletMap.NewupdateMapWithFilteredData(filteredCoords);
//     }
// }

// Load the data
d3.csv("data/ufo_sightings_NMV.csv").then(data => {
    // Aggregate data by UFO shape
    const sightingsByShape = d3.rollup(data,
        v => v.length,
        d => d.ufo_shape
    );

    // Create array for filtering latitude and longitude
    const allSightingsCoords = data.map(sighting => ({
        latitude: sighting.latitude,
        longitude: sighting.longitude
    }));

    // Define the order of UFO shapes
    const ufoShapes = ["light", "triangle", "circle", "fireball", "other", "unknown", "sphere", "disk", "oval", "formation", "cigar", "changing", "flash", "rectangle", "cylinder", "diamond", "chevron", "egg", "teardrop", "cone", "cross", "delta", "round", "crescent", "pyramid", "flare", "hexagon", "dome", "changed"];
// Define a function to filter coordinates based on brushed shapes
function filterCoords(selectedShapes) {
    // Filter the data based on selected shapes
    const filteredCoords = allSightingsCoords.filter(sighting => {
        // Check if the UFO shape of the sighting matches any of the selected shapes
        const sightingShape = data.find(d => d.latitude === sighting.latitude && d.longitude === sighting.longitude).ufo_shape;
        return selectedShapes.includes(sightingShape);
    });
    return filteredCoords;
}

    // Convert map to array with specified order
    const sightingsArray = ufoShapes.map(shape => ({ shape, count: sightingsByShape.get(shape) || 0 }));

    // Define the dimensions for the chart
    const margin = { top: 20, right: 20, bottom: 100, left: 200 }; // Adjusted bottom margin to accommodate axis labels
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append the SVG
    const svg = d3.select("#bar-chart") // Changed the ID to match the SVG container for the bar chart
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define x and y scales
    const xScale = d3.scaleBand()
        .domain(sightingsArray.map(d => d.shape))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(sightingsArray, d => d.count)])
        .nice()
        .range([height, 0]);

    // Create bars with custom shapes
    svg.selectAll(".bar")
        .data(sightingsArray)
        .enter()
        .append("path")
        .attr("class", "bar")
        .attr("d", d => getShapePath(d.shape)) // Call function to get the custom shape path
        .attr("transform", d => `translate(${xScale(d.shape) + xScale.bandwidth() / 2},${yScale(d.count) - 50}) scale(0.2)`) // Scale and position the shape
        .style("fill", "#20C593");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("Sightings by Shape");

    // Add x axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.top + 60})`) // Adjusted margin top for x-axis label
        .style("text-anchor", "middle")
        .text("UFO Shape");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 130 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Sightings (Number)");

    // Append a g element to hold the brush
    const brushG = svg.append("g")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("brush", brushings)
        );

    // Function to handle brush events
    function brushings(event) {
        const selection = event.selection;

        if (selection) {
            // Get the selected shapes based on the brush selection
            const selectedShapes = [];
            const [x0, x1] = selection;
            xScale.domain().forEach(shape => {
                const xPos = xScale(shape) + xScale.bandwidth() / 2;
                if (xPos >= x0 && xPos <= x1) {
                    selectedShapes.push(shape);
                }
            });

            // Filter the coordinates based on selected shapes
            const filteredCoords = filterCoords(selectedShapes);
            console.log(filteredCoords);
            // Update the Leaflet map with filtered data
            leafletMap.NewupdateMapWithFilteredData(filteredCoords);
        }
    }
});


// Function to get custom shape path based on UFO shape
function getShapePath(shape) {
    switch (shape) {
        case "light":
            return "M 0,-30 L 10,-15 L 30,0 L 15,15 L 0,30 L -15,15 L -30,0 L -15,-15 Z";
        case "triangle":
            return "M 0,-30 L 26,15 L -26,15 Z";
        case "circle":
            return "M 0,0 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0";
        case "fireball":
            return "M -30,-30 Q 0,0 30,-30 Q 0,0 -30,-30 Z";
        case "other":
            return "M -30,-30 L 30,-30 L 30,30 L -30,30 Z";
        case "unknown":
            return "M 0,-30 L 26,15 L -26,15 Z";
        case "sphere":
            return "M 0,0 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0";
        case "disk":
            return "M 0,0 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0";
        case "oval":
            return "M -30,-15 A 30,15 0 1,0 30,-15 A 30,15 0 1,0 -30,-15 Z";
        case "formation":
            return "M -30,-30 L 30,-30 L 0,30 Z";
        case "cigar":
            return "M -20,-30 L 20,-30 L 20,30 L -20,30 Z";
        case "changing":
            return "M -30,-30 L 30,-30 L 0,30 Z";
        case "NA":
            return "M -30,-30 L 30,-30 L 30,30 L -30,30 Z";
        case "flash":
            return "M -20,-30 L 20,-30 L 20,30 L -20,30 Z";
        case "rectangle":
            return "M -30,-20 L 30,-20 L 30,20 L -30,20 Z";
        case "cylinder":
            return "M -20,-30 L 20,-30 L 20,30 L -20,30 Z";
        case "diamond":
            return "M 0,-30 L 30,0 L 0,30 L -30,0 Z";
        case "chevron":
            return "M -30,-20 L 0,-30 L 30,-20 L 30,20 L 0,30 L -30,20 Z";
        case "egg":
            return "M 0,-30 A 15,30 0 1,0 0,30 Z";
        case "teardrop":
            return "M -20,0 Q 0,-20 20,0 Q 0,20 -20,0 Z";
        case "cone":
            return "M -30,-30 L 30,-30 L 0,30 Z";
        case "cross":
            return "M -20,-30 L 20,-30 L 20,-20 L 30,-20 L 30,20 L 20,20 L 20,30 L -20,30 L -20,20 L -30,20 L -30,-20 L -20,-20 Z";
        case "delta":
            return "M -30,-30 L 30,-30 L 0,30 Z";
        case "round":
            return "M 0,0 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0";
        case "crescent":
            return "M -30,0 A 30,30 0 0,0 30,0 Z M -30,0 A 30,30 0 1,0 30,0 Z";
        case "pyramid":
            return "M -30,-30 L 0,-30 L 30,-30 L 0,30 Z";
        case "flare":
            return "M -20,-20 L 20,-20 L 20,20 L -20,20 Z";
        case "hexagon":
            return "M -30,0 L -15,-26 L 15,-26 L 30,0 L 15,26 L -15,26 Z";
        case "dome":
            return "M -30,0 A 30,15 0 1,0 30,0 Z";
        case "changed":
            return "M -30,0 L 30,0 L 0,30 Z";
        default:
            return "M -30,-30 L 30,-30 L 30,30 L -30,30 Z"; // Default rectangular shape
    }
}

