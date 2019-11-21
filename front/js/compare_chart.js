function drawLineColors(friends, data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'X');
    friends.forEach(friend => {
        dataTable.addColumn('number', friend);
    });

    dataTable.addRows(data);

    var options = {
      height: 800,
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Rating'
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('timeline_div'));
    chart.draw(dataTable, options);
  }