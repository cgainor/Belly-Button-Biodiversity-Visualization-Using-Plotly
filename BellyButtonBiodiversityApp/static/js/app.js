function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(data => {
        // Use d3 to select the panel with id of `#sample-metadata`
        var metadataSelector = d3.select('#sample-metadata');
        // Use `.html("") to clear any existing metadata
        metadataSelector.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(data).forEach(([key, value]) => {
            metadataSelector
                .append('p').text(`${key} : ${value}`)
                .append('hr')
        });
        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
    })
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = '/samples/<sample>';
    d3.json(url).then(function (response) {
        console.log(response);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        function buildPie(response) {
            var tracePie = [{
                labels: response.otu_ids.slice(0, 10),
                values: response.sample_values.slice(0, 10),
                hovertext: response.otu_labels.slice(0, 10),
                type: 'pie'
            }];
            var data = tracePie;

            var layout = {
                title: "Belly Button Bacteria Biodiversity Pie Chart",
                height: 400,
                width: 500
            };
            Plotly.newPlot('pie', data, layout, { responsive: true });
        }

        // @TODO: Build a Bubble Chart using the sample data
        function buildBubble(response) {
            var traceBubble = [{
                x: response.otu_ids,
                y: response.sample_values,
                mode: 'markers',
                marker: {
                    size: response.sample_values,
                    color: response.otu_ids
                },
                text: data.otu_labels
            }];

            var layout = {
                title: "Belly Button Bacteria Biodiversity Bubble Chart",
                xaxis: { title: 'OTU ID' },
                yaxis: { title: 'Sample Value' },
                width: 1000,
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
            };

            Plotly.newPlot('bubble', traceBubble, layout, { responsive: true })
        }

        buildPie(sample);
        buildBubble(sample);

    })
}

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