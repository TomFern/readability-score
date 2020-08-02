# readability-score

CLI utility for analyzing plain text files and urls with [text-readability](https://www.npmjs.com/package/text-readability).

Prints several readability metrics and optionally saves them in a file for future reference.

The package installs two command line tools:
- **readability-score**: reads plain text files and urls.
- **readability-links**: extracts urls from a Markdown file and analyzes them.

Usage:

```bash
$ readability-score -h
Usage: readability-score [-f FILE.txt] [-u "URL"] [-o FILE.json]

Options:
  -f, --read-file   Read a file
  -u, --read-url    Read a URL
  -o, --save-score  Write scores to JSON file [optional]
  -c, --show-card   Print reference card [optional]
  -h, --help        Show help  [boolean]

Examples:
  Analyze files:  readability-score -f myfile1.txt -f myfile2.txt -o score.json
  Analyze URLs:   readability-score -u http://foo.com -u http://bar.com -o score.json
```

```bash
$ readability-links -h
Usage: readability-links [-f FILE.md] [-o FILE.json]

Options:
  -f, --read-file   Read Markdown file  [required]
  -o, --save-score  Write scores, skips urls next time [optional]
  -c, --show-card   Print reference card [optional]
  -h, --help        Show help  [boolean]

Examples:
  Analyze links in file:                   readability-links -f mylinks.md
  Save the scores, skip urls on next run:  readability-links -f mylinks.md -o score.json
```

## Installing it

```bash
$ npm install -g @tomfern/readability-score
```

## Building it

```bash
$ cd src
$ npm install
$ npm test
$ npm install -g
```
