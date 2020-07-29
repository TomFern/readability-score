#!/usr/bin/env node
// Analyzes readability in plain text files and URLs

const fs = require('fs');
const chalk = require('chalk');
const readability = require('./readability');
const { showScore, showCard } = require('./cards');

// CLI options
const yargs = require('yargs') // eslint-disable-line
  .scriptName('readability-score')
  .version(false)
  .wrap(null)
  .usage(' Usage: $0 [-f FILE.txt] [-u "URL"] [-o FILE.json]')
  .example('Analyze files:', 'readability-score -f myfile1.txt -f myfile2.txt -o score.json')
  .example('Analyze URLs:', 'readability-score -u http://foo.com -u http://bar.com -o score.json')
  .alias('f', 'read-file')
  .describe('f', 'Read a file')
  .alias('u', 'read-url')  // NYI
  .describe('u', 'Read a URL')
  .alias('o', 'save-score')
  .describe('o', 'Write scores to JSON file [optional]')
  .alias('c', 'show-card')
  .describe('c', 'Print reference card [optional]')
  .help('h')
  .alias('h', 'help');
const argv = yargs.argv;

// analyze files and urls
const analysis = [];
if(argv['read-file']) {
  if(Array.isArray(argv['read-file'])) {
    argv['read-file'].forEach(f => analysis.push(readability.analyzeFile(f)));
  }
  else {
    analysis.push(readability.analyzeFile(argv['read-file']));
  }  
}
if(argv['read-url']) {
  if(Array.isArray(argv['read-url'])) {
    argv['read-url'].forEach(u => analysis.push(readability.analyzeUrl(u)));
  }
  else {
    analysis.push(readability.analyzeUrl(argv['read-url']));
  }  
}

// check if readability exists in report for current file
// function reportExists(entry) {
//     return entry.pathRelative == readability.pathRelative
//            && entry.dateModified == readability.dateModified;
// }

// if(!readabilityReport.find(reportExists)) {
//     readabilityReport.push(readability);
// }

// show results in terminal
if(argv['show-card']) showCard();
if(analysis.length == 0) {
  console.log(chalk.red("Nothing to analyze"));
  yargs.showHelp();
}
else {
  Promise.all(analysis)
  .then( score => {          
      showScore(score);
      if(argv['save-score']) {
        fs.writeFileSync(argv['save-score'], JSON.stringify(score, null, 4), 'utf8');
      }
  })
  .catch(console.error); 
}