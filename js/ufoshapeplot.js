class UFOShapePlot {
    constructor(data, containerID, width, height) {
        this.data = data;
        this.containerID = containerID;
        this.width = width;
        this.height = height;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Append SVG
        vis.svg = d3.select(vis.containerID)
            .append('svg')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .append('g')
            .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`);

        // Define scales and axes
        vis.xScale = d3.scaleBand()
            .range([0, vis.width - vis.margin.left - vis.margin.right])
            .padding(0.1);

        vis.yScale = d3.scaleLinear()
            .range([vis.height - vis.margin.top - vis.margin.bottom, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale);

        vis.yAxis = d3.axisLeft(vis.yScale);

        // Initialize brush functionality
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width - vis.margin.left - vis.margin.right, vis.height - vis.margin.top - vis.margin.bottom]])
            .on('brush', () => {
                vis.brushed();
            });

        // Append brush to the SVG
        vis.svg.append('g')
            .attr('class', 'brush')
            .call(vis.brush);

        // Call updateVis
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update scales
        vis.xScale.domain(vis.data.map(d => d.ufo_shape));
        vis.yScale.domain([0, d3.max(vis.data, d => d.count)]);

        // Draw bars
        vis.bars = vis.svg.selectAll('.bar')
            .data(vis.data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d.ufo_shape))
            .attr('y', d => vis.yScale(d.count))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.margin.bottom - vis.margin.top - vis.yScale(d.count))
            .attr('fill', '#20C593');

        // Draw axes
        vis.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${vis.height - vis.margin.bottom - vis.margin.top})`)
            .call(vis.xAxis);

        vis.svg.append('g')
            .attr('class', 'y-axis')
            .call(vis.yAxis);
    }

    brushed() {
        let vis = this;

        // Get the brushed area
        const selection = d3.event.selection;
        
        if (selection) {
            // Get the brushed shapes
            const brushedShapes = vis.data.filter(d => {
                const xPos = vis.xScale(d.ufo_shape) + vis.xScale.bandwidth() / 2;
                return xPos >= selection[0] && xPos <= selection[1];
            }).map(d => d.ufo_shape);

            // Dispatch event with brushed shapes
            const event = new CustomEvent('brushedShapes', { detail: brushedShapes });
            document.dispatchEvent(event);
        }
    }
}
