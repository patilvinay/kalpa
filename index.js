
YAML = require('yamljs');
const fs = require('fs');
let ejs = require('ejs');

nativeObject = YAML.load('entity.yaml');

let job = YAML.load('schema.yaml').job;
console.log("Total jobs %s",job.length)
for(i=0;i<job.length;i++){
    //nsole.log("looping %d",i)
     nativeObject = YAML.load(job[i].input);
     //console.dir(nativeObject, {depth:8, colors: true})
     var str = fs.readFileSync(job[i].template,{encoding:'utf8', flag:'r'}); 
     str= ejs.render(str, {entity:nativeObject.entity}, null);
     console.log(str)
     fs.writeFileSync(job[i].output, str);
    
}


// console.dir(nativeObject, {depth:8, colors: true})
// var str = fs.readFileSync('model-template.ejs.js',{encoding:'utf8', flag:'r'}); 
// str= ejs.render(str, {entity:nativeObject.entity}, null);
// console.log(str)
// fs.writeFileSync('model.js', str);


