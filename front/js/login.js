function login(user, pass){
    let obj = {
        "userName" : user,
        "pass" : pass
    }

    find = false;
    $.ajax({
        url : "/log",
        type : "POST",
        contentType : 'application/json',
        data : JSON.stringify( obj ),
        success : function(res){
            localStorage.setItem("logged", 'true');
            localStorage.setItem("usr", user);
            window.location = 'stats.html';
        },
        error : function(res){
            if(res.status == 404){
                $("#usrError").hide();
                $("#usrError").show();
            }
            return false;
        }
    });
}


function main(){
    $('#log-form').submit(function(e) {
        e.preventDefault();
        usr = $("#usr").val();
        pass = $("#pass").val();
        login(usr, pass);
    });

}


main();
