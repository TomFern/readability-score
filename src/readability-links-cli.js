#!/usr/bin/env node

// arguments:
// -f FILE.md Get links from Markdown file.
// -o FILE.json Write report

const readability = require('./readability');
const fs = require('fs');
const linkExtractor = require("markdown-link-extractor");
const { showScore, showCard, showTotals } = require('./cards');
// const fnInArgs = process.argv[2];


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


// const report = [];
// if(argv.file) {
//   report.push(readability.analyzeFile(argv.file));
// }

// return number of cache hits for a url
// function scoreExists(url, cache) {
//     return cache.filter(c => c.url === url).length;
// }

// read previously saved scores
let savedScores = [];
if(argv['save-score'] && fs.existsSync(argv['save-score']))
    savedScores = JSON.parse(fs.readFileSync(argv['save-score'], 'utf8').toString());
// console.log(savedScores);
const savedUrls = savedScores.map(s => s.url);
// console.log(savedUrls);
// extract urls from markdown file
// argv['read-file'] = 'readability/test.md';
const urls = linkExtractor(fs.readFileSync(argv['read-file']).toString())
    .filter(u => !savedUrls.includes(u))
;
// console.log(urls);

// begin analyzing the urls not previously analyzed
const scores = urls.map(url => readability.analyzeUrl(url));

// show results in terminal
if(argv['show-card']) showCard();
Promise.all(scores)
    .then(score => {
        showScore(score);
        const allScores = savedScores.concat(score);
        
        // console.log("");
        showTotals(allScores);
        if(argv['save-score'])
            fs.writeFileSync(argv['save-score'], JSON.stringify(allScores, null, 4), 'utf8');
        
        console.log("%i skipped urls", allScores.length - urls.length);
        // const links = generateLinks(urls, words);
        // const cache = appendToCache(fnargs, links);
        // const report = generateReport(cache);
        // console.log(JSON.stringify(report, null, 4));

        // if(report.length) {             
        //     console.log(JSON.stringify(report, null, 4));
        //     if(argv.output) {
        //       fs.writeFileSync(argv.output, JSON.stringify(report, null, 4));
        //     }
        //   }
    })
    .catch(console.error);

