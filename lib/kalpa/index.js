"use strict"
let keywords = require("../../lib/keywords/index.js")
const process= (obj) =>{
   let result = keywords.reserved();
   console.log(result.obj)
    console.log("inside kalpa");
}

exports.process=process;


