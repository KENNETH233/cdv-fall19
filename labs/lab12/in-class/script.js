let w = 1400;
let h = 500;
let padding = 25;



let viz = d3.select("#visualization")
    .append("svg")
  .style("background-color", "lavender")
  .attr("width", w)
  .attr("height", h)
;



// initialise scales
let xScaleYear = d3.scaleTime().range([padding, w-padding]);



d3.json("data.json").then(function(incomingData){
  console.log(incomingData);

  incomingData = incomingData.slice(0,50);

  // modify the scale
  let extent = d3.extent(incomingData, function(d){
    return new Date(d.parsedDate);
  })
  console.log(extent);
  // amend domain to scale
  xScaleYear.domain(extent);
  // group to hold axis
  let xAxisGroup = viz.append("g").attr("class", "xaxisgroup");
  // ask d3 to get an axis ready
  let xAxis = d3.axisBottom(xScaleYear);
  // build the axis into our group
  xAxisGroup.call(xAxis);


  // incomingData.forEach(d=>{
  //     d.x = xScaleYear(new Date(d.parsedDate));
  //     d.y = h/2
  // })
  // NEW (robert)
  incomingData.forEach(d=>{
      d.x = w/2;
      d.y = h/2
  })

  simulationEnded();

  // OLD
  // let simulation = d3.forceSimulation(incomingData)
  //   .force("forceX", d3.forceX( function(d){
  //     return xScaleYear( new Date(d.parsedDate) )
  //   } ) )
  //   .force("forceY", d3.forceY( h/2 ) )
  //   .force("collide", d3.forceCollide(5) )
  //   .on("tick", simulationRan)
  //   .tick(299)
  //   // .on("end", simulationEnded)
  // ;
  // NEW (robert)
  let simulation = d3.forceSimulation(incomingData)
    .force("forceX", d3.forceX( w/2) )
    .force("forceY", d3.forceY( h/2 ) )
    .force("collide", d3.forceCollide(5) )
    .on("tick", simulationRan)
    .tick(299)
    // .on("end", simulationEnded)
  ;

  function simulationEnded(){
    viz.selectAll(".datapoint").data(incomingData).enter()
      .append("circle")
      .attr("class", "datapoint")
      .attr("cx", function(d){
        return d.x
      })
      .attr("cy", function(d){
        return d.y
      })
      .attr("r", 4)
    ;
  }


  // console.log(incomingData);
  function simulationRan(){
    console.log("just ran the simulation");
    // console.log(incomingData[0].y);
    viz.selectAll(".datapoint").transition()
      .attr("cx", function(d){
        return d.x;
      })
      .attr("cy", function(d){
        return d.y;
      })
    ;
  }




})
