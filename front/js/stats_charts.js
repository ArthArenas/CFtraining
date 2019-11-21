//import { SKILL_LEVELS, COLORS, TAGS } from './constants.js';


function drawCharts(data) {
    for (let idx = 0; idx < TAGS.length; idx++) {
        drawChart(TAGS[idx], data[idx][TAGS[idx]]);
    }
}

function drawChart(tag, data) {
  var data = google.visualization.arrayToDataTable([
    ["Skill Level", ...SKILL_LEVELS],
    [tag, ...data],
  ]);

  var options = {
    chart: {
      title: tag,
      colors: COLORS,
      width: 100,
      height: 100,
      backgroundColor: '#746592',
    }
  };

  var newDiv = $("<div></div>").attr("class", "chart_div");
  var chart = new google.visualization.ColumnChart($(newDiv)[0]);
  //google.charts.Bar.convertOptions(options)
  chart.draw(data, options);
  $("#charts_div").append(newDiv);
}
