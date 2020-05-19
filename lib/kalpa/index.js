/* eslint-disable no-plusplus */
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
const jsonfile = require("jsonfile");
const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const nunjucks = require("nunjucks");
const _ = require("lodash");
const check = require("yaml-syntax");
const find = require("../../lib/find-module.js");
const { logger, signale, tracer } = require("../../lib/logger.js");

const kalpaFile = path.join(__dirname, "../../kalpa.json");
const log = signale.scope("kalpa");

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

const processSeries = (series) => {
  const _extern = {};
  _extern.vars = series.vars;
  _extern.import = series.import;
  const cwd = path.resolve(".");
  const fileName = path.join(cwd, series.node, "main.yml");
  processFile(fileName, _extern);
};
//* ************************************************************************************** */
const processKalpaRoot = (obj) => {
  const __data = obj.__data !== undefined ? obj.__data : {};
  const seriesNode = _.get(obj, ["series"]);
  for (const i in seriesNode) {
    const series = {};
    series.node = seriesNode[i];
    series.externvars = __data !== undefined ? __data.vars : undefined;
    series.externimport = __data !== undefined ? __data.import : undefined;
    series.__data = obj.__data;
    series.vars = obj.vars;
    series.import = obj.import;
    processSeries(series);
  }

  const playRoot = _.get(obj, ["play"]);
  for (const i in playRoot) {
    const chapter = {};
    chapter.node = playRoot[i];
    chapter.externvars = __data !== undefined ? __data.vars : undefined;
    chapter.externimport = __data !== undefined ? __data.import : undefined;
    chapter.vars = obj.vars;
    chapter.imports = obj.import;
    chapter.__data = obj.__data;
    processChapter(chapter);
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

const renderVars = (rootData) => {
  if (rootData === undefined) {
    return rootData;
  }
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
  const Var = _.get(rootData, "import");
  const items = Var != undefined ? Object.keys(Var) : null;
  let varFileVar = {};
  for (const i in items) {
    const _var = _.get(Var, items[i]);
    let fullFileName = path.join(_var.directory);
    fullFileName = path.isAbsolute(fullFileName)
      ? fullFileName
      : path.join(rootData.__data.cwd, _var.directory, _var.file);
    varFileVar = renderSourceFile(fullFileName);
    const _Var = _.get(varFileVar, `kalpa.${_var.ref}`);
    Var[items[i]] = {};
    Var[items[i]] = _Var;
  }
  return Var;
};

const renderSourceFile = (file, __data) => {
  const src = fs.readFileSync(file);
  const err = check(src, file);
  if (err) {
    console.log(err);
  }
  const obj = yaml.load(file);
  let rootNode = _.get(obj, ["kalpa"]);
  rootNode.__data = __data === undefined ? {} : __data;
  if (path.isAbsolute(file)) {
    rootNode.__data.cwd = path.dirname(file);
  } else {
    rootNode.__data.cwd = path.resolve(".");
  }

  const bwd = path.resolve(".");
  const relPath = path.relative(bwd, file);
  log.info("Processing import file %s ==>[Start]", relPath);

  const __import = renderVarsFiles(rootNode);
  const Var = renderVarsMultiPass(rootNode);
  log.info("Processing import file %s ==>[Sucess]", relPath);
  const renderedRootNode = {};
  renderedRootNode.kalpa = {
    ...Var,
    ...rootNode.__data,
  };
  return renderedRootNode;
};

const processFile = (file, __data) => {
  const rootNode = renderSourceFile(file, __data);
  const bwd = path.resolve(".");
  const relPath = path.relative(bwd, file);
  log.info("Processing file %s ==>[Start]", relPath);
  const kalpaNode = _.get(rootNode, ["kalpa"]);
  processKalpaRoot(kalpaNode);
  log.info("Processing file %s ==>[Sucess]", relPath);
  const rootNodeStr = YAML.stringify(rootNode);
  const dir = path.dirname(file);
  const filename = path.basename(file);
  const str2 = ".";
  const outfilename = str2.concat(filename);
  const outfile = path.join(dir, outfilename);
  log.info("creating source rendered dump %s", outfile);
  fs.writeFileSync(outfile, rootNodeStr);
};

exports.processFile = processFile;
exports.logger = logger;
