function queryRatings() {
    return fetch("../fake_json/ratings.json")
    .then(res => res.json())
    .then(res => {
        var ans = [res.result[0].handle];
        res.forEach(userRatings => {
            ans.push({
                time: userRatings.result.ratingUpdateTimeSeconds,
                rating: userRatings.result.newRating
            })
        });
        return ans;
    })
}

function drawChart(friends, data) {
    var chartDiv = document.getElementById('compare_chart_div');

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Day');
    friends.forEach(friend => {
        data.addColumn('number', friend);
    });

    for (let idx = 0; idx < array.length; idx++) {
        const element = array[idx];
        
    }

    data.addRows([
    [new Date(2014, 0),  -.5,  5.7],
    [new Date(2014, 1),   .4,  8.7],
    [new Date(2014, 2),   .5,   12],
    [new Date(2014, 3),  2.9, 15.3],
    [new Date(2014, 4),  6.3, 18.6],
    [new Date(2014, 5),    9, 20.9],
    [new Date(2014, 6), 10.6, 19.8],
    [new Date(2014, 7), 10.3, 16.6],
    [new Date(2014, 8),  7.4, 13.3],
    [new Date(2014, 9),  4.4,  9.9],
    [new Date(2014, 10), 1.1,  6.6],
    [new Date(2014, 11), -.2,  4.5]
    ]);

    var materialOptions = {
    chart: {
        title: 'Average Temperatures and Daylight in Iceland Throughout the Year'
    },
    width: 900,
    height: 500,
    series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: {axis: 'Temps'},
        1: {axis: 'Daylight'}
    },
    axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
        Temps: {label: 'Temps (Celsius)'},
        Daylight: {label: 'Daylight'}
        }
    }
    };

    function drawMaterialChart() {
    var materialChart = new google.charts.Line(chartDiv);
    materialChart.draw(data, materialOptions);
    button.innerText = 'Change to Classic';
    button.onclick = drawClassicChart;
    }

    drawMaterialChart();

}