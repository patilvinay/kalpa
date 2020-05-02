YAML = require('yamljs');
const fs = require('./lib/fs');
const _fs = require('fs');
let ejs = require('ejs');
const path = require('path')
const kfile=require("kalpa-file")
const scaffold = require("./lib/scaffold/scaffold.js")
yaml= require('./lib/yaml/yaml')
const chalk = require('chalk');

//let playbook = YAML.load('examples/file.yml');
let ret =yaml.load('examples/file.yml')
console.log(ret.code)
let playbook=ret.obj

if(playbook !=undefined)
{
for (let index = 0; index < playbook.length; index++) {


    //******************************Creates Project directory ******************************************** */ 
    let chapter = playbook[index]
    let jobs = chapter.jobs;
    console.log("Playing chapter %s", chapter.name)
   

}
}