const SERVER_URL = "http://localhost:3000";
const STATS_PATH = "/stats?handle=";

const SKILL_LEVELS = [
    "Newbie",
    "Pupil",
    "Specialist",
    "Expert",
    "Candidate Master",
    "Master",
    "Grandmaster"
]

const TAGS = [
    "implementation",
    "dp",
    "math",
    "greedy",
    "brute force",
    "data structures",
    "constructive algorithms",
    "dfs and similar",
    "sortings",
    "binary search",
    "graphs",
    "trees",
    "strings",
    "number theory",
    "geometry",
    "combinatorics",
    "two pointers",
    "dsu",
    "bitmasks",
    "probabilities",
    "shortest paths",
    "hashing",
    "divide and conquer",
    "games",
    "matrices",
    "flows",
    "string suffix structures",
    "expression parsing",
    "graph matchings",
    "ternary search",
    "meet-in-the-middle",
    "fft",
    "2-sat",
    "chinese reminder theorem",
    "schedules",
]

const BOUNDS = [
    {
        min: 0,
        max: 1199
    },
    {
        min: 1200,
        max: 1399
    },
    {
        min: 1400,
        max: 1599
    },
    {
        min: 1600,
        max: 1899
    },
    {
        min: 1900,
        max: 2199
    },
    {
        min: 2200,
        max: 2399
    },
    {
        min: 2400,
        max: 5000
    }
]

module.exports = {
    TAGS, BOUNDS
};