yaml= require('yamljs')
const load =(file)=>{
    var result ={};
    try{
    var obj = YAML.load(file);
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