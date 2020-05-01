  
// const commander = require('commander'); // (normal include)
const commander = require('commander'); // include commander in git clone of commander repo
const program = new commander.Command();
function commaSeparatedList(value, dummyPrevious) {
    return value.split(',');
  }

program
  .arguments('<cmd>')
  .option('-f, --file <type>', 'Add the specified type of cheese', 'blue')
  .option('-s, --set <type>', 'Add the specified type of cheese',  commaSeparatedList)
  .action(function (cmd, env) {
    cmdValue = cmd;
    envValue = env;
    console.log(cmd)
    console.log(program.set);
  })
  .parse(process.argv);
if (program.file === undefined) console.log('no file');
