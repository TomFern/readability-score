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

// extract url from read-file 
// and filter out urls already found in save-score
const savedUrls = savedScores.map(s => s.url);
const urls = linkExtractor(fs.readFileSync(argv['read-file']).toString())
    .filter(u => !savedUrls.includes(u))
;

// begin analyzing the remaining urls
const scores = urls.map(url => readability.analyzeUrl(url));

// show results in terminal & save score file
if(argv['show-card']) showCard();
Promise.all(scores)
    .then(newScore => {
        const allScores = savedScores.concat(newScore);
        if(argv['save-score'])
            fs.writeFileSync(argv['save-score'], JSON.stringify(allScores, null, 4), 'utf8');

        // show results
        showScore(newScore);
        showTotals(allScores);        
        console.log("%i skipped urls", allScores.length - newScore.length);
    })
    .catch(console.error);