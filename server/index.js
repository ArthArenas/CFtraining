const express = require('express')
const uuid = require('uuid/v4')
const morgan = require('morgan')
const app = express()
const port = 3000
const request = require('request')

const API_URL = "https://codeforces.com/api/";

app.use(express.urlencoded({extended: true}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

// REMOVE
app.get('/problemset.problems', (req, res) => {
    request.get({
        url: API_URL + "problemset.problems?tags=" + req.query.tags
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(400).send(err);
        }
    });
})

// Generate contest


// User's complementary personal information and validation of handle existance
app.get('/user.info', (req, res) => {
    request.get({
        url: API_URL + "user.info?handles=" + req.query.handles
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(400).send(err);
        }
    });
})

// User's ratings and friend's ratings
app.get('/user.rating', (req, res) => {
    request.get({
        url: API_URL + "user.rating?handle=" + req.query.handle
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(400).send(err);
        }
    });
})

// User's curtomized contest completion
app.get('/user.status', (req, res) => {
    request.get({
        url: API_URL + "user.status?handle=" + req.query.handle
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            res.status(200).send(body);
        }
        else{
            res.status(400).send(err);
        }
    });
})

// User's stats


app.listen(port, () => console.log(`Example app listening on port ${port}!`))