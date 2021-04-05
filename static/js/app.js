function buildMetadata(sample){
        // d3.json("/metadata/" + sample).then(function(data){
        d3.json("samples.json").then(function(data){
            var metadata = data.metadata;
            // Filtering
            var resultsArray = metadata.filter(function(data){
                return data.id == sample;
            })
            
            var result = resultsArray[0];
            var PANEL = d3.select("#sample-metadata");
            
            PANEL.html("");

            // Object.entries(data).forEach(([key, value]) => {
            //     PANEL.append("h6").text(`${key}:${value}`);

            Object.entries(result).forEach(function([key,value]){
                PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
                
            })


        })

}

function buildCharts(sample){
    d3.json("samples.json").then(function(data){
        var samples = data.samples;
        var resultsArray = samples.filter(function(data){
            return data.id == sample;
        })
        var result = resultsArray[0];

        const otu_ids = result.otu_ids;
        const otu_lables = result.otu_labels;
        const sample_values = result.sample_values

        // Build Bubble Charts
        var bubbleLayout = {
            
            margin: {t: 0},
            hovermode: "closest",
            xaxis: { title: "OTU ID"},

        }
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_lables,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];
        Plotly.newPlot("bubble",bubbleData, bubbleLayout);
        var yticks  = otu_ids.slice(0,10).map(function(otuID){
            return `OTU ${otuID}`;
        }).reverse();

        // Build Horizontal BarCharts
        
        var barLayout = {
            title: "Top 10 Bacteria",
            margin: {t: 30, l: 150}
        };

        var barData = [
            {
                y:yticks,
                x:sample_values.slice(0,10).reverse(),
                text: otu_lables.slice(0,10).reverse(),
                type:"bar",
                orientation: "h"
            }
        ];
        
        Plotly.newPlot("bar",barData,barLayout)
    })
}


function init(){
    console.log("Hello World");
    // Reference to the dropdown select
    var selector = d3.select("#selDataset");

    // d3.json("samples.json").then((sampleNames) => {
    //     sampleNames.forEach((sample) => {
    //       selector
    //         .append("option")
    //         .text(sample)
    //         .property("value", sample);

    d3.json("samples.json").then(function(data){
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach(function(name){
            selector
            .append("option")
            .text(name)
            .property("value",name)
            
        });
        // first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });


}

function optionChanged(newSample){
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
init()


