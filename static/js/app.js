function buildDataPanel() {

  var selection = d3.select('#data-panel');

  selection.append('div')
    .text('Populated data panel with call to buildDataPanel()')

  // // Fetch the metadata for a sample
  // var dataURL = `/data/${sample}`;
  // d3.json(dataURL).then( function (sampleData) {
  //   // Select the metadata panel element  
  //   var selection = d3.select('#sample-metadata');
  //   // Clear existing html
  //   selection.html("");
  //   // Populate panel with metadata
  //   Object.entries(sampleData).forEach( entry => {
  //     let key = entry[0];
  //     let value = entry[1];
  //     selection.append("div")
  //       .text(`${key}: ${value}`)
  //   }); // End .forEach
  // }); // End promise

} // End buildMetadata()

function buildChart() {
    console.log("Called buildChart()")

    // Store currently selected metrics
    var xMetric = d3.select("#XMetricDD").node().value; 
    var yMetric = d3.select("#YMetricDD").node().value; 
    var bMetric = d3.select("#BMetricDD").node().value; 

    // Load data and parse for plotting
    d3.json("/data").then(data => {
      console.log('In call to buildChart(), loaded data:', data);

      // Parse x values for plotting and store in 'xPlotVals'
      var xPlotVals = [];      
      var xData = data[xMetric];
      for (var key in xData) {xPlotVals.push(xData[key]);}
      console.log('xPlotVals =', xPlotVals)

      // Parse y values for plotting and store in 'yPlotVals'
      var yPlotVals = [];      
      var yData = data[yMetric];
      for (var key in yData) {yPlotVals.push(yData[key]);}
      console.log('yPlotVals =', yPlotVals)
      
      // Parse b values for plotting and store in 'bPlotVals'
      var bPlotVals = [];      
      var bData = data[bMetric];
      for (var key in yData) {bPlotVals.push(bData[key]);}
      console.log('bPlotVals =', bPlotVals)
  
      
      // Parse names for plotting and store in 'nPlotVals'
      var nPlotVals = [];      
      var nData = data['team'];

      console.log(data)


      for (var key in nData) {nPlotVals.push(nData[key]);}
      console.log('nPlotVals =', nPlotVals)
  
      // Build Bubble Chart
      var trace1 = {
        x: xPlotVals,
        y: yPlotVals,
        text: nPlotVals,
        mode: 'markers',
        marker: {
          //color: colors,
          size: bPlotVals,
        }
      };

      var plotData = [trace1];
      
      var layout = {
        xaxis: {
          title: xMetric,
        },
        yaxis: {
          title: yMetric,
        },
        showlegend: false,
        height: 600,
        width: 1000,
      };
      
      Plotly.newPlot('bubble', plotData, layout);  

      
    }); // End promise

  // Fetch the sample data for the plots
  // var dataURL = `/data`;
  // d3.json(dataURL).then( function (sampleData) {

  // // Build Bubble Chart
  // var trace1 = {
  //   x: sampleData.otu_ids,
  //   y: sampleData.sample_values,
  //   text: sampleData.otu_labels,
  //   mode: 'markers',
  //   marker: {
  //     //color: colors,
  //     size: sampleData.sample_values,
  //   }
  // };

  //   var data = [trace1];
    
  //   var layout = {
  //     xaxis: {
  //       title: "OTU ID",
  //     },
  //     showlegend: false,
  //     height: 600,
  //     width: 1000,
  //   };
    
  //   Plotly.newPlot('bubble', data, layout);

  //});  // End promise
} // End buildChart()

function parseMetrics(rawMetricList) {
// Input: List of column names from loaded csv
// Output: List with non-metric items removed

  // Define non-metric items
  var excluded = [
    'School',
    'Team Name',
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

  d3.json("/data").then(data => {
    //console.log('In call to init(), loaded data:', data);
    
    // Create 'cols' as list of columns in loaded csv 
    var cols = [];
    for (var item in data) {cols.push(item);} 

    // Create 'metrics' after parsing out non-metric items
    // console.log(parseMetrics(cols));
    var metrics = parseMetrics(cols);
    
    // Populate X-Axis Metric Dropdown
    for (var i=0; i<metrics.length; i++) {
      var metric = metrics[i];
      d3.select('#XMetricDD')
        .append("option")
        .text(metrics[i])
        .property("value", metrics[i])
    }

    // Populate Y-Axis Metric Dropdown
    for (var i=0; i<metrics.length; i++) {
      var metric = metrics[i];
      d3.select('#YMetricDD')
        .append("option")
        .text(metrics[i])
        .property("value", metrics[i])
    }


    // Populate Bubble Metric Dropdown
    for (var i=0; i<metrics.length; i++) {
      var metric = metrics[i];
      d3.select('#BMetricDD')
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
