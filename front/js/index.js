
function setLog(){
    isLogged = localStorage.getItem("logged") == 'true' ? true : false;
    if(!isLogged){
        $("#logbtn").val("Log In");
    }
}

function main(){


    setLog();
    
    // add listeners for buttons
    $("#compare").on("click", function() {
        window.location = 'compare.html';
    });

    $("#stats").on("click", function() {
        window.location = 'stats.html';
    });

    $("#gym").on("click", function() {
        window.location = 'gym.html';
    });

    $("#cf").on("click", function() {
        isLogged = localStorage.getItem("logged") == 'true' ? true : false;
        if(isLogged){
            window.location = 'stats.html';
        }else{
            window.location = 'login.html';
        }
    });

    $("#logbtn").on("click", function() {
        isLogged = localStorage.getItem("logged") == 'true' ? true : false;
        if(isLogged){
            localStorage.clear();
        }
        setLog();
    });
}

function init(callBack){
    // set headers
    fetch("./../header.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            $("header").html(data);
            callBack();
        });
}

init(main);
