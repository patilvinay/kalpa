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
  signale} = require("../../lib/logger.js");

const kalpaFile = path.join(__dirname, "../../kalpa.json");
const log = signale.scope("kalpa");

try {
  configObj = jsonfile.readFileSync(kalpaFile);
} catch (err) {
  log.error("[ Fail ] Error loading kalpa config file");
  log.error(`${err}`);
}

const stdoutCallback = (data) => {
    log.info(`\r[ stdout ] %s`, data);
}

const stderrCallback = (data) => {
    log.info(`\r[ stderr ] %s`, data);
}

const copyResultsToRootNode = (chapter, results) => {
    chapter.rootNode.results = (chapter.rootNode.results === undefined || chapter.rootNode.results === null) ? {}: chapter.rootNode.results
    chapter.rootNode.results[chapter.node.result] = results;
}

const copyRootNodeResultsToChapterResults = (chapter) => {
    chapter.results = (chapter.results === undefined || chapter.results === null) ? {}: chapter.results
    chapter.results = chapter.rootNode.results
}

//* ************************************************************************************** */
const processChapterIf = (chapter) => {
  const items = Object.keys(chapter.node);
  const module = find.findModule(items);
  
    copyRootNodeResultsToChapterResults(chapter);
    chapter = prepareTemplateForFinalRendering(chapter);
    printDebugs(chapter)
    
    /* eslint-disable no-eval */;
    let _if = eval(chapter.node.if)
    _if = (_if === undefined || _if === null || _if === true) ? true: false
    let _module = (module === undefined || module === null || module.length === 0) ? false : true
    if(_if) {
        if (_module) {
            log.start("[ Running ] ", chapter.node.name);
            chapter.module = require(module[0].toString())
            const _resultStream = ((chapter.node.resultStream === undefined) || (chapter.node.resultStream === null)) ? false: chapter.node.resultStream

            if (_resultStream === true) {
                chapter.ctx.stdoutCallback = stdoutCallback;
                chapter.ctx.stderrCallback = stderrCallback;
            }        
            const result = chapter.module.process(chapter);
            log.success("[ Sucess ]");
            return result
        }
    }
    else {
        log.info("[ Skipping ] %s", chapter.node.name);
    }
}

const processChapterLoop = (chapter) => {
    const loop = chapter.node.loop;
    const _result = (chapter.node.result === undefined || chapter.node.result === null) ? false: true
    if(loop.length === 0){
        let _chapter = {...chapter}
        _chapter = prepareTemplateForFinalRendering(_chapter);
        log.info("[Skipping] %s", _chapter.node.name);
    }
    else{
        for (let i = 0; i < loop.length; i++) {
            chapter.item = loop[i]
            let _chapter = {...chapter}
            let results = processChapterIf(_chapter);
            if (_result) {
                copyResultsToRootNode(_chapter, results)
            }
        }
    }
}

const printDebugs = (chapter) => {
    const debugMsgs = chapter.node.debug;
    const ctxdebug = (chapter.ctx.debug !== undefined && chapter.ctx.debug !== null) ? chapter.ctx.debug: false
    const debug = chapter.node.debug !== undefined && chapter.node.debug !== null && chapter.node.debug.length !== 0 ? true : false

    if (ctxdebug && debug) {
        for (let i = 0; i < debugMsgs.length; i++) {
            log.info("[ Debug ] ", debugMsgs[i])
        }
    }
}

//* ************************************************************************************** */
const processChapter = (chapter) => {
  try {
    const loop = chapter.node.loop;
    const _result = ((chapter.node.result === undefined) || (chapter.node.result === null)) ? false: true

    if ((loop === undefined) || (loop === null)) {
        let _chapter = {...chapter}
        let results = processChapterIf(_chapter);
        if (_result) {
            copyResultsToRootNode(_chapter, results)
        }
    } else {
        processChapterLoop(chapter)
    }
    return true
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      log.error("[ Fail ] module not found");
      log.error("%s", err.message);
    } else {
      log.error("[ Fail ] %s", err);
    }
    return false
  }
};

