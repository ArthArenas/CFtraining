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



let friendSchema = mongoose.Schema({
    usr : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'usrSchema',
        required : true
    },
    name : {
        type : String,
        required : true
    }

});


let usuarios = mongoose.model( 'user', usrSchema);
let contests = mongoose.model( 'contests', contestSchema);
let friends = mongoose.model( 'friends', friendSchema);


let amigos = {
    existFriend : function ( nombre , id) {
        console.log(nombre, id);
        return friends.find({name : nombre, usr : id})
                .then(amiwo => {
                    return amiwo.length > 0
                })
                .catch(err => {
                    throw err;
                });
    },
    getFriends : function( id ) {
        return friends.find({usr : id})
                .then(amiwos =>{
                    return amiwos;
                })
                .catch(err => {
                    throw err;
                })
    },
    addFriend : function( id, name) {
            let obj  = {
                "usr" : id,
                "name" : name
            };
            return friends.create(obj)
                .then(amiwo => {
                    return amiwo;
                })
                .catch(err =>{
                    throw err;
                });
    },
    deleteFriend : function(id, name){
            let obj = {
                "usr" : id,
                "name" : name
            };
        return friends.deleteOne(obj)
                .then(amiwo => {
                        return amiwo;
                })
                .catch(err =>{
                    throw err;
                });
    }

}


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
    }
}


let contest = {
    getProblems : function(userName){
        return contests.find({user : userName})
                .then(problems => {
                    return problems;
                })
                .catch(err => {
                    throw err;
                });
    },
    addProblem : function(contestId, userId, pName, dificult, tag){
        let obj = {
            "id" : contestId,
            "user" : userId,
            "problemName" : pName,
            "dificulty" : dificult,
            "tag" : tag
        };
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


module.exports = { user, contest, amigos };
