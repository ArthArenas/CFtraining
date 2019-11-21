//const { TAGS, _RAND_MAX, BOUNDS, STATS_PATH } = require('./constants.js');
//const { drawCharts } = require('./stats_charts.js');

function main(){
    //logic for stats
    usr = localStorage.getItem("usr");
    $("#usr").html(usr);

    usr = "ArtArenas"; // we need to retrieve this from the db

    displayInfo(usr);
    displayFriends(usr);
    displayStats(usr);
}

function displayInfo(usr){

    // get info from codeforces
    result = [{
        lastName: "Arenas",
        country: "Mexico",
        lastOnlineTimeSeconds: 1574204985,
        city: "Monterrey",
        rating: 1830,
        friendOfCount: 29,
        titlePhoto: "//userpic.codeforces.com/no-title.jpg",
        handle: "ArtArenas",
        avatar: "//userpic.codeforces.com/no-avatar.jpg",
        firstName: "Arturo",
        contribution: 0,
        organization: "ITESM Campus Monterrey",
        rank: "expert",
        maxRating: 1830,
        registrationTimeSeconds: 1489891582,
        maxRank: "expert"
    }]

    appendInfo(result[0]);
}

function getRankIdx(rating){
    var ans = 0;
    for (let idx = 0; idx < BOUNDS.length; idx++) {
        let bound = BOUNDS[idx];
        if(bound.min <= rating && rating <= bound.max) ans = idx;
    }
    return ans;
}

function appendInfo(info){
    var headerUsername = $("h1");
    var headerInfo = $("h4");

    $(headerUsername[0]).text(info.handle);
    $(headerInfo[0]).text("Name: " + buildName(info.firstName, info.lastName));
    $(headerInfo[1]).text("Organization: " + (info.organization ? info.organization : "Unknown"));
    $(headerInfo[2]).text("Country: " + (info.country ? info.country : "Unknown"));
    $(headerInfo[3]).text("Contest Rating: " + info.rating + " (" + info.rank + ")");

    $("h1").css("color", COLORS[getRankIdx(info.rating)]);
}

function buildName(first, last){
    var ans;
    if(first) ans = first + (last ? (" " + last) : "");
    else ans = "Unknown"
    return ans;
}

function displayFriends(usr){
    // get friends from db
    friends = [
        "Friend10",
        "Friend20",
        "Friend30",
        "Friend40",
        "Friend50",
        "Friend60",
        "Friend70",
        "Friend80",
    ];
    appendFriends(friends);
}

// TODO: needs functionality
function appendFriends(friends){
    var form = $("#friends_form");
    friends.forEach(friend => {
        var newInput = $("<input/>").attr("type", "radio").attr("class", "form-check-input");
        var newLabel = $("<label></label>").text(friend);
        var newDiv = $("<div></div>").attr("class", "form-group");
        newDiv.append(newInput, newLabel);
        form.append(newDiv);
    });
}

function displayStats(usr){

    // get stats from codeforces
    var data = [];
    queryStats(usr).then(res => {
        TAGS.forEach(tag => {
            data.push({
                [tag]: res[tag]
            });
        });
        drawCharts(data);
    })
}

function queryStats(usr){
    return $.ajax({
        url: "http://localhost:3000/api/stats?handle=" + usr,
        type: "get",
        success: null,
        error: function(err) {
            console.log(err);
        }
    });
}

function getStats(tag){
    var ans = [];
    SKILL_LEVELS.forEach(skill => {
        ans.push(Math.floor(Math.random() * _RAND_MAX));
    });
    return ans;
}