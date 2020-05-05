#!/usr/bin/env node 
const commander = require('commander'); // include commander in git clone of commander repo
const yaml= require("yamljs");
const path = require ('path')
const kalpa = require("kalpa")
const program = new commander.Command();
function commaSeparatedList(value, dummyPrevious) {
    return value.split(',');
  }

program
  .arguments('<filename>')
  .option('-s, --set <type>', 'Set the variable value here, this has highest priority over everything',  commaSeparatedList)
  .action(function (cmd, env) {
    cmdValue = cmd;
    envValue = env;
    //console.log(cmd)
    //nsole.log(program.set);
    let playbook={}
    let globalData={}
    playbook.__data={};
    globalData.playbookDir=path.resolve('.')
    globalData.playbookFile= cmd
    globalData.playbookFileWitAbsolutePath = path.join(globalData.playbookDir, cmd); 
    //nsole.log(playbook.__data.playbookFileWitAbsolutePath)
    playbook.rootData = yaml.load(globalData.playbookFileWitAbsolutePath);
    
    //console.log(playbook.__data.playbookdir)
    kalpa.process(playbook,globalData);

  })
  .parse(process.argv);
