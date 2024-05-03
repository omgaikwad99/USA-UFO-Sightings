// class LeafletMap {

//     /**
//      * Class constructor with basic configuration
//      * @param {Object}
//      * @param {Array}
//      */
//     constructor(_config, _data) {
//       this.config = {
//         parentElement: _config.parentElement,
//       }
//       this.data = _data;
//       this.initVis();
//       this.initUI(); // Call method to initialize UI
  
//     }
    
//     /**
//      * We initialize scales/axes and append static elements, such as axis titles.
//      */
//     initVis() {
//       let vis = this;
  
//       //ESRI
//       vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
//       vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  
//       //TOPO
//       vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
//       vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
  
//       //Thunderforest Outdoors- requires key... so meh... 
//       vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
//       vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
//       //Stamen Terrain
//       vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
//       vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
  
//       vis.jawgLagoonUrl = 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png';
//       vis.jawgLagoonAttr = 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
//       vis.checkurl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
//       vis.checkAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
//       //this is the base map layer, where we are showing the map background
//       vis.base_layer = L.tileLayer(vis.esriUrl, {
//         id: 'esri-image',
//         attribution: vis.esriAttr,
//         ext: 'png'
//       });
  
//       vis.theMap = L.map('my-map', {
//         center: [30, 0],
//         zoom: 2,
//         layers: [vis.base_layer]
//       }).setView([37.8, -96], 3.25);
  
//       //if you stopped here, you would just have a map
  
//       //initialize svg for d3 to add to map
//       L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
//       vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
//       vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")
  
//       //these are the city locations, displayed as a set of dots 
//       vis.Dots = vis.svg.selectAll('circle')
//                       .data(vis.data) 
//                       .join('circle')
//                           .attr("fill", "steelblue") 
//                           .attr("stroke", "black")
//                           //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
//                           //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
//                           //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
//                           .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
//                           .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
//                           .attr("r", 3)
//                           .on('mouseover', function(event,d) { //function to add mouseover event
//                               d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//                                 .duration('150') //how long we are transitioning between the two states (works like keyframes)
//                                 .attr("fill", "red") //change the fill
//                                 .attr('r', 4); //change radius
  
//                               //create a tool tip
//                               d3.select('#tooltip')
//                                   .style('opacity', 1)
//                                   .style('z-index', 1000000)
//                                     // Format number with million and thousand separator
//                                   .html(`<div class="tooltip-label"><b>City:</b> ${d.city_area}, <b>Date and Time:</b> ${d.date_time}, <b>UFO shape</b>: ${d.ufo_shape}, <b>Encounter Description</b>: ${d.description}</div>`);
  
//                             })
//                           .on('mousemove', (event) => {
//                               //position the tooltip
//                               d3.select('#tooltip')
//                                .style('left', (event.pageX + 10) + 'px')   
//                                 .style('top', (event.pageY + 10) + 'px');
//                            })              
//                           .on('mouseleave', function() { //function to add mouseover event
//                               d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//                                 .duration('150') //how long we are transitioning between the two states (works like keyframes)
//                                 .attr("fill", "steelblue") //change the fill
//                                 .attr('r', 3) //change radius
  
//                               d3.select('#tooltip').style('opacity', 0);//turn off the tooltip
  
//                             })
//                           .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
//                              // vis.newZoom = vis.theMap.getZoom()+2;
//                              // if( vis.newZoom > 18)
//                              //  vis.newZoom = 18; 
//                              // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
//                             });
      
//       //handler here for updating the map, as you zoom in and out           
//       vis.theMap.on("zoomend", function(){
//         vis.updateVis();
//       });
  
//     }
  
//     updateVis(selectedAttribute) {
//       let vis = this;
  
//        //ESRI
//        vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
//        vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
   
//        //TOPO
//        vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
//        vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
   
//        //Thunderforest Outdoors- requires key... so meh... 
//        vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
//        vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
   
