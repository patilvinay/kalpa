const fs = require('fs')
const lfs = require('../fs')
let ejs = require('ejs');
const path = require('path')

const create = (job) => {
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

exports.create = create;
exports.name= "scaffold"