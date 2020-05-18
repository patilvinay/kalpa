/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const yaml = require("yamljs");
const path = require("path");
const {
  logger,
  signale,
  tracer
} = require("../../lib/logger.js");

const jsonfile = require("jsonfile");

const log = signale.scope("kalpa");
const _ = require("lodash");
const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const nunjucks = require("nunjucks");
const check = require("yaml-syntax");

const find = require("../../lib/find-module.js");

const kalpaFile = path.join(__dirname, "../../kalpa.json");

try {
  configObj = jsonfile.readFileSync(kalpaFile);
} catch (err) {
  log.error("[ Fail ] Error loading kalpa config file");
  log.error(`${err}`);
}

//* ************************************************************************************** */
const processChapter = (chapter) => {
  const items = Object.keys(chapter.node);
  const module = find.findModule(items);
  try {
    chapter.module = require(module[0].toString());
    log.start("Start of %s", chapter.node.name);
    chapter.module.process(chapter);
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
// const processPlayBlock = (obj, globalData) => {
//   for (const i in obj.play) {
//     processChapter(obj.play[i], globalData);
//     // loggr.info("\t[ Sucess ]");
//   }
// };
//* ************************************************************************************** */
// const processEachSeries = (obj, globalData) => {
//   const Obj = {};
//   Obj.rootData = obj;
//   // eslint-disable-next-line no-use-before-define
//   process(Obj, globalData);
// };
//* ************************************************************************************** */
// const loadPlaybook = (obj, globalData) => {
//   const loggr = globalData.logger;
//   const file = path.join(globalData.playbookDir, obj, "main.yml");
//   // varsFileLoad()
//   try {
//     return yaml.load(file);
//   } catch (err) {
//     loggr.error("Error loading file %s", file);
//     loggr.error(err.code);
//   }
// };
//* ************************************************************************************** */
const processSeries = (obj, globalData) => {
  for (const i in obj) {
    const playbookData = loadPlaybook(obj[i], globalData);
    processEachSeries(playbookData, globalData);
  }
};
//* ************************************************************************************** */
// const processSeriesBlock = (obj, globalData) => {
//   const items = Object.keys(obj);
//   for (const i in items) {
//     switch (items[i]) {
//       case "name":
//         break;
//       case "series":
//         processSeries(obj.series, globalData);
//         break;
//       default:
//         break;
//     }
//   }
// };

// const loadVarFile = (obj, globalData) => {
//   //  console.log(obj["vars-file"]);
// };
//* ************************************************************************************** */
// const processBlock = (obj, globalData) => {
//   //tracer.info(obj)
//   const items = Object.keys(obj);

//   // for (const i in items) {
//   //   switch (items[i]) {
//   //     case "series":
//   //       processSeriesBlock(obj, globalData);
//   //       break;
//   //     case "play":
//   //       processPlayBlock(obj, globalData);
//   //       break;
//   //     case "vars-file":
//   //       loadVarFile(obj, globalData);
//   //       break;
//   //     default:
//   //       break;
//   //   }
//   // }
// };
//* ************************************************************************************** */
const processKalpaRoot = (obj, globalData) => {
  // tracer.info("Processing Kalpa Node");
  //tracer.debug(obj);

  let seriesNode = _.get(obj, ["series"]);
  //tracer.debug(seriesNode)

  let playRoot = _.get(obj, ["play"]);
  for (let i in playRoot) {
    let chapter = {};
    chapter.node = playRoot[i];
    chapter.externVars = obj.vars;
    chapter.externImport = obj.import;
    processChapter(chapter);
  }

  // for (const i in obj) {
  //   processBlock(obj[i], globalData);
  //   //  tracer.log(obj[i])
  // }
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
  console.log(obj);
  //  playbook.rootData = YAML.load(globalData.playbookFileWitAbsolutePath);
}

const renderVars = (rootData) => {
  const Var = rootData.vars;
  const _import = rootData.import;
  rootDataStr = JSON.stringify(rootData);
  let str1 = JSON.stringify(rootData);
  str1 = str1.replace(/"{{/g, "{{");
  str1 = str1.replace(/}}"/g, "}}");

  const str = nunjucks.renderString(str1, {
    vars: Var,
    imported: _import,
  });

  const vars = str.replace(/&quot;/g, '"');
  return JSON.parse(vars);
};

const renderVarsMultiPass = (rootData) => {
  let VarNew = rootData;
  let Var = {};

  for (let i = 1; i <= 10; i++) {
    if (_.isEqual(Var, VarNew)) {
      break;
    } else {
      Var = VarNew;
      VarNew = renderVars(Var);
    }
  }
  return VarNew;
};

const renderVarsFiles = (rootData) => {
  let Var = _.get(rootData, "import");
  const items = Var != undefined ? Object.keys(Var) : null;
  let varFileVar = {};
  for (const i in items) {
    const _var = _.get(Var, items[i]);
    const fullFileName = path.join(_var.directory, _var.file);
    varFileVar = renderSourceFile(fullFileName);
    let _Var = _.get(varFileVar, "kalpa." + _var.ref);
    Var[items[i]] = {};
    Var[items[i]] = _Var;
  }
  return Var;
};

const renderSourceFile = (file) => {
  const src = fs.readFileSync(file);
  const err = check(src, file);
  if (err) {
    console.log(err);
  }
  const obj = yaml.load(file);
  let rootNode = _.get(obj, ["kalpa"]);

  const Var_file = renderVarsFiles(rootNode);
  const Var = renderVarsMultiPass(rootNode);
  rootNode = {};
  rootNode.kalpa = {
    ...Var,
  };
  return rootNode;
};

const processFile = (file) => {
  const rootNode = renderSourceFile(file);

  // let preplayNode = _.get(rootNode, ["preplay"]);
  // console.log(preplayNode)
  // rootNode.preplay.__data = {
  //   ...rootNode.__data
  // };
  // console.log(JSON.stringify(obj))
  // //  processPreplay(obj.rootData.preplay, globalData);
  let kalpaNode = _.get(rootNode, ["kalpa"]);
  kalpaNode.__data = {
    ...kalpaNode.__data,
  };
  processKalpaRoot(kalpaNode, null);
  // console.log(JSON.stringify(obj))

  const rootNodeStr = YAML.stringify(rootNode);
  fs.writeFileSync("output.yaml", rootNodeStr);
};

exports.process = process;
exports.processFile = processFile;
exports.logger = logger;
