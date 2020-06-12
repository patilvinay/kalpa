// #TBD not being used consider deprecating it
 //_ = require("lodash");
const reservedKeywords = ["name","when","register","print","loop","main","series","play"]
const roolModules=["series","play"]

// const unknown= (arr) =>{

//     var knownKeywords = new Set();
//     for(var key in  arr) {
//         var value = item[key];
//         knownKeywords.add(value);
//     }
//     diff= _.difference(array, knownKeywords)
//     console.log(diff)
    
// }
 const reserved = ()=>{
    var result = {};
    result.code= 'SUCESS';
    result.obj= reservedKeywords;
    
    return result
}

exports.reserved=reserved;
// exports.known=known;