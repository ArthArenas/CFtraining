google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawCharts);

const SERVER_URL = "http://localhost:3000/stats?handle=ArtArenas";

const SKILL_LEVELS = [
    "Newbie",
    "Pupil",
    "Specialist",
    "Expert",
    "Candidate Master",
    "Master",
    "Grandmaster"
]

const COLORS = [
    "#808080",
    "#87cd22",
    "#06a89f",
    "#1700ff",
    "#aa02aa",
    "#ff8c00",
    "#ff0000"
]

const TAGS = [
    "implementation",
    "dp",
    "math",
    "greedy",
    "brute force",
    "data structures",
    "constructive algorithms",
    "dfs and similar",
    "sortings",
    "binary search",
    "graphs",
    "trees",
    "strings",
    "number theory",
    "geometry",
    "combinatorics",
    "two pointers",
    "dsu",
    "bitmasks",
    "probabilities",
    "shortest paths",
    "hashing",
    "divide and conquer",
    "games",
    "matrices",
    "flows",
    "string suffix structures",
    "expression parsing",
    "graph matchings",
    "ternary search",
    "meet-in-the-middle",
    "fft",
    "2-sat",
    "chinese reminder theorem",
    "schedules",
]

const _RAND_MAX = 100;

const BOUNDS = [
    {
        min: 0,
        max: 1199
    },
    {
        min: 1200,
        max: 1399
    },
    {
        min: 1400,
        max: 1599
    },
    {
        min: 1600,
        max: 1899
    },
    {
        min: 1900,
        max: 2199
    },
    {
        min: 2200,
        max: 2399
    },
    {
        min: 2400,
        max: 5000
    }
]

function drawCharts() {
    TAGS.forEach(tag => {
        drawChart(getStats(tag));
    });
}

function getStats(tag){
    var ans = [tag];
    SKILL_LEVELS.forEach(skill => {
        ans.push(Math.floor(Math.random() * _RAND_MAX));
    });
    return ans;
}

function drawChart(data) {
  var data = google.visualization.arrayToDataTable([
    ["Skill Level", ...SKILL_LEVELS],
    data,
  ]);

  var options = {
    chart: {
      title: data[0]
    }
  };

  var newDiv = $("<div></div>").attr("class", "statsChart");
  var chart = new google.charts.Bar($(newDiv)[0]);
  chart.draw(data, google.charts.Bar.convertOptions(options));
  $("#charts_div").append(newDiv);
}