const processSeries = (series) => {
  const _extern = {};
  let fileName;
  _extern.vars = series.vars;
  _extern.import = series.import;
  const cwd = path.resolve(".");
  let isFilePresent = false;

  if (typeof series.node === 'object') {
    const _file = ((series.node.file === undefined) || (series.node.file === null) || (series.node.file.length === 0)) ? false: true
    const _dir = ((series.node.dir === undefined) || (series.node.dir === null) || (series.node.dir.length === 0)) ? false: true
    if ((true === _dir)) {
        if (true !== _file) {
            fileName = path.join(cwd, series.node.dir, "main.yml");
        } else {
            fileName = path.join(cwd, series.node.dir, series.node.file);
        }
        isFilePresent = true;
    } else {
        if (true === _file) {
          fileName = path.join(cwd, series.node.file);
        } else {
          log.error("[ Fail ] Invalid object inside series")
          isFilePresent = false;
        }
    }
  } else {
    const ext = path.extname(series.node)
    if (0 === ext.length) {
      fileName = path.join(cwd, series.node, "main.yml");
    } else {
      fileName = path.join(cwd, series.node);
    }
    isFilePresent = true;
  }
  if (true === isFilePresent) {
      processFile(fileName, series.ctx, series.args);
  }
};

const assign = (obj) => (obj === undefined ? {} : obj);


//* ************************************************************************************** */
const processKalpaRoot = (rootNode) => {
    
    const obj = _.get(rootNode, ["kalpa"]);

  const ctx = obj.ctx !== undefined ? obj.ctx : {};
  const seriesNode = _.get(obj, ["series"]);
  for (const i in seriesNode) {
    const series = {};
    series.node = seriesNode[i];
    series.externvars = ctx !== undefined ? ctx.vars : undefined;
    series.externvars = assign(ctx).vars;
    series.externImport = assign(ctx).import;
    series.externimport = ctx !== undefined ? ctx.import : undefined;
    series.ctx = obj.ctx;
    series.env = process.env
    series.vars = obj.vars;
    series.import = obj.import;
    series.args = obj.args;
    processSeries(series);
  }

  const playRoot = _.get(obj, ["play"]);
  for (const i in playRoot) {
    let chapter = {};
    chapter.node = playRoot[i];
    chapter.externvars = ctx !== undefined ? ctx.vars : undefined;
    chapter.externimport = ctx !== undefined ? ctx.import : undefined;
    chapter.vars = obj.globals.vars;
    chapter.import = obj.import;
    chapter.ctx = obj.ctx;
    chapter.env = process.env
    chapter.args = obj.args
    chapter.results = obj.results
    chapter.rootNode = rootNode;
    chapter.ctx.ignoreError = ((chapter.node.ignoreError === undefined) || (chapter.node.ignoreError === null)) ? true : chapter.node.ignoreError

    const result = processChapter(chapter);
    if ((true !== result) && (false === chapter.ctx.ignoreError)) {
        break;
    }
  }
};

//* ************************************************************************************** */

const renderTemplate = (template, data, mask, maskRevert) => {
    let str1 = JSON.stringify(template);
    let keys = Object.keys(mask);

    for (i = 0; i < keys.length; i++) {
        str1 = str1.replace(new RegExp(keys[i], 'g'), mask[keys[i]]);
    }

    str1 = prepareDumpObjectForRendering(str1)
    let renderedStr = nunjucks.renderString(str1, data);
    let vars = decodeRenderedString(renderedStr);
    
    if (maskRevert === true) {
        for (i = 0; i < keys.length; i++) {
            vars = vars.replace(new RegExp(mask[keys[i]], 'g'), keys[i]);
        }
    }
    
    return JSON.parse(vars);
};

const prepareTemplateForInitialRendering = (data) => {
    let mask = {
        "{{<": "{a{",
        ">}}": "}a}"
    }
    if (data === undefined) {
        return data;
    }
    const _import = data.import;
    const {
        ctx
    } = data;

    let global = {}
    global.vars = data.vars;
    let Vars = data.chapter ? data.chapter.vars: null
    let _data = {
        vars: Vars,
        imported: _import,
        ctx,
        env: process.env,
        global: global,
        args: data.args,
        results: data.results
    }
    const template = {...data};
    delete template.env;
    let result = renderTemplate(template, _data, mask, true);
    result.env = data.env;
    return result
};

