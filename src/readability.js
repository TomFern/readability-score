// readability analysis functions

const fs = require('fs').promises;
// const fetch = require('node-fetch');
const path = require('path');
const htmlToText = require('html-to-text');
const { extract } = require('article-parser');
const rs = require('text-readability');

const defaultLang = 'en-US';

// base readability analysis
// text: string to analyze
// lang: language of the text
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


// fetchs, convert to text and analyze url
// url: fully qualified url
// lang: language of the text
// returns: a promise with the readability score for the url
// exports.analyzeUrl2 = (url, lang=defaultLang) => {

//     return fetch(url)
//         .then(req => {return req.text()})
//         .then(body => {
//             const parseOptions = {
//                 ignoreHref: true
//                 ,ignoreImage: true
//                 ,unorderedListItemPrefix: ' - '
//                 ,uppercaseHeadings: false
//                 ,wordwrap: false
//                 ,format: { 
//                     // remove tables
//                     table: () => ''
//                 }
//             };
//             const text = htmlToText.fromString(body, parseOptions);
//             const base = analyzeBase(text, lang);

//             // url attributes
//             const urlAttrs = {
//                 "source": "url"
//                 ,"url": url
//             };

//             return {
//                 ...urlAttrs
//                 ,"readability": base
//             };
//         });
// };


// fetchs, converts to text and analyzes url
// url: fully qualified url
// lang: language of the text
// returns: a promise with the readability score for the url 
exports.analyzeUrl = (url, lang=defaultLang) => {
   
  return extract(url).then((article) => {
    const parseOptions = {
        ignoreHref: true
        ,ignoreImage: true
        ,unorderedListItemPrefix: ' - '
        ,uppercaseHeadings: false
        ,wordwrap: false
        ,format: { 
            // remove tables
            table: () => ''
        }
    };
   
    const text = htmlToText.fromString(article.content, parseOptions);
    const base = analyzeBase(text, lang);

    // article attributes
    const articleAttrs = {
        "title": article.title
        ,"author": article.author
        ,"description": article.description
        ,"published": article.published
        ,"source": article.source
        ,"image": article.image
    }

    // url attributes
    const urlAttrs = {
        "source": "url"
        ,"url": url   
    };

    return {
        ...urlAttrs
        ,"article": articleAttrs
        ,"readability": base
    };
  });
};

// analyze a plain text file
// fn: path to a text file
// lang: language of the text
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
                "source": "file"
                ,"pathRelative": path.relative(process.cwd(), fn)
                ,"filename": path.basename(fn)
            };
        
            return {
                ...fnAttrs,
                "readability": base
            };
        });
};
