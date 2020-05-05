"use strict"
let keywords = require("../../lib/keywords/index.js")
const {Subject} = require('rxjs');
const Spinnies= require("spinnies")


const processNode = (obj) =>{
    let items=Object.keys(obj)
        for (var i in items){ 
            switch(items[i]){
              case 'play':
                      processSeries()
                 break;
                      processplay()
              case 'series':
            }
}
}

const defined=(val)=> val !== undefined
const processRoot =(obj) =>{
    for (var i in obj){ 
        processNode(obj[i])
    }


}
const processPreplay =(obj)=>{
    console.log("process preplay")
}
async function process(obj) {
    console.log("kalpa")
    if (defined(obj.kalpa))
       processRoot(obj.kalpa)
    else{
        processPreplay(obj)
    }
  
}

exports.process=process;









