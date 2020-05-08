#!/usr/bin/env node
const commander = require('commander');
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
    let playbook={}
    let globalData={}
    playbook.__data={};
    globalData.playbookDir=path.resolve('.')
    globalData.playbookFile= cmd
    try{
      globalData.playbookFileWitAbsolutePath = path.join(globalData.playbookDir, cmd);
      playbook.rootData = yaml.load(globalData.playbookFileWitAbsolutePath);
    }catch(err){
      kalpa.logger.error("Error loading file %s",globalData.playbookFile)
      kalpa.logger.error(err.code)
      return 1;

    }
    //nsole.log(kalpa)

    kalpa.process(playbook,globalData);

  })
  .parse(process.argv);
