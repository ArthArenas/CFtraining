let express = require("express");
let bodyParser = require('body-parser');
let morgan = require("morgan");
let cat = require("cat-me");
let bcrypt = require("bcrypt");
let mongoose = require('mongoose');
let {user} = require('./model');
let {contest} = require('./model');
let uuidv4 = require('uuid/v4');
let superagent = require('superagent');

const {DATABASE_URL, PORT} = require('./config.js');

let jsonParser = bodyParser.json();

let app = express();
app.use(express.static('./../front'));
app.use(morgan('combined'));

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
