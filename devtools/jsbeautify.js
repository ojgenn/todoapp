#!/usr/bin/node

const beautifyJs = require('js-beautify').js_beautify;
const beautifyHtml = require('js-beautify').html_beautify;
const beautifyCss = require('js-beautify').css_beautify;

const helpers = require('./helpers');
const glob = require('glob');
const fs = require('fs');
const Promise = require('promise');
const argv = require('minimist')(process.argv.slice(2));

// run jsbeautify on ... or not
const runCss = false;
const runJson = true;
const jsbeautifyrc = JSON.parse(fs.readFileSync(helpers.root('.jsbeautifyrc'), 'utf8'));

let work = [];
let optionsDefault = {
    'indent_size': 4,
    'indent_char': ' ',
    'indent_level': 0,
    'indent_with_tabs': false,
    'eol': '\n',
    'preserve_newlines': true,
    'max_preserve_newlines': 10,
    'space_in_paren': false,
    'space_in_empty_paren': false,
    'jslint_happy': true,
    'space_after_anon_function': false,
    'brace_style': 'collapse',
    'unindent_chained_methods': false,
    'keep_array_indentation': false,
    'keep_function_indentation': false,
    'space_before_conditional': true,
    'break_chained_methods': false,
    'eval_code': false,
    'unescape_strings': false,
    'wrap_line_length': 160,
    'end_with_newline': true,
    'e4x': false,
    'comma_first': false,
    'wrap_attributes': 'force-aligned',
    'operator_position': 'before-newline'
};


let isNeedToFix = false;

function pretty(file, engine, options) {
    let promise = new Promise(function (resolve) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            let pretty = engine(data, options);
            if (data.localeCompare(pretty) !== 0) {
                isNeedToFix = true;
                if (argv.fix) {
                    console.error(`\x1b[31mBeautified: ${file}.\x1b[0m`);
                    fs.writeFileSync(file, pretty);
                    isNeedToFix = false;
                } else {
                    console.error(`\x1b[31mNeeds to beautify: ${file}.\x1b[0m`);
                }
            } else {
                // console.log('Don't need to beautify: '' + file + ''.');
            }
            resolve();
        });
    });
    return promise;
}

function prettyHtml(file) {
    let options = Object.assign(optionsDefault, jsbeautifyrc.html);
    return pretty(file, beautifyHtml, options);
}

function prettyJs(file) {
    let options = Object.assign(optionsDefault, jsbeautifyrc.js);
    return pretty(file, beautifyJs, options);
}

function prettyCss(file) {
    let options = Object.assign(optionsDefault, jsbeautifyrc.css);
    return pretty(file, beautifyCss, options);
}

work.push(new Promise(function (resolve, reject) {
    glob('/src/**/*.html', {
        root: helpers.root(),
        ignore: '**/src/@@assets@@/lib/**/*.html'
    }, function (er, files) {
        if (files[0]) {
            Promise.all(files.map(prettyHtml)).then(function () {
                console.log('Beautifier html ended');
                resolve();
            });
        } else {
            console.log(er);
            reject(new Error('html'));
        }
    });
}));

if (runJson) {
    work.push(new Promise(function (resolve, reject) {
        glob('/{{src,developtools}/**/{,.}*.json,{,.}*.json}', {
            root: helpers.root(),
            ignore: '**/src/@@assets@@/**/*.json'
        }, function (er, files) {
            if (files[0]) {
                Promise.all(files.map(prettyJs)).then(function () {
                    console.log('Beautifier json ended');
                    resolve();
                });
            } else {
                console.log(er);
                reject(new Error('js'));
            }
        });
    }));
}

if (runCss) {
    work.push(new Promise(function (resolve, reject) {
        glob('/src/**/*.{css,less,scss}', {root: helpers.root()}, function (er, files) {
            if (files[0]) {
                Promise.all(files.map(prettyCss)).then(function () {
                    console.log('Beautifier css ended');
                    resolve();
                });
            } else {
                console.log(er);
                reject(new Error('css'));
            }
        });
    }));
}

Promise.all(work).then(function () {
    console.log('Beautifier task ended.');
    process.exit(isNeedToFix);
}, function (what) {
    console.log(`Error: ${what} files for beautify not found.`
    );
    process.exit(1);
});
