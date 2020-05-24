#!/usr/bin/env node

const program = require("commander");
const yaml = require("yamljs");
const path = require("path");
const fs = require("fs");
const execa = require("execa");
const kalpa = require("./lib/kalpa");
const Package = require("./package.json");

let kalpaConfigFile = "kalpa.json";
kalpaConfigFile = path.join(__dirname, kalpaConfigFile);
let kalpaConfig = {};

program.arguments("<filename>").action(function (cmd, env) {
  const cwd = path.resolve(".");
  const playbookFileWitAbsolutePath = path.join(cwd, cmd);
  return kalpa.processFile(playbookFileWitAbsolutePath);
});

program.version(Package.version);


program
  .command("play <playBook>")
  .description("Play-book yaml")
  .alias("p")
  .action((name) => {
    console.log("inside command run");
  });


program
  .command("install [other-pkg...]")
  .description("install kalpa package")
  .alias("i")
  .action((opkgs) => {
    try {
      let result = execa.sync("npm", ["install", "-S", ...opkgs, "--only=prod"]);
      result = execa.sync("npm", ["install", "--only=prod"]);

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
  .action((name) => {
    fs.access(kalpaConfigFile, fs.constants.F_OK, (err) => {
      if (!err) {
        kalpaConfig = JSON.parse(fs.readFileSync(kalpaConfigFile, "utf8"));
      }
    });
  });

program.parse(process.argv);
