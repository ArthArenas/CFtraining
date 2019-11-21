//const { TAGS, _RAND_MAX, BOUNDS, STATS_PATH } = require('./constants.js');
//const { drawCharts } = require('./stats_charts.js');

function main(){
    //logic for stats
    usr = localStorage.getItem("usr");
    $("#usr").html(usr);

    usr = "sam28"; // we need to retrieve this from the db


    $("#addFriend").on("click", function(e){
        e.preventDefault();
        name = $("#usr2").val(); 
        console.log(name);
        let obj = {
            "userName" : usr,
            "friendName" : name
        };

        $.ajax({
        url : "./addFriend",
        type : "POST",
        contentType : 'application/json',
        data : JSON.stringify( obj ),
        success : function(res){
        },
        error : function(res){
            console.log(res.status);
        }
        });


    });

    $("#borrar").on("click", function(e){

        friends = $(".form-check-input");
        console.log(friends);
        friends.map(amiwo2 => {
            amiwo = friends[amiwo2];
            console.log(amiwo);
            if(amiwo.checked){
                let obj = {
                    "userName" : usr,
                    "friendName" : amiwo.name
                };
                $.ajax({
                    url : "./deleteFriend",
                    type : "DELETE",
                    contentType : 'application/json',
                    data : JSON.stringify( obj ),
                    success : function(res){
                        console.log("done");
                    },
                    error : function(res){
                        console.log(res.status);
                    }

                });

            }
        });
        

    });

    displayInfo(usr);
    displayFriends(usr);
    displayStats(usr);
}

function displayInfo(usr){
    // get info from codeforces
    queryFriends(usr).then(result => {
        appendInfo(result[0]);  
    })
}

function queryFriends(usr){
    return $.ajax({
        url: "https://codeforces.com/api/user.info/handle=" + usr,
        type: "get",
        success: null,
        error: function(err) {
            console.log(err);
        }
    });
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
    friends = []
    $.ajax({
        url : "./getFriends/" + usr,
        type : "GET",
        success : function(amiwos) {
            amiwos.forEach( amiwo => {
                console.log(amiwo.name);
                friends.push(amiwo.name);
            });
           appendFriends(friends);
        },
        error : function(err){
            console.log(err);
        }
    });

}

// TODO: needs functionality
function appendFriends(friends){
    var form = $("#friends_form");
    friends.forEach(friend => {
        var newInput = $("<input/>").attr("type", "checkbox").attr("class", "form-check-input");
        var newLabel = $("<label></label>").text(friend);
        var newDiv = $("<div></div>").attr("class", "form-group");
        newInput.attr("name", friend);
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
        url: "./api/stats?handle=" + usr,
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
