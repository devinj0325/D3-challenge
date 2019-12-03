// @TODO: YOUR CODE HERE!
let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80, 
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
let svg = d3
  .select("#scatter")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// CSV
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log("Data Loaded");

healthData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});

// Create scale functions
var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty) * 0.9, d3.max(healthData, d => d.poverty) * 1.05])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the Chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

// Create Circles
var circlesGroup = chartGroup.selectAll("circle")
.data(healthData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "blue")
.attr("opacity", "0.5");
 
// Circle Labels
var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append("text");

circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.poverty);
  })
  .attr("y", function(d) {
    return yLinearScale(d.healthcare);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// Create event listeners to display and hide the tooltip
circlesGroup.on("click", function(data) {
  toolTip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Healthcare");

  chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");

}).catch(function(error) {
  console.log(error);
});