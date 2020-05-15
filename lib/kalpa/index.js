/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const yaml = require("yamljs");
const path = require("path");
const {
  logger,
  signale
} = require("../../lib/logger.js");

const jsonfile = require('jsonfile')
const log = signale.scope("kalpa");
const _ = require("lodash")
const fs = require("fs")
const YAML = require('json-to-pretty-yaml');
const nunjucks = require('nunjucks')
const check = require('yaml-syntax')


const find = require("../../lib/find-module.js");
const kalpaFile = path.join(__dirname, "../../kalpa.json");


try {
  configObj = jsonfile.readFileSync(kalpaFile)
} catch (err) {
  log.error("[ Fail ] Error loading kalpa config file")
  log.error(`${err}`)
}


//* ************************************************************************************** */
const processChapter = (obj, globalData) => {
  const items = Object.keys(obj);
  const module = find.findModule(items);
  try {
    obj.module = require(module[0].toString());
    log.start("Start of %s", obj.name);
    obj.module.process(obj, globalData);
    log.success("[ Sucess ]");
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      log.error("[ Fail ] module not found");
      log.error("%s", err.message);
    } else {
      log.error("[ Fail ] %s", err);
    }
  }
};
//* ************************************************************************************** */
const processPlayBlock = (obj, globalData) => {
  for (const i in obj.play) {
    processChapter(obj.play[i], globalData);
    // loggr.info("\t[ Sucess ]");
  }
};
//* ************************************************************************************** */
const processEachSeries = (obj, globalData) => {
  const Obj = {};
  Obj.rootData = obj;
  // eslint-disable-next-line no-use-before-define
  process(Obj, globalData);
};
//* ************************************************************************************** */
const loadPlaybook = (obj, globalData) => {
  const loggr = globalData.logger;
  const file = path.join(globalData.playbookDir, obj, "main.yml");
  // varsFileLoad()
  try {
    return yaml.load(file);
  } catch (err) {
    loggr.error("Error loading file %s", file);
    loggr.error(err.code);
  }
};
//* ************************************************************************************** */
const processSeries = (obj, globalData) => {
  for (const i in obj) {
    const playbookData = loadPlaybook(obj[i], globalData);
    processEachSeries(playbookData, globalData);
  }
};
//* ************************************************************************************** */
const processSeriesBlock = (obj, globalData) => {
  const items = Object.keys(obj);
  for (const i in items) {
    switch (items[i]) {
      case "name":
        break;
      case "series":
        processSeries(obj.series, globalData);
        break;
      default:
        break;
    }
  }
};

const loadVarFile = (obj, globalData) => {
  //  console.log(obj["vars-file"]);
};
//* ************************************************************************************** */
const processBlock = (obj, globalData) => {
  const items = Object.keys(obj);
  for (const i in items) {
    switch (items[i]) {
      case "series":
        processSeriesBlock(obj, globalData);
        break;
      case "play":
        processPlayBlock(obj, globalData);
        break;
      case "vars-file":
        loadVarFile(obj, globalData);
        break;
      default:
        break;
    }
  }
};
//* ************************************************************************************** */
const processKalpaRoot = (obj, globalData) => {
  // console.log(obj)
  for (const i in obj) {
    processBlock(obj[i], globalData);
  }
};
//* ************************************************************************************** */
const processPreplay = (obj, globalData) => {
  const items = Object.keys(obj);
  for (const i in items) {
    switch (items[i]) {
      case "renderer":
        globalData.renderer = obj.renderer;
        // processRoot(obj.rootData.kalpa)
        break;
      default:
        break;
    }
  }
};
//* ************************************************************************************** */
async function process(obj, globalData) {
  globalData.logger = logger;
  let items = Object.keys(obj.rootData);

  for (const i in items) {
    switch (items[i]) {
      case "preplay":
        obj.rootData.preplay.__data = {
          ...obj.__data,
        };
        processPreplay(obj.rootData.preplay, globalData);
        break;
      default:
        break;
    }
  }

  items = Object.keys(obj.rootData);
  for (const i in items) {
    switch (items[i]) {
      case "kalpa":
        obj.rootData.kalpa.__data = {
          ...obj.__data,
        };
        processKalpaRoot(obj.rootData.kalpa, globalData);
        break;
      default:
        break;
    }
  }
}
//* ************************************************************************************** */

function _loadVarFile(obj) {
  console.log(obj)
  //  playbook.rootData = YAML.load(globalData.playbookFileWitAbsolutePath);
}

const renderVars = (rootData) => {
  let Var = (_.find(rootData, 'vars'));

  rootDataStr = JSON.stringify(rootData);
  let str1 = JSON.stringify(rootData);
  str1 = str1.replace(/"{{/g, '{{');
  str1 = str1.replace(/}}"/g, '}}');

  const str = nunjucks.renderString(str1, {
    vars: Var.vars
  });

  return str.replace(/&quot;/g, '"');
}

function processFile(file) {
  var src = fs.readFileSync(file);
  var err = check(src, file);
  if (err) {
    console.log(err);
  }
  let obj = yaml.load(file);

  let rootData = _.get(obj, ['kalpa']);
  Var = renderVars(rootData)
  const data = YAML.stringify(JSON.parse(Var));
  fs.writeFileSync("output.yaml", data);
}



exports.process = process;
exports.processFile = processFile;
exports.logger = logger;
