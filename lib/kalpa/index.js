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
const {
  logger,
  signale,
  tracer
} = require("../../lib/logger.js");

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
    let args = chapter.args;
    let vars= chapter.vars;
    let env=  chapter.env;
    const _if = eval(chapter.node.if)
    if(_if===undefined||_if===true){
        log.start("[ Running ] %s", chapter.node.name);
        chapter.module.process(chapter);
        log.success("[ Sucess ]");
    }
    else{
        log.info("[Skipping] %s", chapter.node.name);
    }
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

const assign = (obj) => (obj === undefined ? {} : obj);


//* ************************************************************************************** */
const processKalpaRoot = (rootNode) => {

  const obj = _.get(rootNode, ["kalpa"]);

  const __data = obj.__data !== undefined ? obj.__data : {};
  const seriesNode = _.get(obj, ["series"]);
  for (const i in seriesNode) {
    const series = {};
    series.node = seriesNode[i];
    series.externvars = __data !== undefined ? __data.vars : undefined;
    series.externvars = assign(__data).vars;
    series.externImport = assign(__data).import;
    series.externimport = __data !== undefined ? __data.import : undefined;
    series.__data = obj.__data;
    series.env = process.env
    series.vars = obj.vars;
    series.import = obj.import;
    series.args = obj.args;
    processSeries(series);
  }

  const playRoot = _.get(obj, ["play"]);
  for (const i in playRoot) {
    const chapter = {};
    chapter.node = playRoot[i];
    chapter.externvars = __data !== undefined ? __data.vars : undefined;
    chapter.externimport = __data !== undefined ? __data.import : undefined;
    chapter.vars = obj.vars;
    chapter.import = obj.import;
    chapter.__data = obj.__data;
    chapter.env = process.env
    chapter.args = obj.args
    processChapter(chapter);
  }
};

//* ************************************************************************************** */

const renderVars = (rootData) => {
  if (rootData === undefined) {
    return rootData;
  }
  const Var = rootData.vars;
  const _import = rootData.import;
  const {
    __data
  } = rootData;
  rootDataStr = JSON.stringify(rootData);
  let str1 = JSON.stringify(rootData);
  str1 = str1.replace(/"{{-/g, "{{");
  str1 = str1.replace(/-}}"/g, "}}");


  const str = nunjucks.renderString(str1, {
    vars: Var,
    imported: _import,
    __data,
    env: process.env,
    args: rootData.args
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
    fullFileName = path.isAbsolute(fullFileName) ?
      fullFileName :
      path.join(rootData.__data.cwd, _var.directory, _var.file);
    varFileVar = renderSourceFile(fullFileName);
    const _Var = _.get(varFileVar, `kalpa.${_var.ref}`);
    Var[items[i]] = {};
    Var[items[i]] = _Var;
  }
  return Var;
};

const getCWD = (file) => {
  if (path.isAbsolute(file)) {
    return path.dirname(file);
  }
  return path.resolve(".");
};

const getBWD = () => {
  return path.resolve(".");
};


const renderSourceFile = (file, __data, args) => {
  const src = fs.readFileSync(file);
  const err = check(src, file);
  if (err) {
    console.log(err);
  }
  const obj = yaml.load(file);
  const rootNode = _.get(obj, ["kalpa"]);
  rootNode.__data = assign(__data);
  rootNode.__data.cwd = getCWD(file);
  rootNode.__data.bwd = getBWD();
  rootNode.env = process.env
  rootNode.args = args
  const __import = renderVarsFiles(rootNode);
  const Var = renderVarsMultiPass(rootNode);
  const renderedRootNode = {};
  renderedRootNode.kalpa = {
    ...Var,
  };
  writeRenderedFile(renderedRootNode, file);
  return renderedRootNode;
};

const processFile = (file, __data, args) => {
  const rootNode = renderSourceFile(file, __data, args);
  processKalpaRoot(rootNode);
};

// eslint-disable-next-line no-unused-vars
const getFullPath = (baseDir, dir, file) => {
  let fullFileName = path.join(dir);
  fullFileName = path.isAbsolute(fullFileName) ?
    fullFileName :
    path.join(baseDir, dir, file);
};

// eslint-disable-next-line no-unused-vars
const getRelativePath = (file) => {
  const bwd = path.resolve(".");
  const relPath = path.relative(bwd, file);
  return relPath;
};
const writeRenderedFile = (rootNode, file) => {
  const rootNodeStr = YAML.stringify(rootNode);
  const dir = path.dirname(file);
  const filename = path.basename(file);
  const str2 = ".";
  const outfilename = str2.concat(filename);
  const outfile = path.join(dir, outfilename);
  // log.info("creating source rendered dump %s", outfile);
  fs.writeFileSync(outfile, rootNodeStr);
};
exports.processFile = processFile;
exports.logger = logger;