//        //Stamen Terrain
//        vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
//        vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
   
   
//        vis.jawgLagoonUrl = 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png';
//        vis.jawgLagoonAttr = 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
//        vis.checkurl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
//        vis.checkAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  
//       // Update map based on selected attribute
//     switch (selectedAttribute) {
//       case "Geo":
//         vis.base_layer.setUrl(vis.esriUrl);
//         vis.theMap.attributionControl.setPrefix(vis.esriAttr);
//         break;
//       case "Topo":
//         vis.base_layer.setUrl(vis.topoUrl);
//         vis.theMap.attributionControl.setPrefix(vis.topoAttr);
//         break;
//       case "Street":
//         vis.base_layer.setUrl(vis.checkurl.replace('{apikey}', vis.accessToken));
//         vis.theMap.attributionControl.setPrefix(vis.checkAttr);
//         break;
//       case "Airport":
//         vis.base_layer.setUrl(vis.jawgLagoonUrl.replace('{s}', 'toner').replace('{ext}', 'png'));
//         vis.theMap.attributionControl.setPrefix(vis.jawgLagoonAttr);
//         break;
//       default:
//         console.error("Invalid attribute selection");
//         break;
//     }
  
//       //want to see how zoomed in you are? 
//       // console.log(vis.map.getZoom()); //how zoomed am I
      
//       //want to control the size of the radius to be a certain number of meters? 
//       vis.radiusSize = 3; 
  
//       // if( vis.theMap.getZoom > 15 ){
//       //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
//       //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
//       //   radiusSize = desiredMetersForPoint / metresPerPixel;
//       // }
     
//      //redraw based on new zoom- need to recalculate on-screen position
//       vis.Dots
//         .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
//         .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
//         .attr("r", vis.radiusSize) ;
  
//     }
  
//     initUI() {
//       let vis = this;
    
//       // Add UI elements for 'color by' options
//       const attributeSelect = document.getElementById('select-attribute-1');
    
//       // Event listener for attribute selection change
//       attributeSelect.addEventListener('change', () => {
//         const selectedAttribute = attributeSelect.value;
//         vis.updateVis(selectedAttribute);
//       });
    
//       // Add UI elements for 'color by' options
//       const colorByYearButton = document.getElementById('colorByYear');
//       const colorByMonthButton = document.getElementById('colorByMonth');
//       const colorByTimeOfDayButton = document.getElementById('colorByTimeOfDay');
//       const colorPointsByUFOshapeButton = document.getElementById('colorByUFOshape');
//       // Event listeners for 'color by' options
//       colorByYearButton.addEventListener('click', () => {
//         vis.colorPointsByYear();
//       });
    
//       colorByMonthButton.addEventListener('click', () => {
//         vis.colorPointsByMonth();
//       });
    
//       colorByTimeOfDayButton.addEventListener('click', () => {
//         vis.colorPointsByTimeOfDay();
//       });

//       colorPointsByUFOshapeButton.addEventListener('click', () => {
//         vis.colorPointsByUFOshape();
//       });
//     }
  
//     // Method to color points based on year
//     colorPointsByYear() {
//       let vis = this;
  
//       // Get the range of years in the data
//       const minYear = d3.min(vis.data, d => new Date(d.date_time).getFullYear());
//       const maxYear = d3.max(vis.data, d => new Date(d.date_time).getFullYear());
  
//       // Define a color scale that maps older years to darker shades and younger years to lighter shades
//       const colorScale = d3.scaleLinear()
//           .domain([minYear, maxYear])
//           .range(["#333", "#eee"]); // Darker to lighter shades
  
//       // Apply the color scale to the points based on the year
//       vis.Dots.attr("fill", d => {
//           // Extract year from date_time field
//           const year = new Date(d.date_time).getFullYear();
//           // Map year to color using the color scale
//           return colorScale(year);
//       });
//     }
  
//     // Method to color points based on month
//     colorPointsByMonth() {
//       let vis = this;
  
//       // Logic to determine colors based on month
//       // Example:
//       vis.Dots.attr("fill", d => {
//         // Extract month from date_time field
//         const month = new Date(d.date_time).getMonth();
//         // Assign color based on month
//         // You can define your own color scale here
//         // For demonstration, let's assign different shades of green for each month
//         const colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, 11]);
//         return colorScale(month);
//       });
//     }
  
//     // Method to color points based on time of day
//     colorPointsByTimeOfDay() {
//       let vis = this;
  
