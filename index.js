YAML = require('yamljs');
const fs = require('./lib/fs');
const _fs = require('fs');
let ejs = require('ejs');
const path = require('path')
const scaffold = require("./lib/scaffold/scaffold.js")
let projects = YAML.load('tasks.yml').project;

for (let index = 0; index < projects.length; index++) {


    //******************************Creates Project directory ******************************************** */ 
    let prj = projects[index]
    fs.mkDirByPathSync(prj.name)
    let jobs = prj.jobs;
    console.log("Total jobs %s", jobs.length)
    for (i = 0; i < jobs.length; i++) {
       let job = jobs[i]
       console.log(job.name)
       scaffold.create(job)
    }


    // console.dir(nativeObject, {depth:8, colors: true})
    // var str = fs.readFileSync('model-template.ejs.js',{encoding:'utf8', flag:'r'}); 
    // str= ejs.render(str, {entity:nativeObject.entity}, null);
    // console.log(str)
    // fs.writeFileSync('model.js', str);
}