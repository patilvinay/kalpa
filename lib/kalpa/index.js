"use strict"
let keywords = require("../../lib/keywords/index.js")
const {Subject} = require('rxjs');
const Spinnies= require("spinnies")
//let listr=[{}]
const series =(item)=>{
    
    //console.log("...")
    item.subject.next(10);
    
    if(item.str=="taskA")
    {
        item.subject.error(new Error("TaskB failed"));
    }
    item.subject.complete();
};

const listner= async (obj)=>{
    const tasks = new listr([
        {
            title: obj.str,
            task: (observer) =>obj.subject
        } 
    ]);
    tasks.run(obj.subject).then(()=>{
    }).catch(()=>{
    })
}

const execa = require('execa');

const exec = async (cmd) => {
	const {stdout} = await execa('wget', ['https://github.com/digitalocean/doctl/releases/download/v1.43.0/doctl-1.43.0-linux-amd64.tar.gz']);
	console.log(stdout);
	//=> 'unicorns'
};



async function process(obj) {
    
    let main={}
    main.str=obj[0].name
    main.subject= new Subject()
const spinnies = new Spinnies();
spinnies.add('spinner-1', { text: 'Downloading file' });


for( let i=0; i < obj[0].series.length; i++){
    let task= {};
    task.str=obj[0].series[i]
    task.subject = new Subject()
}
exec().then(()=>{
    spinnies.succeed('spinner-1', { text: 'Downloading sucess' });
 }).catch(()=>{
    spinnies.fail('spinner-1', { text: 'Downloading failed' });
})
}

exports.process=process;









