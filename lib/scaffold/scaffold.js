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

            console.log(str);
            writePath = path.join(dir,dst);
            console.log("writing in %s", writePath);
            lfs.writeFileSync(writePath, str);

}

exports.create = create;