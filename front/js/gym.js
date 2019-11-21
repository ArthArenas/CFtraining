function main(){
    //logic for the gym
    $("#makeContest").on("click", function(e){
        e.preventDefault();
        let contestName = $("#contestName").val();
        let lb = $("#lw").val();
        let ub = $("#ub").val();

        listaTags = $(".form-check-input");
        let tags = [];

        listaTags.map(elem =>{
            if(listaTags[elem].checked){
                tags.push(listaTags[elem].name);
            }
        });

        let size = $("#size").val();
        let usr = localStorage.getItem("usr");

        let obj = {
            "lb" : lb,
            "ub" : ub,
            "tags" : tags,
            "size" : size,
            "user" : usr,
            "contestName" : contestName
        };
        $.ajax({
        url : "./createContest",
        type : "POST",
        contentType : 'application/json',
        data : JSON.stringify( obj ),
        success : function(res){
            console.log("nice");
        },
        error : function(res){
            console.log(res.status);

        }
        });
    });
    renderContests();
}

function getProblemTag(problem){
    pr = $("<div class='problem'></div>");
    cName = $("<span class='badge badge-primary'>PROBLEM:"+problem.problemName+"</span>");
    pr.append(cName);

    console.log(problem);
    url = "https://codeforces.com/contest/" + problem.contestId + "/problem/" + problem.index;
    
    problema = $("<div></div>");
    link = $("<a href='" + url + "' target='_blank'> </a>");
    solve = $("<button type='button' class='btn btn-success'>solve</button>");

    link.append(solve);
    problema.append(link);
    pr.append(problema);


    tags = $("<div></div>");
    problem.tag.forEach( tag => {
       tag = $("<span class='badge badge-danger'>"+tag+"</span>");
       tags.append(tag);
    });
    pr.append(tags);
    return pr;
}

function addContest(contest, number){
            cont = $("<div class='contest'> </div>");
            card = $("<div id='accordion'> </div>");
            cardHeader = $("<div class='card-header' id='heading'"+number+"> </div>");
            h2class = $("<h5 class='mb-0'>");
            but = $("<button class='btn btn-primary' data-toggle='collapse' data-target='#collapse"+number+"' aria-expanded='true; aria-controls='collapse" + number + "'>" + contest[0].name + "</button>");

            h2class.append(but);
            cardHeader.append(h2class);

            fDiv = $("<div id='collapse" + number + "' class='collapse' aria-labelledby='heading"+number+"' data-parent='#accordion'> </div");
            cardBody = $("<div class='card-body'> </div>");

            contest.forEach( problem => {
                pr = getProblemTag(problem);
                console.log(pr);
                cardBody.append(pr);
            });

            fDiv.append(cardBody);
            card.append(cardHeader);
            card.append(fDiv);
            cont.append(card);
            $("#rightSide").append(cont);


}


function renderContests(){
        let usr = localStorage.getItem("usr");
        $.ajax({
        url : "./getContests/"+usr,
        type : "GET",
        contentType : 'application/json',
        success : function(res){
            for ( c1 in res){
                addContest(res[c1], c1);
            }
        },
        error : function(res){
            console.log(res.status);
        }
        });
}


main();