//       // Logic to determine colors based on time of day
//       // Example:
//       vis.Dots.attr("fill", d => {
//         // Extract hour from date_time field
//         const hour = new Date(d.date_time).getHours();
//         // Assign color based on time of day
//         // You can define your own color scale here
//         // For demonstration, let's assign different colors for morning, afternoon, evening, and night
//         if (hour >= 6 && hour < 12) return "yellow"; // Morning
//         else if (hour >= 12 && hour < 18) return "orange"; // Afternoon
//         else if (hour >= 18 && hour < 21) return "red"; // Evening
//         else return "blue"; // Night
//       });
//     }

//     colorPointsByUFOshape() {
//       let vis = this;

//       const colorScale = d3.scaleOrdinal()
//     .domain(vis.data.map(d => d.ufo_shape))
//     .range(d3.schemeCategory10);

//   // Apply the color scale to the points based on UFO shape
//   vis.Dots.attr("fill", d => colorScale(d.ufo_shape));
//     }

//     updateVisByDateRange(dateRange) {
//       // Filter data based on selected date range
//       const filteredData = this.data.filter(d => {
//           const date = new Date(d.date_time);
//           return date >= dateRange[0] && date <= dateRange[1];
//       });
  
//       // Clear existing dots
//       this.Dots.remove();
  
//       // Draw only the filtered points
//       this.Dots = this.svg.selectAll('circle')
//           .data(filteredData)
//           .join('circle')
//           .attr("fill", "steelblue")
//           .attr("stroke", "black")
//           .attr("cx", d => this.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
//           .attr("cy", d => this.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
//           .attr("r", 3)
//           .on('mouseover', function (event, d) {
//               // Mouseover event handling
//           })
//           .on('mousemove', (event) => {
//               // Mousemove event handling
//           })
//           .on('mouseleave', function () {
//               // Mouseleave event handling
//           })
//           .on('click', (event, d) => {
//               // Click event handling
//           });
  
//       // Add zoomend event listener to update visualization on zoom
//       this.theMap.on("zoomend", () => {
//           this.updateVisByDateRange(dateRange);
//       });
//   }
//   brushedWithCoordinatesCheck(event) {
//     let vis = this;
  
//     const selection = event.selection; // Access the brush selection
  
//     if (!selection) return; // If no selection, return
  
//     // Get the pixel coordinates of the brush selection
//     const [x0, x1] = selection;
  
//     // Calculate the domain values based on pixel coordinates
//     const domainX0 = vis.xScaleBarGraph.domain()[Math.round(x0 / vis.xScaleBarGraph.step())];
//     const domainX1 = vis.xScaleBarGraph.domain()[Math.round(x1 / vis.xScaleBarGraph.step())];
  
//     // Filter data based on selected bars and valid coordinates
//     const filteredData = vis.timelineData.filter(d => {
//         const month = d.month;
//         return month >= domainX0 && month <= domainX1 && d.latitude !== undefined && d.longitude !== undefined && d.latitude !== null && d.longitude !== null;
//     });
  
//     // Update the Leaflet map with filtered data
//     vis.updateMapWithFilteredData(filteredData);
//   }
  


// updateMapWithFilteredData(filteredData) {
//   let vis = this;
// console.log(filteredData)
//   // Filter out data points with undefined or null latitude or longitude
//   filteredData = filteredData.filter(d => d.latitude !== undefined && d.longitude !== undefined && d.latitude !== null && d.longitude !== null);

//   // Clear existing dots
//   vis.Dots.remove();

//   // Draw only the filtered points with valid coordinates
//   vis.Dots = vis.svg.selectAll('circle')
//       .data(filteredData)
//       .join('circle')
//       .attr("fill", "white") // Set color for filtered points
//       .attr("stroke", "black")
//       .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
//       .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
//       .attr("r", vis.radiusSize)
//       .on('mouseover', function(event, d) { //function to add mouseover event
//           console.log(d)
//           d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//               .duration('150') //how long we are transitioning between the two states (works like keyframes)
//               .attr("fill", "red") //change the fill
//               .attr('r', 4); //change radius

