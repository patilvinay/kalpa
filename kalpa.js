#!/usr/bin/env node 
const commander = require('commander'); // include commander in git clone of commander repo
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
    console.log(cmd)
    console.log(program.set);

    
  })
  .parse(process.argv);
