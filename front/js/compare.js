
function main(){
    // logic for compare
    usr = localStorage.getItem("usr");
    $("#usr").html(usr);
    console.log(usr);

    displayComparison(usr);
}

main();

function displayComparison(usr){

    $.ajax({
        url: "./getFriends/" + usr,
        type: "get",
        success: queryRatings,
        error: function(err) {
            console.log(err);
        }
    });
}

function queryRatings(friends2){
    friends = [usr];
    friends2.forEach(dude =>{
        friends.push(dude.name);
    });
    queryCFRatings(friends).then(res => {
        var data = prepareData(res);
        drawLineColors(friends, data);
    })
}

function queryCFRatings(friends){
    return $.ajax({
        url: "./api/compare?handles=" + buildHandlesQuery(friends),
        type: "get",
        success: null,
        error: function(err) {
            console.log(err);
        }
    });
}

function buildHandlesQuery(friends){
    var ans = "";
    for (let idx = 0; idx < friends.length; idx++) {
        ans += friends[idx];
        if(idx < friends.length - 1){
            ans += ";";
        }
    }
    return ans;
}

function prepareData(res){
    console.log(res);
    var ptrs = new Array(res.length);
    for (let idx = 0; idx < ptrs.length; idx++) {
        ptrs[idx] = 0;
    }

    var ans = [];
    while(!doneWithPtrs(res, ptrs)){
        newRow = new Array(res.length);

        // get the current minimum
        var min_time = 2000000000;
        for (let idx = 0; idx < ptrs.length; idx++) {
            if(ptrs[idx] != res[idx].length && res[idx][ptrs[idx]].ratingUpdateTimeSeconds < min_time) min_time = res[idx][ptrs[idx]].ratingUpdateTimeSeconds;
        }

        for (let idx = 0; idx < ptrs.length; idx++) {
            if(ptrs[idx] != res[idx].length && res[idx][ptrs[idx]].ratingUpdateTimeSeconds == min_time){
                // as-is
                newRow[idx] = res[idx][ptrs[idx]].newRating;
                ptrs[idx]++;
            } 
            else{
                if(ptrs[idx] == res[idx].length || ptrs[idx] == 0){
                    // null - it's finished or hasn't started
                    newRow[idx] = null;
                }
                else{
                    // inference
                    let timeA = res[idx][ptrs[idx] - 1].ratingUpdateTimeSeconds;
                    let ratingA = res[idx][ptrs[idx]].oldRating;
                    let timeB = res[idx][ptrs[idx]].ratingUpdateTimeSeconds;
                    let ratingB = res[idx][ptrs[idx]].newRating;
                    let timeM = min_time;
                    newRow[idx] = ratingA + (ratingB - ratingA) * (timeM - timeA) / (timeB - timeA);
                }
            }
        }
    
        ans.push([min_time, ...newRow]);
    }

    return ans;
}

function doneWithPtrs(res, ptrs){
    var done = true;
    for (let idx = 0; idx < ptrs.length && done; idx++) {
        if(ptrs[idx] != res[idx].length) done = false;
    }
    return done;
}
