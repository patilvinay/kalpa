"use strict"
let keywords = require("../../lib/keywords/index.js")
const {Subject} = require('rxjs');
const yaml= require("yamljs")
const path = require ('path')
const Spinnies= require("spinnies")


const processPlayBlock=(obj,globalData)=>{
}


const processEachSeries= (obj,globalData)=>{
}

const processSeries=(obj,globalData)=>{
   
    for(let i in obj)
    {
        getSeriesDetails(obj[i],globalData) 
        processEachSeries(obj[i],globalData)
    }
}

const getSeriesDetails=(obj,globalData)=>{
    let file = path.join(globalData.playbookDir, obj,'main.yml'); 
    let seriesData=yaml.load(file)
}
const processSeriesBlock=(obj,globalData)=>{
    let items=Object.keys(obj)
    for (var i in items){
    switch(items[i]){
        case 'name':
              console.log(obj.name)
         break;
        case 'series':
            processSeries(obj.series,globalData)
         break;     
      }
        }
    } 




const processBlock = (obj,globalData) =>{
    let items=Object.keys(obj)
        for (var i in items){ 
            switch(items[i]){
              case 'series':
                    processSeriesBlock(obj,globalData)
               break;
              case 'play':
                    processPlayBlock(obj,globalData)
               break;     
            }
        }
}

const defined=(val)=> val !== undefined
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

    //    obj.RootData.__data= { ... rootBlock.__data };
    //let globalData={}
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
