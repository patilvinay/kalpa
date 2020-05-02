const fs = require('fs')
const lfs = require('../file/file')
let ejs = require('ejs');
const path = require('path')

const process = (job) => {
     const scaffold=job.scaffold
     const src= scaffold.src;
     const dst= scaffold.dest;
     const template= scaffold.template;
     const dir= scaffold.dir;
   
     var str = fs.readFileSync(template, {
                  encoding: 'utf8',
                  flag: 'r'});
  
             obj = YAML.load(src);
  
             str = ejs.render(str, {
                  obj: obj
              }, null);
  
              writePath = path.join(dir,dst);
              lfs.writeFileSync(writePath, str);
  
  }

const create = (job) => {
     _path= path.dirname('/foo/bar/baz/asdf/quux');
     file.action='mkdir'
     file.path=_path
     lfs.process(file)



}

exports.process = process;
exports.name= "scaffold"