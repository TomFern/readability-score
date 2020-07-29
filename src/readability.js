// readability analysis functions

const fs = require('fs').promises;
const fetch = require('node-fetch');
const path = require('path');
const htmlToText = require('html-to-text');
const rs = require('text-readability');

const defaultLang = 'en-US';

// read previous report reports in current directory
// exports.readPreviousReport = (fn) => {
//     let reportArray = [];
//     if (fs.existsSync(fn)) {
//         let data = fs.readFileSync(fn, 'utf8').toString();
//         reportArray = JSON.parse(data);
//     }
//     return reportArray;
// }


// base readability analysis
function analyzeBase(text, lang) {
    return {
        "sentenceCount": rs.sentenceCount(text),
        "syllableCount": rs.syllableCount(text, lang),
        "wordCount": rs.lexiconCount(text, removePunctuation=true),
        "gradeRequired": rs.textStandard(text, float_output=false),
        "fleschReadingEase": rs.fleschReadingEase(text),
        "fleschKincaidGrade": rs.fleschKincaidGrade(text),
        "gunningFog": rs.gunningFog(text),
        "smogIndex": rs.smogIndex(text),
        "automatedReadabilityIndex": rs.automatedReadabilityIndex(text),
        "colemanLiauIndex": rs.colemanLiauIndex(text),
        "linsearWriteFormula": rs.linsearWriteFormula(text),
        "daleChallReadabilityScore": rs.daleChallReadabilityScore(text)
    };
}


// url: fully qualified url
// title: optional title for the url
// lang: the url's language
// returns: a promise with the readability score for the url
exports.analyzeUrl = (url, title=null, lang=defaultLang) => {

    return fetch(url)
        .then(req => {return req.text()})
        .then(body => {
            const parseOptions = {
                ignoreHref: true,
                ignoreImage: true,
                unorderedListItemPrefix: ' - ',
                uppercaseHeadings: false,
                wordwrap: false,
                format: { 
                    // remove tables
                    table: () => ''
                }
            };
            const text = htmlToText.fromString(body, parseOptions);
            const base = analyzeBase(text, lang);

            // url attributes
            const urlAttrs = {
                "source": "url",
                "url": url,
                "title": title,
                "dateFetch": Date.now()
            };

            return {
                ...urlAttrs,
                "readability": base
            };
        });
};

// fn: path to a text file
// returns: a promise with the readability score for the file
exports.analyzeFile = (fn, lang=defaultLang) => {

    let data = null;

    return fs.readFile(fn, 'utf8')
        .then(buffer => { 
            data = buffer;
            return fs.stat(fn);
        })
        .then(stats => {
            const base = analyzeBase(data.toString(), lang);
            const fnAttrs = {
                "source": "file",
                "pathRelative": path.relative(process.cwd(), fn),
                "filename": path.basename(fn),
                "dateModified": stats.mtime.toISOString()
            };
        
            return {
                ...fnAttrs,
                "readability": base
            };
        });
};