//           //create a tool tip
//           d3.select('#tooltip')
//               .style('opacity', 1)
//               .style('z-index', 1000000)
//               // Format number with million and thousand separator
//               .html(`<div class="tooltip-label"><b>Frequently Used Word :</b> ${d.word}</div>`);
//       })
//       .on('mousemove', (event) => {
//           //position the tooltip
//           d3.select('#tooltip')
//               .style('left', (event.pageX + 10) + 'px')
//               .style('top', (event.pageY + 10) + 'px');
//       })
//       .on('mouseleave', function() { //function to add mouseover event
//           d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//               .duration('150') //how long we are transitioning between the two states (works like keyframes)
//               .attr("fill", "white") //change the fill
//               .attr('r', 3); //change radius

//           d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
//       })
//       .on('click', (event, d) => {
//           // Click event handling
//       });

//   // Add zoomend event listener to update visualization on zoom
//   // vis.theMap.on("zoomend", () => {
//   //     vis.updateVis(selectedAttribute);
//   // });
// }


// NewupdateMapWithFilteredData(filteredCoords) {
//   let vis = this;

//   // Clear existing dots
//   vis.Dots.remove();

//   console.log(filteredCoords);
//   // Draw only the filtered points with valid coordinates
//   vis.Dots = vis.svg.selectAll('circle')
//       .data(filteredCoords)
//       .join('circle')
//       .attr("fill", "white") // Set color for filtered points
//       .attr("stroke", "black")
//       .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
//       .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
//       .attr("r", vis.radiusSize)
//       .on('mouseover', function(event, d) { //function to add mouseover event
//           console.log(d)
//           d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//               .duration('150') //how long we are transitioning between the two states (works like keyframes)
//               .attr("fill", "red") //change the fill
//               .attr('r', 4); //change radius

//           //create a tool tip
//           d3.select('#tooltip')
//               .style('opacity', 1)
//               .style('z-index', 1000000)
//               // Format number with million and thousand separator
//               .html(`<div class="tooltip-label"><b>Frequently Used Word :</b> ${d.word}</div>`);
//       })
//       .on('mousemove', (event) => {
//           //position the tooltip
//           d3.select('#tooltip')
//               .style('left', (event.pageX + 10) + 'px')
//               .style('top', (event.pageY + 10) + 'px');
//       })
//       .on('mouseleave', function() { //function to add mouseover event
//           d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
//               .duration('150') //how long we are transitioning between the two states (works like keyframes)
//               .attr("fill", "white") //change the fill
//               .attr('r', 3); //change radius

//           d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
//       })
//       .on('click', (event, d) => {
//           // Click event handling
//       });

//   // Add zoomend event listener to update visualization on zoom
//   // vis.theMap.on("zoomend", () => {
//   //     vis.updateVis(selectedAttribute);
//   // });
// }



//     renderVis() {
//       let vis = this;
  
//       //not using right now... 
   
//     }
//   }


