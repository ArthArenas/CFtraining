function register(usr, pass){
    let obj = {
        "userName" : usr,
        "pass" : pass
    }
    console.log(obj);

    $.ajax({
        url : "/register",
        type : "POST",
        contentType : 'application/json',
        data : JSON.stringify( obj ),
        success : function(res){
            window.location = "login.html";
        },
        error : function(res){
            console.log(res.status);
            if(res.status == 405){
                $("#usrError").hide();
                $("#usrError").show();
            }
        }
    });
}


function main(){
    $("#reg-form").on('input', function(){
        pass = $("#pass").val();
        cpass = $("#cpass").val();

        if(pass == cpass){
            console.log(usr, pass, cpass);
            $("#cpass")[0].setCustomValidity("");
        }else{
            $("#cpass")[0].setCustomValidity("Passwords do not match.");
        }
    });

    $("#reg-form").submit(function(e){
        e.preventDefault();
        usr = $("#usr").val();
        pass = $("#pass").val();
        cpass = $("#cpass").val();

        register(usr, pass);


    });
}


main();
