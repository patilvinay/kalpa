/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const yaml = require("yamljs");
const path = require("path");
const logger = require("../../lib/logger.js");
const find = require("../../lib/find-module.js");

//* ************************************************************************************** */
const processPlayBlock = (obj, globalData) => {
  const loggr = globalData.logger;
  for (const i in obj.play) {
    console.log("\n");
    loggr.info(`\t${obj.play[i].name}`);
    processChapter(obj.play[i], globalData);
    loggr.info("\t[ Sucess ]");
  }
};
//* ************************************************************************************** */
const processChapter = (obj, globalData) => {
  const loggr = globalData.logger;
  const items = Object.keys(obj);
  // console.log(items)
  // console.log(obj)
  const module = find.findModule(items);
  try {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-dynamic-require
    obj.module = require(module[0].toString());
    obj.module.process(obj, globalData);
  } catch (err) {
    if (err.code == "MODULE_NOT_FOUND") {
      loggr.error("Module %s not found", module[0]);
      loggr.error("USE: 'npm install %s' to install the module", module[0]);
    } else {
      loggr.error(err);
    }
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
const processSeries = (obj, globalData) => {
  for (const i in obj) {
    const playbookData = loadPlaybook(obj[i], globalData);
    processEachSeries(playbookData, globalData);
  }
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
const processSeriesBlock = (obj, globalData) => {
  const loggr = globalData.logger;
  const items = Object.keys(obj);
  for (const i in items) {
    switch (items[i]) {
      case "name":
        console.log(obj.name);
        loggr.info(obj.name);
        break;
      case "series":
        processSeries(obj.series, globalData);
        break;
      default:
        loggr.error("unknow block");
    }
  }
};

const loadVarFile = (obj, globalData) => {
  console.log(obj["vars-file"]);
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
    }
  }
};
//* ************************************************************************************** */
async function process(obj, globalData) {
  globalData.logger = logger;
  let items = Object.keys(obj.rootData);

  for (var i in items) {
    switch (items[i]) {
      case "preplay":
        obj.rootData.preplay.__data = { ...obj.__data };
        processPreplay(obj.rootData.preplay, globalData);
        break;
    }
  }

  items = Object.keys(obj.rootData);
  for (var i in items) {
    switch (items[i]) {
      case "kalpa":
        obj.rootData.kalpa.__data = { ...obj.__data };
        processKalpaRoot(obj.rootData.kalpa, globalData);
        break;
    }
  }
}
//* ************************************************************************************** */
exports.process = process;
exports.logger = logger;
