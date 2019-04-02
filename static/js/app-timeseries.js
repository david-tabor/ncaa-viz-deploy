function buildDataPanel() {

  var selection = d3.select('#data-panel');

  selection.append('div')
    .text('Populated data panel with call to buildDataPanel()')

} // End buildDataPanel()

function buildChart() {
    console.log("Called buildChart()")

    // Store currently selected metrics
    var yMetric = d3.select("#YMetricDD").node().value; 

    // Load data and parse for plotting
    d3.json("/timedata").then(data => {
      //console.log('In call to buildChart(), loaded data:', data);

      // Parse loaded data into and array of dicts where each
      // dict contains data associated with a single data point
      var nRows = Object.keys(data['Team']).length
      var colNames = Object.keys(data)
      var plotData = []
      for (var i=0; i<nRows; i++) {
        var dataPoint = {}
        for (var j in colNames) {
          var colName=colNames[j]
          dataPoint[colName] = data[colName][i]
        }
        plotData.push(dataPoint)
      }
      //console.log(plotData)

      // Parse x values for plotting and store in 'xPlotVals'
      // var xPlotVals = [];      
      // var xData = data['Week'];
      // for (var key in xData) {xPlotVals.push(xData[key]);}
      // // Get unique values
      // xPlotVals = xPlotVals.filter((v, i, a) => a.indexOf(v) === i); 

      // Parse plotData into traces

      // Select out distinct list of teams
      var teams = [];
      var teamData = data['Team'];
      for (var key in teamData) {teams.push(teamData[key]);}
      teams = teams.filter((v, i, a) => a.indexOf(v) === i); 

      // @TODO For a specific team, create trace for plotting      
      var xPlotVals = [];
      var yPlotVals = [];

      var team = 'Kentucky Wildcats'
      var teamData = plotData.filter((v,i,a) => v['Team'] == team)

      for (var key in teamData) {
        var dataPoint = teamData[key];
        xPlotVals.push(dataPoint['Week']);
        yPlotVals.push(dataPoint[yMetric]);
      }
      
      console.log('teamData =', teamData)
      console.log('xPlotVals =', xPlotVals)
      console.log('yPlotVals =', yPlotVals)

      var trace = {
        x: xPlotVals,
        y: yPlotVals,
        type: 'scatter'
      }

      // @TODO Create plot with one specific trace

      var traces = [trace];
      var layout = {};
      Plotly.newPlot('timeseries', traces, layout);  




      // @TODO Iterate over distinct list of teams to generate traces

      // @TODO Create plot with multiple traces











      // // Build Timeseries Chart
      // var trace1 = {
      //   x: xPlotVals,
      //   y: yPlotVals,
      //   mode: 'markers',
      // };

      // var plotData = [trace1];
      
      // var layout = {
      //   xaxis: {
      //     title: 'Week',
      //   },
      //   yaxis: {
      //     title: yMetric,
      //   },
      //   showlegend: false,
      //   height: 600,
      //   width: 1000,
      // };
      
      // Plotly.newPlot('timeseries', plotData, layout);  

      
    }); // End promise

} // End buildChart()

function parseMetrics(rawMetricList) {
// Input: List of column names from loaded csv
// Output: List with non-metric items removed

  // Define non-metric items
  var excluded = [
    'Week',
    'Team',
    'Conference',
  ]

  // Define list to be eventually returned
  var output = [];

  // Compare each item in rawMetricList to each item in excluded
  for (var i=0; i<rawMetricList.length; i++) {
    var metric = rawMetricList[i];

    // Test if metric is in the excluded list
    var is_in_excluded = false;
    for (var j=0; j<excluded.length; j++) {
      if (excluded[j].trim() == metric.trim()) {is_in_excluded = true;}
    }

    // Append to output if not in excluded
    if (!is_in_excluded) {output.push(metric);}
  }

  return output
} // End define parseMetrics()

function init() {

  d3.json("/timedata").then(data => {
    //console.log('In call to init(), loaded data:', data);
    
    // Create 'cols' as list of columns in loaded csv 
    var cols = [];
    for (var item in data) {cols.push(item);} 

    // Create 'metrics' after parsing out non-metric items
    // console.log(parseMetrics(cols));
    var metrics = parseMetrics(cols);
    
    // Populate Y-Axis Metric Dropdown
    for (var i=0; i<metrics.length; i++) {
      var metric = metrics[i];
      d3.select('#YMetricDD')
        .append("option")
        .text(metrics[i])
        .property("value", metrics[i])
    }


    // Initial build of chart
    buildChart(); 

  }) // End promise
} // End function init()

function xMetricChanged() {
  console.log("Call made to xMetricChanged()");
  console.log("Rebuilding char with call to buildChart()");
  buildChart();
}

function yMetricChanged() {
  console.log("Call made to yMetricChanged()");
  console.log("Rebuilding chart with call to buildChart()");
  buildChart();
}

function bMetricChanged() {
  console.log("Call made to bMetricChanged()");
  console.log("Rebuilding chart with call to buildChart()");
  buildChart();
}





// Initialize the dashboard
init();
