YAML = require('yamljs');
const fs = require('./lib/fs');
const _fs = require('fs');
let ejs = require('ejs');
const path = require('path')
const scaffold = require("./lib/scaffold/scaffold.js")
yaml= require('./lib/yaml/yaml')
const chalk = require('chalk');

//let playbook = YAML.load('examples/file.yml');
let ret =yaml.load('examples/file1.yml')
console.log(ret.code)
let playbook=ret.obj

if(playbook !=undefined)
{
for (let index = 0; index < playbook.length; index++) {


    //******************************Creates Project directory ******************************************** */ 
    let chapter = playbook[index]
    let jobs = chapter.jobs;
    console.log("Playing chapter %s", chapter.name)
    
    // for (i = 0; i < jobs.length; i++) {
    //    let job = jobs[i]
    //    console.log(chalk.blue("**************-- Executing Job:["+ job.name +"] --**************"));
    //    var ret=scaffold.process(job)
    //    console.log (chalk.red(ret))
    // }


    // console.dir(nativeObject, {depth:8, colors: true})
    // var str = fs.readFileSync('model-template.ejs.js',{encoding:'utf8', flag:'r'}); 
    // str= ejs.render(str, {entity:nativeObject.entity}, null);
    // console.log(str)
    // fs.writeFileSync('model.js', str);
}
}