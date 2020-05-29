const YAML= require('yamljs')
const load =(file)=>{
    let result ={};
    try{
    let obj = YAML.load(file);
    result.code ='SUCESS'
    result.obj=obj;
 }
    catch (err){
        result.code= err.code
        result.msg= "yaml load failed"
    }
return result;

}
exports.load=load