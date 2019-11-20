let mongoose = require('mongoose');

mongoose.Promise = global.Promise;


let usrSchema = mongoose.Schema({
    usr : {type : String, required : true},
    pass : {type : String, required : true},
});




let usuarios = mongoose.model( 'user', usrSchema);



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
    }
}


let studentList = {
    get : function(){
        return Student.find()
                .then(list => {
                    return list;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
    },
    post : function(obj){
        console.log(obj);
        return Student.create(obj)
                .then(elem => {
                    return elem;
                })
                .catch(err => {
                    throw err;
                });
    },
    getId : function(obj){
        return Student.find({id : obj.id})
            .then(list => {
                return list;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });

    }
}

module.exports = { user };
