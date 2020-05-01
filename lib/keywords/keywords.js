import * as _ from "lodash";

const knownKeywords =["name","when","register","print"]
const unknown= (arr) =>{

    var knownKeywords = new Set();
    for(var key in  arr) {
        var value = item[key];
        knownKeywords.add(value);
    }
    diff= _.difference(array, knownKeywords)
    console.log(diff)
    
}
exports.unknown=unknown;