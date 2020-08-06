#!/usr/bin/env node
// Analyzes readability in urls found in markdown file

const fs = require('fs');
const linkExtractor = require("markdown-link-extractor");
const { showScore, showCard, showTotals } = require('./cards');
const readability = require('./readability');

const yargs = require('yargs') // eslint-disable-line
  .scriptName('readability-links')
  .version(false)
  .wrap(null)
  .usage(' Usage: $0 [-f FILE.md] [-o FILE.json]')
  .example('Analyze links in file:', 'readability-links -f mylinks.md')
  .example('Save the scores, skip urls on next run:', 'readability-links -f mylinks.md -o score.json')
  .alias('f', 'read-file')
  .describe('f', 'Read Markdown file')
  .demandOption(['read-file'], "Provide a markdown file to read with -f")
  .alias('o', 'save-score')
  .describe('o', 'Write scores, skips urls next time [optional]')
  .alias('c', 'show-card')
  .describe('c', 'Print reference card [optional]')
  .help('h')
  .alias('h', 'help');
const argv = yargs.argv;

// read previously analyzed score from save-score file
let savedScores = [];
if(argv['save-score'] && fs.existsSync(argv['save-score']))
    savedScores = JSON.parse(fs.readFileSync(argv['save-score'], 'utf8').toString());

// extract urls from read-file 
// and filter out those already found in save-score
const savedUrls = savedScores.map(s => s.url);
const urls = linkExtractor(fs.readFileSync(argv['read-file'])
    .toString())
    .filter(u => !savedUrls.includes(u));

// begin analyzing the remaining urls, array elements are promises
const scores = urls.map(url => readability.analyzeUrl(url));

// show reference card
if(argv['show-card']) showCard();

// resolve all promises, print out results and write save-score
Promise.all(scores)
    .then(newScores => {

        // filter failed and new urls
        const okScores = newScores.filter(s => s.readability);
        const allScores = savedScores.concat(okScores);

        // write save-score
        if(argv['save-score'])
            fs.writeFileSync(argv['save-score'], JSON.stringify(allScores, null, 4), 'utf8');

        // print out results
        showScore(okScores);
        showTotals(allScores);   
        
        // show skipped and failed url count
        console.log("%i skipped urls, %i failed urls"
            ,allScores.length - okScores.length
            ,newScores.length - okScores.length);

        // print failed urls
        if(newScores.length - okScores.length) {
            newScores.filter(s => !s.readability).forEach(s => console.log(' ✗ ' + s.url));
        }
    })
    .catch(console.error);