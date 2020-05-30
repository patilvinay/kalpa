#!/usr/bin/env node

const program = require("commander");
const path = require("path");
const fs = require("fs");
const execa = require("execa");
const kalpa = require("./lib/kalpa");
const Package = require("./package.json");

let kalpaConfigFile = "kalpa.json";
kalpaConfigFile = path.join(__dirname, kalpaConfigFile);
let kalpaConfig = {};

program.arguments("<filename>")
.description("kalpa <playbook.yml>")
.action(function (cmd) {
  const cwd = path.resolve(".");
  const playbookFileWitAbsolutePath = path.join(cwd, cmd);
  const ctx = prepareContext();
  return kalpa.processFile(playbookFileWitAbsolutePath, ctx, program.pargs);
});

const prepareContext = () => {
    let ctx = {};
    ctx.dump = program.dump ? true : false;
    ctx.debug = program.debug ? true : false;
    return ctx
}

function collect(value, previous) {
    return previous.concat([value]);
}

program.version(Package.version);
program
    .option('-a, --pargs <value>', 'Arguments to be passed to playbook', collect, [])
    .option('-d, --dump', 'Enable playbook rendered file dump')
    .option('-D, --debug', 'Enable playbook rendered file dump')

program
  .command("play <playBook>")
  .description("Play-book yaml")
  .alias("p")
  .action((cmd) => {
    console.log("Inside command run");
     const cwd = path.resolve(".");
     const playbookFileWitAbsolutePath = path.join(cwd, cmd);
     return kalpa.processFile(playbookFileWitAbsolutePath, undefined, program.pargs);
  });

program
  .command("install [other-pkg...]")
  .description("Install kalpa package")
  .alias("i")
  .action((opkgs) => {
    try {
      execa.sync("npm", ["install", "-S", ...opkgs, "--only=prod"], {
        cwd: __dirname
      });

      // Check if the file exists in the current directory.
      try {
        fs.accessSync(kalpaConfigFile, fs.constants.F_OK);
        kalpaConfig = JSON.parse(fs.readFileSync(kalpaConfigFile, "utf8"));
        console.log(kalpaConfig);
      } catch (err) {}

      if (kalpaConfig.kalpa_modules === undefined) {
        kalpaConfig.kalpa_modules = [...opkgs];
      } else {
        kalpaConfig.kalpa_modules = [...opkgs, ...kalpaConfig.kalpa_modules];
      }
      const res = fs.writeFileSync(kalpaConfigFile, JSON.stringify(kalpaConfig));
    } catch (err) {
      console.log(err.stderr);
    }
  });

program
  .command("list")
  .description("List installed kalpa modules")
  .alias("i")
  .action(() => {
    fs.access(kalpaConfigFile, fs.constants.F_OK, (err) => {
      if (!err) {
        kalpaConfig = JSON.parse(fs.readFileSync(kalpaConfigFile, "utf8"));
        console.log(kalpaConfig.kalpa_modules);
      }
    });
  });

program.parse(process.argv);
