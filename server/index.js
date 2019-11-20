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
app.get('/gen-contest', (req, res) => {
    request.get({
        url: API_URL + "problemset.problems?tags=fft"
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            console.log(body);
            console.log(typeof(body));
            res.status(200).send(body);
        }
        else{
            res.status(400).send();
        }
    });

    /*
    var tags = req.query.tags;
    tags = tags.split(';');
    let rating_min = req.query.rating_min;
    let rating_max = req.query.rating_max;
    let ps_length = req.query.ps_length;

    // validate query parameters
    if(!tags || isNaN(rating_min) || isNaN(rating_max) || rating_min > rating_max){
        //res.statusMessage = "The provided range bounds aren't valid, make sure they're numbers and the lower bound is not greater than the upper bound";
        res.status(400).send();
    }
    else{
        //res.statusMessage = "Success";
        res.status(200)
        .send(queryProblems(tags, rating_min, rating_max, ps_length));
    }
    */
})

function queryProblems(tags, low, upp, ps_length){
    var ans = [];
    tags.forEach(tag => {
        ans.push({
            tag: tag,
            problems: filterProblemsByRating(queryProblemsByTag(tag), low, upp)
        })
    });
    return chooseProblems(tags, ans, ps_length);
}

function filterProblemsByRating(problems, low, upp){
    console.log(problems);
    ans = [];
    problems.forEach(problem => {
        if(problem.rating >= low && problem.rating <= upp){
            ans.push(problem);
        }
    });
    return ans;
}

function queryProblemsByTag(tag){
    return request.get({
        url: API_URL + "problemset.problems?tags=" + tag
    }, (err, response, body) => {
        if(!err && response.statusCode == 200){
            return body;
        }
        else{
            return [];
        }
    });
}

// not checking if it's possible or if we have repeated problems
function chooseProblems(tags, problems, ps_length){
    let prob = tags.length;
    let ans = [];
    while(ps_length){
        tags.forEach(tag => {
            if(ps_length){
                let tagProblems = problems[tag];
                let total = tagProblems.length;
                let idx = Math.floor(Math.random() * total)
                if(Math.floor(Math.random() * prob) == 0){
                    let idxSelection = Math.floor(Math.random() * total);
                    ans.push(tagProblems[idxSelection]);
                    problems[tag].splice(idxSelection, 1);
                    ps_length--;
                }
            }
        });
    }
    return ans;
}

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