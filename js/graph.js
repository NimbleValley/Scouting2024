var graph;
Chart.register(ChartDataLabels);
Chart.defaults.color = '#ffffff';

function showBarGraph(canvas, sortedGraphColumn, teamsSorted, description) {
    let graphContainer = document.getElementById("graph-canvas-container");

    terminateGraph();

    console.log("Rendering horizontal bar graph.");

    const data = [];

    for (let i = 0; i < sortedGraphColumn.length; i++) {
        data.push({ team: teamsSorted[i], count: sortedGraphColumn[i] })
    }

    console.log(data.length);

    graphContainer.style.height = `${data.length * 5}vh`;

    const config = {
        type: 'bar',
        data: {
            labels: data.map(row => row.team),
            datasets: [
                {
                    label: description,
                    data: data.map(row => row.count),
                    backgroundColor: 'rgb(189, 95, 33)',
                    color: "#ffffff"
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    color: "#ffffff"
                }
            }
        },
    };

    graph = new Chart(canvas, config);
}

function showScatterChart(canvas, teamData2d, description) {
    teamData2d = mergeScatterData(teamData2d);

    terminateGraph();

    console.log("Rendering scatter graph.");

    const data = teamData2d;

    const config = {
        type: 'scatter',
        data: {
            labels: data.map(x => x.team),
            datasets: [
                {
                    label: "Teams",
                    data: data.map(row => ({
                        label: row.team,
                        x: row.x,
                        y: row.y
                    })),
                    pointRadius: 5,
                    backgroundColor: 'rgb(189, 95, 33)'
                }
            ]
        },
        options: {
            legend: { display: false },
            scales: {
                x: {
                    ticks: {
                        callback: value => `${value / 1}`,
                        color: "#ababab"
                    },
                    title: {
                        display: true,
                        text: description[0],
                        color: "#FFFFFF"
                    }
                },
                y: {
                    ticks: {
                        callback: value => `${value / 1}`,
                        color: "#ababab"
                    },
                    title: {
                        display: true,
                        text: description[1],
                        color: "#FFFFFF"
                    }
                }
            },
            plugins: {
                // Change options for ALL labels of THIS CHART
                datalabels: {
                    color: '#ffffff',
                    align: 'top'
                }
            }
        }
    };

    graph = new Chart(canvas, config);

    console.log(window.innerHeight)
    //graph.resize(window.innerHeight * 1.75, window.innerWidth * 0.4);

    // Refer to https://github.com/chartjs/Chart.js/discussions/10742 to add hover effect
}

function mergeScatterData(teamData2d) {
    let xValues = [];
    let yValues = [];
    let labels = [];

    for (let i = 0; i < teamData2d.length; i++) {
        let specialCase = false;
        if (xValues.includes(teamData2d[i].x)) {
            for (let s = 0; s < xValues.length; s++) {
                if (!specialCase && xValues[s] == teamData2d[i].x && yValues[s] == teamData2d[i].y) {
                    specialCase = true;
                    labels[s] += ",\n" + teamData2d[i].team;
                }
            }
        }
        if (!specialCase) {
            labels.push(teamData2d[i].team);
            xValues.push(teamData2d[i].x);
            yValues.push(teamData2d[i].y);
            console.log(i);
        }
    }

    let formattedArray = [];
    for (let i = 0; i < xValues.length; i++) {
        formattedArray.push({
            team: labels[i],
            x: xValues[i],
            y: yValues[i]
        })
    }

    console.log(formattedArray);

    return formattedArray;
}

function terminateGraph() {
    if (graph != null) {
        graph.destroy();
    }
}