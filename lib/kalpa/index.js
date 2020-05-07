"use strict"
let keywords = require("../../lib/keywords/index.js")
var logger = require('../../lib/logger.js');  
let find = require("../../lib/find-module.js")
const {Subject} = require('rxjs');
const yaml= require("yamljs")
const path = require ('path')
const Spinnies= require("spinnies")

const defined=(val)=> val !== undefined

const processPlayBlock=(obj,globalData)=>{
    let loggr=globalData.logger
    for(let i in obj.play)
    {
        console.log('\n')
        loggr.info('\t'+obj.play[i].name);
        processChapter(obj.play[i],globalData)
        loggr.info("\t[ Sucess ]");

    }
}

const processChapter =(obj,globalData,logger)=>{
    
    let loggr=globalData.logger
    let items=Object.keys(obj)
    //console.log(items)
    let module=find.findModule(items)
    try{
        obj.module=require(module[0].toString())
        obj.module.process(obj,globalData)
       }
       catch(err){
           if(err.code=='MODULE_NOT_FOUND'){
                loggr.error("Module %s not found",module[0]);
                loggr.error("USE: \'npm install %s\' to install the module",module[0]);
           }

    }
}

const processEachSeries= (obj,globalData)=>{
    //console.log(obj)
    var Obj={}
    Obj.rootData=obj
    process(Obj,globalData)
}

const processSeries=(obj,globalData)=>{
    
    for(let i in obj)
    {
        let playbookData= loadPlaybook(obj[i],globalData) 
        processEachSeries(playbookData,globalData)
    }
}

const loadPlaybook=(obj,globalData)=>{
    let file = path.join(globalData.playbookDir, obj,'main.yml'); 
    //varsFileLoad()
    return yaml.load(file)
}
const processSeriesBlock=(obj,globalData)=>{
    let loggr=globalData.logger
    let items=Object.keys(obj)
    for (var i in items){
        switch(items[i]){
         case 'name':
                console.log(obj.name)
                loggr.info(obj.name);
         break;
        case 'series':
            processSeries(obj.series,globalData)
         break;     
      }
        }
    } 




const processBlock = (obj,globalData) =>{
    var loggr=globalData.logger;
    let items=Object.keys(obj)
    loggr.info(items)
        for (var i in items){ 
            switch(items[i]){
              case 'series':
                    processSeriesBlock(obj,globalData)
               break;
              case 'play':
                    processPlayBlock(obj,globalData)
               break;     
              case 'vars-file':
                    console.log(obj);
                    break
            }
        }
}

const processKalpaRoot =(obj,globalData) =>{
   // console.log(obj)
    for (var i in obj){ 
        processBlock(obj[i],globalData)
    }

}

const processPreplay =(obj,globalData)=>{
    let items=Object.keys(obj)
    for (var i in items){ 
        switch(items[i]){
            case 'renderer':
                globalData.renderer=obj.renderer
                //processRoot(obj.rootData.kalpa)
                break;
            }
        }
        
}

async function process(obj,globalData) {
    globalData.logger=logger;
    let items=Object.keys(obj.rootData)

        for (var i in items){ 
       
     switch(items[i]){
              case 'preplay':
                    obj.rootData.preplay.__data={ ... obj.__data }
                    processPreplay(obj.rootData.preplay,globalData)
               break;     
            }
        }


   items=Object.keys(obj.rootData)
        for (var i in items){ 
            switch(items[i]){
              case 'kalpa':
                    obj.rootData.kalpa.__data={ ... obj.__data }
                    processKalpaRoot(obj.rootData.kalpa,globalData)
               break;
             }
        }
  
}

exports.process=process;
