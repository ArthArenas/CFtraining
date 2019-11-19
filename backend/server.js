let express = require("express");
let bodyParser = require('body-parser');
let morgan = require("morgan");
let cat = require("cat-me");
let mongoose = require('mongoose');
let {studentList} = require('./model');
const {DATABASE_URL, PORT} = require('./config.js');

let jsonParser = bodyParser.json();

let app = express();
app.use(express.static('public'));
app.use(morgan('combined'));

let names = [
    {
        name : "ravioli",
        id : 1234567
    }, 
    {
        name: "ravioli2",
        id : 898989,
    }];

mongoose.Promise = global.Promise;
console.log(cat());

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
    //  return res.status(200).json(names);
//    res.statusMessage="something went wrong, umma delicia";
//    return res.status(400).json({message: "something went wrong", status : 400});
});

app.post("/api/postStudent", jsonParser, (req, res) => {

    console.log(req.params);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let id = req.body.id

    let newStudent = {
        firstName,
        lastName,
        id
    }
    
    console.log(newStudent);

    studentList.post(newStudent)
        .then ( student => {
            return res.status(200).json(student);
        })
        .catch(err => {
            console.log(err);
        });
/*
    if(!req.body.name || !req.body.id){
        res.statusMessage = "Missing field in body";
        return res.status(406).json({message : "missing field in bodyy", status : 406});
    }
    names.forEach((obj) => {
        if(obj.id == req.body.id){
            res.statusMessage = 'Repeated identifier';
            return res.status(409).json({message :'Repeated identifier', status : 409});
        }
    });
    names.push(req.body);
    return res.status(201).json({message : req.body , status: 201});
    */
});


app.get('/api/getStudentById', (req, res) => {
    if(!req.query.id){
        res.statusMessage = 'Missing id in param';
        return res.status(406).json({message: 'Missing id in param', status : 406});
    }

//    names.forEach((obj) => {
//            if(obj.id == req.query.id){
 //               return res.status(202).json({message : obj, status: 202});
  //          }
   // });
    //

    let obj = {
        "id" : req.query.id
    };

    studentList.getId(obj)
        .then( response => {
            return res.json(response);
            return res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
        });


    res.statusMessage = 'Student id not found on the list';
    return res.status(404).json({messsage: 'student id not found on the list', status: 404});
});

app.delete('/api/removeStudent/:id', (req, res) => {
    for(var i = 0 ; i < names.length; i++){
        if(names[i].id == req.params.id){
            var tmp = names[i]; 
            names.splice(i, 1);
            return res.status(200).json({message : tmp, status: 202});
        }
    }

    res.statusMessage = 'id not found on the list';
    return res.status(404).json({message: 'id not found on the list', status: 404});
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
