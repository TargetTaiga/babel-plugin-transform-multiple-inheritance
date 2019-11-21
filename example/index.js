const fs = require('fs');
const babel = require('@babel/core');

fs.writeFileSync('./output.js',
    babel.transform(fs.readFileSync('./input.js'), { plugins: ['transform-multiple-inheritance'] }).code);