class LeafletMap {

  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
    }
    this.data = _data;
    this.initVis();
    this.initUI(); // Call method to initialize UI

  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    //ESRI
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';

    //Thunderforest Outdoors- requires key... so meh... 
    vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
    vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


    vis.jawgLagoonUrl = 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png';
    vis.jawgLagoonAttr = 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    vis.checkurl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
    vis.checkAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background
    vis.base_layer = L.tileLayer(vis.esriUrl, {
      id: 'esri-image',
      attribution: vis.esriAttr,
      ext: 'png'
    });

    vis.theMap = L.map('my-map', {
      center: [30, 0],
      zoom: 2,
      layers: [vis.base_layer]
    }).setView([37.8, -96], 3.25);

    //if you stopped here, you would just have a map

    //initialize svg for d3 to add to map
    L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")

    //these are the city locations, displayed as a set of dots 
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", "steelblue") 
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "red") //change the fill
                              .attr('r', 4); //change radius

                            //create a tool tip
                            d3.select('#tooltip')
                                .style('opacity', 1)
                                .style('z-index', 1000000)
                                  // Format number with million and thousand separator
                                .html(`<div class="tooltip-label"><b>City:</b> ${d.city_area}, <b>Date and Time:</b> ${d.date_time}, <b>UFO shape</b>: ${d.ufo_shape}, <b>Encounter Description</b>: ${d.description}</div>`);

                          })
                        .on('mousemove', (event) => {
                            //position the tooltip
                            d3.select('#tooltip')
                             .style('left', (event.pageX + 10) + 'px')   
                              .style('top', (event.pageY + 10) + 'px');
                         })              
                        .on('mouseleave', function() { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "steelblue") //change the fill
                              .attr('r', 3) //change radius

                            d3.select('#tooltip').style('opacity', 0);//turn off the tooltip

                          })
                        .on('click', (event, d) => { //experimental feature I was trying- click on point and then fly to it
                           // vis.newZoom = vis.theMap.getZoom()+2;
                           // if( vis.newZoom > 18)
                           //  vis.newZoom = 18; 
                           // vis.theMap.flyTo([d.latitude, d.longitude], vis.newZoom);
                          });
    
    //handler here for updating the map, as you zoom in and out           
    vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });

  }

  updateVis(selectedAttribute) {
    let vis = this;

     //ESRI
     vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
     vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
 
     //TOPO
     vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
     vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
 
     //Thunderforest Outdoors- requires key... so meh... 
     vis.thOutUrl = 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}';
     vis.thOutAttr = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
 
     //Stamen Terrain
     vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
     vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
 
 
     vis.jawgLagoonUrl = 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png';
     vis.jawgLagoonAttr = 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

     vis.checkurl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
     vis.checkAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    // Update map based on selected attribute
  switch (selectedAttribute) {
    case "Geo":
      vis.base_layer.setUrl(vis.esriUrl);
      vis.theMap.attributionControl.setPrefix(vis.esriAttr);
      break;
    case "Topo":
      vis.base_layer.setUrl(vis.topoUrl);
      vis.theMap.attributionControl.setPrefix(vis.topoAttr);
      break;
    case "Street":
      vis.base_layer.setUrl(vis.checkurl.replace('{apikey}', vis.accessToken));
      vis.theMap.attributionControl.setPrefix(vis.checkAttr);
      break;
    case "Airport":
      vis.base_layer.setUrl(vis.jawgLagoonUrl.replace('{s}', 'toner').replace('{ext}', 'png'));
      vis.theMap.attributionControl.setPrefix(vis.jawgLagoonAttr);
      break;
    default:
      console.error("Invalid attribute selection");
      break;
  }

    //want to see how zoomed in you are? 
    // console.log(vis.map.getZoom()); //how zoomed am I
    
    //want to control the size of the radius to be a certain number of meters? 
    vis.radiusSize = 3; 

    // if( vis.theMap.getZoom > 15 ){
    //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
    //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
    //   radiusSize = desiredMetersForPoint / metresPerPixel;
    // }
   
   //redraw based on new zoom- need to recalculate on-screen position
    vis.Dots
      .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
      .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
      .attr("r", vis.radiusSize) ;

  }

  initUI() {
    let vis = this;
  
    // Add UI elements for 'color by' options
    const attributeSelect = document.getElementById('select-attribute-1');
  
    // Event listener for attribute selection change
    attributeSelect.addEventListener('change', () => {
      const selectedAttribute = attributeSelect.value;
      vis.updateVis(selectedAttribute);
    });
  
    // Add UI elements for 'color by' options
    const colorByYearButton = document.getElementById('colorByYear');
    const colorByMonthButton = document.getElementById('colorByMonth');
    const colorByTimeOfDayButton = document.getElementById('colorByTimeOfDay');
    const colorPointsByUFOshapeButton = document.getElementById('colorByUFOshape');
    // Event listeners for 'color by' options
    colorByYearButton.addEventListener('click', () => {
      vis.colorPointsByYear();
    });
  
    colorByMonthButton.addEventListener('click', () => {
      vis.colorPointsByMonth();
    });
  
    colorByTimeOfDayButton.addEventListener('click', () => {
      vis.colorPointsByTimeOfDay();
    });

    colorPointsByUFOshapeButton.addEventListener('click', () => {
      vis.colorPointsByUFOshape();
    });
  }

  // Method to color points based on year
  colorPointsByYear() {
    let vis = this;

    // Get the range of years in the data
    const minYear = d3.min(vis.data, d => new Date(d.date_time).getFullYear());
    const maxYear = d3.max(vis.data, d => new Date(d.date_time).getFullYear());

    // Define a color scale that maps older years to darker shades and younger years to lighter shades
    const colorScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range(["#333", "#eee"]); // Darker to lighter shades

    // Apply the color scale to the points based on the year
    vis.Dots.attr("fill", d => {
        // Extract year from date_time field
        const year = new Date(d.date_time).getFullYear();
        // Map year to color using the color scale
        return colorScale(year);
    });
  }

  // Method to color points based on month
  colorPointsByMonth() {
    let vis = this;

    // Logic to determine colors based on month
    // Example:
    vis.Dots.attr("fill", d => {
      // Extract month from date_time field
      const month = new Date(d.date_time).getMonth();
      // Assign color based on month
      // You can define your own color scale here
      // For demonstration, let's assign different shades of green for each month
      const colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, 11]);
      return colorScale(month);
    });
  }

  // Method to color points based on time of day
  colorPointsByTimeOfDay() {
    let vis = this;

    // Logic to determine colors based on time of day
    // Example:
    vis.Dots.attr("fill", d => {
      // Extract hour from date_time field
      const hour = new Date(d.date_time).getHours();
      // Assign color based on time of day
      // You can define your own color scale here
      // For demonstration, let's assign different colors for morning, afternoon, evening, and night
      if (hour >= 6 && hour < 12) return "yellow"; // Morning
      else if (hour >= 12 && hour < 18) return "orange"; // Afternoon
      else if (hour >= 18 && hour < 21) return "red"; // Evening
      else return "blue"; // Night
    });
  }

  colorPointsByUFOshape() {
    let vis = this;

    const colorScale = d3.scaleOrdinal()
  .domain(vis.data.map(d => d.ufo_shape))
  .range(d3.schemeCategory10);

// Apply the color scale to the points based on UFO shape
vis.Dots.attr("fill", d => colorScale(d.ufo_shape));
  }

  updateVisByDateRange(dateRange) {
    // Filter data based on selected date range
    const filteredData = this.data.filter(d => {
        const date = new Date(d.date_time);
        return date >= dateRange[0] && date <= dateRange[1];
    });

    // Clear existing dots
    this.Dots.remove();

    // Draw only the filtered points
    this.Dots = this.svg.selectAll('circle')
        .data(filteredData)
        .join('circle')
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr("cx", d => this.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
        .attr("cy", d => this.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
        .attr("r", 3)
        .on('mouseover', function (event, d) {
            // Mouseover event handling
        })
        .on('mousemove', (event) => {
            // Mousemove event handling
        })
        .on('mouseleave', function () {
            // Mouseleave event handling
        })
        .on('click', (event, d) => {
            // Click event handling
        });

    // Add zoomend event listener to update visualization on zoom
    this.theMap.on("zoomend", () => {
        this.updateVisByDateRange(dateRange);
    });
}
brushedWithCoordinatesCheck(event) {
  let vis = this;

  const selection = event.selection; // Access the brush selection

  if (!selection) return; // If no selection, return

  // Get the pixel coordinates of the brush selection
  const [x0, x1] = selection;

  // Calculate the domain values based on pixel coordinates
  const domainX0 = vis.xScaleBarGraph.domain()[Math.round(x0 / vis.xScaleBarGraph.step())];
  const domainX1 = vis.xScaleBarGraph.domain()[Math.round(x1 / vis.xScaleBarGraph.step())];

  // Filter data based on selected bars and valid coordinates
  const filteredData = vis.timelineData.filter(d => {
      const month = d.month;
      return month >= domainX0 && month <= domainX1 && d.latitude !== undefined && d.longitude !== undefined && d.latitude !== null && d.longitude !== null;
  });

  // Update the Leaflet map with filtered data
  vis.updateMapWithFilteredData(filteredData);
}



updateMapWithFilteredData(filteredData) {
let vis = this;
console.log(filteredData)
// Filter out data points with undefined or null latitude or longitude
filteredData = filteredData.filter(d => d.latitude !== undefined && d.longitude !== undefined && d.latitude !== null && d.longitude !== null);

// Clear existing dots
vis.Dots.remove();

// Draw only the filtered points with valid coordinates
vis.Dots = vis.svg.selectAll('circle')
    .data(filteredData)
    .join('circle')
    .attr("fill", "steelblue") // Set color for filtered points
    .attr("stroke", "black")
    .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
    .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
    .attr("r", vis.radiusSize)
    .on('mouseover', function(event, d) { //function to add mouseover event
        console.log(d)
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "red") //change the fill
            .attr('r', 4); //change radius

        //create a tool tip
        d3.select('#tooltip')
            .style('opacity', 1)
            .style('z-index', 1000000)
            // Format number with million and thousand separator
            .html(`<div class="tooltip-label"><b>Frequently Used Word :</b> ${d.word}</div>`);
    })
    .on('mousemove', (event) => {
        //position the tooltip
        d3.select('#tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
    })
    .on('mouseleave', function() { //function to add mouseover event
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "steelblue") //change the fill
            .attr('r', 3); //change radius

        d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
    })
    .on('click', (event, d) => {
        // Click event handling
    });

// Add zoomend event listener to update visualization on zoom
// vis.theMap.on("zoomend", () => {
//     vis.updateVis(selectedAttribute);
// });
}


BeatifulupdateMapWithFilteredData(filteredData) {
let vis = this;
console.log(filteredData)
// Filter out data points with undefined or null latitude or longitude
filteredData = filteredData.filter(d => d.latitude !== undefined && d.longitude !== undefined && d.latitude !== null && d.longitude !== null);

// Clear existing dots
vis.Dots.remove();

// Draw only the filtered points with valid coordinates
vis.Dots = vis.svg.selectAll('circle')
    .data(filteredData)
    .join('circle')
    .attr("fill", "white") // Set color for filtered points
    .attr("stroke", "black")
    .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
    .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
    .attr("r", vis.radiusSize)
    .on('mouseover', function(event, d) { //function to add mouseover event
        console.log(d)
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "red") //change the fill
            .attr('r', 4); //change radius

        //create a tool tip
        d3.select('#tooltip')
            .style('opacity', 1)
            .style('z-index', 1000000)
            // Format number with million and thousand separator
            .html(`<div class="tooltip-label"><b>Frequently Used Word :</b> ${d.word}</div>`);
    })
    .on('mousemove', (event) => {
        //position the tooltip
        d3.select('#tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
    })
    .on('mouseleave', function() { //function to add mouseover event
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "white") //change the fill
            .attr('r', 3); //change radius

        d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
    })
    .on('click', (event, d) => {
        // Click event handling
    });

// Add zoomend event listener to update visualization on zoom
// vis.theMap.on("zoomend", () => {
//     vis.updateVis(selectedAttribute);
// });
}


