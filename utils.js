let {TAGS, BOUNDS} = require('./constants');

function tagCnt(status){
    var ans = {};
    for (let idx = 0; idx < TAGS.length; idx++) {
        ans[TAGS[idx]] = [0, 0, 0, 0, 0, 0, 0];
    }

    for (let idx = 0; idx < status.length; idx++) {
        const problem = status[idx].problem;
        let rankIdx = getRankIdx(problem.rating);
        problem.tags.forEach(tag => {
            if(ans[tag]){
                ans[tag][rankIdx]++;
            }
        });
    }

    return ans;
}

function getRankIdx(rating){
    var ans = 0;
    for (let idx = 0; idx < BOUNDS.length; idx++) {
        let bound = BOUNDS[idx];
        if(bound.min <= rating && rating <= bound.max) ans = idx;
    }
    return ans;
}

module.exports = {
    tagCnt
};