const prepareTemplateForFinalRendering = (data) => {
    let mask = {
        "{{<": "{{",
        ">}}": "}}"
    }
    if (data === undefined) {
        return data;
    }
    const _import = data.import;
    const {
    ctx
    } = data;
    let global = {}
    global.vars = data.vars;
    let Vars = data.chapter ? data.chapter.vars: null
    let _data = {
        vars: Vars,
        imported: _import,
        ctx,
        env: process.env,
        global: global,
        args: data.args,
        results: data.results,
        item: data.item
    }
    let template = {...data};
    delete template.rootNode
    delete template.env;
    let result = renderTemplate(template, _data, mask, false);
    result.env = data.env;
    return result;
};

const renderGlobals = (rootData) => {
    let rootDataCopy = {
        ...rootData
    };
    delete rootDataCopy.play;
    const result = prepareTemplateForInitialRendering(rootDataCopy);
    return result;
}

const renderVars = (rootData) => {
  let renderedRootData = renderGlobals(rootData)
  renderedRootData.play = [];
  const playRoot = _.get(rootData, ["play"]);
  for (const i in playRoot) {
    let rootDataCopy = {
        ...renderedRootData
    };
    delete rootDataCopy.play;
    rootDataCopy.chapter = playRoot[i];

    renderedRootData.play[i] = prepareTemplateForInitialRendering(rootDataCopy).chapter
  }
  return renderedRootData
};

