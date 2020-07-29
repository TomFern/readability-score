// terminal output and score cards
const chalk = require("chalk");

// prints reference card
exports.showCard = () => {
    console.log(chalk.underline("Score Card") + " | " + chalk.green("very easy") + " | " + chalk.blue("easy") + " | plain | " + chalk.yellow("hard") + " | " + chalk.red("very hard"));
    console.log(chalk.bold("  ease") + ": Flesch Reading Ease (readability ). [0-100] more is easier, 60 is plain English.");
    console.log(chalk.bold("  ari") + ": Automated Readability Index (undestandability). [1-14] more is harder, 8 is plain English.");
    console.log(chalk.bold("  smog") + ": SMOG Index (word length). [0-10] more is harder, 8 is plain English.")
    console.log(chalk.bold("  dale") + ": Dale-Chall Readability (common words). [0-10] more is harder, 7 is plain English.")
    console.log(chalk.dim("Use --output to view all scores."));
    console.log("");
};

// print score in terminal
exports.showScore = (score) => {    
    score.forEach(function(s) {
        const r = s.readability;
        if(s.source == 'file') console.log(chalk.bold(s.filename));
        else if(s.source == 'url')  console.log(chalk.underline(s.url));
        console.log("  words: %i, sentences: %i", r.wordCount, r.sentenceCount);
        console.log("  %s, %s, %s, %s"
            ,sc('ease', r.fleschReadingEase)
            ,sc('ari', r.automatedReadabilityIndex)
            ,sc('smog', r.smogIndex)
            ,sc('dale',r.daleChallReadabilityScore)
        );
        console.log("  %s", sc('grade', r.gradeRequired));
        console.log("");
    });
    // console.log(chalk.dim("Use --card to see what these values mean."));

};

// prints totals/averages
exports.showTotals = (score) => {

    function totalize(metric) {
        return score.reduce((a,b) => a.readability[metric]+b.readability[metric]);
    }

    const totalWords = totalize('wordCount');
    const totalLinks = score.length;
    console.log(chalk.underline("Totals & Averages"));
    console.log("  words: %i, links: %i"
                ,totalWords
                ,totalLinks);
    // console.log(chalk.underline("Averages"));
    // console.log("  words: %f", totalWords/totalLinks);
    console.log("  %s, %s, %s, %s"
        ,sc('ease', totalize('fleschReadingEase')/totalLinks)
        ,sc('ari', totalize('automatedReadabilityIndex')/totalLinks)
        ,sc('smog', totalize('smogIndex')/totalLinks)
        ,sc('dale', totalize('daleChallReadabilityScore')/totalLinks)
            ); 
    console.log("");
}
  
  
// returns: color-formatted metric sting
function sc(metric, value) {

    if(metric=="grade") {
        return value;
    }

    if(metric=="ease") {
        if(value < 30) {
        return "ease: " + chalk.red(value);
        }
        if(value >= 30 && value < 60) {
        return "ease: " + chalk.yellow(value);
        }
        if(value >= 60 && value < 80) {
        return "ease: " + value;
        }
        if(value >= 80 && value < 90) {
        return "ease: " + chalk.blue(value);
        }
        if(value >= 90) {
        return "ease: " + chalk.green(value);
        }
    }

    if(metric=="ari") {
        if(value < 4) {
        return "ari: " + chalk.green(value);
        }
        if(value >= 4 && value < 8) {
        return "ari: " + chalk.blue(value);
        }
        if(value >= 8 && value < 10) {
        return "ari: " + value;
        }
        if(value >= 10 && value < 12) {
        return "ari: " + chalk.yellow(value);
        }
        if(value >= 12) {
        return "ari: " + chalk.red(value);
        }
    }


    if(metric=="dale") {
        if(value < 5) {
        return "dale: " + chalk.green(value);
        }
        if(value >= 5 && value < 7) {
        return "dale: " + chalk.blue(value);
        }
        if(value >= 7 && value < 8) {
        return "dale: " + value;
        }
        if(value >= 8 && value < 9) {
        return "dale: " + chalk.yellow(value);
        }
        if(value >= 9) {
        return "dale: " + chalk.red(value);
        }
    }


    if(metric=="smog") {
        if(value < 5) {
        return "smog: " + chalk.green(value);
        }
        if(value >= 5 && value < 7) {
        return "smog: " + chalk.blue(value);
        }
        if(value >= 7 && value < 8) {
        return "smog: " + value;
        }
        if(value >= 8 && value < 9) {
        return "smog: " + chalk.yellow(value);
        }
        if(value >= 9) {
        return "smog: " + chalk.red(value);
        }
    }

    return "[unknow-metric]";
}