NewupdateMapWithFilteredData(filteredCoords) {
let vis = this;

// Clear existing dots
vis.Dots.remove();

console.log(filteredCoords);
// Draw only the filtered points with valid coordinates
vis.Dots = vis.svg.selectAll('circle')
    .data(filteredCoords)
    .join('circle')
    .attr("fill", "steelblue") // Set color for filtered points
    .attr("stroke", "black")
    .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).x)
    .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude, d.longitude]).y)
    .attr("r", vis.radiusSize)
    .on('mouseover', function(event, d) { //function to add mouseover event
        console.log(d)
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "red") //change the fill
            .attr('r', 4); //change radius

        //create a tool tip
        d3.select('#tooltip')
            .style('opacity', 1)
            .style('z-index', 1000000)
            // Format number with million and thousand separator
            .html(`<div class="tooltip-label"><b>Frequently Used Word :</b> ${d.word}</div>`);
    })
    .on('mousemove', (event) => {
        //position the tooltip
        d3.select('#tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
    })
    .on('mouseleave', function() { //function to add mouseover event
        d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
            .duration('150') //how long we are transitioning between the two states (works like keyframes)
            .attr("fill", "steelblue") //change the fill
            .attr('r', 3); //change radius

        d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
    })
    .on('click', (event, d) => {
        // Click event handling
    });

// Add zoomend event listener to update visualization on zoom
// vis.theMap.on("zoomend", () => {
//     vis.updateVis(selectedAttribute);
// });
}



  renderVis() {
    let vis = this;

    //not using right now... 
 
  }
}