const decodeRenderedString = (str) => {
    let paramsPattern = /<\{<[^>]*/g;
    let extractParams = str.match(paramsPattern);

    if (extractParams !== null) {
        let tempFinalString = {...extractParams}
        for (let i = 0; i < extractParams.length; i++) {
          extractParams[i] = extractParams[i].concat('>}>');
          tempFinalString[i] = tempFinalString[i].concat('>}>');
          tempFinalString[i] = tempFinalString[i].replace(/<\{</g, '')
          tempFinalString[i] = tempFinalString[i].replace(/>\}>/g, '')
          tempFinalString[i] = tempFinalString[i].replace(/&quot;/g, '"')
          str = str.replace(extractParams[i], tempFinalString[i])
        }
    }
    paramsPattern = /<\*<[^>]*/g;
    extractParams = str.match(paramsPattern);
    if (extractParams !== null) {
        let tempFinalString = {...extractParams}
        for (let i = 0; i < extractParams.length; i++) {
          extractParams[i] = extractParams[i].concat('>*>');
          tempFinalString[i] = tempFinalString[i].concat('>*>');
          tempFinalString[i] = tempFinalString[i].replace(/<\*</g, '')
          tempFinalString[i] = tempFinalString[i].replace(/>\*>/g, '')
          tempFinalString[i] = tempFinalString[i].replace(/&quot;/g, '')
          str = str.replace(extractParams[i], tempFinalString[i])
        }
    }
    
    return str;
}

const prepareDumpObjectForRendering = (str) => { 
  const paramsPattern = /" *?\{{2}[\w| _\.]*\}{2} *?"/g;
  let extractParams = str.match(paramsPattern);

  if (extractParams !== null) {
      let tempFinalString = {...extractParams}
      for (let i = 0; i < extractParams.length; i++) {
        if (tempFinalString[i].includes('dump') === true) {
            tempFinalString[i] = tempFinalString[i].replace(/" *?\{{2}/g, '<{<{a{')
            tempFinalString[i] = tempFinalString[i].replace(/\}{2} *?"/g, '}a}>}>')
            str = str.replace(extractParams[i], tempFinalString[i])
        }
      }
  }
  const _paramsPattern = /\{{2}[\w| _\.]*\}{2}/g;
  let _extractParams = str.match(_paramsPattern);
  if (_extractParams !== null) {
      let tempFinalString = {..._extractParams}
      for (let i = 0; i < _extractParams.length; i++) {
        if (tempFinalString[i].includes('dump') === true) {
          tempFinalString[i] = tempFinalString[i].replace(/\{{2}/g, '<*<{b{')
          tempFinalString[i] = tempFinalString[i].replace(/\}{2}/g, '}b}>*>')
          str = str.replace(_extractParams[i], tempFinalString[i])
        }
      }
  }

  if (extractParams !== null) {
    let tempFinalString = {...extractParams}
    for (let i = 0; i < extractParams.length; i++) {
      if (tempFinalString[i].includes('dump') === true) {
        tempFinalString[i] = tempFinalString[i].replace(/" *?\{{2}/g, '<{<{a{')
        tempFinalString[i] = tempFinalString[i].replace(/\}{2} *?"/g, '}a}>}>')
        extractParams[i] = extractParams[i].replace(/" *?\{{2}/g, '<{<{{')
        extractParams[i] = extractParams[i].replace(/\}{2} *?"/g, '}}>}>')
        str = str.replace(tempFinalString[i], extractParams[i])
      }
    }
  }
  if (_extractParams !== null) {
    let tempFinalString = {..._extractParams}
    for (let i = 0; i < _extractParams.length; i++) {
      if (tempFinalString[i].includes('dump') === true) {
        tempFinalString[i] = tempFinalString[i].replace(/\{{2}/g, '<*<{b{')
        tempFinalString[i] = tempFinalString[i].replace(/\}{2}/g, '}b}>*>')
        _extractParams[i] = _extractParams[i].replace(/\{{2}/g, '<*<{{')
        _extractParams[i] = _extractParams[i].replace(/\}{2}/g, '}}>*>')
        str = str.replace(tempFinalString[i], _extractParams[i])
      }
    }
  }
  return str;
}

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

const renderImport = (rootData) => {
  const Var = _.get(rootData, "import");
  const items = (Var !== undefined) && (Var !== null) ? Object.keys(Var) : null;
  let varFileVar = {};
  for (const i in items) {
    const _var = _.get(Var, items[i]);
    let fullFileName = path.join(_var.directory);
    fullFileName = path.isAbsolute(fullFileName) ?
      fullFileName :
      path.join(rootData.ctx.cwd, _var.directory, _var.file);
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


const renderSourceFile = (file, ctx, args) => {
  const src = fs.readFileSync(file);
  const err = check(src, file);
  if (err) {
    log.fatal(err);
  }
  const obj = yaml.load(file);
  const rootNode = _.get(obj, ["kalpa"]);
  rootNode.ctx = assign(ctx);
  rootNode.ctx.cwd = getCWD(file);
  rootNode.ctx.bwd = getBWD();
  rootNode.env = process.env
  rootNode.env = process.env
  rootNode.globals = {};
  rootNode.globals.vars = rootNode.vars
//   delete rootNode.vars
  rootNode.args = (args===undefined||args===null||args.length===0) ? [] : args
  const __import = renderImport(rootNode);
  const Var = renderVarsMultiPass(rootNode);
  const renderedRootNode = {};
  renderedRootNode.kalpa = {
    ...Var,
    ...rootNode.ctx,
    ...rootNode.args
  };
  writeRenderedFile(renderedRootNode.kalpa, file);
  return renderedRootNode;
};

const processFile = (file, ctx, args) => {
  const rootNode = renderSourceFile(file, ctx, args);
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
  let ctx = rootNode.ctx
  const ctxdump = (ctx.dump !== undefined && ctx.dump !== null) ? ctx.dump: false
  const rootNodeStr = YAML.stringify(rootNode);
  const dir = path.dirname(file);
  const filename = path.basename(file);
  const str2 = ".";
  const outfilename = str2.concat(filename);
  const outfile = path.join(dir, outfilename);
  // log.info("creating source rendered dump %s", outfile);
  ctxdump ? fs.writeFileSync(outfile, rootNodeStr): null;
};
exports.processFile = processFile;
exports.logger = logger;
