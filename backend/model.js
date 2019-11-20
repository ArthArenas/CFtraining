let mongoose = require('mongoose');

mongoose.Promise = global.Promise;


let studentSchema = mongoose.Schema({
    firstName : {type : String },
    lastName : {type : String },
    id : {
          type : Number, 
          required : true },
});


let Student = mongoose.model( 'student', studentSchema);



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

module.exports = { studentList };
