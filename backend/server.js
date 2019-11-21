let express = require("express");
let bodyParser = require('body-parser');
let morgan = require("morgan");
let cat = require("cat-me");
let bcrypt = require("bcrypt");
let mongoose = require('mongoose');
let {user} = require('./model');
let {contest} = require('./model');
let {amigos} = require('./model');
let uuidv4 = require('uuid/v4');
let superagent = require('superagent');

let {tagCnt} = require('./utils');

const {DATABASE_URL, PORT} = require('./config.js');

let jsonParser = bodyParser.json();

let app = express();
app.use(express.static('./../front'));
app.use(morgan('combined'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

mongoose.Promise = global.Promise;

problems = [];

function error(res){
    res.statusMessage="something went wrong, internal error";
    return res.status(400).json({status: 400, message : "something went wrong, internal error"});
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}





function getProblem(tags, tag, lb, up, size, callBack, cid, uid){
    superagent.get("https://codeforces.com/api/problemset.problems")
    .query({tags : tag})
    .then(res => {
        let idx = -1;
        list = shuffle(res.body.result.problems);
        find = false;
        list.forEach(elem =>{
            if(!find && elem.rating >= lb && elem.rating <= up){
                problems.push(elem);
                find = true;
            }
        });
        if(size > 0){
            if(size%5 == 0){
                let wait = new Date(new Date().getTime() + 1 * 1000);
                while(wait > new Date());
            }
            let rn = Math.floor(Math.random() * tags.length);
            getProblem(tags, tags[rn], lb, up, size-1, callBack, cid, uid);
        }else{
            callBack(cid, uid);
        }
    })
    .catch(err => {
        console.log(err);
    });
}


function pushToDB(contestId, uid){
    problems.forEach(problem => {
        contest.addProblem(contestId, uid, problem.name, problem.rating, problem.tags);
    });
}


function set(myDict, key,){
    if(!myDict.hasOwnProperty(key)){
        myDict[key] = [];
    }
}

app.get("/getContests/:id", function(req, res){
    let usr = req.params.id

    user.getID(usr)
        .then( id=>{
            contest.getProblems(id)
                .then(problems => {
                    //hacer bucket de los contests
                    contests = {};
                    problems.forEach( problem => {
                        set(contests, problem.id);
                        contests[problem.id].push(problem);
                    })

                    return res.status(200).json(contests);
                })
                .catch( err =>{
                    return error(res);
                });
        })
        .catch(err =>{
            return error(res);
        })

});


function existHandle(usr, id, callBack){
    superagent.get("https://codeforces.com/api/user.info")
    .query({handles : usr})
    .then(res => {
        return callBack(usr, id);
    })
    .catch(err =>{
        return;
    });
}


function addFriend(friendName, id){
        amigos.addFriend(id, friendName)
        .then( elem=>{
            return elem;
        })
        .catch( err =>{
            return err;
        });
}


app.delete("/deleteFriend", jsonParser, function(req, res){
    let usr = req.body.userName;
    let friendName = req.body.friendName;
    console.log(friendName);
    if(!usr || !friendName){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }
    // get usr id
    user.getID(usr)
        .then( id =>{
            console.log(friendName, id);
           amigos.existFriend(friendName, id)
                .then(val =>{
                    if(val == true){
                        amigos.deleteFriend(id, friendName)
                            .then(elem => {
                                return res.status(200).json(elem);
                            })
                            .catch ( err =>{
                                return error(res);
                            });
                    }else{
                        res.statusMessage = "friend doesnt exists";
                        return res.status(401).json({status: 401, message : "firend doesnt exists"});
                    }
                })
                .catch( err => {
                    return error(res);
                });
        })
        .catch( err => {
            return error(res);
        });
});


app.post("/addFriend", jsonParser, function(req, res){
    let usr = req.body.userName;
    let friendName = req.body.friendName;
    console.log(friendName);
    if(!usr || !friendName){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }
    // get usr id
    user.getID(usr)
        .then( id =>{
            console.log(friendName, id);
           amigos.existFriend(friendName, id)
                .then(val =>{
                    if(val == false){
                        existHandle(friendName, id, addFriend);
                        return res.status(200).json({status: 200});
                    }else{
                        res.statusMessage = "Friend already exist";
                        return res.status(401).json({status: 401, message : "friend already exist"});
                    }
                })
                .catch( err => {
                    return error(res);
                });
        })
        .catch( err => {
            return error(res);
        });
});


app.get("/getFriends/:id", function(req, res){
    let usr = req.params.id
    if(!usr){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }

    user.getID(usr)
        .then(id => {
            amigos.getFriends(id)
                .then( friends =>{
                    return res.status(200).json(friends);
                })
                .catch( err => {
                    return error(res);
                });
        })
        .catch(err =>{
            return error(res);
        });
});

app.post("/createContest", jsonParser, function(req, res){
    let lb = req.body.lb;
    let ub = req.body.ub;
    // this should be an array of tags, amirite
    let tags = req.body.tags;
    let size = req.body.size;
    let usr = req.body.user;

    if(!lb || !ub || !tags || !size || !usr){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }
    if(tags.length < 1 ){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }

    
    user.getID(usr)
        .then(usrID => {
            let contestId = uuidv4();
            problems = [];

            let rn = Math.floor(Math.random() * tags.length);
            getProblem(tags, tags[rn], lb, ub, size-1, pushToDB, contestId, usrID);
        })
        .catch( err => {
            return error(res);
        });

   return res.status(200).json({status: 200, message : "ok"});

});

app.post("/register", jsonParser, function(req, res) {
    let usr = req.body.userName;
    let pass = req.body.pass;
    if(!usr || !pass){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }
    
    user.existUsr(usr)
        .then(exists => {
            if(exists){
                res.statusMessage = "The user already exists";
                return res.status(405).json({status: 405, message : "The user already exists"});
            }else{
                bcrypt.hash(pass, 10, function(err, hash){
                let obj = {
                    usr,
                    "pass" : hash
                }
                user.register(obj)
                    .then(usr => {
                        return res.status(200).json(usr);
                    })
                    .catch(err => {
                        return error(res);
                    });

                });
            }
            
        })
        .catch( err => {
            return error(res);
        });


});


app.post("/log", jsonParser, function(req, res){
    let usr = req.body.userName;
    let pass = req.body.pass;
    if(!usr || !pass){
        res.statusMessage = "Field missing";
        return res.status(401).json({status: 401, message : "field missing"});
    }
    user.getPass(usr)
        .then(hash => {
            console.log(pass, hash);
            bcrypt.compare(pass, hash, function(err, res2){
                if(res2===true){
                    return res.status(200).json({status: 200, message : "ok"});
                }else{
                    res.statusMessage = "some information is wrong";
                    return res.status(404).json({status: 404, message : "some information is wrong"});
                }
            });
        })
        .catch(err => {
            return error(res);
        });

});

app.get("/api/students", function(req, res, next){
    studentList.get()
        .then(list => {
            res.statusMessage="cool";
            return res.status(200).json(list);
        })
        .catch(err =>{
            res.statusMessage="something went wrong, internal error?";
            return res.status(400).json({status: 400, message : "something went wrong lmao"});
        });
});

app.get("/api/stats", function(req, res){
    superagent.get("https://codeforces.com/api/user.status?handle=" + req.query.handle)
    .then(ans => {
        res.status(200).send(tagCnt(ans.body.result));
    })
    .catch(err => {
        console.log(err);
    });
})

let server;
function runServer(port, databaseUrl){
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if(err){
                return reject(err);
            }else{
                server = app.listen(port, () => {
                    console.log("soppa de macaco uma delicia kkk");
                    console.log(cat());
                    resolve();
                })
                .on('error', error => {
                    mongoose.disconnect();
                    return reject(err);
                });
            }
        });
    });
}

runServer(PORT, DATABASE_URL)
        .catch(err => {
            console.log(err);
        });

function closeServer(){
 return mongoose.disconnect()
     .then(() => {
         return new Promise((resolve, reject) => {
         console.log('Closing the server');
                 server.close( err => {
                 if (err){
                     return reject(err);
                 }
                 else{
                     resolve();
                 }
             });
         });
     });
}

module.exports = {app, runServer, closeServer }
