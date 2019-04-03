function buildDataPanel() {

  var selection = d3.select('#data-panel');

  selection.append('div')
    .text('Populated data panel with call to buildDataPanel()')

} // End buildDataPanel()


function makeTrace(myTeam, myPlotData, myYMetric) {
  // Extracts all data associated with myTeam from myplotData
  // and returns trace of associated values of myYMetric

  // Declare variables
  var xPlotVals = [];
  var yPlotVals = [];

  // Filter plotData to points associated with myTeam
  var teamData = myPlotData.filter((v,i,a) => v['Team'] == myTeam)

  // Populate xPlotVals and yPlotVals
  for (var key in teamData) {
    var dataPoint = teamData[key];
    xPlotVals.push(dataPoint['Week']);
    yPlotVals.push(dataPoint[myYMetric]);
  }

  // Construct trace and return
  return {
    x: xPlotVals,
    y: yPlotVals,
    type: 'scatter',
    name: myTeam,
  }

}

function buildChart() {
    console.log("Called buildChart()")

    // Store currently selected metric
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

      // Parse plotData into traces

      // Select out distinct list of teams
      var distinctTeamNames = [];
      var allTeamNames = [];
      var teamData = data['Team'];
      for (var key in teamData) {allTeamNames.push(teamData[key]);}
      distinctTeamNames = allTeamNames.filter((v, i, a) => a.indexOf(v) === i); 

      var traces = [];
      for (var key in distinctTeamNames) {
        var teamName = distinctTeamNames[key];
        traces.push(makeTrace(teamName, plotData, yMetric));
      }
      
      // Create plot
      
      var layout = {
        xaxis: {
          title: 'Week',
        },
        yaxis: {
          title: yMetric,
        },
        showlegend: true,
        height: 600,
        width: 1000,
      };

      if (yMetric == 'AP Rank') {layout['yaxis']['range'] = [26,0.5]}

      Plotly.newPlot('timeseries', traces, layout);  

      
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
