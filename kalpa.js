#!/usr/bin/env node

const program = require("commander");
const yaml = require("yamljs");
const path = require("path");
const fs = require("fs");
const execa = require("execa");
const kalpa = require("./lib/kalpa");
const Package = require("./package.json");

const kalpaFile = "kalpa.json";

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

let kalpaConfig = {};


program
  .command("install [other-pkg...]")
  .description("install kalpa package")
  .alias("i")
  .action((opkgs) => {
    try {
      const result = execa.sync("npm", ["install", "-S", ...opkgs]);
      console.log(result.stdout);

      // Check if the file exists in the current directory.
      try {
        fs.accessSync(kalpaFile, fs.constants.F_OK);
        kalpaConfig = JSON.parse(fs.readFileSync("kalpa.json", "utf8"));
        console.log(kalpaConfig);
      } catch (err) {}

      if (kalpaConfig.kalpa_modules === undefined) {
        kalpaConfig.kalpa_modules = [...opkgs];
      } else {
        kalpaConfig.kalpa_modules = [...opkgs, ...kalpaConfig.kalpa_modules];
      }
      const res = fs.writeFileSync(kalpaFile, JSON.stringify(kalpaConfig));
    } catch (err) {
      console.log(err.stderr);
    }
  });

program
  .command("list")
  .description("List installed kalpa modules")
  .alias("i")
  .action((name) => {
    fs.access(kalpaFile, fs.constants.F_OK, (err) => {
      // console.log(`${kalpaFile} ${err ? 'does not exist' : 'exists'}`);
      if (!err) {
        kalpaConfig = JSON.parse(fs.readFileSync("kalpa.json", "utf8"));
      }

      console.log(kalpaConfig.kalpa_modules);
    });
  });

program.parse(process.argv);
