fs=require('fs')

const mkdir =(obj) =>{
    path=obj.path;
    var result;
    try {
        fs.mkdirSync(path, { recursive: true })
        result.code= 'SUCCESS'
      }
      catch (err){
           result.code=err.code  
      }

    obj.result=result;
    return obj
}

const process = (obj)=>
{



    switch(obj.action) {
        case 'mkdir':
            mkdir(obj)
          break;
        case y:
          // code block
          break;
        default:
          // code block
      }


}

exports.process =process;