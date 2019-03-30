function buildMetadata(sample) {

  // Fetch the metadata for a sample
  var dataURL = `/metadata/${sample}`;
  d3.json(dataURL).then( function (sampleData) {

    // Select the metadata panel element  
    var selection = d3.select('#sample-metadata');

    // Clear existing html
    selection.html("");

    // Populate panel with metadata
    Object.entries(sampleData).forEach( entry => {
      let key = entry[0];
      let value = entry[1];
      selection.append("div")
        .text(`${key}: ${value}`)
    }); // End .forEach

  }); // End promise

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

} // End buildMetadata()



// Minor adapation from https://gist.github.com/mjackson/5311256
// This function is used as help to assign colors in bubble chart
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return `rgb(${r*255}, ${g*255}, ${b*255})`
  //return [ r * 255, g * 255, b * 255 ];
}


function buildCharts(sample) {
  // Fetch the sample data for the plots
  var dataURL = `/samples/${sample}`;
  d3.json(dataURL).then( function (sampleData) {

    // Build Bubble Chart

    // Build colors array based on otu_id to assign colors to each bubble
    // Colors are assigned from red to blue with increasing out_id
    var hueRange = d3.max(sampleData.otu_ids) - d3.min(sampleData.otu_ids);
    var colors = sampleData.otu_ids.map(x => hslToRgb(x/hueRange, 0.5, 0.5));

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        color: colors,
        size: sampleData.sample_values,
      }
    };

    var data = [trace1];
    
    var layout = {
      xaxis: {
        title: "OTU ID",
      },
      showlegend: false,
      height: 600,
      width: 1000,
    };
    
    Plotly.newPlot('bubble', data, layout);

    // Build a Pie Chart
    var data = [{
      values: sampleData.sample_values.slice(0, 10),
      labels: sampleData.otu_ids.slice(0, 10),
      hovertext: sampleData.otu_labels.slice(0,10),
      type: 'pie',
    }];

    var layout = {
      height: 400,
      width: 500,
    };

    Plotly.newPlot('pie', data, layout);

  });  // End promise
} // End buildCharts()

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
