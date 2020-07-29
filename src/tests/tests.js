const readability = require('../readability');
const { equal } = require('assert');

function testAnalyzeFile() {
    readability.analyzeFile('tests/test.txt')
        .then(score => {
            const r = score.readability;
            equal(r.wordCount, 82);
            equal(r.fleschReadingEase, 43.77);
            equal(r.automatedReadabilityIndex, 16);
            equal(r.smogIndex,14.6);
            equal(r.daleChallReadabilityScore, 7.11);
        })
        .catch(console.error);
}

testAnalyzeFile();
