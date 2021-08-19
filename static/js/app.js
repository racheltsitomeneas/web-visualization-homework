//Updated version 
//Load the json file (use a local host)

d3.json("samples.json").then(function(data){ 
  //console.log(data);

  var dataNames = data.names;
    var dropDownMenu = d3.select("#selDataset");

    dataNames.forEach(function (name) {
      dropDownMenu.append("option").text(name).property("value", name);
    });

    // let selectedID = "940";
    console.log('dataNames: ', dataNames)
  });


//console.log(data)
//create one large function that will gather data into variables and plot it
function buildCharts(sample) {
    d3.json("samples.json").then(function (data) {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject => sampleobject.id = sample);
        var result = resultsarray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;


        // Build a Bubble Chart using the sample data that you pulled
        var LayoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "Id's" },
            hovermode: "closest",
        };

        var DataBubble = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];
        ///need to give title still?

        Plotly.plot("bubble", DataBubble, LayoutBubble);



        //Build a bar Chart

        var bar_data = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", bar_data, barLayout);
    });
}

//Add metadata function

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}

   
/// add a sample for each dropdown option
function init() {

    var selector = d3.select("#selDataset");

    //   // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

    // get first sample to build the initial plots
        var firstSample = sampleNames[0];
        console.log(firstSample);
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}
// Option change function
function optionChanged(nextSample) {
//   // get new data each time a new sample is selected
      buildCharts(nextSample);
      buildMetadata(nextSample);
}


// initialize the dashboard
init();





