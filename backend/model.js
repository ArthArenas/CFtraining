let mongoose = require('mongoose');

mongoose.Promise = global.Promise;


let usrSchema = mongoose.Schema({
    usr : {type : String, required : true},
    pass : {type : String, required : true},
});


let contestSchema = mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'usrSchema',
        required : true
    },
    problemName : {
        type: String,
        required : true
    },
    dificulty : {
        type : Number,
        required : true
    },
    tag : {
        type: [String],
        required : true
    }

});

let usuarios = mongoose.model( 'user', usrSchema);
let contests = mongoose.model( 'contests', contestSchema);



let user = {
    existUsr : function(userName){
        return usuarios.find({usr : userName})
                .then(user => {
                    return user.length > 0;
                })
                .catch(err => {
                    throw err;
                });
    },
    register : function(obj){
        return usuarios.create(obj)
                .then(elem => {
                    return elem;
                })
                .catch( err => {
                    throw err;
                });
    },
    getPass : function(userName){
        return usuarios.findOne({usr : userName})
                .then(user => {
                    return user.pass;
                })
                .catch(err => {
                    throw err;
                });
    },
    getID : function(userName){
        return usuarios.findOne({usr : userName})
                .then(user => {
                    return user._id;
                })
                .catch(err => {
                    throw err;
                });
    },
}


let contest = {
    addProblem : function(contestId, userId, pName, dificult, tag){
        let obj = {
            "id" : contestId,
            "user" : userId,
            "problemName" : pName,
            "dificulty" : dificult,
            "tag" : tag
        }
        console.log(obj);
        return contests.create(obj)
                .then(elem => {
                    return elem;
                })
                .catch( err => {
                    throw err;
                });
    }
}


module.exports = { user, contest };
