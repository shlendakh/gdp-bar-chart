import { getData } from './data.js';
const data = getData();

// Get the width and height of the window
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

// Calculate 50% of the window width and height
const width = windowWidth * 0.5 - margin.left - margin.right;
const height = windowHeight * 0.5 - margin.top - margin.bottom;

// Create linear scales
const xExtent = d3.extent(data.data, d => new Date(d[0]));
const yExtent = d3.extent(data.data, d => d[1]);

const xScale = d3.scaleTime()
    .domain(xExtent)
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, yExtent[1]])
    .range([height, 0]);

const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y'));
const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => `${d}B`);

// Create svg and set size
const svg = d3.select('svg#chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'p-4 bg-white')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('id', 'x-axis')
    .call(xAxis);

svg.append('g')
    .attr('id', 'y-axis')
    .call(yAxis);

// Create tooltip and render data values
const tooltip = d3.select('#tooltip');

svg.selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(new Date(d[0])))
    .attr('y', d => yScale(d[1]))
    .attr('width', width / data.data.length - 1)
    .attr('height', d => height - yScale(d[1]))
    .attr('fill', 'steelblue')
    .attr('class', 'bar hover:fill-blue-700')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .on('mouseover', function(event) {
        const date = d3.select(this).attr('data-date');
        const gdp = d3.select(this).attr('data-gdp');
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
        tooltip.html(`Date: ${date}<br/>Value: ${gdp}`);
        tooltip.attr('data-date', date);
    })
    .on('mousemove', function(event) {
        const mouseX = d3.event.pageX;
        const mouseY = d3.event.pageY;
        tooltip
            .style('left', (mouseX -120) + 'px')
            .style('top', (mouseY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

// Add chart title
svg.append('text')
    .attr('x', width / 2)
    .attr('y', 0 - (margin.top / 2))
    .attr('id', 'title')
    .attr('text-anchor', 'middle')
    .style('font-size', '24px')
    .text(data.name);

// Add ticks class name
d3.selectAll('.tick')
    .attr('class', 'tick');

// Add y axis label
svg.append('text')
    .attr('x', -height / 2)
    .attr('y', margin.left - 5)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('GDP (Billion $)');