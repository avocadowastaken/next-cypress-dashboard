var __create = Object.create, __defProp = Object.defineProperty, __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty, __getOwnPropNames = Object.getOwnPropertyNames, __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: !0}), __name = (target, value) => __defProp(target, "name", {value, configurable: !0});
var __commonJS = (callback, module2) => () => (module2 || (module2 = {exports: {}}, callback(module2.exports, module2)), module2.exports);
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 == "object" || typeof module2 == "function")
    for (let key of __getOwnPropNames(module2))
      !__hasOwnProp.call(target, key) && key !== "default" && __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  return target;
}, __toModule = (module2) => __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: !0} : {value: module2, enumerable: !0})), module2);

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  function toCommandValue(input) {
    return input == null ? "" : typeof input == "string" || input instanceof String ? input : JSON.stringify(input);
  }
  __name(toCommandValue, "toCommandValue");
  exports2.toCommandValue = toCommandValue;
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var os = __importStar(require("os")), utils_1 = require_utils();
  function issueCommand(command, properties, message) {
    let cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
  }
  __name(issueCommand, "issueCommand");
  exports2.issueCommand = issueCommand;
  function issue(name, message = "") {
    issueCommand(name, {}, message);
  }
  __name(issue, "issue");
  exports2.issue = issue;
  var CMD_STRING = "::", Command = class {
    constructor(command, properties, message) {
      command || (command = "missing.command"), this.command = command, this.properties = properties, this.message = message;
    }
    toString() {
      let cmdStr = CMD_STRING + this.command;
      if (this.properties && Object.keys(this.properties).length > 0) {
        cmdStr += " ";
        let first = !0;
        for (let key in this.properties)
          if (this.properties.hasOwnProperty(key)) {
            let val = this.properties[key];
            val && (first ? first = !1 : cmdStr += ",", cmdStr += `${key}=${escapeProperty(val)}`);
          }
      }
      return cmdStr += `${CMD_STRING}${escapeData(this.message)}`, cmdStr;
    }
  };
  __name(Command, "Command");
  function escapeData(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  }
  __name(escapeData, "escapeData");
  function escapeProperty(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
  }
  __name(escapeProperty, "escapeProperty");
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var fs2 = __importStar(require("fs")), os = __importStar(require("os")), utils_1 = require_utils();
  function issueCommand(command, message) {
    let filePath = process.env[`GITHUB_${command}`];
    if (!filePath)
      throw new Error(`Unable to find environment variable for file command ${command}`);
    if (!fs2.existsSync(filePath))
      throw new Error(`Missing file at path: ${filePath}`);
    fs2.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
      encoding: "utf8"
    });
  }
  __name(issueCommand, "issueCommand");
  exports2.issueCommand = issueCommand;
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }, __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var command_1 = require_command(), file_command_1 = require_file_command(), utils_1 = require_utils(), os = __importStar(require("os")), path2 = __importStar(require("path")), ExitCode;
  (function(ExitCode2) {
    ExitCode2[ExitCode2.Success = 0] = "Success", ExitCode2[ExitCode2.Failure = 1] = "Failure";
  })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
  function exportVariable(name, val) {
    let convertedVal = utils_1.toCommandValue(val);
    if (process.env[name] = convertedVal, process.env.GITHUB_ENV || "") {
      let delimiter = "_GitHubActionsFileCommandDelimeter_", commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
      file_command_1.issueCommand("ENV", commandValue);
    } else
      command_1.issueCommand("set-env", {name}, convertedVal);
  }
  __name(exportVariable, "exportVariable");
  exports2.exportVariable = exportVariable;
  function setSecret(secret) {
    command_1.issueCommand("add-mask", {}, secret);
  }
  __name(setSecret, "setSecret");
  exports2.setSecret = setSecret;
  function addPath(inputPath) {
    process.env.GITHUB_PATH || "" ? file_command_1.issueCommand("PATH", inputPath) : command_1.issueCommand("add-path", {}, inputPath), process.env.PATH = `${inputPath}${path2.delimiter}${process.env.PATH}`;
  }
  __name(addPath, "addPath");
  exports2.addPath = addPath;
  function getInput2(name, options) {
    let val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
    if (options && options.required && !val)
      throw new Error(`Input required and not supplied: ${name}`);
    return val.trim();
  }
  __name(getInput2, "getInput");
  exports2.getInput = getInput2;
  function setOutput(name, value) {
    command_1.issueCommand("set-output", {name}, value);
  }
  __name(setOutput, "setOutput");
  exports2.setOutput = setOutput;
  function setCommandEcho(enabled) {
    command_1.issue("echo", enabled ? "on" : "off");
  }
  __name(setCommandEcho, "setCommandEcho");
  exports2.setCommandEcho = setCommandEcho;
  function setFailed2(message) {
    process.exitCode = ExitCode.Failure, error(message);
  }
  __name(setFailed2, "setFailed");
  exports2.setFailed = setFailed2;
  function isDebug() {
    return process.env.RUNNER_DEBUG === "1";
  }
  __name(isDebug, "isDebug");
  exports2.isDebug = isDebug;
  function debug(message) {
    command_1.issueCommand("debug", {}, message);
  }
  __name(debug, "debug");
  exports2.debug = debug;
  function error(message) {
    command_1.issue("error", message instanceof Error ? message.toString() : message);
  }
  __name(error, "error");
  exports2.error = error;
  function warning(message) {
    command_1.issue("warning", message instanceof Error ? message.toString() : message);
  }
  __name(warning, "warning");
  exports2.warning = warning;
  function info2(message) {
    process.stdout.write(message + os.EOL);
  }
  __name(info2, "info");
  exports2.info = info2;
  function startGroup(name) {
    command_1.issue("group", name);
  }
  __name(startGroup, "startGroup");
  exports2.startGroup = startGroup;
  function endGroup() {
    command_1.issue("endgroup");
  }
  __name(endGroup, "endGroup");
  exports2.endGroup = endGroup;
  function group2(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      startGroup(name);
      let result;
      try {
        result = yield fn();
      } finally {
        endGroup();
      }
      return result;
    });
  }
  __name(group2, "group");
  exports2.group = group2;
  function saveState(name, value) {
    command_1.issueCommand("save-state", {name}, value);
  }
  __name(saveState, "saveState");
  exports2.saveState = saveState;
  function getState(name) {
    return process.env[`STATE_${name}`] || "";
  }
  __name(getState, "getState");
  exports2.getState = getState;
});

// node_modules/@actions/io/lib/io-util.js
var require_io_util = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }, _a;
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var assert_1 = require("assert"), fs2 = require("fs"), path2 = require("path");
  _a = fs2.promises, exports2.chmod = _a.chmod, exports2.copyFile = _a.copyFile, exports2.lstat = _a.lstat, exports2.mkdir = _a.mkdir, exports2.readdir = _a.readdir, exports2.readlink = _a.readlink, exports2.rename = _a.rename, exports2.rmdir = _a.rmdir, exports2.stat = _a.stat, exports2.symlink = _a.symlink, exports2.unlink = _a.unlink;
  exports2.IS_WINDOWS = process.platform === "win32";
  function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield exports2.stat(fsPath);
      } catch (err) {
        if (err.code === "ENOENT")
          return !1;
        throw err;
      }
      return !0;
    });
  }
  __name(exists, "exists");
  exports2.exists = exists;
  function isDirectory(fsPath, useStat = !1) {
    return __awaiter(this, void 0, void 0, function* () {
      return (useStat ? yield exports2.stat(fsPath) : yield exports2.lstat(fsPath)).isDirectory();
    });
  }
  __name(isDirectory, "isDirectory");
  exports2.isDirectory = isDirectory;
  function isRooted(p) {
    if (p = normalizeSeparators(p), !p)
      throw new Error('isRooted() parameter "p" cannot be empty');
    return exports2.IS_WINDOWS ? p.startsWith("\\") || /^[A-Z]:/i.test(p) : p.startsWith("/");
  }
  __name(isRooted, "isRooted");
  exports2.isRooted = isRooted;
  function mkdirP(fsPath, maxDepth = 1e3, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
      if (assert_1.ok(fsPath, "a path argument must be provided"), fsPath = path2.resolve(fsPath), depth >= maxDepth)
        return exports2.mkdir(fsPath);
      try {
        yield exports2.mkdir(fsPath);
        return;
      } catch (err) {
        switch (err.code) {
          case "ENOENT": {
            yield mkdirP(path2.dirname(fsPath), maxDepth, depth + 1), yield exports2.mkdir(fsPath);
            return;
          }
          default: {
            let stats;
            try {
              stats = yield exports2.stat(fsPath);
            } catch (err2) {
              throw err;
            }
            if (!stats.isDirectory())
              throw err;
          }
        }
      }
    });
  }
  __name(mkdirP, "mkdirP");
  exports2.mkdirP = mkdirP;
  function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
      let stats;
      try {
        stats = yield exports2.stat(filePath);
      } catch (err) {
        err.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
      }
      if (stats && stats.isFile()) {
        if (exports2.IS_WINDOWS) {
          let upperExt = path2.extname(filePath).toUpperCase();
          if (extensions.some((validExt) => validExt.toUpperCase() === upperExt))
            return filePath;
        } else if (isUnixExecutable(stats))
          return filePath;
      }
      let originalFilePath = filePath;
      for (let extension of extensions) {
        filePath = originalFilePath + extension, stats = void 0;
        try {
          stats = yield exports2.stat(filePath);
        } catch (err) {
          err.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
        if (stats && stats.isFile()) {
          if (exports2.IS_WINDOWS) {
            try {
              let directory = path2.dirname(filePath), upperName = path2.basename(filePath).toUpperCase();
              for (let actualName of yield exports2.readdir(directory))
                if (upperName === actualName.toUpperCase()) {
                  filePath = path2.join(directory, actualName);
                  break;
                }
            } catch (err) {
              console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
            }
            return filePath;
          } else if (isUnixExecutable(stats))
            return filePath;
        }
      }
      return "";
    });
  }
  __name(tryGetExecutablePath, "tryGetExecutablePath");
  exports2.tryGetExecutablePath = tryGetExecutablePath;
  function normalizeSeparators(p) {
    return p = p || "", exports2.IS_WINDOWS ? (p = p.replace(/\//g, "\\"), p.replace(/\\\\+/g, "\\")) : p.replace(/\/\/+/g, "/");
  }
  __name(normalizeSeparators, "normalizeSeparators");
  function isUnixExecutable(stats) {
    return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
  }
  __name(isUnixExecutable, "isUnixExecutable");
});

// node_modules/@actions/io/lib/io.js
var require_io = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var childProcess = require("child_process"), path2 = require("path"), util_1 = require("util"), ioUtil = require_io_util(), exec2 = util_1.promisify(childProcess.exec);
  function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      let {force, recursive} = readCopyOptions(options), destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
      if (destStat && destStat.isFile() && !force)
        return;
      let newDest = destStat && destStat.isDirectory() ? path2.join(dest, path2.basename(source)) : dest;
      if (!(yield ioUtil.exists(source)))
        throw new Error(`no such file or directory: ${source}`);
      if ((yield ioUtil.stat(source)).isDirectory())
        if (recursive)
          yield cpDirRecursive(source, newDest, 0, force);
        else
          throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
      else {
        if (path2.relative(source, newDest) === "")
          throw new Error(`'${newDest}' and '${source}' are the same file`);
        yield copyFile(source, newDest, force);
      }
    });
  }
  __name(cp, "cp");
  exports2.cp = cp;
  function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      if (yield ioUtil.exists(dest)) {
        let destExists = !0;
        if ((yield ioUtil.isDirectory(dest)) && (dest = path2.join(dest, path2.basename(source)), destExists = yield ioUtil.exists(dest)), destExists)
          if (options.force == null || options.force)
            yield rmRF(dest);
          else
            throw new Error("Destination already exists");
      }
      yield mkdirP(path2.dirname(dest)), yield ioUtil.rename(source, dest);
    });
  }
  __name(mv, "mv");
  exports2.mv = mv;
  function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
      if (ioUtil.IS_WINDOWS) {
        try {
          (yield ioUtil.isDirectory(inputPath, !0)) ? yield exec2(`rd /s /q "${inputPath}"`) : yield exec2(`del /f /a "${inputPath}"`);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
        try {
          yield ioUtil.unlink(inputPath);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
      } else {
        let isDir = !1;
        try {
          isDir = yield ioUtil.isDirectory(inputPath);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
          return;
        }
        isDir ? yield exec2(`rm -rf "${inputPath}"`) : yield ioUtil.unlink(inputPath);
      }
    });
  }
  __name(rmRF, "rmRF");
  exports2.rmRF = rmRF;
  function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
      yield ioUtil.mkdirP(fsPath);
    });
  }
  __name(mkdirP, "mkdirP");
  exports2.mkdirP = mkdirP;
  function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!tool)
        throw new Error("parameter 'tool' is required");
      if (check && !(yield which(tool, !1)))
        throw ioUtil.IS_WINDOWS ? new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`) : new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
      try {
        let extensions = [];
        if (ioUtil.IS_WINDOWS && process.env.PATHEXT)
          for (let extension of process.env.PATHEXT.split(path2.delimiter))
            extension && extensions.push(extension);
        if (ioUtil.isRooted(tool)) {
          let filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
          return filePath || "";
        }
        if (tool.includes("/") || ioUtil.IS_WINDOWS && tool.includes("\\"))
          return "";
        let directories = [];
        if (process.env.PATH)
          for (let p of process.env.PATH.split(path2.delimiter))
            p && directories.push(p);
        for (let directory of directories) {
          let filePath = yield ioUtil.tryGetExecutablePath(directory + path2.sep + tool, extensions);
          if (filePath)
            return filePath;
        }
        return "";
      } catch (err) {
        throw new Error(`which failed with message ${err.message}`);
      }
    });
  }
  __name(which, "which");
  exports2.which = which;
  function readCopyOptions(options) {
    let force = options.force == null ? !0 : options.force, recursive = Boolean(options.recursive);
    return {force, recursive};
  }
  __name(readCopyOptions, "readCopyOptions");
  function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
      if (currentDepth >= 255)
        return;
      currentDepth++, yield mkdirP(destDir);
      let files = yield ioUtil.readdir(sourceDir);
      for (let fileName of files) {
        let srcFile = `${sourceDir}/${fileName}`, destFile = `${destDir}/${fileName}`;
        (yield ioUtil.lstat(srcFile)).isDirectory() ? yield cpDirRecursive(srcFile, destFile, currentDepth, force) : yield copyFile(srcFile, destFile, force);
      }
      yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
  }
  __name(cpDirRecursive, "cpDirRecursive");
  function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
      if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
        try {
          yield ioUtil.lstat(destFile), yield ioUtil.unlink(destFile);
        } catch (e) {
          e.code === "EPERM" && (yield ioUtil.chmod(destFile, "0666"), yield ioUtil.unlink(destFile));
        }
        let symlinkFull = yield ioUtil.readlink(srcFile);
        yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? "junction" : null);
      } else
        (!(yield ioUtil.exists(destFile)) || force) && (yield ioUtil.copyFile(srcFile, destFile));
    });
  }
  __name(copyFile, "copyFile");
});

// node_modules/@actions/exec/lib/toolrunner.js
var require_toolrunner = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }, __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var os = __importStar(require("os")), events = __importStar(require("events")), child = __importStar(require("child_process")), path2 = __importStar(require("path")), io = __importStar(require_io()), ioUtil = __importStar(require_io_util()), IS_WINDOWS = process.platform === "win32", ToolRunner = class extends events.EventEmitter {
    constructor(toolPath, args, options) {
      super();
      if (!toolPath)
        throw new Error("Parameter 'toolPath' cannot be null or empty.");
      this.toolPath = toolPath, this.args = args || [], this.options = options || {};
    }
    _debug(message) {
      this.options.listeners && this.options.listeners.debug && this.options.listeners.debug(message);
    }
    _getCommandString(options, noPrefix) {
      let toolPath = this._getSpawnFileName(), args = this._getSpawnArgs(options), cmd = noPrefix ? "" : "[command]";
      if (IS_WINDOWS)
        if (this._isCmdFile()) {
          cmd += toolPath;
          for (let a of args)
            cmd += ` ${a}`;
        } else if (options.windowsVerbatimArguments) {
          cmd += `"${toolPath}"`;
          for (let a of args)
            cmd += ` ${a}`;
        } else {
          cmd += this._windowsQuoteCmdArg(toolPath);
          for (let a of args)
            cmd += ` ${this._windowsQuoteCmdArg(a)}`;
        }
      else {
        cmd += toolPath;
        for (let a of args)
          cmd += ` ${a}`;
      }
      return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
      try {
        let s = strBuffer + data.toString(), n = s.indexOf(os.EOL);
        for (; n > -1; ) {
          let line = s.substring(0, n);
          onLine(line), s = s.substring(n + os.EOL.length), n = s.indexOf(os.EOL);
        }
        strBuffer = s;
      } catch (err) {
        this._debug(`error processing line. Failed with error ${err}`);
      }
    }
    _getSpawnFileName() {
      return IS_WINDOWS && this._isCmdFile() ? process.env.COMSPEC || "cmd.exe" : this.toolPath;
    }
    _getSpawnArgs(options) {
      if (IS_WINDOWS && this._isCmdFile()) {
        let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
        for (let a of this.args)
          argline += " ", argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
        return argline += '"', [argline];
      }
      return this.args;
    }
    _endsWith(str, end) {
      return str.endsWith(end);
    }
    _isCmdFile() {
      let upperToolPath = this.toolPath.toUpperCase();
      return this._endsWith(upperToolPath, ".CMD") || this._endsWith(upperToolPath, ".BAT");
    }
    _windowsQuoteCmdArg(arg) {
      if (!this._isCmdFile())
        return this._uvQuoteCmdArg(arg);
      if (!arg)
        return '""';
      let cmdSpecialChars = [
        " ",
        "	",
        "&",
        "(",
        ")",
        "[",
        "]",
        "{",
        "}",
        "^",
        "=",
        ";",
        "!",
        "'",
        "+",
        ",",
        "`",
        "~",
        "|",
        "<",
        ">",
        '"'
      ], needsQuotes = !1;
      for (let char of arg)
        if (cmdSpecialChars.some((x) => x === char)) {
          needsQuotes = !0;
          break;
        }
      if (!needsQuotes)
        return arg;
      let reverse = '"', quoteHit = !0;
      for (let i = arg.length; i > 0; i--)
        reverse += arg[i - 1], quoteHit && arg[i - 1] === "\\" ? reverse += "\\" : arg[i - 1] === '"' ? (quoteHit = !0, reverse += '"') : quoteHit = !1;
      return reverse += '"', reverse.split("").reverse().join("");
    }
    _uvQuoteCmdArg(arg) {
      if (!arg)
        return '""';
      if (!arg.includes(" ") && !arg.includes("	") && !arg.includes('"'))
        return arg;
      if (!arg.includes('"') && !arg.includes("\\"))
        return `"${arg}"`;
      let reverse = '"', quoteHit = !0;
      for (let i = arg.length; i > 0; i--)
        reverse += arg[i - 1], quoteHit && arg[i - 1] === "\\" ? reverse += "\\" : arg[i - 1] === '"' ? (quoteHit = !0, reverse += "\\") : quoteHit = !1;
      return reverse += '"', reverse.split("").reverse().join("");
    }
    _cloneExecOptions(options) {
      options = options || {};
      let result = {
        cwd: options.cwd || process.cwd(),
        env: options.env || process.env,
        silent: options.silent || !1,
        windowsVerbatimArguments: options.windowsVerbatimArguments || !1,
        failOnStdErr: options.failOnStdErr || !1,
        ignoreReturnCode: options.ignoreReturnCode || !1,
        delay: options.delay || 1e4
      };
      return result.outStream = options.outStream || process.stdout, result.errStream = options.errStream || process.stderr, result;
    }
    _getSpawnOptions(options, toolPath) {
      options = options || {};
      let result = {};
      return result.cwd = options.cwd, result.env = options.env, result.windowsVerbatimArguments = options.windowsVerbatimArguments || this._isCmdFile(), options.windowsVerbatimArguments && (result.argv0 = `"${toolPath}"`), result;
    }
    exec() {
      return __awaiter(this, void 0, void 0, function* () {
        return !ioUtil.isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS && this.toolPath.includes("\\")) && (this.toolPath = path2.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath)), this.toolPath = yield io.which(this.toolPath, !0), new Promise((resolve, reject) => {
          this._debug(`exec tool: ${this.toolPath}`), this._debug("arguments:");
          for (let arg of this.args)
            this._debug(`   ${arg}`);
          let optionsNonNull = this._cloneExecOptions(this.options);
          !optionsNonNull.silent && optionsNonNull.outStream && optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
          let state = new ExecState(optionsNonNull, this.toolPath);
          state.on("debug", (message) => {
            this._debug(message);
          });
          let fileName = this._getSpawnFileName(), cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName)), stdbuffer = "";
          cp.stdout && cp.stdout.on("data", (data) => {
            this.options.listeners && this.options.listeners.stdout && this.options.listeners.stdout(data), !optionsNonNull.silent && optionsNonNull.outStream && optionsNonNull.outStream.write(data), this._processLineBuffer(data, stdbuffer, (line) => {
              this.options.listeners && this.options.listeners.stdline && this.options.listeners.stdline(line);
            });
          });
          let errbuffer = "";
          if (cp.stderr && cp.stderr.on("data", (data) => {
            state.processStderr = !0, this.options.listeners && this.options.listeners.stderr && this.options.listeners.stderr(data), !optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream && (optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream).write(data), this._processLineBuffer(data, errbuffer, (line) => {
              this.options.listeners && this.options.listeners.errline && this.options.listeners.errline(line);
            });
          }), cp.on("error", (err) => {
            state.processError = err.message, state.processExited = !0, state.processClosed = !0, state.CheckComplete();
          }), cp.on("exit", (code) => {
            state.processExitCode = code, state.processExited = !0, this._debug(`Exit code ${code} received from tool '${this.toolPath}'`), state.CheckComplete();
          }), cp.on("close", (code) => {
            state.processExitCode = code, state.processExited = !0, state.processClosed = !0, this._debug(`STDIO streams have closed for tool '${this.toolPath}'`), state.CheckComplete();
          }), state.on("done", (error, exitCode) => {
            stdbuffer.length > 0 && this.emit("stdline", stdbuffer), errbuffer.length > 0 && this.emit("errline", errbuffer), cp.removeAllListeners(), error ? reject(error) : resolve(exitCode);
          }), this.options.input) {
            if (!cp.stdin)
              throw new Error("child process missing stdin");
            cp.stdin.end(this.options.input);
          }
        });
      });
    }
  };
  __name(ToolRunner, "ToolRunner");
  exports2.ToolRunner = ToolRunner;
  function argStringToArray(argString) {
    let args = [], inQuotes = !1, escaped = !1, arg = "";
    function append(c) {
      escaped && c !== '"' && (arg += "\\"), arg += c, escaped = !1;
    }
    __name(append, "append");
    for (let i = 0; i < argString.length; i++) {
      let c = argString.charAt(i);
      if (c === '"') {
        escaped ? append(c) : inQuotes = !inQuotes;
        continue;
      }
      if (c === "\\" && escaped) {
        append(c);
        continue;
      }
      if (c === "\\" && inQuotes) {
        escaped = !0;
        continue;
      }
      if (c === " " && !inQuotes) {
        arg.length > 0 && (args.push(arg), arg = "");
        continue;
      }
      append(c);
    }
    return arg.length > 0 && args.push(arg.trim()), args;
  }
  __name(argStringToArray, "argStringToArray");
  exports2.argStringToArray = argStringToArray;
  var ExecState = class extends events.EventEmitter {
    constructor(options, toolPath) {
      super();
      if (this.processClosed = !1, this.processError = "", this.processExitCode = 0, this.processExited = !1, this.processStderr = !1, this.delay = 1e4, this.done = !1, this.timeout = null, !toolPath)
        throw new Error("toolPath must not be empty");
      this.options = options, this.toolPath = toolPath, options.delay && (this.delay = options.delay);
    }
    CheckComplete() {
      this.done || (this.processClosed ? this._setResult() : this.processExited && (this.timeout = setTimeout(ExecState.HandleTimeout, this.delay, this)));
    }
    _debug(message) {
      this.emit("debug", message);
    }
    _setResult() {
      let error;
      this.processExited && (this.processError ? error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`) : this.processExitCode !== 0 && !this.options.ignoreReturnCode ? error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`) : this.processStderr && this.options.failOnStdErr && (error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`))), this.timeout && (clearTimeout(this.timeout), this.timeout = null), this.done = !0, this.emit("done", error, this.processExitCode);
    }
    static HandleTimeout(state) {
      if (!state.done) {
        if (!state.processClosed && state.processExited) {
          let message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
          state._debug(message);
        }
        state._setResult();
      }
    }
  };
  __name(ExecState, "ExecState");
});

// node_modules/@actions/exec/lib/exec.js
var require_exec = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }, __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var tr = __importStar(require_toolrunner());
  function exec2(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
      let commandArgs = tr.argStringToArray(commandLine);
      if (commandArgs.length === 0)
        throw new Error("Parameter 'commandLine' cannot be null or empty.");
      let toolPath = commandArgs[0];
      return args = commandArgs.slice(1).concat(args || []), new tr.ToolRunner(toolPath, args, options).exec();
    });
  }
  __name(exec2, "exec");
  exports2.exec = exec2;
});

// node_modules/@actions/glob/lib/internal-glob-options-helper.js
var require_internal_glob_options_helper = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var core = __importStar(require_core());
  function getOptions(copy) {
    let result = {
      followSymbolicLinks: !0,
      implicitDescendants: !0,
      omitBrokenSymbolicLinks: !0
    };
    return copy && (typeof copy.followSymbolicLinks == "boolean" && (result.followSymbolicLinks = copy.followSymbolicLinks, core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`)), typeof copy.implicitDescendants == "boolean" && (result.implicitDescendants = copy.implicitDescendants, core.debug(`implicitDescendants '${result.implicitDescendants}'`)), typeof copy.omitBrokenSymbolicLinks == "boolean" && (result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks, core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`))), result;
  }
  __name(getOptions, "getOptions");
  exports2.getOptions = getOptions;
});

// node_modules/@actions/glob/lib/internal-path-helper.js
var require_internal_path_helper = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  }, __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var path2 = __importStar(require("path")), assert_1 = __importDefault(require("assert")), IS_WINDOWS = process.platform === "win32";
  function dirname(p) {
    if (p = safeTrimTrailingSeparator(p), IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p))
      return p;
    let result = path2.dirname(p);
    return IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result) && (result = safeTrimTrailingSeparator(result)), result;
  }
  __name(dirname, "dirname");
  exports2.dirname = dirname;
  function ensureAbsoluteRoot(root, itemPath) {
    if (assert_1.default(root, "ensureAbsoluteRoot parameter 'root' must not be empty"), assert_1.default(itemPath, "ensureAbsoluteRoot parameter 'itemPath' must not be empty"), hasAbsoluteRoot(itemPath))
      return itemPath;
    if (IS_WINDOWS) {
      if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
        let cwd = process.cwd();
        return assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`), itemPath[0].toUpperCase() === cwd[0].toUpperCase() ? itemPath.length === 2 ? `${itemPath[0]}:\\${cwd.substr(3)}` : (cwd.endsWith("\\") || (cwd += "\\"), `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`) : `${itemPath[0]}:\\${itemPath.substr(2)}`;
      } else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
        let cwd = process.cwd();
        return assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`), `${cwd[0]}:\\${itemPath.substr(1)}`;
      }
    }
    return assert_1.default(hasAbsoluteRoot(root), "ensureAbsoluteRoot parameter 'root' must have an absolute root"), root.endsWith("/") || IS_WINDOWS && root.endsWith("\\") || (root += path2.sep), root + itemPath;
  }
  __name(ensureAbsoluteRoot, "ensureAbsoluteRoot");
  exports2.ensureAbsoluteRoot = ensureAbsoluteRoot;
  function hasAbsoluteRoot(itemPath) {
    return assert_1.default(itemPath, "hasAbsoluteRoot parameter 'itemPath' must not be empty"), itemPath = normalizeSeparators(itemPath), IS_WINDOWS ? itemPath.startsWith("\\\\") || /^[A-Z]:\\/i.test(itemPath) : itemPath.startsWith("/");
  }
  __name(hasAbsoluteRoot, "hasAbsoluteRoot");
  exports2.hasAbsoluteRoot = hasAbsoluteRoot;
  function hasRoot(itemPath) {
    return assert_1.default(itemPath, "isRooted parameter 'itemPath' must not be empty"), itemPath = normalizeSeparators(itemPath), IS_WINDOWS ? itemPath.startsWith("\\") || /^[A-Z]:/i.test(itemPath) : itemPath.startsWith("/");
  }
  __name(hasRoot, "hasRoot");
  exports2.hasRoot = hasRoot;
  function normalizeSeparators(p) {
    return p = p || "", IS_WINDOWS ? (p = p.replace(/\//g, "\\"), (/^\\\\+[^\\]/.test(p) ? "\\" : "") + p.replace(/\\\\+/g, "\\")) : p.replace(/\/\/+/g, "/");
  }
  __name(normalizeSeparators, "normalizeSeparators");
  exports2.normalizeSeparators = normalizeSeparators;
  function safeTrimTrailingSeparator(p) {
    return p ? (p = normalizeSeparators(p), !p.endsWith(path2.sep) || p === path2.sep || IS_WINDOWS && /^[A-Z]:\\$/i.test(p) ? p : p.substr(0, p.length - 1)) : "";
  }
  __name(safeTrimTrailingSeparator, "safeTrimTrailingSeparator");
  exports2.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
});

// node_modules/@actions/glob/lib/internal-match-kind.js
var require_internal_match_kind = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var MatchKind;
  (function(MatchKind2) {
    MatchKind2[MatchKind2.None = 0] = "None", MatchKind2[MatchKind2.Directory = 1] = "Directory", MatchKind2[MatchKind2.File = 2] = "File", MatchKind2[MatchKind2.All = 3] = "All";
  })(MatchKind = exports2.MatchKind || (exports2.MatchKind = {}));
});

// node_modules/@actions/glob/lib/internal-pattern-helper.js
var require_internal_pattern_helper = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var pathHelper = __importStar(require_internal_path_helper()), internal_match_kind_1 = require_internal_match_kind(), IS_WINDOWS = process.platform === "win32";
  function getSearchPaths(patterns) {
    patterns = patterns.filter((x) => !x.negate);
    let searchPathMap = {};
    for (let pattern of patterns) {
      let key = IS_WINDOWS ? pattern.searchPath.toUpperCase() : pattern.searchPath;
      searchPathMap[key] = "candidate";
    }
    let result = [];
    for (let pattern of patterns) {
      let key = IS_WINDOWS ? pattern.searchPath.toUpperCase() : pattern.searchPath;
      if (searchPathMap[key] === "included")
        continue;
      let foundAncestor = !1, tempKey = key, parent = pathHelper.dirname(tempKey);
      for (; parent !== tempKey; ) {
        if (searchPathMap[parent]) {
          foundAncestor = !0;
          break;
        }
        tempKey = parent, parent = pathHelper.dirname(tempKey);
      }
      foundAncestor || (result.push(pattern.searchPath), searchPathMap[key] = "included");
    }
    return result;
  }
  __name(getSearchPaths, "getSearchPaths");
  exports2.getSearchPaths = getSearchPaths;
  function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (let pattern of patterns)
      pattern.negate ? result &= ~pattern.match(itemPath) : result |= pattern.match(itemPath);
    return result;
  }
  __name(match, "match");
  exports2.match = match;
  function partialMatch(patterns, itemPath) {
    return patterns.some((x) => !x.negate && x.partialMatch(itemPath));
  }
  __name(partialMatch, "partialMatch");
  exports2.partialMatch = partialMatch;
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS((exports2, module2) => {
  module2.exports = function(xs, fn) {
    for (var res = [], i = 0; i < xs.length; i++) {
      var x = fn(xs[i], i);
      isArray(x) ? res.push.apply(res, x) : res.push(x);
    }
    return res;
  };
  var isArray = Array.isArray || function(xs) {
    return Object.prototype.toString.call(xs) === "[object Array]";
  };
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = balanced;
  function balanced(a, b, str) {
    a instanceof RegExp && (a = maybeMatch(a, str)), b instanceof RegExp && (b = maybeMatch(b, str));
    var r = range(a, b, str);
    return r && {
      start: r[0],
      end: r[1],
      pre: str.slice(0, r[0]),
      body: str.slice(r[0] + a.length, r[1]),
      post: str.slice(r[1] + b.length)
    };
  }
  __name(balanced, "balanced");
  function maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
  }
  __name(maybeMatch, "maybeMatch");
  balanced.range = range;
  function range(a, b, str) {
    var begs, beg, left, right, result, ai = str.indexOf(a), bi = str.indexOf(b, ai + 1), i = ai;
    if (ai >= 0 && bi > 0) {
      for (begs = [], left = str.length; i >= 0 && !result; )
        i == ai ? (begs.push(i), ai = str.indexOf(a, i + 1)) : begs.length == 1 ? result = [begs.pop(), bi] : (beg = begs.pop(), beg < left && (left = beg, right = bi), bi = str.indexOf(b, i + 1)), i = ai < bi && ai >= 0 ? ai : bi;
      begs.length && (result = [left, right]);
    }
    return result;
  }
  __name(range, "range");
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS((exports2, module2) => {
  var concatMap = require_concat_map(), balanced = require_balanced_match();
  module2.exports = expandTop;
  var escSlash = "\0SLASH" + Math.random() + "\0", escOpen = "\0OPEN" + Math.random() + "\0", escClose = "\0CLOSE" + Math.random() + "\0", escComma = "\0COMMA" + Math.random() + "\0", escPeriod = "\0PERIOD" + Math.random() + "\0";
  function numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
  }
  __name(numeric, "numeric");
  function escapeBraces(str) {
    return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
  }
  __name(escapeBraces, "escapeBraces");
  function unescapeBraces(str) {
    return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
  }
  __name(unescapeBraces, "unescapeBraces");
  function parseCommaParts(str) {
    if (!str)
      return [""];
    var parts = [], m = balanced("{", "}", str);
    if (!m)
      return str.split(",");
    var pre = m.pre, body = m.body, post = m.post, p = pre.split(",");
    p[p.length - 1] += "{" + body + "}";
    var postParts = parseCommaParts(post);
    return post.length && (p[p.length - 1] += postParts.shift(), p.push.apply(p, postParts)), parts.push.apply(parts, p), parts;
  }
  __name(parseCommaParts, "parseCommaParts");
  function expandTop(str) {
    return str ? (str.substr(0, 2) === "{}" && (str = "\\{\\}" + str.substr(2)), expand(escapeBraces(str), !0).map(unescapeBraces)) : [];
  }
  __name(expandTop, "expandTop");
  function embrace(str) {
    return "{" + str + "}";
  }
  __name(embrace, "embrace");
  function isPadded(el) {
    return /^-?0\d/.test(el);
  }
  __name(isPadded, "isPadded");
  function lte(i, y) {
    return i <= y;
  }
  __name(lte, "lte");
  function gte(i, y) {
    return i >= y;
  }
  __name(gte, "gte");
  function expand(str, isTop) {
    var expansions = [], m = balanced("{", "}", str);
    if (!m || /\$$/.test(m.pre))
      return [str];
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body), isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body), isSequence = isNumericSequence || isAlphaSequence, isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions)
      return m.post.match(/,.*\}/) ? (str = m.pre + "{" + m.body + escClose + m.post, expand(str)) : [str];
    var n;
    if (isSequence)
      n = m.body.split(/\.\./);
    else if (n = parseCommaParts(m.body), n.length === 1 && (n = expand(n[0], !1).map(embrace), n.length === 1)) {
      var post = m.post.length ? expand(m.post, !1) : [""];
      return post.map(function(p) {
        return m.pre + n[0] + p;
      });
    }
    var pre = m.pre, post = m.post.length ? expand(m.post, !1) : [""], N;
    if (isSequence) {
      var x = numeric(n[0]), y = numeric(n[1]), width = Math.max(n[0].length, n[1].length), incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1, test = lte, reverse = y < x;
      reverse && (incr *= -1, test = gte);
      var pad = n.some(isPadded);
      N = [];
      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence)
          c = String.fromCharCode(i), c === "\\" && (c = "");
        else if (c = String(i), pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join("0");
            i < 0 ? c = "-" + z + c.slice(1) : c = z + c;
          }
        }
        N.push(c);
      }
    } else
      N = concatMap(n, function(el) {
        return expand(el, !1);
      });
    for (var j = 0; j < N.length; j++)
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        (!isTop || isSequence || expansion) && expansions.push(expansion);
      }
    return expansions;
  }
  __name(expand, "expand");
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS((exports2, module2) => {
  module2.exports = minimatch;
  minimatch.Minimatch = Minimatch;
  var path2 = {sep: "/"};
  try {
    path2 = require("path");
  } catch (er) {
  }
  var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}, expand = require_brace_expansion(), plTypes = {
    "!": {open: "(?:(?!(?:", close: "))[^/]*?)"},
    "?": {open: "(?:", close: ")?"},
    "+": {open: "(?:", close: ")+"},
    "*": {open: "(?:", close: ")*"},
    "@": {open: "(?:", close: ")"}
  }, qmark = "[^/]", star = qmark + "*?", twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?", reSpecials = charSet("().*{}+?[]^$\\!");
  function charSet(s) {
    return s.split("").reduce(function(set, c) {
      return set[c] = !0, set;
    }, {});
  }
  __name(charSet, "charSet");
  var slashSplit = /\/+/;
  minimatch.filter = filter;
  function filter(pattern, options) {
    return options = options || {}, function(p, i, list) {
      return minimatch(p, pattern, options);
    };
  }
  __name(filter, "filter");
  function ext(a, b) {
    a = a || {}, b = b || {};
    var t = {};
    return Object.keys(b).forEach(function(k) {
      t[k] = b[k];
    }), Object.keys(a).forEach(function(k) {
      t[k] = a[k];
    }), t;
  }
  __name(ext, "ext");
  minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length)
      return minimatch;
    var orig = minimatch, m = /* @__PURE__ */ __name(function(p, pattern, options) {
      return orig.minimatch(p, pattern, ext(def, options));
    }, "minimatch");
    return m.Minimatch = /* @__PURE__ */ __name(function(pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options));
    }, "Minimatch"), m;
  };
  Minimatch.defaults = function(def) {
    return !def || !Object.keys(def).length ? Minimatch : minimatch.defaults(def).Minimatch;
  };
  function minimatch(p, pattern, options) {
    if (typeof pattern != "string")
      throw new TypeError("glob pattern string required");
    return options || (options = {}), !options.nocomment && pattern.charAt(0) === "#" ? !1 : pattern.trim() === "" ? p === "" : new Minimatch(pattern, options).match(p);
  }
  __name(minimatch, "minimatch");
  function Minimatch(pattern, options) {
    if (!(this instanceof Minimatch))
      return new Minimatch(pattern, options);
    if (typeof pattern != "string")
      throw new TypeError("glob pattern string required");
    options || (options = {}), pattern = pattern.trim(), path2.sep !== "/" && (pattern = pattern.split(path2.sep).join("/")), this.options = options, this.set = [], this.pattern = pattern, this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.make();
  }
  __name(Minimatch, "Minimatch");
  Minimatch.prototype.debug = function() {
  };
  Minimatch.prototype.make = make;
  function make() {
    if (!this._made) {
      var pattern = this.pattern, options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = !0;
        return;
      }
      if (!pattern) {
        this.empty = !0;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      options.debug && (this.debug = console.error), this.debug(this.pattern, set), set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      }), this.debug(this.pattern, set), set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this), this.debug(this.pattern, set), set = set.filter(function(s) {
        return s.indexOf(!1) === -1;
      }), this.debug(this.pattern, set), this.set = set;
    }
  }
  __name(make, "make");
  Minimatch.prototype.parseNegate = parseNegate;
  function parseNegate() {
    var pattern = this.pattern, negate = !1, options = this.options, negateOffset = 0;
    if (!options.nonegate) {
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++)
        negate = !negate, negateOffset++;
      negateOffset && (this.pattern = pattern.substr(negateOffset)), this.negate = negate;
    }
  }
  __name(parseNegate, "parseNegate");
  minimatch.braceExpand = function(pattern, options) {
    return braceExpand(pattern, options);
  };
  Minimatch.prototype.braceExpand = braceExpand;
  function braceExpand(pattern, options) {
    if (options || (this instanceof Minimatch ? options = this.options : options = {}), pattern = typeof pattern == "undefined" ? this.pattern : pattern, typeof pattern == "undefined")
      throw new TypeError("undefined pattern");
    return options.nobrace || !pattern.match(/\{.*\}/) ? [pattern] : expand(pattern);
  }
  __name(braceExpand, "braceExpand");
  Minimatch.prototype.parse = parse2;
  var SUBPARSE = {};
  function parse2(pattern, isSub) {
    if (pattern.length > 1024 * 64)
      throw new TypeError("pattern is too long");
    var options = this.options;
    if (!options.noglobstar && pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    var re = "", hasMagic = !!options.nocase, escaping = !1, patternListStack = [], negativeLists = [], stateChar, inClass = !1, reClassStart = -1, classStart = -1, patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", self = this;
    function clearStateChar() {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star, hasMagic = !0;
            break;
          case "?":
            re += qmark, hasMagic = !0;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        self.debug("clearStateChar %j %j", stateChar, re), stateChar = !1;
      }
    }
    __name(clearStateChar, "clearStateChar");
    for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
      if (this.debug("%s	%s %s %j", pattern, i, re, c), escaping && reSpecials[c]) {
        re += "\\" + c, escaping = !1;
        continue;
      }
      switch (c) {
        case "/":
          return !1;
        case "\\":
          clearStateChar(), escaping = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c), inClass) {
            this.debug("  in class"), c === "!" && i === classStart + 1 && (c = "^"), re += c;
            continue;
          }
          self.debug("call clearStateChar %j", stateChar), clearStateChar(), stateChar = c, options.noext && clearStateChar();
          continue;
        case "(":
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          }), re += stateChar === "!" ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", stateChar, re), stateChar = !1;
          continue;
        case ")":
          if (inClass || !patternListStack.length) {
            re += "\\)";
            continue;
          }
          clearStateChar(), hasMagic = !0;
          var pl = patternListStack.pop();
          re += pl.close, pl.type === "!" && negativeLists.push(pl), pl.reEnd = re.length;
          continue;
        case "|":
          if (inClass || !patternListStack.length || escaping) {
            re += "\\|", escaping = !1;
            continue;
          }
          clearStateChar(), re += "|";
          continue;
        case "[":
          if (clearStateChar(), inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = !0, classStart = i, reClassStart = re.length, re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c, escaping = !1;
            continue;
          }
          if (inClass) {
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]", hasMagic = hasMagic || sp[1], inClass = !1;
              continue;
            }
          }
          hasMagic = !0, inClass = !1, re += c;
          continue;
        default:
          clearStateChar(), escaping ? escaping = !1 : reSpecials[c] && !(c === "^" && inClass) && (re += "\\"), re += c;
      }
    }
    for (inClass && (cs = pattern.substr(classStart + 1), sp = this.parse(cs, SUBPARSE), re = re.substr(0, reClassStart) + "\\[" + sp[0], hasMagic = hasMagic || sp[1]), pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl), tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
        return $2 || ($2 = "\\"), $1 + $1 + $2 + "|";
      }), this.debug(`tail=%j
   %s`, tail, tail, pl, re);
      var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = !0, re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar(), escaping && (re += "\\\\");
    var addPatternStart = !1;
    switch (re.charAt(0)) {
      case ".":
      case "[":
      case "(":
        addPatternStart = !0;
    }
    for (var n = negativeLists.length - 1; n > -1; n--) {
      var nl = negativeLists[n], nlBefore = re.slice(0, nl.reStart), nlFirst = re.slice(nl.reStart, nl.reEnd - 8), nlLast = re.slice(nl.reEnd - 8, nl.reEnd), nlAfter = re.slice(nl.reEnd);
      nlLast += nlAfter;
      var openParensBefore = nlBefore.split("(").length - 1, cleanAfter = nlAfter;
      for (i = 0; i < openParensBefore; i++)
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      nlAfter = cleanAfter;
      var dollar = "";
      nlAfter === "" && isSub !== SUBPARSE && (dollar = "$");
      var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
      re = newRe;
    }
    if (re !== "" && hasMagic && (re = "(?=.)" + re), addPatternStart && (re = patternStart + re), isSub === SUBPARSE)
      return [re, hasMagic];
    if (!hasMagic)
      return globUnescape(pattern);
    var flags = options.nocase ? "i" : "";
    try {
      var regExp = new RegExp("^" + re + "$", flags);
    } catch (er) {
      return new RegExp("$.");
    }
    return regExp._glob = pattern, regExp._src = re, regExp;
  }
  __name(parse2, "parse");
  minimatch.makeRe = function(pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe();
  };
  Minimatch.prototype.makeRe = makeRe;
  function makeRe() {
    if (this.regexp || this.regexp === !1)
      return this.regexp;
    var set = this.set;
    if (!set.length)
      return this.regexp = !1, this.regexp;
    var options = this.options, twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot, flags = options.nocase ? "i" : "", re = set.map(function(pattern) {
      return pattern.map(function(p) {
        return p === GLOBSTAR ? twoStar : typeof p == "string" ? regExpEscape(p) : p._src;
      }).join("\\/");
    }).join("|");
    re = "^(?:" + re + ")$", this.negate && (re = "^(?!" + re + ").*$");
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = !1;
    }
    return this.regexp;
  }
  __name(makeRe, "makeRe");
  minimatch.match = function(list, pattern, options) {
    options = options || {};
    var mm = new Minimatch(pattern, options);
    return list = list.filter(function(f) {
      return mm.match(f);
    }), mm.options.nonull && !list.length && list.push(pattern), list;
  };
  Minimatch.prototype.match = match;
  function match(f, partial) {
    if (this.debug("match", f, this.pattern), this.comment)
      return !1;
    if (this.empty)
      return f === "";
    if (f === "/" && partial)
      return !0;
    var options = this.options;
    path2.sep !== "/" && (f = f.split(path2.sep).join("/")), f = f.split(slashSplit), this.debug(this.pattern, "split", f);
    var set = this.set;
    this.debug(this.pattern, "set", set);
    var filename, i;
    for (i = f.length - 1; i >= 0 && (filename = f[i], !filename); i--)
      ;
    for (i = 0; i < set.length; i++) {
      var pattern = set[i], file = f;
      options.matchBase && pattern.length === 1 && (file = [filename]);
      var hit = this.matchOne(file, pattern, partial);
      if (hit)
        return options.flipNegate ? !0 : !this.negate;
    }
    return options.flipNegate ? !1 : this.negate;
  }
  __name(match, "match");
  Minimatch.prototype.matchOne = function(file, pattern, partial) {
    var options = this.options;
    this.debug("matchOne", {this: this, file, pattern}), this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi], f = file[fi];
      if (this.debug(pattern, p, f), p === !1)
        return !1;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi, pr = pi + 1;
        if (pr === pl) {
          for (this.debug("** at the end"); fi < fl; fi++)
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return !1;
          return !0;
        }
        for (; fr < fl; ) {
          var swallowee = file[fr];
          if (this.debug(`
globstar while`, file, fr, pattern, pr, swallowee), this.matchOne(file.slice(fr), pattern.slice(pr), partial))
            return this.debug("globstar found match!", fr, fl, swallowee), !0;
          if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
            this.debug("dot detected!", file, fr, pattern, pr);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), fr++;
        }
        return !!(partial && (this.debug(`
>>> no match, partial?`, file, fr, pattern, pr), fr === fl));
      }
      var hit;
      if (typeof p == "string" ? (options.nocase ? hit = f.toLowerCase() === p.toLowerCase() : hit = f === p, this.debug("string match", p, f, hit)) : (hit = f.match(p), this.debug("pattern match", p, f, hit)), !hit)
        return !1;
    }
    if (fi === fl && pi === pl)
      return !0;
    if (fi === fl)
      return partial;
    if (pi === pl) {
      var emptyFileEnd = fi === fl - 1 && file[fi] === "";
      return emptyFileEnd;
    }
    throw new Error("wtf?");
  };
  function globUnescape(s) {
    return s.replace(/\\(.)/g, "$1");
  }
  __name(globUnescape, "globUnescape");
  function regExpEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  __name(regExpEscape, "regExpEscape");
});

// node_modules/@actions/glob/lib/internal-path.js
var require_internal_path = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  }, __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var path2 = __importStar(require("path")), pathHelper = __importStar(require_internal_path_helper()), assert_1 = __importDefault(require("assert")), IS_WINDOWS = process.platform === "win32", Path = class {
    constructor(itemPath) {
      if (this.segments = [], typeof itemPath == "string")
        if (assert_1.default(itemPath, "Parameter 'itemPath' must not be empty"), itemPath = pathHelper.safeTrimTrailingSeparator(itemPath), !pathHelper.hasRoot(itemPath))
          this.segments = itemPath.split(path2.sep);
        else {
          let remaining = itemPath, dir = pathHelper.dirname(remaining);
          for (; dir !== remaining; ) {
            let basename = path2.basename(remaining);
            this.segments.unshift(basename), remaining = dir, dir = pathHelper.dirname(remaining);
          }
          this.segments.unshift(remaining);
        }
      else {
        assert_1.default(itemPath.length > 0, "Parameter 'itemPath' must not be an empty array");
        for (let i = 0; i < itemPath.length; i++) {
          let segment = itemPath[i];
          assert_1.default(segment, "Parameter 'itemPath' must not contain any empty segments"), segment = pathHelper.normalizeSeparators(itemPath[i]), i === 0 && pathHelper.hasRoot(segment) ? (segment = pathHelper.safeTrimTrailingSeparator(segment), assert_1.default(segment === pathHelper.dirname(segment), "Parameter 'itemPath' root segment contains information for multiple segments"), this.segments.push(segment)) : (assert_1.default(!segment.includes(path2.sep), "Parameter 'itemPath' contains unexpected path separators"), this.segments.push(segment));
        }
      }
    }
    toString() {
      let result = this.segments[0], skipSlash = result.endsWith(path2.sep) || IS_WINDOWS && /^[A-Z]:$/i.test(result);
      for (let i = 1; i < this.segments.length; i++)
        skipSlash ? skipSlash = !1 : result += path2.sep, result += this.segments[i];
      return result;
    }
  };
  __name(Path, "Path");
  exports2.Path = Path;
});

// node_modules/@actions/glob/lib/internal-pattern.js
var require_internal_pattern = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  }, __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var os = __importStar(require("os")), path2 = __importStar(require("path")), pathHelper = __importStar(require_internal_path_helper()), assert_1 = __importDefault(require("assert")), minimatch_1 = require_minimatch(), internal_match_kind_1 = require_internal_match_kind(), internal_path_1 = require_internal_path(), IS_WINDOWS = process.platform === "win32", Pattern = class {
    constructor(patternOrNegate, segments, homedir) {
      this.negate = !1;
      let pattern;
      if (typeof patternOrNegate == "string")
        pattern = patternOrNegate.trim();
      else {
        segments = segments || [], assert_1.default(segments.length, "Parameter 'segments' must not empty");
        let root = Pattern.getLiteral(segments[0]);
        assert_1.default(root && pathHelper.hasAbsoluteRoot(root), "Parameter 'segments' first element must be a root path"), pattern = new internal_path_1.Path(segments).toString().trim(), patternOrNegate && (pattern = `!${pattern}`);
      }
      for (; pattern.startsWith("!"); )
        this.negate = !this.negate, pattern = pattern.substr(1).trim();
      pattern = Pattern.fixupPattern(pattern, homedir), this.segments = new internal_path_1.Path(pattern).segments, this.trailingSeparator = pathHelper.normalizeSeparators(pattern).endsWith(path2.sep), pattern = pathHelper.safeTrimTrailingSeparator(pattern);
      let foundGlob = !1, searchSegments = this.segments.map((x) => Pattern.getLiteral(x)).filter((x) => !foundGlob && !(foundGlob = x === ""));
      this.searchPath = new internal_path_1.Path(searchSegments).toString(), this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? "i" : "");
      let minimatchOptions = {
        dot: !0,
        nobrace: !0,
        nocase: IS_WINDOWS,
        nocomment: !0,
        noext: !0,
        nonegate: !0
      };
      pattern = IS_WINDOWS ? pattern.replace(/\\/g, "/") : pattern, this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    match(itemPath) {
      return this.segments[this.segments.length - 1] === "**" ? (itemPath = pathHelper.normalizeSeparators(itemPath), itemPath.endsWith(path2.sep) || (itemPath = `${itemPath}${path2.sep}`)) : itemPath = pathHelper.safeTrimTrailingSeparator(itemPath), this.minimatch.match(itemPath) ? this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All : internal_match_kind_1.MatchKind.None;
    }
    partialMatch(itemPath) {
      return itemPath = pathHelper.safeTrimTrailingSeparator(itemPath), pathHelper.dirname(itemPath) === itemPath ? this.rootRegExp.test(itemPath) : this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], !0);
    }
    static globEscape(s) {
      return (IS_WINDOWS ? s : s.replace(/\\/g, "\\\\")).replace(/(\[)(?=[^/]+\])/g, "[[]").replace(/\?/g, "[?]").replace(/\*/g, "[*]");
    }
    static fixupPattern(pattern, homedir) {
      assert_1.default(pattern, "pattern cannot be empty");
      let literalSegments = new internal_path_1.Path(pattern).segments.map((x) => Pattern.getLiteral(x));
      if (assert_1.default(literalSegments.every((x, i) => (x !== "." || i === 0) && x !== ".."), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`), assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`), pattern = pathHelper.normalizeSeparators(pattern), pattern === "." || pattern.startsWith(`.${path2.sep}`))
        pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
      else if (pattern === "~" || pattern.startsWith(`~${path2.sep}`))
        homedir = homedir || os.homedir(), assert_1.default(homedir, "Unable to determine HOME directory"), assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`), pattern = Pattern.globEscape(homedir) + pattern.substr(1);
      else if (IS_WINDOWS && (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
        let root = pathHelper.ensureAbsoluteRoot("C:\\dummy-root", pattern.substr(0, 2));
        pattern.length > 2 && !root.endsWith("\\") && (root += "\\"), pattern = Pattern.globEscape(root) + pattern.substr(2);
      } else if (IS_WINDOWS && (pattern === "\\" || pattern.match(/^\\[^\\]/))) {
        let root = pathHelper.ensureAbsoluteRoot("C:\\dummy-root", "\\");
        root.endsWith("\\") || (root += "\\"), pattern = Pattern.globEscape(root) + pattern.substr(1);
      } else
        pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
      return pathHelper.normalizeSeparators(pattern);
    }
    static getLiteral(segment) {
      let literal = "";
      for (let i = 0; i < segment.length; i++) {
        let c = segment[i];
        if (c === "\\" && !IS_WINDOWS && i + 1 < segment.length) {
          literal += segment[++i];
          continue;
        } else {
          if (c === "*" || c === "?")
            return "";
          if (c === "[" && i + 1 < segment.length) {
            let set = "", closed = -1;
            for (let i2 = i + 1; i2 < segment.length; i2++) {
              let c2 = segment[i2];
              if (c2 === "\\" && !IS_WINDOWS && i2 + 1 < segment.length) {
                set += segment[++i2];
                continue;
              } else if (c2 === "]") {
                closed = i2;
                break;
              } else
                set += c2;
            }
            if (closed >= 0) {
              if (set.length > 1)
                return "";
              if (set) {
                literal += set, i = closed;
                continue;
              }
            }
          }
        }
        literal += c;
      }
      return literal;
    }
    static regExpEscape(s) {
      return s.replace(/[[\\^$.|?*+()]/g, "\\$&");
    }
  };
  __name(Pattern, "Pattern");
  exports2.Pattern = Pattern;
});

// node_modules/@actions/glob/lib/internal-search-state.js
var require_internal_search_state = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var SearchState = class {
    constructor(path2, level) {
      this.path = path2, this.level = level;
    }
  };
  __name(SearchState, "SearchState");
  exports2.SearchState = SearchState;
});

// node_modules/@actions/glob/lib/internal-globber.js
var require_internal_globber = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }, __asyncValues = exports2 && exports2.__asyncValues || function(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values == "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({value: v2, done: d});
      }, reject);
    }
  }, __await = exports2 && exports2.__await || function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }, __asyncGenerator = exports2 && exports2.__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      g[n] && (i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      });
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      f(v), q.shift(), q.length && resume(q[0][0], q[0][1]);
    }
  }, __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && (result[k] = mod[k]);
    return result.default = mod, result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var core = __importStar(require_core()), fs2 = __importStar(require("fs")), globOptionsHelper = __importStar(require_internal_glob_options_helper()), path2 = __importStar(require("path")), patternHelper = __importStar(require_internal_pattern_helper()), internal_match_kind_1 = require_internal_match_kind(), internal_pattern_1 = require_internal_pattern(), internal_search_state_1 = require_internal_search_state(), IS_WINDOWS = process.platform === "win32", DefaultGlobber = class {
    constructor(options) {
      this.patterns = [], this.searchPaths = [], this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
      return this.searchPaths.slice();
    }
    glob() {
      var e_1, _a;
      return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        try {
          for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done; ) {
            let itemPath = _c.value;
            result.push(itemPath);
          }
        } catch (e_1_1) {
          e_1 = {error: e_1_1};
        } finally {
          try {
            _c && !_c.done && (_a = _b.return) && (yield _a.call(_b));
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return result;
      });
    }
    globGenerator() {
      return __asyncGenerator(this, arguments, /* @__PURE__ */ __name(function* () {
        let options = globOptionsHelper.getOptions(this.options), patterns = [];
        for (let pattern of this.patterns)
          patterns.push(pattern), options.implicitDescendants && (pattern.trailingSeparator || pattern.segments[pattern.segments.length - 1] !== "**") && patterns.push(new internal_pattern_1.Pattern(pattern.negate, pattern.segments.concat("**")));
        let stack = [];
        for (let searchPath of patternHelper.getSearchPaths(patterns)) {
          core.debug(`Search path '${searchPath}'`);
          try {
            yield __await(fs2.promises.lstat(searchPath));
          } catch (err) {
            if (err.code === "ENOENT")
              continue;
            throw err;
          }
          stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
        }
        let traversalChain = [];
        for (; stack.length; ) {
          let item = stack.pop(), match = patternHelper.match(patterns, item.path), partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
          if (!match && !partialMatch)
            continue;
          let stats = yield __await(DefaultGlobber.stat(item, options, traversalChain));
          if (!!stats)
            if (stats.isDirectory()) {
              if (match & internal_match_kind_1.MatchKind.Directory)
                yield yield __await(item.path);
              else if (!partialMatch)
                continue;
              let childLevel = item.level + 1, childItems = (yield __await(fs2.promises.readdir(item.path))).map((x) => new internal_search_state_1.SearchState(path2.join(item.path, x), childLevel));
              stack.push(...childItems.reverse());
            } else
              match & internal_match_kind_1.MatchKind.File && (yield yield __await(item.path));
        }
      }, "globGenerator_1"));
    }
    static create(patterns, options) {
      return __awaiter(this, void 0, void 0, function* () {
        let result = new DefaultGlobber(options);
        IS_WINDOWS && (patterns = patterns.replace(/\r\n/g, `
`), patterns = patterns.replace(/\r/g, `
`));
        let lines = patterns.split(`
`).map((x) => x.trim());
        for (let line of lines)
          !line || line.startsWith("#") || result.patterns.push(new internal_pattern_1.Pattern(line));
        return result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns)), result;
      });
    }
    static stat(item, options, traversalChain) {
      return __awaiter(this, void 0, void 0, function* () {
        let stats;
        if (options.followSymbolicLinks)
          try {
            stats = yield fs2.promises.stat(item.path);
          } catch (err) {
            if (err.code === "ENOENT") {
              if (options.omitBrokenSymbolicLinks) {
                core.debug(`Broken symlink '${item.path}'`);
                return;
              }
              throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
            }
            throw err;
          }
        else
          stats = yield fs2.promises.lstat(item.path);
        if (stats.isDirectory() && options.followSymbolicLinks) {
          let realPath = yield fs2.promises.realpath(item.path);
          for (; traversalChain.length >= item.level; )
            traversalChain.pop();
          if (traversalChain.some((x) => x === realPath)) {
            core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
            return;
          }
          traversalChain.push(realPath);
        }
        return stats;
      });
    }
  };
  __name(DefaultGlobber, "DefaultGlobber");
  exports2.DefaultGlobber = DefaultGlobber;
});

// node_modules/@actions/glob/lib/glob.js
var require_glob = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return __name(adopt, "adopt"), new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(fulfilled, "fulfilled");
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      __name(rejected, "rejected");
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      __name(step, "step"), step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var internal_globber_1 = require_internal_globber();
  function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
  }
  __name(create, "create");
  exports2.create = create;
});

// node_modules/yaml/dist/PlainValue-ec8e588e.js
var require_PlainValue_ec8e588e = __commonJS((exports2) => {
  "use strict";
  var Char = {
    ANCHOR: "&",
    COMMENT: "#",
    TAG: "!",
    DIRECTIVES_END: "-",
    DOCUMENT_END: "."
  }, Type = {
    ALIAS: "ALIAS",
    BLANK_LINE: "BLANK_LINE",
    BLOCK_FOLDED: "BLOCK_FOLDED",
    BLOCK_LITERAL: "BLOCK_LITERAL",
    COMMENT: "COMMENT",
    DIRECTIVE: "DIRECTIVE",
    DOCUMENT: "DOCUMENT",
    FLOW_MAP: "FLOW_MAP",
    FLOW_SEQ: "FLOW_SEQ",
    MAP: "MAP",
    MAP_KEY: "MAP_KEY",
    MAP_VALUE: "MAP_VALUE",
    PLAIN: "PLAIN",
    QUOTE_DOUBLE: "QUOTE_DOUBLE",
    QUOTE_SINGLE: "QUOTE_SINGLE",
    SEQ: "SEQ",
    SEQ_ITEM: "SEQ_ITEM"
  }, defaultTagPrefix = "tag:yaml.org,2002:", defaultTags = {
    MAP: "tag:yaml.org,2002:map",
    SEQ: "tag:yaml.org,2002:seq",
    STR: "tag:yaml.org,2002:str"
  };
  function findLineStarts(src) {
    let ls = [0], offset = src.indexOf(`
`);
    for (; offset !== -1; )
      offset += 1, ls.push(offset), offset = src.indexOf(`
`, offset);
    return ls;
  }
  __name(findLineStarts, "findLineStarts");
  function getSrcInfo(cst) {
    let lineStarts, src;
    return typeof cst == "string" ? (lineStarts = findLineStarts(cst), src = cst) : (Array.isArray(cst) && (cst = cst[0]), cst && cst.context && (cst.lineStarts || (cst.lineStarts = findLineStarts(cst.context.src)), lineStarts = cst.lineStarts, src = cst.context.src)), {
      lineStarts,
      src
    };
  }
  __name(getSrcInfo, "getSrcInfo");
  function getLinePos(offset, cst) {
    if (typeof offset != "number" || offset < 0)
      return null;
    let {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !src || offset > src.length)
      return null;
    for (let i = 0; i < lineStarts.length; ++i) {
      let start = lineStarts[i];
      if (offset < start)
        return {
          line: i,
          col: offset - lineStarts[i - 1] + 1
        };
      if (offset === start)
        return {
          line: i + 1,
          col: 1
        };
    }
    let line = lineStarts.length;
    return {
      line,
      col: offset - lineStarts[line - 1] + 1
    };
  }
  __name(getLinePos, "getLinePos");
  function getLine(line, cst) {
    let {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !(line >= 1) || line > lineStarts.length)
      return null;
    let start = lineStarts[line - 1], end = lineStarts[line];
    for (; end && end > start && src[end - 1] === `
`; )
      --end;
    return src.slice(start, end);
  }
  __name(getLine, "getLine");
  function getPrettyContext({
    start,
    end
  }, cst, maxWidth = 80) {
    let src = getLine(start.line, cst);
    if (!src)
      return null;
    let {
      col
    } = start;
    if (src.length > maxWidth)
      if (col <= maxWidth - 10)
        src = src.substr(0, maxWidth - 1) + "\u2026";
      else {
        let halfWidth = Math.round(maxWidth / 2);
        src.length > col + halfWidth && (src = src.substr(0, col + halfWidth - 1) + "\u2026"), col -= src.length - maxWidth, src = "\u2026" + src.substr(1 - maxWidth);
      }
    let errLen = 1, errEnd = "";
    end && (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1 ? errLen = end.col - start.col : (errLen = Math.min(src.length + 1, maxWidth) - col, errEnd = "\u2026"));
    let offset = col > 1 ? " ".repeat(col - 1) : "", err = "^".repeat(errLen);
    return `${src}
${offset}${err}${errEnd}`;
  }
  __name(getPrettyContext, "getPrettyContext");
  var Range = class {
    static copy(orig) {
      return new Range(orig.start, orig.end);
    }
    constructor(start, end) {
      this.start = start, this.end = end || start;
    }
    isEmpty() {
      return typeof this.start != "number" || !this.end || this.end <= this.start;
    }
    setOrigRange(cr, offset) {
      let {
        start,
        end
      } = this;
      if (cr.length === 0 || end <= cr[0])
        return this.origStart = start, this.origEnd = end, offset;
      let i = offset;
      for (; i < cr.length && !(cr[i] > start); )
        ++i;
      this.origStart = start + i;
      let nextOffset = i;
      for (; i < cr.length && !(cr[i] >= end); )
        ++i;
      return this.origEnd = end + i, nextOffset;
    }
  };
  __name(Range, "Range");
  var Node = class {
    static addStringTerminator(src, offset, str) {
      if (str[str.length - 1] === `
`)
        return str;
      let next = Node.endOfWhiteSpace(src, offset);
      return next >= src.length || src[next] === `
` ? str + `
` : str;
    }
    static atDocumentBoundary(src, offset, sep) {
      let ch0 = src[offset];
      if (!ch0)
        return !0;
      let prev = src[offset - 1];
      if (prev && prev !== `
`)
        return !1;
      if (sep) {
        if (ch0 !== sep)
          return !1;
      } else if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END)
        return !1;
      let ch1 = src[offset + 1], ch2 = src[offset + 2];
      if (ch1 !== ch0 || ch2 !== ch0)
        return !1;
      let ch3 = src[offset + 3];
      return !ch3 || ch3 === `
` || ch3 === "	" || ch3 === " ";
    }
    static endOfIdentifier(src, offset) {
      let ch = src[offset], isVerbatim = ch === "<", notOk = isVerbatim ? [`
`, "	", " ", ">"] : [`
`, "	", " ", "[", "]", "{", "}", ","];
      for (; ch && notOk.indexOf(ch) === -1; )
        ch = src[offset += 1];
      return isVerbatim && ch === ">" && (offset += 1), offset;
    }
    static endOfIndent(src, offset) {
      let ch = src[offset];
      for (; ch === " "; )
        ch = src[offset += 1];
      return offset;
    }
    static endOfLine(src, offset) {
      let ch = src[offset];
      for (; ch && ch !== `
`; )
        ch = src[offset += 1];
      return offset;
    }
    static endOfWhiteSpace(src, offset) {
      let ch = src[offset];
      for (; ch === "	" || ch === " "; )
        ch = src[offset += 1];
      return offset;
    }
    static startOfLine(src, offset) {
      let ch = src[offset - 1];
      if (ch === `
`)
        return offset;
      for (; ch && ch !== `
`; )
        ch = src[offset -= 1];
      return offset + 1;
    }
    static endOfBlockIndent(src, indent, lineStart) {
      let inEnd = Node.endOfIndent(src, lineStart);
      if (inEnd > lineStart + indent)
        return inEnd;
      {
        let wsEnd = Node.endOfWhiteSpace(src, inEnd), ch = src[wsEnd];
        if (!ch || ch === `
`)
          return wsEnd;
      }
      return null;
    }
    static atBlank(src, offset, endAsBlank) {
      let ch = src[offset];
      return ch === `
` || ch === "	" || ch === " " || endAsBlank && !ch;
    }
    static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
      return !ch || indentDiff < 0 ? !1 : indentDiff > 0 ? !0 : indicatorAsIndent && ch === "-";
    }
    static normalizeOffset(src, offset) {
      let ch = src[offset];
      return ch ? ch !== `
` && src[offset - 1] === `
` ? offset - 1 : Node.endOfWhiteSpace(src, offset) : offset;
    }
    static foldNewline(src, offset, indent) {
      let inCount = 0, error = !1, fold = "", ch = src[offset + 1];
      for (; ch === " " || ch === "	" || ch === `
`; ) {
        switch (ch) {
          case `
`:
            inCount = 0, offset += 1, fold += `
`;
            break;
          case "	":
            inCount <= indent && (error = !0), offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
            break;
          case " ":
            inCount += 1, offset += 1;
            break;
        }
        ch = src[offset + 1];
      }
      return fold || (fold = " "), ch && inCount <= indent && (error = !0), {
        fold,
        offset,
        error
      };
    }
    constructor(type, props, context) {
      Object.defineProperty(this, "context", {
        value: context || null,
        writable: !0
      }), this.error = null, this.range = null, this.valueRange = null, this.props = props || [], this.type = type, this.value = null;
    }
    getPropValue(idx, key, skipKey) {
      if (!this.context)
        return null;
      let {
        src
      } = this.context, prop = this.props[idx];
      return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
    }
    get anchor() {
      for (let i = 0; i < this.props.length; ++i) {
        let anchor = this.getPropValue(i, Char.ANCHOR, !0);
        if (anchor != null)
          return anchor;
      }
      return null;
    }
    get comment() {
      let comments = [];
      for (let i = 0; i < this.props.length; ++i) {
        let comment = this.getPropValue(i, Char.COMMENT, !0);
        comment != null && comments.push(comment);
      }
      return comments.length > 0 ? comments.join(`
`) : null;
    }
    commentHasRequiredWhitespace(start) {
      let {
        src
      } = this.context;
      if (this.header && start === this.header.end || !this.valueRange)
        return !1;
      let {
        end
      } = this.valueRange;
      return start !== end || Node.atBlank(src, end - 1);
    }
    get hasComment() {
      if (this.context) {
        let {
          src
        } = this.context;
        for (let i = 0; i < this.props.length; ++i)
          if (src[this.props[i].start] === Char.COMMENT)
            return !0;
      }
      return !1;
    }
    get hasProps() {
      if (this.context) {
        let {
          src
        } = this.context;
        for (let i = 0; i < this.props.length; ++i)
          if (src[this.props[i].start] !== Char.COMMENT)
            return !0;
      }
      return !1;
    }
    get includesTrailingLines() {
      return !1;
    }
    get jsonLike() {
      return [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE].indexOf(this.type) !== -1;
    }
    get rangeAsLinePos() {
      if (!this.range || !this.context)
        return;
      let start = getLinePos(this.range.start, this.context.root);
      if (!start)
        return;
      let end = getLinePos(this.range.end, this.context.root);
      return {
        start,
        end
      };
    }
    get rawValue() {
      if (!this.valueRange || !this.context)
        return null;
      let {
        start,
        end
      } = this.valueRange;
      return this.context.src.slice(start, end);
    }
    get tag() {
      for (let i = 0; i < this.props.length; ++i) {
        let tag = this.getPropValue(i, Char.TAG, !1);
        if (tag != null) {
          if (tag[1] === "<")
            return {
              verbatim: tag.slice(2, -1)
            };
          {
            let [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
            return {
              handle,
              suffix
            };
          }
        }
      }
      return null;
    }
    get valueRangeContainsNewline() {
      if (!this.valueRange || !this.context)
        return !1;
      let {
        start,
        end
      } = this.valueRange, {
        src
      } = this.context;
      for (let i = start; i < end; ++i)
        if (src[i] === `
`)
          return !0;
      return !1;
    }
    parseComment(start) {
      let {
        src
      } = this.context;
      if (src[start] === Char.COMMENT) {
        let end = Node.endOfLine(src, start + 1), commentRange = new Range(start, end);
        return this.props.push(commentRange), end;
      }
      return start;
    }
    setOrigRanges(cr, offset) {
      return this.range && (offset = this.range.setOrigRange(cr, offset)), this.valueRange && this.valueRange.setOrigRange(cr, offset), this.props.forEach((prop) => prop.setOrigRange(cr, offset)), offset;
    }
    toString() {
      let {
        context: {
          src
        },
        range,
        value
      } = this;
      if (value != null)
        return value;
      let str = src.slice(range.start, range.end);
      return Node.addStringTerminator(src, range.end, str);
    }
  };
  __name(Node, "Node");
  var YAMLError = class extends Error {
    constructor(name, source, message) {
      if (!message || !(source instanceof Node))
        throw new Error(`Invalid arguments for new ${name}`);
      super();
      this.name = name, this.message = message, this.source = source;
    }
    makePretty() {
      if (!this.source)
        return;
      this.nodeType = this.source.type;
      let cst = this.source.context && this.source.context.root;
      if (typeof this.offset == "number") {
        this.range = new Range(this.offset, this.offset + 1);
        let start = cst && getLinePos(this.offset, cst);
        if (start) {
          let end = {
            line: start.line,
            col: start.col + 1
          };
          this.linePos = {
            start,
            end
          };
        }
        delete this.offset;
      } else
        this.range = this.source.range, this.linePos = this.source.rangeAsLinePos;
      if (this.linePos) {
        let {
          line,
          col
        } = this.linePos.start;
        this.message += ` at line ${line}, column ${col}`;
        let ctx = cst && getPrettyContext(this.linePos, cst);
        ctx && (this.message += `:

${ctx}
`);
      }
      delete this.source;
    }
  };
  __name(YAMLError, "YAMLError");
  var YAMLReferenceError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLReferenceError", source, message);
    }
  };
  __name(YAMLReferenceError, "YAMLReferenceError");
  var YAMLSemanticError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLSemanticError", source, message);
    }
  };
  __name(YAMLSemanticError, "YAMLSemanticError");
  var YAMLSyntaxError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLSyntaxError", source, message);
    }
  };
  __name(YAMLSyntaxError, "YAMLSyntaxError");
  var YAMLWarning = class extends YAMLError {
    constructor(source, message) {
      super("YAMLWarning", source, message);
    }
  };
  __name(YAMLWarning, "YAMLWarning");
  function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
      value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : obj[key] = value, obj;
  }
  __name(_defineProperty, "_defineProperty");
  var PlainValue = class extends Node {
    static endOfLine(src, start, inFlow) {
      let ch = src[start], offset = start;
      for (; ch && ch !== `
` && !(inFlow && (ch === "[" || ch === "]" || ch === "{" || ch === "}" || ch === ",")); ) {
        let next = src[offset + 1];
        if (ch === ":" && (!next || next === `
` || next === "	" || next === " " || inFlow && next === ",") || (ch === " " || ch === "	") && next === "#")
          break;
        offset += 1, ch = next;
      }
      return offset;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let {
        start,
        end
      } = this.valueRange, {
        src
      } = this.context, ch = src[end - 1];
      for (; start < end && (ch === `
` || ch === "	" || ch === " "); )
        ch = src[--end - 1];
      let str = "";
      for (let i = start; i < end; ++i) {
        let ch2 = src[i];
        if (ch2 === `
`) {
          let {
            fold,
            offset
          } = Node.foldNewline(src, i, -1);
          str += fold, i = offset;
        } else if (ch2 === " " || ch2 === "	") {
          let wsStart = i, next = src[i + 1];
          for (; i < end && (next === " " || next === "	"); )
            i += 1, next = src[i + 1];
          next !== `
` && (str += i > wsStart ? src.slice(wsStart, i + 1) : ch2);
        } else
          str += ch2;
      }
      let ch0 = src[start];
      switch (ch0) {
        case "	": {
          let msg = "Plain value cannot start with a tab character";
          return {
            errors: [new YAMLSemanticError(this, msg)],
            str
          };
        }
        case "@":
        case "`": {
          let msg = `Plain value cannot start with reserved character ${ch0}`;
          return {
            errors: [new YAMLSemanticError(this, msg)],
            str
          };
        }
        default:
          return str;
      }
    }
    parseBlockValue(start) {
      let {
        indent,
        inFlow,
        src
      } = this.context, offset = start, valueEnd = start;
      for (let ch = src[offset]; ch === `
` && !Node.atDocumentBoundary(src, offset + 1); ch = src[offset]) {
        let end = Node.endOfBlockIndent(src, indent, offset + 1);
        if (end === null || src[end] === "#")
          break;
        src[end] === `
` ? offset = end : (valueEnd = PlainValue.endOfLine(src, end, inFlow), offset = valueEnd);
      }
      return this.valueRange.isEmpty() && (this.valueRange.start = start), this.valueRange.end = valueEnd, valueEnd;
    }
    parse(context, start) {
      this.context = context;
      let {
        inFlow,
        src
      } = context, offset = start, ch = src[offset];
      return ch && ch !== "#" && ch !== `
` && (offset = PlainValue.endOfLine(src, start, inFlow)), this.valueRange = new Range(start, offset), offset = Node.endOfWhiteSpace(src, offset), offset = this.parseComment(offset), (!this.hasComment || this.valueRange.isEmpty()) && (offset = this.parseBlockValue(offset)), offset;
    }
  };
  __name(PlainValue, "PlainValue");
  exports2.Char = Char;
  exports2.Node = Node;
  exports2.PlainValue = PlainValue;
  exports2.Range = Range;
  exports2.Type = Type;
  exports2.YAMLError = YAMLError;
  exports2.YAMLReferenceError = YAMLReferenceError;
  exports2.YAMLSemanticError = YAMLSemanticError;
  exports2.YAMLSyntaxError = YAMLSyntaxError;
  exports2.YAMLWarning = YAMLWarning;
  exports2._defineProperty = _defineProperty;
  exports2.defaultTagPrefix = defaultTagPrefix;
  exports2.defaultTags = defaultTags;
});

// node_modules/yaml/dist/parse-cst.js
var require_parse_cst = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e(), BlankLine = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.BLANK_LINE);
    }
    get includesTrailingLines() {
      return !0;
    }
    parse(context, start) {
      return this.context = context, this.range = new PlainValue.Range(start, start + 1), start + 1;
    }
  };
  __name(BlankLine, "BlankLine");
  var CollectionItem = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.node = null;
    }
    get includesTrailingLines() {
      return !!this.node && this.node.includesTrailingLines;
    }
    parse(context, start) {
      this.context = context;
      let {
        parseNode,
        src
      } = context, {
        atLineStart,
        lineStart
      } = context;
      !atLineStart && this.type === PlainValue.Type.SEQ_ITEM && (this.error = new PlainValue.YAMLSemanticError(this, "Sequence items must not have preceding content on the same line"));
      let indent = atLineStart ? start - lineStart : context.indent, offset = PlainValue.Node.endOfWhiteSpace(src, start + 1), ch = src[offset], inlineComment = ch === "#", comments = [], blankLine = null;
      for (; ch === `
` || ch === "#"; ) {
        if (ch === "#") {
          let end2 = PlainValue.Node.endOfLine(src, offset + 1);
          comments.push(new PlainValue.Range(offset, end2)), offset = end2;
        } else {
          atLineStart = !0, lineStart = offset + 1;
          let wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);
          src[wsEnd] === `
` && comments.length === 0 && (blankLine = new BlankLine(), lineStart = blankLine.parse({
            src
          }, lineStart)), offset = PlainValue.Node.endOfIndent(src, lineStart);
        }
        ch = src[offset];
      }
      if (PlainValue.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== PlainValue.Type.SEQ_ITEM) ? this.node = parseNode({
        atLineStart,
        inCollection: !1,
        indent,
        lineStart,
        parent: this
      }, offset) : ch && lineStart > start + 1 && (offset = lineStart - 1), this.node) {
        if (blankLine) {
          let items = context.parent.items || context.parent.contents;
          items && items.push(blankLine);
        }
        comments.length && Array.prototype.push.apply(this.props, comments), offset = this.node.range.end;
      } else if (inlineComment) {
        let c = comments[0];
        this.props.push(c), offset = c.end;
      } else
        offset = PlainValue.Node.endOfLine(src, start + 1);
      let end = this.node ? this.node.valueRange.end : offset;
      return this.valueRange = new PlainValue.Range(start, end), offset;
    }
    setOrigRanges(cr, offset) {
      return offset = super.setOrigRanges(cr, offset), this.node ? this.node.setOrigRanges(cr, offset) : offset;
    }
    toString() {
      let {
        context: {
          src
        },
        node,
        range,
        value
      } = this;
      if (value != null)
        return value;
      let str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
      return PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  __name(CollectionItem, "CollectionItem");
  var Comment = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.COMMENT);
    }
    parse(context, start) {
      this.context = context;
      let offset = this.parseComment(start);
      return this.range = new PlainValue.Range(start, offset), offset;
    }
  };
  __name(Comment, "Comment");
  function grabCollectionEndComments(node) {
    let cnode = node;
    for (; cnode instanceof CollectionItem; )
      cnode = cnode.node;
    if (!(cnode instanceof Collection))
      return null;
    let len = cnode.items.length, ci = -1;
    for (let i = len - 1; i >= 0; --i) {
      let n = cnode.items[i];
      if (n.type === PlainValue.Type.COMMENT) {
        let {
          indent,
          lineStart
        } = n.context;
        if (indent > 0 && n.range.start >= lineStart + indent)
          break;
        ci = i;
      } else if (n.type === PlainValue.Type.BLANK_LINE)
        ci = i;
      else
        break;
    }
    if (ci === -1)
      return null;
    let ca = cnode.items.splice(ci, len - ci), prevEnd = ca[0].range.start;
    for (; cnode.range.end = prevEnd, cnode.valueRange && cnode.valueRange.end > prevEnd && (cnode.valueRange.end = prevEnd), cnode !== node; )
      cnode = cnode.context.parent;
    return ca;
  }
  __name(grabCollectionEndComments, "grabCollectionEndComments");
  var Collection = class extends PlainValue.Node {
    static nextContentHasIndent(src, offset, indent) {
      let lineStart = PlainValue.Node.endOfLine(src, offset) + 1;
      offset = PlainValue.Node.endOfWhiteSpace(src, lineStart);
      let ch = src[offset];
      return ch ? offset >= lineStart + indent ? !0 : ch !== "#" && ch !== `
` ? !1 : Collection.nextContentHasIndent(src, offset, indent) : !1;
    }
    constructor(firstItem) {
      super(firstItem.type === PlainValue.Type.SEQ_ITEM ? PlainValue.Type.SEQ : PlainValue.Type.MAP);
      for (let i = firstItem.props.length - 1; i >= 0; --i)
        if (firstItem.props[i].start < firstItem.context.lineStart) {
          this.props = firstItem.props.slice(0, i + 1), firstItem.props = firstItem.props.slice(i + 1);
          let itemRange = firstItem.props[0] || firstItem.valueRange;
          firstItem.range.start = itemRange.start;
          break;
        }
      this.items = [firstItem];
      let ec = grabCollectionEndComments(firstItem);
      ec && Array.prototype.push.apply(this.items, ec);
    }
    get includesTrailingLines() {
      return this.items.length > 0;
    }
    parse(context, start) {
      this.context = context;
      let {
        parseNode,
        src
      } = context, lineStart = PlainValue.Node.startOfLine(src, start), firstItem = this.items[0];
      firstItem.context.parent = this, this.valueRange = PlainValue.Range.copy(firstItem.valueRange);
      let indent = firstItem.range.start - firstItem.context.lineStart, offset = start;
      offset = PlainValue.Node.normalizeOffset(src, offset);
      let ch = src[offset], atLineStart = PlainValue.Node.endOfWhiteSpace(src, lineStart) === offset, prevIncludesTrailingLines = !1;
      for (; ch; ) {
        for (; ch === `
` || ch === "#"; ) {
          if (atLineStart && ch === `
` && !prevIncludesTrailingLines) {
            let blankLine = new BlankLine();
            if (offset = blankLine.parse({
              src
            }, offset), this.valueRange.end = offset, offset >= src.length) {
              ch = null;
              break;
            }
            this.items.push(blankLine), offset -= 1;
          } else if (ch === "#") {
            if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent))
              return offset;
            let comment = new Comment();
            if (offset = comment.parse({
              indent,
              lineStart,
              src
            }, offset), this.items.push(comment), this.valueRange.end = offset, offset >= src.length) {
              ch = null;
              break;
            }
          }
          if (lineStart = offset + 1, offset = PlainValue.Node.endOfIndent(src, lineStart), PlainValue.Node.atBlank(src, offset)) {
            let wsEnd = PlainValue.Node.endOfWhiteSpace(src, offset), next = src[wsEnd];
            (!next || next === `
` || next === "#") && (offset = wsEnd);
          }
          ch = src[offset], atLineStart = !0;
        }
        if (!ch)
          break;
        if (offset !== lineStart + indent && (atLineStart || ch !== ":")) {
          if (offset < lineStart + indent) {
            lineStart > start && (offset = lineStart);
            break;
          } else if (!this.error) {
            let msg = "All collection items must start at the same column";
            this.error = new PlainValue.YAMLSyntaxError(this, msg);
          }
        }
        if (firstItem.type === PlainValue.Type.SEQ_ITEM) {
          if (ch !== "-") {
            lineStart > start && (offset = lineStart);
            break;
          }
        } else if (ch === "-" && !this.error) {
          let next = src[offset + 1];
          if (!next || next === `
` || next === "	" || next === " ") {
            let msg = "A collection cannot be both a mapping and a sequence";
            this.error = new PlainValue.YAMLSyntaxError(this, msg);
          }
        }
        let node = parseNode({
          atLineStart,
          inCollection: !0,
          indent,
          lineStart,
          parent: this
        }, offset);
        if (!node)
          return offset;
        if (this.items.push(node), this.valueRange.end = node.valueRange.end, offset = PlainValue.Node.normalizeOffset(src, node.range.end), ch = src[offset], atLineStart = !1, prevIncludesTrailingLines = node.includesTrailingLines, ch) {
          let ls = offset - 1, prev = src[ls];
          for (; prev === " " || prev === "	"; )
            prev = src[--ls];
          prev === `
` && (lineStart = ls + 1, atLineStart = !0);
        }
        let ec = grabCollectionEndComments(node);
        ec && Array.prototype.push.apply(this.items, ec);
      }
      return offset;
    }
    setOrigRanges(cr, offset) {
      return offset = super.setOrigRanges(cr, offset), this.items.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      }), offset;
    }
    toString() {
      let {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null)
        return value;
      let str = src.slice(range.start, items[0].range.start) + String(items[0]);
      for (let i = 1; i < items.length; ++i) {
        let item = items[i], {
          atLineStart,
          indent
        } = item.context;
        if (atLineStart)
          for (let i2 = 0; i2 < indent; ++i2)
            str += " ";
        str += String(item);
      }
      return PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  __name(Collection, "Collection");
  var Directive = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.DIRECTIVE);
      this.name = null;
    }
    get parameters() {
      let raw = this.rawValue;
      return raw ? raw.trim().split(/[ \t]+/) : [];
    }
    parseName(start) {
      let {
        src
      } = this.context, offset = start, ch = src[offset];
      for (; ch && ch !== `
` && ch !== "	" && ch !== " "; )
        ch = src[offset += 1];
      return this.name = src.slice(start, offset), offset;
    }
    parseParameters(start) {
      let {
        src
      } = this.context, offset = start, ch = src[offset];
      for (; ch && ch !== `
` && ch !== "#"; )
        ch = src[offset += 1];
      return this.valueRange = new PlainValue.Range(start, offset), offset;
    }
    parse(context, start) {
      this.context = context;
      let offset = this.parseName(start + 1);
      return offset = this.parseParameters(offset), offset = this.parseComment(offset), this.range = new PlainValue.Range(start, offset), offset;
    }
  };
  __name(Directive, "Directive");
  var Document = class extends PlainValue.Node {
    static startCommentOrEndBlankLine(src, start) {
      let offset = PlainValue.Node.endOfWhiteSpace(src, start), ch = src[offset];
      return ch === "#" || ch === `
` ? offset : start;
    }
    constructor() {
      super(PlainValue.Type.DOCUMENT);
      this.directives = null, this.contents = null, this.directivesEndMarker = null, this.documentEndMarker = null;
    }
    parseDirectives(start) {
      let {
        src
      } = this.context;
      this.directives = [];
      let atLineStart = !0, hasDirectives = !1, offset = start;
      for (; !PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DIRECTIVES_END); )
        switch (offset = Document.startCommentOrEndBlankLine(src, offset), src[offset]) {
          case `
`:
            if (atLineStart) {
              let blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset), offset < src.length && this.directives.push(blankLine);
            } else
              offset += 1, atLineStart = !0;
            break;
          case "#":
            {
              let comment = new Comment();
              offset = comment.parse({
                src
              }, offset), this.directives.push(comment), atLineStart = !1;
            }
            break;
          case "%":
            {
              let directive = new Directive();
              offset = directive.parse({
                parent: this,
                src
              }, offset), this.directives.push(directive), hasDirectives = !0, atLineStart = !1;
            }
            break;
          default:
            return hasDirectives ? this.error = new PlainValue.YAMLSemanticError(this, "Missing directives-end indicator line") : this.directives.length > 0 && (this.contents = this.directives, this.directives = []), offset;
        }
      return src[offset] ? (this.directivesEndMarker = new PlainValue.Range(offset, offset + 3), offset + 3) : (hasDirectives ? this.error = new PlainValue.YAMLSemanticError(this, "Missing directives-end indicator line") : this.directives.length > 0 && (this.contents = this.directives, this.directives = []), offset);
    }
    parseContents(start) {
      let {
        parseNode,
        src
      } = this.context;
      this.contents || (this.contents = []);
      let lineStart = start;
      for (; src[lineStart - 1] === "-"; )
        lineStart -= 1;
      let offset = PlainValue.Node.endOfWhiteSpace(src, start), atLineStart = lineStart === start;
      for (this.valueRange = new PlainValue.Range(offset); !PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DOCUMENT_END); ) {
        switch (src[offset]) {
          case `
`:
            if (atLineStart) {
              let blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset), offset < src.length && this.contents.push(blankLine);
            } else
              offset += 1, atLineStart = !0;
            lineStart = offset;
            break;
          case "#":
            {
              let comment = new Comment();
              offset = comment.parse({
                src
              }, offset), this.contents.push(comment), atLineStart = !1;
            }
            break;
          default: {
            let iEnd = PlainValue.Node.endOfIndent(src, offset), node = parseNode({
              atLineStart,
              indent: -1,
              inFlow: !1,
              inCollection: !1,
              lineStart,
              parent: this
            }, iEnd);
            if (!node)
              return this.valueRange.end = iEnd;
            this.contents.push(node), offset = node.range.end, atLineStart = !1;
            let ec = grabCollectionEndComments(node);
            ec && Array.prototype.push.apply(this.contents, ec);
          }
        }
        offset = Document.startCommentOrEndBlankLine(src, offset);
      }
      if (this.valueRange.end = offset, src[offset] && (this.documentEndMarker = new PlainValue.Range(offset, offset + 3), offset += 3, src[offset])) {
        if (offset = PlainValue.Node.endOfWhiteSpace(src, offset), src[offset] === "#") {
          let comment = new Comment();
          offset = comment.parse({
            src
          }, offset), this.contents.push(comment);
        }
        switch (src[offset]) {
          case `
`:
            offset += 1;
            break;
          case void 0:
            break;
          default:
            this.error = new PlainValue.YAMLSyntaxError(this, "Document end marker line cannot have a non-comment suffix");
        }
      }
      return offset;
    }
    parse(context, start) {
      context.root = this, this.context = context;
      let {
        src
      } = context, offset = src.charCodeAt(start) === 65279 ? start + 1 : start;
      return offset = this.parseDirectives(offset), offset = this.parseContents(offset), offset;
    }
    setOrigRanges(cr, offset) {
      return offset = super.setOrigRanges(cr, offset), this.directives.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      }), this.directivesEndMarker && (offset = this.directivesEndMarker.setOrigRange(cr, offset)), this.contents.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      }), this.documentEndMarker && (offset = this.documentEndMarker.setOrigRange(cr, offset)), offset;
    }
    toString() {
      let {
        contents,
        directives,
        value
      } = this;
      if (value != null)
        return value;
      let str = directives.join("");
      return contents.length > 0 && ((directives.length > 0 || contents[0].type === PlainValue.Type.COMMENT) && (str += `---
`), str += contents.join("")), str[str.length - 1] !== `
` && (str += `
`), str;
    }
  };
  __name(Document, "Document");
  var Alias = class extends PlainValue.Node {
    parse(context, start) {
      this.context = context;
      let {
        src
      } = context, offset = PlainValue.Node.endOfIdentifier(src, start + 1);
      return this.valueRange = new PlainValue.Range(start + 1, offset), offset = PlainValue.Node.endOfWhiteSpace(src, offset), offset = this.parseComment(offset), offset;
    }
  };
  __name(Alias, "Alias");
  var Chomp = {
    CLIP: "CLIP",
    KEEP: "KEEP",
    STRIP: "STRIP"
  }, BlockValue = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.blockIndent = null, this.chomping = Chomp.CLIP, this.header = null;
    }
    get includesTrailingLines() {
      return this.chomping === Chomp.KEEP;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let {
        start,
        end
      } = this.valueRange, {
        indent,
        src
      } = this.context;
      if (this.valueRange.isEmpty())
        return "";
      let lastNewLine = null, ch = src[end - 1];
      for (; ch === `
` || ch === "	" || ch === " "; ) {
        if (end -= 1, end <= start) {
          if (this.chomping === Chomp.KEEP)
            break;
          return "";
        }
        ch === `
` && (lastNewLine = end), ch = src[end - 1];
      }
      let keepStart = end + 1;
      lastNewLine && (this.chomping === Chomp.KEEP ? (keepStart = lastNewLine, end = this.valueRange.end) : end = lastNewLine);
      let bi = indent + this.blockIndent, folded = this.type === PlainValue.Type.BLOCK_FOLDED, atStart = !0, str = "", sep = "", prevMoreIndented = !1;
      for (let i = start; i < end; ++i) {
        for (let j = 0; j < bi && src[i] === " "; ++j)
          i += 1;
        let ch2 = src[i];
        if (ch2 === `
`)
          sep === `
` ? str += `
` : sep = `
`;
        else {
          let lineEnd = PlainValue.Node.endOfLine(src, i), line = src.slice(i, lineEnd);
          i = lineEnd, folded && (ch2 === " " || ch2 === "	") && i < keepStart ? (sep === " " ? sep = `
` : !prevMoreIndented && !atStart && sep === `
` && (sep = `

`), str += sep + line, sep = lineEnd < end && src[lineEnd] || "", prevMoreIndented = !0) : (str += sep + line, sep = folded && i < keepStart ? " " : `
`, prevMoreIndented = !1), atStart && line !== "" && (atStart = !1);
        }
      }
      return this.chomping === Chomp.STRIP ? str : str + `
`;
    }
    parseBlockHeader(start) {
      let {
        src
      } = this.context, offset = start + 1, bi = "";
      for (; ; ) {
        let ch = src[offset];
        switch (ch) {
          case "-":
            this.chomping = Chomp.STRIP;
            break;
          case "+":
            this.chomping = Chomp.KEEP;
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            bi += ch;
            break;
          default:
            return this.blockIndent = Number(bi) || null, this.header = new PlainValue.Range(start, offset), offset;
        }
        offset += 1;
      }
    }
    parseBlockValue(start) {
      let {
        indent,
        src
      } = this.context, explicit = !!this.blockIndent, offset = start, valueEnd = start, minBlockIndent = 1;
      for (let ch = src[offset]; ch === `
` && (offset += 1, !PlainValue.Node.atDocumentBoundary(src, offset)); ch = src[offset]) {
        let end = PlainValue.Node.endOfBlockIndent(src, indent, offset);
        if (end === null)
          break;
        let ch2 = src[end], lineIndent = end - (offset + indent);
        if (this.blockIndent) {
          if (ch2 && ch2 !== `
` && lineIndent < this.blockIndent) {
            if (src[end] === "#")
              break;
            if (!this.error) {
              let msg = `Block scalars must not be less indented than their ${explicit ? "explicit indentation indicator" : "first line"}`;
              this.error = new PlainValue.YAMLSemanticError(this, msg);
            }
          }
        } else if (src[end] !== `
`) {
          if (lineIndent < minBlockIndent) {
            let msg = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            this.error = new PlainValue.YAMLSemanticError(this, msg);
          }
          this.blockIndent = lineIndent;
        } else
          lineIndent > minBlockIndent && (minBlockIndent = lineIndent);
        src[end] === `
` ? offset = end : offset = valueEnd = PlainValue.Node.endOfLine(src, end);
      }
      return this.chomping !== Chomp.KEEP && (offset = src[valueEnd] ? valueEnd + 1 : valueEnd), this.valueRange = new PlainValue.Range(start + 1, offset), offset;
    }
    parse(context, start) {
      this.context = context;
      let {
        src
      } = context, offset = this.parseBlockHeader(start);
      return offset = PlainValue.Node.endOfWhiteSpace(src, offset), offset = this.parseComment(offset), offset = this.parseBlockValue(offset), offset;
    }
    setOrigRanges(cr, offset) {
      return offset = super.setOrigRanges(cr, offset), this.header ? this.header.setOrigRange(cr, offset) : offset;
    }
  };
  __name(BlockValue, "BlockValue");
  var FlowCollection = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.items = null;
    }
    prevNodeIsJsonLike(idx = this.items.length) {
      let node = this.items[idx - 1];
      return !!node && (node.jsonLike || node.type === PlainValue.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
    }
    parse(context, start) {
      this.context = context;
      let {
        parseNode,
        src
      } = context, {
        indent,
        lineStart
      } = context, char = src[start];
      this.items = [{
        char,
        offset: start
      }];
      let offset = PlainValue.Node.endOfWhiteSpace(src, start + 1);
      for (char = src[offset]; char && char !== "]" && char !== "}"; ) {
        switch (char) {
          case `
`:
            {
              lineStart = offset + 1;
              let wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);
              if (src[wsEnd] === `
`) {
                let blankLine = new BlankLine();
                lineStart = blankLine.parse({
                  src
                }, lineStart), this.items.push(blankLine);
              }
              if (offset = PlainValue.Node.endOfIndent(src, lineStart), offset <= lineStart + indent && (char = src[offset], offset < lineStart + indent || char !== "]" && char !== "}")) {
                let msg = "Insufficient indentation in flow collection";
                this.error = new PlainValue.YAMLSemanticError(this, msg);
              }
            }
            break;
          case ",":
            this.items.push({
              char,
              offset
            }), offset += 1;
            break;
          case "#":
            {
              let comment = new Comment();
              offset = comment.parse({
                src
              }, offset), this.items.push(comment);
            }
            break;
          case "?":
          case ":": {
            let next = src[offset + 1];
            if (next === `
` || next === "	" || next === " " || next === "," || char === ":" && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              }), offset += 1;
              break;
            }
          }
          default: {
            let node = parseNode({
              atLineStart: !1,
              inCollection: !1,
              inFlow: !0,
              indent: -1,
              lineStart,
              parent: this
            }, offset);
            if (!node)
              return this.valueRange = new PlainValue.Range(start, offset), offset;
            this.items.push(node), offset = PlainValue.Node.normalizeOffset(src, node.range.end);
          }
        }
        offset = PlainValue.Node.endOfWhiteSpace(src, offset), char = src[offset];
      }
      return this.valueRange = new PlainValue.Range(start, offset + 1), char && (this.items.push({
        char,
        offset
      }), offset = PlainValue.Node.endOfWhiteSpace(src, offset + 1), offset = this.parseComment(offset)), offset;
    }
    setOrigRanges(cr, offset) {
      return offset = super.setOrigRanges(cr, offset), this.items.forEach((node) => {
        if (node instanceof PlainValue.Node)
          offset = node.setOrigRanges(cr, offset);
        else if (cr.length === 0)
          node.origOffset = node.offset;
        else {
          let i = offset;
          for (; i < cr.length && !(cr[i] > node.offset); )
            ++i;
          node.origOffset = node.offset + i, offset = i;
        }
      }), offset;
    }
    toString() {
      let {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null)
        return value;
      let nodes = items.filter((item) => item instanceof PlainValue.Node), str = "", prevEnd = range.start;
      return nodes.forEach((node) => {
        let prefix = src.slice(prevEnd, node.range.start);
        prevEnd = node.range.end, str += prefix + String(node), str[str.length - 1] === `
` && src[prevEnd - 1] !== `
` && src[prevEnd] === `
` && (prevEnd += 1);
      }), str += src.slice(prevEnd, range.end), PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  __name(FlowCollection, "FlowCollection");
  var QuoteDouble = class extends PlainValue.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];
      for (; ch && ch !== '"'; )
        offset += ch === "\\" ? 2 : 1, ch = src[offset];
      return offset + 1;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let errors = [], {
        start,
        end
      } = this.valueRange, {
        indent,
        src
      } = this.context;
      src[end - 1] !== '"' && errors.push(new PlainValue.YAMLSyntaxError(this, 'Missing closing "quote'));
      let str = "";
      for (let i = start + 1; i < end - 1; ++i) {
        let ch = src[i];
        if (ch === `
`) {
          PlainValue.Node.atDocumentBoundary(src, i + 1) && errors.push(new PlainValue.YAMLSemanticError(this, "Document boundary indicators are not allowed within string values"));
          let {
            fold,
            offset,
            error
          } = PlainValue.Node.foldNewline(src, i, indent);
          str += fold, i = offset, error && errors.push(new PlainValue.YAMLSemanticError(this, "Multi-line double-quoted string needs to be sufficiently indented"));
        } else if (ch === "\\")
          switch (i += 1, src[i]) {
            case "0":
              str += "\0";
              break;
            case "a":
              str += "\x07";
              break;
            case "b":
              str += "\b";
              break;
            case "e":
              str += "";
              break;
            case "f":
              str += "\f";
              break;
            case "n":
              str += `
`;
              break;
            case "r":
              str += "\r";
              break;
            case "t":
              str += "	";
              break;
            case "v":
              str += "\v";
              break;
            case "N":
              str += "\x85";
              break;
            case "_":
              str += "\xA0";
              break;
            case "L":
              str += "\u2028";
              break;
            case "P":
              str += "\u2029";
              break;
            case " ":
              str += " ";
              break;
            case '"':
              str += '"';
              break;
            case "/":
              str += "/";
              break;
            case "\\":
              str += "\\";
              break;
            case "	":
              str += "	";
              break;
            case "x":
              str += this.parseCharCode(i + 1, 2, errors), i += 2;
              break;
            case "u":
              str += this.parseCharCode(i + 1, 4, errors), i += 4;
              break;
            case "U":
              str += this.parseCharCode(i + 1, 8, errors), i += 8;
              break;
            case `
`:
              for (; src[i + 1] === " " || src[i + 1] === "	"; )
                i += 1;
              break;
            default:
              errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`)), str += "\\" + src[i];
          }
        else if (ch === " " || ch === "	") {
          let wsStart = i, next = src[i + 1];
          for (; next === " " || next === "	"; )
            i += 1, next = src[i + 1];
          next !== `
` && (str += i > wsStart ? src.slice(wsStart, i + 1) : ch);
        } else
          str += ch;
      }
      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }
    parseCharCode(offset, length, errors) {
      let {
        src
      } = this.context, cc = src.substr(offset, length), code = cc.length === length && /^[0-9a-fA-F]+$/.test(cc) ? parseInt(cc, 16) : NaN;
      return isNaN(code) ? (errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`)), src.substr(offset - 2, length + 2)) : String.fromCodePoint(code);
    }
    parse(context, start) {
      this.context = context;
      let {
        src
      } = context, offset = QuoteDouble.endOfQuote(src, start + 1);
      return this.valueRange = new PlainValue.Range(start, offset), offset = PlainValue.Node.endOfWhiteSpace(src, offset), offset = this.parseComment(offset), offset;
    }
  };
  __name(QuoteDouble, "QuoteDouble");
  var QuoteSingle = class extends PlainValue.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];
      for (; ch; )
        if (ch === "'") {
          if (src[offset + 1] !== "'")
            break;
          ch = src[offset += 2];
        } else
          ch = src[offset += 1];
      return offset + 1;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let errors = [], {
        start,
        end
      } = this.valueRange, {
        indent,
        src
      } = this.context;
      src[end - 1] !== "'" && errors.push(new PlainValue.YAMLSyntaxError(this, "Missing closing 'quote"));
      let str = "";
      for (let i = start + 1; i < end - 1; ++i) {
        let ch = src[i];
        if (ch === `
`) {
          PlainValue.Node.atDocumentBoundary(src, i + 1) && errors.push(new PlainValue.YAMLSemanticError(this, "Document boundary indicators are not allowed within string values"));
          let {
            fold,
            offset,
            error
          } = PlainValue.Node.foldNewline(src, i, indent);
          str += fold, i = offset, error && errors.push(new PlainValue.YAMLSemanticError(this, "Multi-line single-quoted string needs to be sufficiently indented"));
        } else if (ch === "'")
          str += ch, i += 1, src[i] !== "'" && errors.push(new PlainValue.YAMLSyntaxError(this, "Unescaped single quote? This should not happen."));
        else if (ch === " " || ch === "	") {
          let wsStart = i, next = src[i + 1];
          for (; next === " " || next === "	"; )
            i += 1, next = src[i + 1];
          next !== `
` && (str += i > wsStart ? src.slice(wsStart, i + 1) : ch);
        } else
          str += ch;
      }
      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }
    parse(context, start) {
      this.context = context;
      let {
        src
      } = context, offset = QuoteSingle.endOfQuote(src, start + 1);
      return this.valueRange = new PlainValue.Range(start, offset), offset = PlainValue.Node.endOfWhiteSpace(src, offset), offset = this.parseComment(offset), offset;
    }
  };
  __name(QuoteSingle, "QuoteSingle");
  function createNewNode(type, props) {
    switch (type) {
      case PlainValue.Type.ALIAS:
        return new Alias(type, props);
      case PlainValue.Type.BLOCK_FOLDED:
      case PlainValue.Type.BLOCK_LITERAL:
        return new BlockValue(type, props);
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.FLOW_SEQ:
        return new FlowCollection(type, props);
      case PlainValue.Type.MAP_KEY:
      case PlainValue.Type.MAP_VALUE:
      case PlainValue.Type.SEQ_ITEM:
        return new CollectionItem(type, props);
      case PlainValue.Type.COMMENT:
      case PlainValue.Type.PLAIN:
        return new PlainValue.PlainValue(type, props);
      case PlainValue.Type.QUOTE_DOUBLE:
        return new QuoteDouble(type, props);
      case PlainValue.Type.QUOTE_SINGLE:
        return new QuoteSingle(type, props);
      default:
        return null;
    }
  }
  __name(createNewNode, "createNewNode");
  var ParseContext = class {
    static parseType(src, offset, inFlow) {
      switch (src[offset]) {
        case "*":
          return PlainValue.Type.ALIAS;
        case ">":
          return PlainValue.Type.BLOCK_FOLDED;
        case "|":
          return PlainValue.Type.BLOCK_LITERAL;
        case "{":
          return PlainValue.Type.FLOW_MAP;
        case "[":
          return PlainValue.Type.FLOW_SEQ;
        case "?":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, !0) ? PlainValue.Type.MAP_KEY : PlainValue.Type.PLAIN;
        case ":":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, !0) ? PlainValue.Type.MAP_VALUE : PlainValue.Type.PLAIN;
        case "-":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, !0) ? PlainValue.Type.SEQ_ITEM : PlainValue.Type.PLAIN;
        case '"':
          return PlainValue.Type.QUOTE_DOUBLE;
        case "'":
          return PlainValue.Type.QUOTE_SINGLE;
        default:
          return PlainValue.Type.PLAIN;
      }
    }
    constructor(orig = {}, {
      atLineStart,
      inCollection,
      inFlow,
      indent,
      lineStart,
      parent
    } = {}) {
      PlainValue._defineProperty(this, "parseNode", (overlay, start) => {
        if (PlainValue.Node.atDocumentBoundary(this.src, start))
          return null;
        let context = new ParseContext(this, overlay), {
          props,
          type,
          valueStart
        } = context.parseProps(start), node = createNewNode(type, props), offset = node.parse(context, valueStart);
        if (node.range = new PlainValue.Range(start, offset), offset <= start && (node.error = new Error("Node#parse consumed no characters"), node.error.parseEnd = offset, node.error.source = node, node.range.end = start + 1), context.nodeStartsCollection(node)) {
          !node.error && !context.atLineStart && context.parent.type === PlainValue.Type.DOCUMENT && (node.error = new PlainValue.YAMLSyntaxError(node, "Block collection must not have preceding content here (e.g. directives-end indicator)"));
          let collection = new Collection(node);
          return offset = collection.parse(new ParseContext(context), offset), collection.range = new PlainValue.Range(start, offset), collection;
        }
        return node;
      }), this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || !1, this.inCollection = inCollection != null ? inCollection : orig.inCollection || !1, this.inFlow = inFlow != null ? inFlow : orig.inFlow || !1, this.indent = indent != null ? indent : orig.indent, this.lineStart = lineStart != null ? lineStart : orig.lineStart, this.parent = parent != null ? parent : orig.parent || {}, this.root = orig.root, this.src = orig.src;
    }
    nodeStartsCollection(node) {
      let {
        inCollection,
        inFlow,
        src
      } = this;
      if (inCollection || inFlow)
        return !1;
      if (node instanceof CollectionItem)
        return !0;
      let offset = node.range.end;
      return src[offset] === `
` || src[offset - 1] === `
` ? !1 : (offset = PlainValue.Node.endOfWhiteSpace(src, offset), src[offset] === ":");
    }
    parseProps(offset) {
      let {
        inFlow,
        parent,
        src
      } = this, props = [], lineHasProps = !1;
      offset = this.atLineStart ? PlainValue.Node.endOfIndent(src, offset) : PlainValue.Node.endOfWhiteSpace(src, offset);
      let ch = src[offset];
      for (; ch === PlainValue.Char.ANCHOR || ch === PlainValue.Char.COMMENT || ch === PlainValue.Char.TAG || ch === `
`; ) {
        if (ch === `
`) {
          let lineStart = offset + 1, inEnd = PlainValue.Node.endOfIndent(src, lineStart), indentDiff = inEnd - (lineStart + this.indent), noIndicatorAsIndent = parent.type === PlainValue.Type.SEQ_ITEM && parent.context.atLineStart;
          if (!PlainValue.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent))
            break;
          this.atLineStart = !0, this.lineStart = lineStart, lineHasProps = !1, offset = inEnd;
        } else if (ch === PlainValue.Char.COMMENT) {
          let end = PlainValue.Node.endOfLine(src, offset + 1);
          props.push(new PlainValue.Range(offset, end)), offset = end;
        } else {
          let end = PlainValue.Node.endOfIdentifier(src, offset + 1);
          ch === PlainValue.Char.TAG && src[end] === "," && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13)) && (end = PlainValue.Node.endOfIdentifier(src, end + 5)), props.push(new PlainValue.Range(offset, end)), lineHasProps = !0, offset = PlainValue.Node.endOfWhiteSpace(src, end);
        }
        ch = src[offset];
      }
      lineHasProps && ch === ":" && PlainValue.Node.atBlank(src, offset + 1, !0) && (offset -= 1);
      let type = ParseContext.parseType(src, offset, inFlow);
      return {
        props,
        type,
        valueStart: offset
      };
    }
  };
  __name(ParseContext, "ParseContext");
  function parse2(src) {
    let cr = [];
    src.indexOf("\r") !== -1 && (src = src.replace(/\r\n?/g, (match, offset2) => (match.length > 1 && cr.push(offset2), `
`)));
    let documents = [], offset = 0;
    do {
      let doc = new Document(), context = new ParseContext({
        src
      });
      offset = doc.parse(context, offset), documents.push(doc);
    } while (offset < src.length);
    return documents.setOrigRanges = () => {
      if (cr.length === 0)
        return !1;
      for (let i = 1; i < cr.length; ++i)
        cr[i] -= i;
      let crOffset = 0;
      for (let i = 0; i < documents.length; ++i)
        crOffset = documents[i].setOrigRanges(cr, crOffset);
      return cr.splice(0, cr.length), !0;
    }, documents.toString = () => documents.join(`...
`), documents;
  }
  __name(parse2, "parse");
  exports2.parse = parse2;
});

// node_modules/yaml/dist/resolveSeq-4a68b39b.js
var require_resolveSeq_4a68b39b = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  function addCommentBefore(str, indent, comment) {
    return comment ? `#${comment.replace(/[\s\S]^/gm, `$&${indent}#`)}
${indent}${str}` : str;
  }
  __name(addCommentBefore, "addCommentBefore");
  function addComment(str, indent, comment) {
    return comment ? comment.indexOf(`
`) === -1 ? `${str} #${comment}` : `${str}
` + comment.replace(/^/gm, `${indent || ""}#`) : str;
  }
  __name(addComment, "addComment");
  var Node = class {
  };
  __name(Node, "Node");
  function toJSON(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJSON(v, String(i), ctx));
    if (value && typeof value.toJSON == "function") {
      let anchor = ctx && ctx.anchors && ctx.anchors.get(value);
      anchor && (ctx.onCreate = (res2) => {
        anchor.res = res2, delete ctx.onCreate;
      });
      let res = value.toJSON(arg, ctx);
      return anchor && ctx.onCreate && ctx.onCreate(res), res;
    }
    return (!ctx || !ctx.keep) && typeof value == "bigint" ? Number(value) : value;
  }
  __name(toJSON, "toJSON");
  var Scalar = class extends Node {
    constructor(value) {
      super();
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  };
  __name(Scalar, "Scalar");
  function collectionFromPath(schema, path2, value) {
    let v = value;
    for (let i = path2.length - 1; i >= 0; --i) {
      let k = path2[i], o = Number.isInteger(k) && k >= 0 ? [] : {};
      o[k] = v, v = o;
    }
    return schema.createNode(v, !1);
  }
  __name(collectionFromPath, "collectionFromPath");
  var isEmptyPath = /* @__PURE__ */ __name((path2) => path2 == null || typeof path2 == "object" && path2[Symbol.iterator]().next().done, "isEmptyPath"), Collection = class extends Node {
    constructor(schema) {
      super();
      PlainValue._defineProperty(this, "items", []), this.schema = schema;
    }
    addIn(path2, value) {
      if (isEmptyPath(path2))
        this.add(value);
      else {
        let [key, ...rest] = path2, node = this.get(key, !0);
        if (node instanceof Collection)
          node.addIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    deleteIn([key, ...rest]) {
      if (rest.length === 0)
        return this.delete(key);
      let node = this.get(key, !0);
      if (node instanceof Collection)
        return node.deleteIn(rest);
      throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    getIn([key, ...rest], keepScalar) {
      let node = this.get(key, !0);
      return rest.length === 0 ? !keepScalar && node instanceof Scalar ? node.value : node : node instanceof Collection ? node.getIn(rest, keepScalar) : void 0;
    }
    hasAllNullValues() {
      return this.items.every((node) => {
        if (!node || node.type !== "PAIR")
          return !1;
        let n = node.value;
        return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    hasIn([key, ...rest]) {
      if (rest.length === 0)
        return this.has(key);
      let node = this.get(key, !0);
      return node instanceof Collection ? node.hasIn(rest) : !1;
    }
    setIn([key, ...rest], value) {
      if (rest.length === 0)
        this.set(key, value);
      else {
        let node = this.get(key, !0);
        if (node instanceof Collection)
          node.setIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    toJSON() {
      return null;
    }
    toString(ctx, {
      blockItem,
      flowChars,
      isMap,
      itemIndent
    }, onComment, onChompKeep) {
      let {
        indent,
        indentStep,
        stringify: stringify2
      } = ctx, inFlow = this.type === PlainValue.Type.FLOW_MAP || this.type === PlainValue.Type.FLOW_SEQ || ctx.inFlow;
      inFlow && (itemIndent += indentStep);
      let allNullValues = isMap && this.hasAllNullValues();
      ctx = Object.assign({}, ctx, {
        allNullValues,
        indent: itemIndent,
        inFlow,
        type: null
      });
      let chompKeep = !1, hasItemWithNewLine = !1, nodes = this.items.reduce((nodes2, item, i) => {
        let comment;
        item && (!chompKeep && item.spaceBefore && nodes2.push({
          type: "comment",
          str: ""
        }), item.commentBefore && item.commentBefore.match(/^.*$/gm).forEach((line) => {
          nodes2.push({
            type: "comment",
            str: `#${line}`
          });
        }), item.comment && (comment = item.comment), inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment)) && (hasItemWithNewLine = !0)), chompKeep = !1;
        let str2 = stringify2(item, ctx, () => comment = null, () => chompKeep = !0);
        return inFlow && !hasItemWithNewLine && str2.includes(`
`) && (hasItemWithNewLine = !0), inFlow && i < this.items.length - 1 && (str2 += ","), str2 = addComment(str2, itemIndent, comment), chompKeep && (comment || inFlow) && (chompKeep = !1), nodes2.push({
          type: "item",
          str: str2
        }), nodes2;
      }, []), str;
      if (nodes.length === 0)
        str = flowChars.start + flowChars.end;
      else if (inFlow) {
        let {
          start,
          end
        } = flowChars, strings = nodes.map((n) => n.str);
        if (hasItemWithNewLine || strings.reduce((sum, str2) => sum + str2.length + 2, 2) > Collection.maxFlowStringSingleLineLength) {
          str = start;
          for (let s of strings)
            str += s ? `
${indentStep}${indent}${s}` : `
`;
          str += `
${indent}${end}`;
        } else
          str = `${start} ${strings.join(" ")} ${end}`;
      } else {
        let strings = nodes.map(blockItem);
        str = strings.shift();
        for (let s of strings)
          str += s ? `
${indent}${s}` : `
`;
      }
      return this.comment ? (str += `
` + this.comment.replace(/^/gm, `${indent}#`), onComment && onComment()) : chompKeep && onChompKeep && onChompKeep(), str;
    }
  };
  __name(Collection, "Collection");
  PlainValue._defineProperty(Collection, "maxFlowStringSingleLineLength", 60);
  function asItemIndex(key) {
    let idx = key instanceof Scalar ? key.value : key;
    return idx && typeof idx == "string" && (idx = Number(idx)), Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  __name(asItemIndex, "asItemIndex");
  var YAMLSeq = class extends Collection {
    add(value) {
      this.items.push(value);
    }
    delete(key) {
      let idx = asItemIndex(key);
      return typeof idx != "number" ? !1 : this.items.splice(idx, 1).length > 0;
    }
    get(key, keepScalar) {
      let idx = asItemIndex(key);
      if (typeof idx != "number")
        return;
      let it = this.items[idx];
      return !keepScalar && it instanceof Scalar ? it.value : it;
    }
    has(key) {
      let idx = asItemIndex(key);
      return typeof idx == "number" && idx < this.items.length;
    }
    set(key, value) {
      let idx = asItemIndex(key);
      if (typeof idx != "number")
        throw new Error(`Expected a valid index, not ${key}.`);
      this.items[idx] = value;
    }
    toJSON(_, ctx) {
      let seq = [];
      ctx && ctx.onCreate && ctx.onCreate(seq);
      let i = 0;
      for (let item of this.items)
        seq.push(toJSON(item, String(i++), ctx));
      return seq;
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx ? super.toString(ctx, {
        blockItem: (n) => n.type === "comment" ? n.str : `- ${n.str}`,
        flowChars: {
          start: "[",
          end: "]"
        },
        isMap: !1,
        itemIndent: (ctx.indent || "") + "  "
      }, onComment, onChompKeep) : JSON.stringify(this);
    }
  };
  __name(YAMLSeq, "YAMLSeq");
  var stringifyKey = /* @__PURE__ */ __name((key, jsKey, ctx) => jsKey === null ? "" : typeof jsKey != "object" ? String(jsKey) : key instanceof Node && ctx && ctx.doc ? key.toString({
    anchors: {},
    doc: ctx.doc,
    indent: "",
    indentStep: ctx.indentStep,
    inFlow: !0,
    inStringifyKey: !0,
    stringify: ctx.stringify
  }) : JSON.stringify(jsKey), "stringifyKey"), Pair = class extends Node {
    constructor(key, value = null) {
      super();
      this.key = key, this.value = value, this.type = Pair.Type.PAIR;
    }
    get commentBefore() {
      return this.key instanceof Node ? this.key.commentBefore : void 0;
    }
    set commentBefore(cb) {
      if (this.key == null && (this.key = new Scalar(null)), this.key instanceof Node)
        this.key.commentBefore = cb;
      else {
        let msg = "Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.";
        throw new Error(msg);
      }
    }
    addToJSMap(ctx, map) {
      let key = toJSON(this.key, "", ctx);
      if (map instanceof Map) {
        let value = toJSON(this.value, key, ctx);
        map.set(key, value);
      } else if (map instanceof Set)
        map.add(key);
      else {
        let stringKey = stringifyKey(this.key, key, ctx);
        map[stringKey] = toJSON(this.value, stringKey, ctx);
      }
      return map;
    }
    toJSON(_, ctx) {
      let pair = ctx && ctx.mapAsMap ? new Map() : {};
      return this.addToJSMap(ctx, pair);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx || !ctx.doc)
        return JSON.stringify(this);
      let {
        indent: indentSize,
        indentSeq,
        simpleKeys
      } = ctx.doc.options, {
        key,
        value
      } = this, keyComment = key instanceof Node && key.comment;
      if (simpleKeys) {
        if (keyComment)
          throw new Error("With simple keys, key nodes cannot have comments");
        if (key instanceof Collection) {
          let msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment || key instanceof Collection || key.type === PlainValue.Type.BLOCK_FOLDED || key.type === PlainValue.Type.BLOCK_LITERAL), {
        doc,
        indent,
        indentStep,
        stringify: stringify2
      } = ctx;
      ctx = Object.assign({}, ctx, {
        implicitKey: !explicitKey,
        indent: indent + indentStep
      });
      let chompKeep = !1, str = stringify2(key, ctx, () => keyComment = null, () => chompKeep = !0);
      if (str = addComment(str, ctx.indent, keyComment), ctx.allNullValues && !simpleKeys)
        return this.comment ? (str = addComment(str, ctx.indent, this.comment), onComment && onComment()) : chompKeep && !keyComment && onChompKeep && onChompKeep(), ctx.inFlow ? str : `? ${str}`;
      str = explicitKey ? `? ${str}
${indent}:` : `${str}:`, this.comment && (str = addComment(str, ctx.indent, this.comment), onComment && onComment());
      let vcb = "", valueComment = null;
      value instanceof Node ? (value.spaceBefore && (vcb = `
`), value.commentBefore && (vcb += `
${value.commentBefore.replace(/^/gm, `${ctx.indent}#`)}`), valueComment = value.comment) : value && typeof value == "object" && (value = doc.schema.createNode(value, !0)), ctx.implicitKey = !1, !explicitKey && !this.comment && value instanceof Scalar && (ctx.indentAtStart = str.length + 1), chompKeep = !1, !indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== PlainValue.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value) && (ctx.indent = ctx.indent.substr(2));
      let valueStr = stringify2(value, ctx, () => valueComment = null, () => chompKeep = !0), ws = " ";
      return vcb || this.comment ? ws = `${vcb}
${ctx.indent}` : !explicitKey && value instanceof Collection && (!(valueStr[0] === "[" || valueStr[0] === "{") || valueStr.includes(`
`)) && (ws = `
${ctx.indent}`), chompKeep && !valueComment && onChompKeep && onChompKeep(), addComment(str + ws + valueStr, ctx.indent, valueComment);
    }
  };
  __name(Pair, "Pair");
  PlainValue._defineProperty(Pair, "Type", {
    PAIR: "PAIR",
    MERGE_PAIR: "MERGE_PAIR"
  });
  var getAliasCount = /* @__PURE__ */ __name((node, anchors) => {
    if (node instanceof Alias) {
      let anchor = anchors.get(node.source);
      return anchor.count * anchor.aliasCount;
    } else if (node instanceof Collection) {
      let count = 0;
      for (let item of node.items) {
        let c = getAliasCount(item, anchors);
        c > count && (count = c);
      }
      return count;
    } else if (node instanceof Pair) {
      let kc = getAliasCount(node.key, anchors), vc = getAliasCount(node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }, "getAliasCount"), Alias = class extends Node {
    static stringify({
      range,
      source
    }, {
      anchors,
      doc,
      implicitKey,
      inStringifyKey
    }) {
      let anchor = Object.keys(anchors).find((a) => anchors[a] === source);
      if (!anchor && inStringifyKey && (anchor = doc.anchors.getName(source) || doc.anchors.newName()), anchor)
        return `*${anchor}${implicitKey ? " " : ""}`;
      let msg = doc.anchors.getName(source) ? "Alias node must be after source node" : "Source node not found for alias node";
      throw new Error(`${msg} [${range}]`);
    }
    constructor(source) {
      super();
      this.source = source, this.type = PlainValue.Type.ALIAS;
    }
    set tag(t) {
      throw new Error("Alias nodes cannot have tags");
    }
    toJSON(arg, ctx) {
      if (!ctx)
        return toJSON(this.source, arg, ctx);
      let {
        anchors,
        maxAliasCount
      } = ctx, anchor = anchors.get(this.source);
      if (!anchor || anchor.res === void 0) {
        let msg = "This should not happen: Alias anchor was not resolved?";
        throw this.cstNode ? new PlainValue.YAMLReferenceError(this.cstNode, msg) : new ReferenceError(msg);
      }
      if (maxAliasCount >= 0 && (anchor.count += 1, anchor.aliasCount === 0 && (anchor.aliasCount = getAliasCount(this.source, anchors)), anchor.count * anchor.aliasCount > maxAliasCount)) {
        let msg = "Excessive alias count indicates a resource exhaustion attack";
        throw this.cstNode ? new PlainValue.YAMLReferenceError(this.cstNode, msg) : new ReferenceError(msg);
      }
      return anchor.res;
    }
    toString(ctx) {
      return Alias.stringify(this, ctx);
    }
  };
  __name(Alias, "Alias");
  PlainValue._defineProperty(Alias, "default", !0);
  function findPair(items, key) {
    let k = key instanceof Scalar ? key.value : key;
    for (let it of items)
      if (it instanceof Pair && (it.key === key || it.key === k || it.key && it.key.value === k))
        return it;
  }
  __name(findPair, "findPair");
  var YAMLMap = class extends Collection {
    add(pair, overwrite) {
      pair ? pair instanceof Pair || (pair = new Pair(pair.key || pair, pair.value)) : pair = new Pair(pair);
      let prev = findPair(this.items, pair.key), sortEntries = this.schema && this.schema.sortMapEntries;
      if (prev)
        if (overwrite)
          prev.value = pair.value;
        else
          throw new Error(`Key ${pair.key} already set`);
      else if (sortEntries) {
        let i = this.items.findIndex((item) => sortEntries(pair, item) < 0);
        i === -1 ? this.items.push(pair) : this.items.splice(i, 0, pair);
      } else
        this.items.push(pair);
    }
    delete(key) {
      let it = findPair(this.items, key);
      return it ? this.items.splice(this.items.indexOf(it), 1).length > 0 : !1;
    }
    get(key, keepScalar) {
      let it = findPair(this.items, key), node = it && it.value;
      return !keepScalar && node instanceof Scalar ? node.value : node;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair(key, value), !0);
    }
    toJSON(_, ctx, Type) {
      let map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
      ctx && ctx.onCreate && ctx.onCreate(map);
      for (let item of this.items)
        item.addToJSMap(ctx, map);
      return map;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (let item of this.items)
        if (!(item instanceof Pair))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      return super.toString(ctx, {
        blockItem: (n) => n.str,
        flowChars: {
          start: "{",
          end: "}"
        },
        isMap: !0,
        itemIndent: ctx.indent || ""
      }, onComment, onChompKeep);
    }
  };
  __name(YAMLMap, "YAMLMap");
  var MERGE_KEY = "<<", Merge = class extends Pair {
    constructor(pair) {
      if (pair instanceof Pair) {
        let seq = pair.value;
        seq instanceof YAMLSeq || (seq = new YAMLSeq(), seq.items.push(pair.value), seq.range = pair.value.range), super(pair.key, seq), this.range = pair.range;
      } else
        super(new Scalar(MERGE_KEY), new YAMLSeq());
      this.type = Pair.Type.MERGE_PAIR;
    }
    addToJSMap(ctx, map) {
      for (let {
        source
      } of this.value.items) {
        if (!(source instanceof YAMLMap))
          throw new Error("Merge sources must be maps");
        let srcMap = source.toJSON(null, ctx, Map);
        for (let [key, value] of srcMap)
          map instanceof Map ? map.has(key) || map.set(key, value) : map instanceof Set ? map.add(key) : Object.prototype.hasOwnProperty.call(map, key) || (map[key] = value);
      }
      return map;
    }
    toString(ctx, onComment) {
      let seq = this.value;
      if (seq.items.length > 1)
        return super.toString(ctx, onComment);
      this.value = seq.items[0];
      let str = super.toString(ctx, onComment);
      return this.value = seq, str;
    }
  };
  __name(Merge, "Merge");
  var binaryOptions = {
    defaultType: PlainValue.Type.BLOCK_LITERAL,
    lineWidth: 76
  }, boolOptions = {
    trueStr: "true",
    falseStr: "false"
  }, intOptions = {
    asBigInt: !1
  }, nullOptions = {
    nullStr: "null"
  }, strOptions = {
    defaultType: PlainValue.Type.PLAIN,
    doubleQuoted: {
      jsonEncoding: !1,
      minMultiLineLength: 40
    },
    fold: {
      lineWidth: 80,
      minContentWidth: 20
    }
  };
  function resolveScalar(str, tags, scalarFallback) {
    for (let {
      format,
      test,
      resolve
    } of tags)
      if (test) {
        let match = str.match(test);
        if (match) {
          let res = resolve.apply(null, match);
          return res instanceof Scalar || (res = new Scalar(res)), format && (res.format = format), res;
        }
      }
    return scalarFallback && (str = scalarFallback(str)), new Scalar(str);
  }
  __name(resolveScalar, "resolveScalar");
  var FOLD_FLOW = "flow", FOLD_BLOCK = "block", FOLD_QUOTED = "quoted", consumeMoreIndentedLines = /* @__PURE__ */ __name((text, i) => {
    let ch = text[i + 1];
    for (; ch === " " || ch === "	"; ) {
      do
        ch = text[i += 1];
      while (ch && ch !== `
`);
      ch = text[i + 1];
    }
    return i;
  }, "consumeMoreIndentedLines");
  function foldFlowLines(text, indent, mode, {
    indentAtStart,
    lineWidth = 80,
    minContentWidth = 20,
    onFold,
    onOverflow
  }) {
    if (!lineWidth || lineWidth < 0)
      return text;
    let endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    let folds = [], escapedFolds = {}, end = lineWidth - (typeof indentAtStart == "number" ? indentAtStart : indent.length), split, prev, overflow = !1, i = -1;
    mode === FOLD_BLOCK && (i = consumeMoreIndentedLines(text, i), i !== -1 && (end = i + endStep));
    for (let ch; ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\")
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
      if (ch === `
`)
        mode === FOLD_BLOCK && (i = consumeMoreIndentedLines(text, i)), end = i + endStep, split = void 0;
      else {
        if (ch === " " && prev && prev !== " " && prev !== `
` && prev !== "	") {
          let next = text[i + 1];
          next && next !== " " && next !== `
` && next !== "	" && (split = i);
        }
        if (i >= end)
          if (split)
            folds.push(split), end = split + endStep, split = void 0;
          else if (mode === FOLD_QUOTED) {
            for (; prev === " " || prev === "	"; )
              prev = ch, ch = text[i += 1], overflow = !0;
            folds.push(i - 2), escapedFolds[i - 2] = !0, end = i - 2 + endStep, split = void 0;
          } else
            overflow = !0;
      }
      prev = ch;
    }
    if (overflow && onOverflow && onOverflow(), folds.length === 0)
      return text;
    onFold && onFold();
    let res = text.slice(0, folds[0]);
    for (let i2 = 0; i2 < folds.length; ++i2) {
      let fold = folds[i2], end2 = folds[i2 + 1] || text.length;
      mode === FOLD_QUOTED && escapedFolds[fold] && (res += `${text[fold]}\\`), res += `
${indent}${text.slice(fold + 1, end2)}`;
    }
    return res;
  }
  __name(foldFlowLines, "foldFlowLines");
  var getFoldOptions = /* @__PURE__ */ __name(({
    indentAtStart
  }) => indentAtStart ? Object.assign({
    indentAtStart
  }, strOptions.fold) : strOptions.fold, "getFoldOptions"), containsDocumentMarker = /* @__PURE__ */ __name((str) => /^(%|---|\.\.\.)/m.test(str), "containsDocumentMarker");
  function lineLengthOverLimit(str, limit) {
    let strLen = str.length;
    if (strLen <= limit)
      return !1;
    for (let i = 0, start = 0; i < strLen; ++i)
      if (str[i] === `
`) {
        if (i - start > limit)
          return !0;
        if (start = i + 1, strLen - start <= limit)
          return !1;
      }
    return !0;
  }
  __name(lineLengthOverLimit, "lineLengthOverLimit");
  function doubleQuotedString(value, ctx) {
    let {
      implicitKey
    } = ctx, {
      jsonEncoding,
      minMultiLineLength
    } = strOptions.doubleQuoted, json = JSON.stringify(value);
    if (jsonEncoding)
      return json;
    let indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), str = "", start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i])
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n" && (str += json.slice(start, i) + "\\ ", i += 1, start = i, ch = "\\"), ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              let code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  code.substr(0, 2) === "00" ? str += "\\x" + code.substr(2) : str += json.substr(i, 6);
              }
              i += 5, start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength)
              i += 1;
            else {
              for (str += json.slice(start, i) + `

`; json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"'; )
                str += `
`, i += 2;
              str += indent, json[i + 2] === " " && (str += "\\"), i += 1, start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    return str = start ? str + json.slice(start) : json, implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
  }
  __name(doubleQuotedString, "doubleQuotedString");
  function singleQuotedString(value, ctx) {
    if (ctx.implicitKey) {
      if (/\n/.test(value))
        return doubleQuotedString(value, ctx);
    } else if (/[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    let indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
  }
  __name(singleQuotedString, "singleQuotedString");
  function blockString({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) {
    if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value))
      return doubleQuotedString(value, ctx);
    let indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : ""), indentSize = indent ? "2" : "1", literal = type === PlainValue.Type.BLOCK_FOLDED ? !1 : type === PlainValue.Type.BLOCK_LITERAL ? !0 : !lineLengthOverLimit(value, strOptions.fold.lineWidth - indent.length), header = literal ? "|" : ">";
    if (!value)
      return header + `
`;
    let wsStart = "", wsEnd = "";
    if (value = value.replace(/[\n\t ]*$/, (ws) => {
      let n = ws.indexOf(`
`);
      return n === -1 ? header += "-" : (value === ws || n !== ws.length - 1) && (header += "+", onChompKeep && onChompKeep()), wsEnd = ws.replace(/\n$/, ""), "";
    }).replace(/^[\n ]*/, (ws) => {
      ws.indexOf(" ") !== -1 && (header += indentSize);
      let m = ws.match(/ +$/);
      return m ? (wsStart = ws.slice(0, -m[0].length), m[0]) : (wsStart = ws, "");
    }), wsEnd && (wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`)), wsStart && (wsStart = wsStart.replace(/\n+/g, `$&${indent}`)), comment && (header += " #" + comment.replace(/ ?[\r\n]+/g, " "), onComment && onComment()), !value)
      return `${header}${indentSize}
${indent}${wsEnd}`;
    if (literal)
      return value = value.replace(/\n+/g, `$&${indent}`), `${header}
${indent}${wsStart}${value}${wsEnd}`;
    value = value.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let body = foldFlowLines(`${wsStart}${value}${wsEnd}`, indent, FOLD_BLOCK, strOptions.fold);
    return `${header}
${indent}${body}`;
  }
  __name(blockString, "blockString");
  function plainString(item, ctx, onComment, onChompKeep) {
    let {
      comment,
      type,
      value
    } = item, {
      actualString,
      implicitKey,
      indent,
      inFlow
    } = ctx;
    if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value))
      return doubleQuotedString(value, ctx);
    if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value))
      return implicitKey || inFlow || value.indexOf(`
`) === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    if (!implicitKey && !inFlow && type !== PlainValue.Type.PLAIN && value.indexOf(`
`) !== -1)
      return blockString(item, ctx, onComment, onChompKeep);
    if (indent === "" && containsDocumentMarker(value))
      return ctx.forceBlockIndent = !0, blockString(item, ctx, onComment, onChompKeep);
    let str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      let {
        tags
      } = ctx.doc.schema;
      if (typeof resolveScalar(str, tags, tags.scalarFallback).value != "string")
        return doubleQuotedString(value, ctx);
    }
    let body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));
    return comment && !inFlow && (body.indexOf(`
`) !== -1 || comment.indexOf(`
`) !== -1) ? (onComment && onComment(), addCommentBefore(body, indent, comment)) : body;
  }
  __name(plainString, "plainString");
  function stringifyString(item, ctx, onComment, onChompKeep) {
    let {
      defaultType
    } = strOptions, {
      implicitKey,
      inFlow
    } = ctx, {
      type,
      value
    } = item;
    typeof value != "string" && (value = String(value), item = Object.assign({}, item, {
      value
    }));
    let _stringify = /* @__PURE__ */ __name((_type) => {
      switch (_type) {
        case PlainValue.Type.BLOCK_FOLDED:
        case PlainValue.Type.BLOCK_LITERAL:
          return blockString(item, ctx, onComment, onChompKeep);
        case PlainValue.Type.QUOTE_DOUBLE:
          return doubleQuotedString(value, ctx);
        case PlainValue.Type.QUOTE_SINGLE:
          return singleQuotedString(value, ctx);
        case PlainValue.Type.PLAIN:
          return plainString(item, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    }, "_stringify");
    (type !== PlainValue.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value) || (implicitKey || inFlow) && (type === PlainValue.Type.BLOCK_FOLDED || type === PlainValue.Type.BLOCK_LITERAL)) && (type = PlainValue.Type.QUOTE_DOUBLE);
    let res = _stringify(type);
    if (res === null && (res = _stringify(defaultType), res === null))
      throw new Error(`Unsupported default string type ${defaultType}`);
    return res;
  }
  __name(stringifyString, "stringifyString");
  function stringifyNumber({
    format,
    minFractionDigits,
    tag,
    value
  }) {
    if (typeof value == "bigint")
      return String(value);
    if (!isFinite(value))
      return isNaN(value) ? ".nan" : value < 0 ? "-.inf" : ".inf";
    let n = JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
      let i = n.indexOf(".");
      i < 0 && (i = n.length, n += ".");
      let d = minFractionDigits - (n.length - i - 1);
      for (; d-- > 0; )
        n += "0";
    }
    return n;
  }
  __name(stringifyNumber, "stringifyNumber");
  function checkFlowCollectionEnd(errors, cst) {
    let char, name;
    switch (cst.type) {
      case PlainValue.Type.FLOW_MAP:
        char = "}", name = "flow map";
        break;
      case PlainValue.Type.FLOW_SEQ:
        char = "]", name = "flow sequence";
        break;
      default:
        errors.push(new PlainValue.YAMLSemanticError(cst, "Not a flow collection!?"));
        return;
    }
    let lastItem;
    for (let i = cst.items.length - 1; i >= 0; --i) {
      let item = cst.items[i];
      if (!item || item.type !== PlainValue.Type.COMMENT) {
        lastItem = item;
        break;
      }
    }
    if (lastItem && lastItem.char !== char) {
      let msg = `Expected ${name} to end with ${char}`, err;
      typeof lastItem.offset == "number" ? (err = new PlainValue.YAMLSemanticError(cst, msg), err.offset = lastItem.offset + 1) : (err = new PlainValue.YAMLSemanticError(lastItem, msg), lastItem.range && lastItem.range.end && (err.offset = lastItem.range.end - lastItem.range.start)), errors.push(err);
    }
  }
  __name(checkFlowCollectionEnd, "checkFlowCollectionEnd");
  function checkFlowCommentSpace(errors, comment) {
    let prev = comment.context.src[comment.range.start - 1];
    if (prev !== `
` && prev !== "	" && prev !== " ") {
      let msg = "Comments must be separated from other tokens by white space characters";
      errors.push(new PlainValue.YAMLSemanticError(comment, msg));
    }
  }
  __name(checkFlowCommentSpace, "checkFlowCommentSpace");
  function getLongKeyError(source, key) {
    let sk = String(key), k = sk.substr(0, 8) + "..." + sk.substr(-8);
    return new PlainValue.YAMLSemanticError(source, `The "${k}" key is too long`);
  }
  __name(getLongKeyError, "getLongKeyError");
  function resolveComments(collection, comments) {
    for (let {
      afterKey,
      before,
      comment
    } of comments) {
      let item = collection.items[before];
      item ? (afterKey && item.value && (item = item.value), comment === void 0 ? (afterKey || !item.commentBefore) && (item.spaceBefore = !0) : item.commentBefore ? item.commentBefore += `
` + comment : item.commentBefore = comment) : comment !== void 0 && (collection.comment ? collection.comment += `
` + comment : collection.comment = comment);
    }
  }
  __name(resolveComments, "resolveComments");
  function resolveString(doc, node) {
    let res = node.strValue;
    return res ? typeof res == "string" ? res : (res.errors.forEach((error) => {
      error.source || (error.source = node), doc.errors.push(error);
    }), res.str) : "";
  }
  __name(resolveString, "resolveString");
  function resolveTagHandle(doc, node) {
    let {
      handle,
      suffix
    } = node.tag, prefix = doc.tagPrefixes.find((p) => p.handle === handle);
    if (!prefix) {
      let dtp = doc.getDefaults().tagPrefixes;
      if (dtp && (prefix = dtp.find((p) => p.handle === handle)), !prefix)
        throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag handle is non-default and was not declared.`);
    }
    if (!suffix)
      throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag has no suffix.`);
    if (handle === "!" && (doc.version || doc.options.version) === "1.0") {
      if (suffix[0] === "^")
        return doc.warnings.push(new PlainValue.YAMLWarning(node, "YAML 1.0 ^ tag expansion is not supported")), suffix;
      if (/[:/]/.test(suffix)) {
        let vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
        return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
      }
    }
    return prefix.prefix + decodeURIComponent(suffix);
  }
  __name(resolveTagHandle, "resolveTagHandle");
  function resolveTagName(doc, node) {
    let {
      tag,
      type
    } = node, nonSpecific = !1;
    if (tag) {
      let {
        handle,
        suffix,
        verbatim
      } = tag;
      if (verbatim) {
        if (verbatim !== "!" && verbatim !== "!!")
          return verbatim;
        let msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
        doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
      } else if (handle === "!" && !suffix)
        nonSpecific = !0;
      else
        try {
          return resolveTagHandle(doc, node);
        } catch (error) {
          doc.errors.push(error);
        }
    }
    switch (type) {
      case PlainValue.Type.BLOCK_FOLDED:
      case PlainValue.Type.BLOCK_LITERAL:
      case PlainValue.Type.QUOTE_DOUBLE:
      case PlainValue.Type.QUOTE_SINGLE:
        return PlainValue.defaultTags.STR;
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.MAP:
        return PlainValue.defaultTags.MAP;
      case PlainValue.Type.FLOW_SEQ:
      case PlainValue.Type.SEQ:
        return PlainValue.defaultTags.SEQ;
      case PlainValue.Type.PLAIN:
        return nonSpecific ? PlainValue.defaultTags.STR : null;
      default:
        return null;
    }
  }
  __name(resolveTagName, "resolveTagName");
  function resolveByTagName(doc, node, tagName) {
    let {
      tags
    } = doc.schema, matchWithTest = [];
    for (let tag of tags)
      if (tag.tag === tagName)
        if (tag.test)
          matchWithTest.push(tag);
        else {
          let res = tag.resolve(doc, node);
          return res instanceof Collection ? res : new Scalar(res);
        }
    let str = resolveString(doc, node);
    return typeof str == "string" && matchWithTest.length > 0 ? resolveScalar(str, matchWithTest, tags.scalarFallback) : null;
  }
  __name(resolveByTagName, "resolveByTagName");
  function getFallbackTagName({
    type
  }) {
    switch (type) {
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.MAP:
        return PlainValue.defaultTags.MAP;
      case PlainValue.Type.FLOW_SEQ:
      case PlainValue.Type.SEQ:
        return PlainValue.defaultTags.SEQ;
      default:
        return PlainValue.defaultTags.STR;
    }
  }
  __name(getFallbackTagName, "getFallbackTagName");
  function resolveTag(doc, node, tagName) {
    try {
      let res = resolveByTagName(doc, node, tagName);
      if (res)
        return tagName && node.tag && (res.tag = tagName), res;
    } catch (error) {
      return error.source || (error.source = node), doc.errors.push(error), null;
    }
    try {
      let fallback = getFallbackTagName(node);
      if (!fallback)
        throw new Error(`The tag ${tagName} is unavailable`);
      let msg = `The tag ${tagName} is unavailable, falling back to ${fallback}`;
      doc.warnings.push(new PlainValue.YAMLWarning(node, msg));
      let res = resolveByTagName(doc, node, fallback);
      return res.tag = tagName, res;
    } catch (error) {
      let refError = new PlainValue.YAMLReferenceError(node, error.message);
      return refError.stack = error.stack, doc.errors.push(refError), null;
    }
  }
  __name(resolveTag, "resolveTag");
  var isCollectionItem = /* @__PURE__ */ __name((node) => {
    if (!node)
      return !1;
    let {
      type
    } = node;
    return type === PlainValue.Type.MAP_KEY || type === PlainValue.Type.MAP_VALUE || type === PlainValue.Type.SEQ_ITEM;
  }, "isCollectionItem");
  function resolveNodeProps(errors, node) {
    let comments = {
      before: [],
      after: []
    }, hasAnchor = !1, hasTag = !1, props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;
    for (let {
      start,
      end
    } of props)
      switch (node.context.src[start]) {
        case PlainValue.Char.COMMENT: {
          if (!node.commentHasRequiredWhitespace(start)) {
            let msg = "Comments must be separated from other tokens by white space characters";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          let {
            header,
            valueRange
          } = node;
          (valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before).push(node.context.src.slice(start + 1, end));
          break;
        }
        case PlainValue.Char.ANCHOR:
          if (hasAnchor) {
            let msg = "A node can have at most one anchor";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          hasAnchor = !0;
          break;
        case PlainValue.Char.TAG:
          if (hasTag) {
            let msg = "A node can have at most one tag";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          hasTag = !0;
          break;
      }
    return {
      comments,
      hasAnchor,
      hasTag
    };
  }
  __name(resolveNodeProps, "resolveNodeProps");
  function resolveNodeValue(doc, node) {
    let {
      anchors,
      errors,
      schema
    } = doc;
    if (node.type === PlainValue.Type.ALIAS) {
      let name = node.rawValue, src = anchors.getNode(name);
      if (!src) {
        let msg = `Aliased anchor not found: ${name}`;
        return errors.push(new PlainValue.YAMLReferenceError(node, msg)), null;
      }
      let res = new Alias(src);
      return anchors._cstAliases.push(res), res;
    }
    let tagName = resolveTagName(doc, node);
    if (tagName)
      return resolveTag(doc, node, tagName);
    if (node.type !== PlainValue.Type.PLAIN) {
      let msg = `Failed to resolve ${node.type} node here`;
      return errors.push(new PlainValue.YAMLSyntaxError(node, msg)), null;
    }
    try {
      let str = resolveString(doc, node);
      return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
    } catch (error) {
      return error.source || (error.source = node), errors.push(error), null;
    }
  }
  __name(resolveNodeValue, "resolveNodeValue");
  function resolveNode(doc, node) {
    if (!node)
      return null;
    node.error && doc.errors.push(node.error);
    let {
      comments,
      hasAnchor,
      hasTag
    } = resolveNodeProps(doc.errors, node);
    if (hasAnchor) {
      let {
        anchors
      } = doc, name = node.anchor, prev = anchors.getNode(name);
      prev && (anchors.map[anchors.newName(name)] = prev), anchors.map[name] = node;
    }
    if (node.type === PlainValue.Type.ALIAS && (hasAnchor || hasTag)) {
      let msg = "An alias node must not specify any properties";
      doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
    }
    let res = resolveNodeValue(doc, node);
    if (res) {
      res.range = [node.range.start, node.range.end], doc.options.keepCstNodes && (res.cstNode = node), doc.options.keepNodeTypes && (res.type = node.type);
      let cb = comments.before.join(`
`);
      cb && (res.commentBefore = res.commentBefore ? `${res.commentBefore}
${cb}` : cb);
      let ca = comments.after.join(`
`);
      ca && (res.comment = res.comment ? `${res.comment}
${ca}` : ca);
    }
    return node.resolved = res;
  }
  __name(resolveNode, "resolveNode");
  function resolveMap(doc, cst) {
    if (cst.type !== PlainValue.Type.MAP && cst.type !== PlainValue.Type.FLOW_MAP) {
      let msg = `A ${cst.type} node cannot be resolved as a mapping`;
      return doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg)), null;
    }
    let {
      comments,
      items
    } = cst.type === PlainValue.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst), map = new YAMLMap();
    map.items = items, resolveComments(map, comments);
    let hasCollectionKey = !1;
    for (let i = 0; i < items.length; ++i) {
      let {
        key: iKey
      } = items[i];
      if (iKey instanceof Collection && (hasCollectionKey = !0), doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
        items[i] = new Merge(items[i]);
        let sources = items[i].value.items, error = null;
        sources.some((node) => {
          if (node instanceof Alias) {
            let {
              type
            } = node.source;
            return type === PlainValue.Type.MAP || type === PlainValue.Type.FLOW_MAP ? !1 : error = "Merge nodes aliases can only point to maps";
          }
          return error = "Merge nodes can only have Alias nodes as values";
        }), error && doc.errors.push(new PlainValue.YAMLSemanticError(cst, error));
      } else
        for (let j = i + 1; j < items.length; ++j) {
          let {
            key: jKey
          } = items[j];
          if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, "value") && iKey.value === jKey.value) {
            let msg = `Map keys must be unique; "${iKey}" is repeated`;
            doc.errors.push(new PlainValue.YAMLSemanticError(cst, msg));
            break;
          }
        }
    }
    if (hasCollectionKey && !doc.options.mapAsMap) {
      let warn = "Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.";
      doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
    }
    return cst.resolved = map, map;
  }
  __name(resolveMap, "resolveMap");
  var valueHasPairComment = /* @__PURE__ */ __name(({
    context: {
      lineStart,
      node,
      src
    },
    props
  }) => {
    if (props.length === 0)
      return !1;
    let {
      start
    } = props[0];
    if (node && start > node.valueRange.start || src[start] !== PlainValue.Char.COMMENT)
      return !1;
    for (let i = lineStart; i < start; ++i)
      if (src[i] === `
`)
        return !1;
    return !0;
  }, "valueHasPairComment");
  function resolvePairComment(item, pair) {
    if (!valueHasPairComment(item))
      return;
    let comment = item.getPropValue(0, PlainValue.Char.COMMENT, !0), found = !1, cb = pair.value.commentBefore;
    if (cb && cb.startsWith(comment))
      pair.value.commentBefore = cb.substr(comment.length + 1), found = !0;
    else {
      let cc = pair.value.comment;
      !item.node && cc && cc.startsWith(comment) && (pair.value.comment = cc.substr(comment.length + 1), found = !0);
    }
    found && (pair.comment = comment);
  }
  __name(resolvePairComment, "resolvePairComment");
  function resolveBlockMapItems(doc, cst) {
    let comments = [], items = [], key, keyStart = null;
    for (let i = 0; i < cst.items.length; ++i) {
      let item = cst.items[i];
      switch (item.type) {
        case PlainValue.Type.BLANK_LINE:
          comments.push({
            afterKey: !!key,
            before: items.length
          });
          break;
        case PlainValue.Type.COMMENT:
          comments.push({
            afterKey: !!key,
            before: items.length,
            comment: item.comment
          });
          break;
        case PlainValue.Type.MAP_KEY:
          key !== void 0 && items.push(new Pair(key)), item.error && doc.errors.push(item.error), key = resolveNode(doc, item.node), keyStart = null;
          break;
        case PlainValue.Type.MAP_VALUE:
          {
            if (key === void 0 && (key = null), item.error && doc.errors.push(item.error), !item.context.atLineStart && item.node && item.node.type === PlainValue.Type.MAP && !item.node.context.atLineStart) {
              let msg = "Nested mappings are not allowed in compact mappings";
              doc.errors.push(new PlainValue.YAMLSemanticError(item.node, msg));
            }
            let valueNode = item.node;
            if (!valueNode && item.props.length > 0) {
              valueNode = new PlainValue.PlainValue(PlainValue.Type.PLAIN, []), valueNode.context = {
                parent: item,
                src: item.context.src
              };
              let pos = item.range.start + 1;
              if (valueNode.range = {
                start: pos,
                end: pos
              }, valueNode.valueRange = {
                start: pos,
                end: pos
              }, typeof item.range.origStart == "number") {
                let origPos = item.range.origStart + 1;
                valueNode.range.origStart = valueNode.range.origEnd = origPos, valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
              }
            }
            let pair = new Pair(key, resolveNode(doc, valueNode));
            resolvePairComment(item, pair), items.push(pair), key && typeof keyStart == "number" && item.range.start > keyStart + 1024 && doc.errors.push(getLongKeyError(cst, key)), key = void 0, keyStart = null;
          }
          break;
        default:
          key !== void 0 && items.push(new Pair(key)), key = resolveNode(doc, item), keyStart = item.range.start, item.error && doc.errors.push(item.error);
          next:
            for (let j = i + 1; ; ++j) {
              let nextItem = cst.items[j];
              switch (nextItem && nextItem.type) {
                case PlainValue.Type.BLANK_LINE:
                case PlainValue.Type.COMMENT:
                  continue next;
                case PlainValue.Type.MAP_VALUE:
                  break next;
                default: {
                  let msg = "Implicit map keys need to be followed by map values";
                  doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
                  break next;
                }
              }
            }
          if (item.valueRangeContainsNewline) {
            let msg = "Implicit map keys need to be on a single line";
            doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
          }
      }
    }
    return key !== void 0 && items.push(new Pair(key)), {
      comments,
      items
    };
  }
  __name(resolveBlockMapItems, "resolveBlockMapItems");
  function resolveFlowMapItems(doc, cst) {
    let comments = [], items = [], key, explicitKey = !1, next = "{";
    for (let i = 0; i < cst.items.length; ++i) {
      let item = cst.items[i];
      if (typeof item.char == "string") {
        let {
          char,
          offset
        } = item;
        if (char === "?" && key === void 0 && !explicitKey) {
          explicitKey = !0, next = ":";
          continue;
        }
        if (char === ":") {
          if (key === void 0 && (key = null), next === ":") {
            next = ",";
            continue;
          }
        } else if (explicitKey && (key === void 0 && char !== "," && (key = null), explicitKey = !1), key !== void 0 && (items.push(new Pair(key)), key = void 0, char === ",")) {
          next = ":";
          continue;
        }
        if (char === "}") {
          if (i === cst.items.length - 1)
            continue;
        } else if (char === next) {
          next = ":";
          continue;
        }
        let msg = `Flow map contains an unexpected ${char}`, err = new PlainValue.YAMLSyntaxError(cst, msg);
        err.offset = offset, doc.errors.push(err);
      } else
        item.type === PlainValue.Type.BLANK_LINE ? comments.push({
          afterKey: !!key,
          before: items.length
        }) : item.type === PlainValue.Type.COMMENT ? (checkFlowCommentSpace(doc.errors, item), comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        })) : key === void 0 ? (next === "," && doc.errors.push(new PlainValue.YAMLSemanticError(item, "Separator , missing in flow map")), key = resolveNode(doc, item)) : (next !== "," && doc.errors.push(new PlainValue.YAMLSemanticError(item, "Indicator : missing in flow map entry")), items.push(new Pair(key, resolveNode(doc, item))), key = void 0, explicitKey = !1);
    }
    return checkFlowCollectionEnd(doc.errors, cst), key !== void 0 && items.push(new Pair(key)), {
      comments,
      items
    };
  }
  __name(resolveFlowMapItems, "resolveFlowMapItems");
  function resolveSeq(doc, cst) {
    if (cst.type !== PlainValue.Type.SEQ && cst.type !== PlainValue.Type.FLOW_SEQ) {
      let msg = `A ${cst.type} node cannot be resolved as a sequence`;
      return doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg)), null;
    }
    let {
      comments,
      items
    } = cst.type === PlainValue.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst), seq = new YAMLSeq();
    if (seq.items = items, resolveComments(seq, comments), !doc.options.mapAsMap && items.some((it) => it instanceof Pair && it.key instanceof Collection)) {
      let warn = "Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.";
      doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
    }
    return cst.resolved = seq, seq;
  }
  __name(resolveSeq, "resolveSeq");
  function resolveBlockSeqItems(doc, cst) {
    let comments = [], items = [];
    for (let i = 0; i < cst.items.length; ++i) {
      let item = cst.items[i];
      switch (item.type) {
        case PlainValue.Type.BLANK_LINE:
          comments.push({
            before: items.length
          });
          break;
        case PlainValue.Type.COMMENT:
          comments.push({
            comment: item.comment,
            before: items.length
          });
          break;
        case PlainValue.Type.SEQ_ITEM:
          if (item.error && doc.errors.push(item.error), items.push(resolveNode(doc, item.node)), item.hasProps) {
            let msg = "Sequence items cannot have tags or anchors before the - indicator";
            doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
          }
          break;
        default:
          item.error && doc.errors.push(item.error), doc.errors.push(new PlainValue.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
      }
    }
    return {
      comments,
      items
    };
  }
  __name(resolveBlockSeqItems, "resolveBlockSeqItems");
  function resolveFlowSeqItems(doc, cst) {
    let comments = [], items = [], explicitKey = !1, key, keyStart = null, next = "[", prevItem = null;
    for (let i = 0; i < cst.items.length; ++i) {
      let item = cst.items[i];
      if (typeof item.char == "string") {
        let {
          char,
          offset
        } = item;
        if (char !== ":" && (explicitKey || key !== void 0) && (explicitKey && key === void 0 && (key = next ? items.pop() : null), items.push(new Pair(key)), explicitKey = !1, key = void 0, keyStart = null), char === next)
          next = null;
        else if (!next && char === "?")
          explicitKey = !0;
        else if (next !== "[" && char === ":" && key === void 0) {
          if (next === ",") {
            if (key = items.pop(), key instanceof Pair) {
              let msg = "Chaining flow sequence pairs is invalid", err = new PlainValue.YAMLSemanticError(cst, msg);
              err.offset = offset, doc.errors.push(err);
            }
            if (!explicitKey && typeof keyStart == "number") {
              let keyEnd = item.range ? item.range.start : item.offset;
              keyEnd > keyStart + 1024 && doc.errors.push(getLongKeyError(cst, key));
              let {
                src
              } = prevItem.context;
              for (let i2 = keyStart; i2 < keyEnd; ++i2)
                if (src[i2] === `
`) {
                  let msg = "Implicit keys of flow sequence pairs need to be on a single line";
                  doc.errors.push(new PlainValue.YAMLSemanticError(prevItem, msg));
                  break;
                }
            }
          } else
            key = null;
          keyStart = null, explicitKey = !1, next = null;
        } else if (next === "[" || char !== "]" || i < cst.items.length - 1) {
          let msg = `Flow sequence contains an unexpected ${char}`, err = new PlainValue.YAMLSyntaxError(cst, msg);
          err.offset = offset, doc.errors.push(err);
        }
      } else if (item.type === PlainValue.Type.BLANK_LINE)
        comments.push({
          before: items.length
        });
      else if (item.type === PlainValue.Type.COMMENT)
        checkFlowCommentSpace(doc.errors, item), comments.push({
          comment: item.comment,
          before: items.length
        });
      else {
        if (next) {
          let msg = `Expected a ${next} in flow sequence`;
          doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
        }
        let value = resolveNode(doc, item);
        key === void 0 ? (items.push(value), prevItem = item) : (items.push(new Pair(key, value)), key = void 0), keyStart = item.range.start, next = ",";
      }
    }
    return checkFlowCollectionEnd(doc.errors, cst), key !== void 0 && items.push(new Pair(key)), {
      comments,
      items
    };
  }
  __name(resolveFlowSeqItems, "resolveFlowSeqItems");
  exports2.Alias = Alias;
  exports2.Collection = Collection;
  exports2.Merge = Merge;
  exports2.Node = Node;
  exports2.Pair = Pair;
  exports2.Scalar = Scalar;
  exports2.YAMLMap = YAMLMap;
  exports2.YAMLSeq = YAMLSeq;
  exports2.addComment = addComment;
  exports2.binaryOptions = binaryOptions;
  exports2.boolOptions = boolOptions;
  exports2.findPair = findPair;
  exports2.intOptions = intOptions;
  exports2.isEmptyPath = isEmptyPath;
  exports2.nullOptions = nullOptions;
  exports2.resolveMap = resolveMap;
  exports2.resolveNode = resolveNode;
  exports2.resolveSeq = resolveSeq;
  exports2.resolveString = resolveString;
  exports2.strOptions = strOptions;
  exports2.stringifyNumber = stringifyNumber;
  exports2.stringifyString = stringifyString;
  exports2.toJSON = toJSON;
});

// node_modules/yaml/dist/warnings-39684f17.js
var require_warnings_39684f17 = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e(), resolveSeq = require_resolveSeq_4a68b39b(), binary = {
    identify: (value) => value instanceof Uint8Array,
    default: !1,
    tag: "tag:yaml.org,2002:binary",
    resolve: (doc, node) => {
      let src = resolveSeq.resolveString(doc, node);
      if (typeof Buffer == "function")
        return Buffer.from(src, "base64");
      if (typeof atob == "function") {
        let str = atob(src.replace(/[\n\r]/g, "")), buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        let msg = "This environment does not support reading binary tags; either Buffer or atob is required";
        return doc.errors.push(new PlainValue.YAMLReferenceError(node, msg)), null;
      }
    },
    options: resolveSeq.binaryOptions,
    stringify: ({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep) => {
      let src;
      if (typeof Buffer == "function")
        src = value instanceof Buffer ? value.toString("base64") : Buffer.from(value.buffer).toString("base64");
      else if (typeof btoa == "function") {
        let s = "";
        for (let i = 0; i < value.length; ++i)
          s += String.fromCharCode(value[i]);
        src = btoa(s);
      } else
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      if (type || (type = resolveSeq.binaryOptions.defaultType), type === PlainValue.Type.QUOTE_DOUBLE)
        value = src;
      else {
        let {
          lineWidth
        } = resolveSeq.binaryOptions, n = Math.ceil(src.length / lineWidth), lines = new Array(n);
        for (let i = 0, o = 0; i < n; ++i, o += lineWidth)
          lines[i] = src.substr(o, lineWidth);
        value = lines.join(type === PlainValue.Type.BLOCK_LITERAL ? `
` : " ");
      }
      return resolveSeq.stringifyString({
        comment,
        type,
        value
      }, ctx, onComment, onChompKeep);
    }
  };
  function parsePairs(doc, cst) {
    let seq = resolveSeq.resolveSeq(doc, cst);
    for (let i = 0; i < seq.items.length; ++i) {
      let item = seq.items[i];
      if (!(item instanceof resolveSeq.Pair)) {
        if (item instanceof resolveSeq.YAMLMap) {
          if (item.items.length > 1) {
            let msg = "Each pair must have its own sequence indicator";
            throw new PlainValue.YAMLSemanticError(cst, msg);
          }
          let pair = item.items[0] || new resolveSeq.Pair();
          item.commentBefore && (pair.commentBefore = pair.commentBefore ? `${item.commentBefore}
${pair.commentBefore}` : item.commentBefore), item.comment && (pair.comment = pair.comment ? `${item.comment}
${pair.comment}` : item.comment), item = pair;
        }
        seq.items[i] = item instanceof resolveSeq.Pair ? item : new resolveSeq.Pair(item);
      }
    }
    return seq;
  }
  __name(parsePairs, "parsePairs");
  function createPairs(schema, iterable, ctx) {
    let pairs2 = new resolveSeq.YAMLSeq(schema);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    for (let it of iterable) {
      let key, value;
      if (Array.isArray(it))
        if (it.length === 2)
          key = it[0], value = it[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      else if (it && it instanceof Object) {
        let keys = Object.keys(it);
        if (keys.length === 1)
          key = keys[0], value = it[key];
        else
          throw new TypeError(`Expected { key: value } tuple: ${it}`);
      } else
        key = it;
      let pair = schema.createPair(key, value, ctx);
      pairs2.items.push(pair);
    }
    return pairs2;
  }
  __name(createPairs, "createPairs");
  var pairs = {
    default: !1,
    tag: "tag:yaml.org,2002:pairs",
    resolve: parsePairs,
    createNode: createPairs
  }, YAMLOMap = class extends resolveSeq.YAMLSeq {
    constructor() {
      super();
      PlainValue._defineProperty(this, "add", resolveSeq.YAMLMap.prototype.add.bind(this)), PlainValue._defineProperty(this, "delete", resolveSeq.YAMLMap.prototype.delete.bind(this)), PlainValue._defineProperty(this, "get", resolveSeq.YAMLMap.prototype.get.bind(this)), PlainValue._defineProperty(this, "has", resolveSeq.YAMLMap.prototype.has.bind(this)), PlainValue._defineProperty(this, "set", resolveSeq.YAMLMap.prototype.set.bind(this)), this.tag = YAMLOMap.tag;
    }
    toJSON(_, ctx) {
      let map = new Map();
      ctx && ctx.onCreate && ctx.onCreate(map);
      for (let pair of this.items) {
        let key, value;
        if (pair instanceof resolveSeq.Pair ? (key = resolveSeq.toJSON(pair.key, "", ctx), value = resolveSeq.toJSON(pair.value, key, ctx)) : key = resolveSeq.toJSON(pair, "", ctx), map.has(key))
          throw new Error("Ordered maps must not include duplicate keys");
        map.set(key, value);
      }
      return map;
    }
  };
  __name(YAMLOMap, "YAMLOMap");
  PlainValue._defineProperty(YAMLOMap, "tag", "tag:yaml.org,2002:omap");
  function parseOMap(doc, cst) {
    let pairs2 = parsePairs(doc, cst), seenKeys = [];
    for (let {
      key
    } of pairs2.items)
      if (key instanceof resolveSeq.Scalar)
        if (seenKeys.includes(key.value)) {
          let msg = "Ordered maps must not include duplicate keys";
          throw new PlainValue.YAMLSemanticError(cst, msg);
        } else
          seenKeys.push(key.value);
    return Object.assign(new YAMLOMap(), pairs2);
  }
  __name(parseOMap, "parseOMap");
  function createOMap(schema, iterable, ctx) {
    let pairs2 = createPairs(schema, iterable, ctx), omap2 = new YAMLOMap();
    return omap2.items = pairs2.items, omap2;
  }
  __name(createOMap, "createOMap");
  var omap = {
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve: parseOMap,
    createNode: createOMap
  }, YAMLSet = class extends resolveSeq.YAMLMap {
    constructor() {
      super();
      this.tag = YAMLSet.tag;
    }
    add(key) {
      let pair = key instanceof resolveSeq.Pair ? key : new resolveSeq.Pair(key);
      resolveSeq.findPair(this.items, pair.key) || this.items.push(pair);
    }
    get(key, keepPair) {
      let pair = resolveSeq.findPair(this.items, key);
      return !keepPair && pair instanceof resolveSeq.Pair ? pair.key instanceof resolveSeq.Scalar ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value != "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      let prev = resolveSeq.findPair(this.items, key);
      prev && !value ? this.items.splice(this.items.indexOf(prev), 1) : !prev && value && this.items.push(new resolveSeq.Pair(key));
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues())
        return super.toString(ctx, onComment, onChompKeep);
      throw new Error("Set items must all have null values");
    }
  };
  __name(YAMLSet, "YAMLSet");
  PlainValue._defineProperty(YAMLSet, "tag", "tag:yaml.org,2002:set");
  function parseSet(doc, cst) {
    let map = resolveSeq.resolveMap(doc, cst);
    if (!map.hasAllNullValues())
      throw new PlainValue.YAMLSemanticError(cst, "Set items must all have null values");
    return Object.assign(new YAMLSet(), map);
  }
  __name(parseSet, "parseSet");
  function createSet(schema, iterable, ctx) {
    let set2 = new YAMLSet();
    for (let value of iterable)
      set2.items.push(schema.createPair(value, null, ctx));
    return set2;
  }
  __name(createSet, "createSet");
  var set = {
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    resolve: parseSet,
    createNode: createSet
  }, parseSexagesimal = /* @__PURE__ */ __name((sign, parts) => {
    let n = parts.split(":").reduce((n2, p) => n2 * 60 + Number(p), 0);
    return sign === "-" ? -n : n;
  }, "parseSexagesimal"), stringifySexagesimal = /* @__PURE__ */ __name(({
    value
  }) => {
    if (isNaN(value) || !isFinite(value))
      return resolveSeq.stringifyNumber(value);
    let sign = "";
    value < 0 && (sign = "-", value = Math.abs(value));
    let parts = [value % 60];
    return value < 60 ? parts.unshift(0) : (value = Math.round((value - parts[0]) / 60), parts.unshift(value % 60), value >= 60 && (value = Math.round((value - parts[0]) / 60), parts.unshift(value))), sign + parts.map((n) => n < 10 ? "0" + String(n) : String(n)).join(":").replace(/000000\d*$/, "");
  }, "stringifySexagesimal"), intTime = {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, "")),
    stringify: stringifySexagesimal
  }, floatTime = {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, "")),
    stringify: stringifySexagesimal
  }, timestamp = {
    identify: (value) => value instanceof Date,
    default: !0,
    tag: "tag:yaml.org,2002:timestamp",
    test: RegExp("^(?:([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?)$"),
    resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
      millisec && (millisec = (millisec + "00").substr(1, 3));
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz[0], tz.slice(1));
        Math.abs(d) < 30 && (d *= 60), date -= 6e4 * d;
      }
      return new Date(date);
    },
    stringify: ({
      value
    }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, "")
  };
  function shouldWarn(deprecation) {
    let env = typeof process != "undefined" && process.env || {};
    return deprecation ? typeof YAML_SILENCE_DEPRECATION_WARNINGS != "undefined" ? !YAML_SILENCE_DEPRECATION_WARNINGS : !env.YAML_SILENCE_DEPRECATION_WARNINGS : typeof YAML_SILENCE_WARNINGS != "undefined" ? !YAML_SILENCE_WARNINGS : !env.YAML_SILENCE_WARNINGS;
  }
  __name(shouldWarn, "shouldWarn");
  function warn(warning, type) {
    if (shouldWarn(!1)) {
      let emit = typeof process != "undefined" && process.emitWarning;
      emit ? emit(warning, type) : console.warn(type ? `${type}: ${warning}` : warning);
    }
  }
  __name(warn, "warn");
  function warnFileDeprecation(filename) {
    if (shouldWarn(!0)) {
      let path2 = filename.replace(/.*yaml[/\\]/i, "").replace(/\.js$/, "").replace(/\\/g, "/");
      warn(`The endpoint 'yaml/${path2}' will be removed in a future release.`, "DeprecationWarning");
    }
  }
  __name(warnFileDeprecation, "warnFileDeprecation");
  var warned = {};
  function warnOptionDeprecation(name, alternative) {
    if (!warned[name] && shouldWarn(!0)) {
      warned[name] = !0;
      let msg = `The option '${name}' will be removed in a future release`;
      msg += alternative ? `, use '${alternative}' instead.` : ".", warn(msg, "DeprecationWarning");
    }
  }
  __name(warnOptionDeprecation, "warnOptionDeprecation");
  exports2.binary = binary;
  exports2.floatTime = floatTime;
  exports2.intTime = intTime;
  exports2.omap = omap;
  exports2.pairs = pairs;
  exports2.set = set;
  exports2.timestamp = timestamp;
  exports2.warn = warn;
  exports2.warnFileDeprecation = warnFileDeprecation;
  exports2.warnOptionDeprecation = warnOptionDeprecation;
});

// node_modules/yaml/dist/Schema-42e9705c.js
var require_Schema_42e9705c = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e(), resolveSeq = require_resolveSeq_4a68b39b(), warnings = require_warnings_39684f17();
  function createMap(schema, obj, ctx) {
    let map2 = new resolveSeq.YAMLMap(schema);
    if (obj instanceof Map)
      for (let [key, value] of obj)
        map2.items.push(schema.createPair(key, value, ctx));
    else if (obj && typeof obj == "object")
      for (let key of Object.keys(obj))
        map2.items.push(schema.createPair(key, obj[key], ctx));
    return typeof schema.sortMapEntries == "function" && map2.items.sort(schema.sortMapEntries), map2;
  }
  __name(createMap, "createMap");
  var map = {
    createNode: createMap,
    default: !0,
    nodeClass: resolveSeq.YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve: resolveSeq.resolveMap
  };
  function createSeq(schema, obj, ctx) {
    let seq2 = new resolveSeq.YAMLSeq(schema);
    if (obj && obj[Symbol.iterator])
      for (let it of obj) {
        let v = schema.createNode(it, ctx.wrapScalars, null, ctx);
        seq2.items.push(v);
      }
    return seq2;
  }
  __name(createSeq, "createSeq");
  var seq = {
    createNode: createSeq,
    default: !0,
    nodeClass: resolveSeq.YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve: resolveSeq.resolveSeq
  }, string = {
    identify: (value) => typeof value == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: resolveSeq.resolveString,
    stringify(item, ctx, onComment, onChompKeep) {
      return ctx = Object.assign({
        actualString: !0
      }, ctx), resolveSeq.stringifyString(item, ctx, onComment, onChompKeep);
    },
    options: resolveSeq.strOptions
  }, failsafe = [map, seq, string], intIdentify = /* @__PURE__ */ __name((value) => typeof value == "bigint" || Number.isInteger(value), "intIdentify"), intResolve = /* @__PURE__ */ __name((src, part, radix) => resolveSeq.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix), "intResolve");
  function intStringify(node, radix, prefix) {
    let {
      value
    } = node;
    return intIdentify(value) && value >= 0 ? prefix + value.toString(radix) : resolveSeq.stringifyNumber(node);
  }
  __name(intStringify, "intStringify");
  var nullObj = {
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeq.nullOptions,
    stringify: () => resolveSeq.nullOptions.nullStr
  }, boolObj = {
    identify: (value) => typeof value == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => str[0] === "t" || str[0] === "T",
    options: resolveSeq.boolOptions,
    stringify: ({
      value
    }) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr
  }, octObj = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o([0-7]+)$/,
    resolve: (str, oct) => intResolve(str, oct, 8),
    options: resolveSeq.intOptions,
    stringify: (node) => intStringify(node, 8, "0o")
  }, intObj = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str) => intResolve(str, str, 10),
    options: resolveSeq.intOptions,
    stringify: resolveSeq.stringifyNumber
  }, hexObj = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x([0-9a-fA-F]+)$/,
    resolve: (str, hex) => intResolve(str, hex, 16),
    options: resolveSeq.intOptions,
    stringify: (node) => intStringify(node, 16, "0x")
  }, nanObj = {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeq.stringifyNumber
  }, expObj = {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify: ({
      value
    }) => Number(value).toExponential()
  }, floatObj = {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,
    resolve(str, frac1, frac2) {
      let frac = frac1 || frac2, node = new resolveSeq.Scalar(parseFloat(str));
      return frac && frac[frac.length - 1] === "0" && (node.minFractionDigits = frac.length), node;
    },
    stringify: resolveSeq.stringifyNumber
  }, core = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]), intIdentify$1 = /* @__PURE__ */ __name((value) => typeof value == "bigint" || Number.isInteger(value), "intIdentify$1"), stringifyJSON = /* @__PURE__ */ __name(({
    value
  }) => JSON.stringify(value), "stringifyJSON"), json = [map, seq, {
    identify: (value) => typeof value == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: resolveSeq.resolveString,
    stringify: stringifyJSON
  }, {
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  }, {
    identify: (value) => typeof value == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true|false$/,
    resolve: (str) => str === "true",
    stringify: stringifyJSON
  }, {
    identify: intIdentify$1,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str) => resolveSeq.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({
      value
    }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
  }, {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str) => parseFloat(str),
    stringify: stringifyJSON
  }];
  json.scalarFallback = (str) => {
    throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
  };
  var boolStringify = /* @__PURE__ */ __name(({
    value
  }) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr, "boolStringify"), intIdentify$2 = /* @__PURE__ */ __name((value) => typeof value == "bigint" || Number.isInteger(value), "intIdentify$2");
  function intResolve$1(sign, src, radix) {
    let str = src.replace(/_/g, "");
    if (resolveSeq.intOptions.asBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      let n2 = BigInt(str);
      return sign === "-" ? BigInt(-1) * n2 : n2;
    }
    let n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  __name(intResolve$1, "intResolve$1");
  function intStringify$1(node, radix, prefix) {
    let {
      value
    } = node;
    if (intIdentify$2(value)) {
      let str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return resolveSeq.stringifyNumber(node);
  }
  __name(intStringify$1, "intStringify$1");
  var yaml11 = failsafe.concat([{
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeq.nullOptions,
    stringify: () => resolveSeq.nullOptions.nullStr
  }, {
    identify: (value) => typeof value == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => !0,
    options: resolveSeq.boolOptions,
    stringify: boolStringify
  }, {
    identify: (value) => typeof value == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => !1,
    options: resolveSeq.boolOptions,
    stringify: boolStringify
  }, {
    identify: intIdentify$2,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^([-+]?)0b([0-1_]+)$/,
    resolve: (str, sign, bin) => intResolve$1(sign, bin, 2),
    stringify: (node) => intStringify$1(node, 2, "0b")
  }, {
    identify: intIdentify$2,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^([-+]?)0([0-7_]+)$/,
    resolve: (str, sign, oct) => intResolve$1(sign, oct, 8),
    stringify: (node) => intStringify$1(node, 8, "0")
  }, {
    identify: intIdentify$2,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^([-+]?)([0-9][0-9_]*)$/,
    resolve: (str, sign, abs) => intResolve$1(sign, abs, 10),
    stringify: resolveSeq.stringifyNumber
  }, {
    identify: intIdentify$2,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
    resolve: (str, sign, hex) => intResolve$1(sign, hex, 16),
    stringify: (node) => intStringify$1(node, 16, "0x")
  }, {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeq.stringifyNumber
  }, {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify: ({
      value
    }) => Number(value).toExponential()
  }, {
    identify: (value) => typeof value == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,
    resolve(str, frac) {
      let node = new resolveSeq.Scalar(parseFloat(str.replace(/_/g, "")));
      if (frac) {
        let f = frac.replace(/_/g, "");
        f[f.length - 1] === "0" && (node.minFractionDigits = f.length);
      }
      return node;
    },
    stringify: resolveSeq.stringifyNumber
  }], warnings.binary, warnings.omap, warnings.pairs, warnings.set, warnings.intTime, warnings.floatTime, warnings.timestamp), schemas = {
    core,
    failsafe,
    json,
    yaml11
  }, tags = {
    binary: warnings.binary,
    bool: boolObj,
    float: floatObj,
    floatExp: expObj,
    floatNaN: nanObj,
    floatTime: warnings.floatTime,
    int: intObj,
    intHex: hexObj,
    intOct: octObj,
    intTime: warnings.intTime,
    map,
    null: nullObj,
    omap: warnings.omap,
    pairs: warnings.pairs,
    seq,
    set: warnings.set,
    timestamp: warnings.timestamp
  };
  function findTagObject(value, tagName, tags2) {
    if (tagName) {
      let match = tags2.filter((t) => t.tag === tagName), tagObj = match.find((t) => !t.format) || match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags2.find((t) => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);
  }
  __name(findTagObject, "findTagObject");
  function createNode(value, tagName, ctx) {
    if (value instanceof resolveSeq.Node)
      return value;
    let {
      defaultPrefix,
      onTagObj,
      prevObjects,
      schema,
      wrapScalars
    } = ctx;
    tagName && tagName.startsWith("!!") && (tagName = defaultPrefix + tagName.slice(2));
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
      if (typeof value.toJSON == "function" && (value = value.toJSON()), typeof value != "object")
        return wrapScalars ? new resolveSeq.Scalar(value) : value;
      tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
    }
    onTagObj && (onTagObj(tagObj), delete ctx.onTagObj);
    let obj = {};
    if (value && typeof value == "object" && prevObjects) {
      let prev = prevObjects.get(value);
      if (prev) {
        let alias = new resolveSeq.Alias(prev);
        return ctx.aliasNodes.push(alias), alias;
      }
      obj.value = value, prevObjects.set(value, obj);
    }
    return obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new resolveSeq.Scalar(value) : value, tagName && obj.node instanceof resolveSeq.Node && (obj.node.tag = tagName), obj.node;
  }
  __name(createNode, "createNode");
  function getSchemaTags(schemas2, knownTags, customTags, schemaId) {
    let tags2 = schemas2[schemaId.replace(/\W/g, "")];
    if (!tags2) {
      let keys = Object.keys(schemas2).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaId}"; use one of ${keys}`);
    }
    if (Array.isArray(customTags))
      for (let tag of customTags)
        tags2 = tags2.concat(tag);
    else
      typeof customTags == "function" && (tags2 = customTags(tags2.slice()));
    for (let i = 0; i < tags2.length; ++i) {
      let tag = tags2[i];
      if (typeof tag == "string") {
        let tagObj = knownTags[tag];
        if (!tagObj) {
          let keys = Object.keys(knownTags).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        }
        tags2[i] = tagObj;
      }
    }
    return tags2;
  }
  __name(getSchemaTags, "getSchemaTags");
  var sortMapEntriesByKey = /* @__PURE__ */ __name((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0, "sortMapEntriesByKey"), Schema = class {
    constructor({
      customTags,
      merge,
      schema,
      sortMapEntries,
      tags: deprecatedCustomTags
    }) {
      this.merge = !!merge, this.name = schema, this.sortMapEntries = sortMapEntries === !0 ? sortMapEntriesByKey : sortMapEntries || null, !customTags && deprecatedCustomTags && warnings.warnOptionDeprecation("tags", "customTags"), this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
    }
    createNode(value, wrapScalars, tagName, ctx) {
      let baseCtx = {
        defaultPrefix: Schema.defaultPrefix,
        schema: this,
        wrapScalars
      }, createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
      return createNode(value, tagName, createCtx);
    }
    createPair(key, value, ctx) {
      ctx || (ctx = {
        wrapScalars: !0
      });
      let k = this.createNode(key, ctx.wrapScalars, null, ctx), v = this.createNode(value, ctx.wrapScalars, null, ctx);
      return new resolveSeq.Pair(k, v);
    }
  };
  __name(Schema, "Schema");
  PlainValue._defineProperty(Schema, "defaultPrefix", PlainValue.defaultTagPrefix);
  PlainValue._defineProperty(Schema, "defaultTags", PlainValue.defaultTags);
  exports2.Schema = Schema;
});

// node_modules/yaml/dist/Document-2cf6b08c.js
var require_Document_2cf6b08c = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e(), resolveSeq = require_resolveSeq_4a68b39b(), Schema = require_Schema_42e9705c(), defaultOptions = {
    anchorPrefix: "a",
    customTags: null,
    indent: 2,
    indentSeq: !0,
    keepCstNodes: !1,
    keepNodeTypes: !0,
    keepBlobsInJSON: !0,
    mapAsMap: !1,
    maxAliasCount: 100,
    prettyErrors: !1,
    simpleKeys: !1,
    version: "1.2"
  }, scalarOptions = {
    get binary() {
      return resolveSeq.binaryOptions;
    },
    set binary(opt) {
      Object.assign(resolveSeq.binaryOptions, opt);
    },
    get bool() {
      return resolveSeq.boolOptions;
    },
    set bool(opt) {
      Object.assign(resolveSeq.boolOptions, opt);
    },
    get int() {
      return resolveSeq.intOptions;
    },
    set int(opt) {
      Object.assign(resolveSeq.intOptions, opt);
    },
    get null() {
      return resolveSeq.nullOptions;
    },
    set null(opt) {
      Object.assign(resolveSeq.nullOptions, opt);
    },
    get str() {
      return resolveSeq.strOptions;
    },
    set str(opt) {
      Object.assign(resolveSeq.strOptions, opt);
    }
  }, documentOptions = {
    "1.0": {
      schema: "yaml-1.1",
      merge: !0,
      tagPrefixes: [{
        handle: "!",
        prefix: PlainValue.defaultTagPrefix
      }, {
        handle: "!!",
        prefix: "tag:private.yaml.org,2002:"
      }]
    },
    "1.1": {
      schema: "yaml-1.1",
      merge: !0,
      tagPrefixes: [{
        handle: "!",
        prefix: "!"
      }, {
        handle: "!!",
        prefix: PlainValue.defaultTagPrefix
      }]
    },
    "1.2": {
      schema: "core",
      merge: !1,
      tagPrefixes: [{
        handle: "!",
        prefix: "!"
      }, {
        handle: "!!",
        prefix: PlainValue.defaultTagPrefix
      }]
    }
  };
  function stringifyTag(doc, tag) {
    if ((doc.version || doc.options.version) === "1.0") {
      let priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
      if (priv)
        return "!" + priv[1];
      let vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
      return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, "")}`;
    }
    let p = doc.tagPrefixes.find((p2) => tag.indexOf(p2.prefix) === 0);
    if (!p) {
      let dtp = doc.getDefaults().tagPrefixes;
      p = dtp && dtp.find((p2) => tag.indexOf(p2.prefix) === 0);
    }
    if (!p)
      return tag[0] === "!" ? tag : `!<${tag}>`;
    let suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, (ch) => ({
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    })[ch]);
    return p.handle + suffix;
  }
  __name(stringifyTag, "stringifyTag");
  function getTagObject(tags, item) {
    if (item instanceof resolveSeq.Alias)
      return resolveSeq.Alias;
    if (item.tag) {
      let match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) || match[0];
    }
    let tagObj, obj;
    if (item instanceof resolveSeq.Scalar) {
      obj = item.value;
      let match = tags.filter((t) => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
      tagObj = match.find((t) => t.format === item.format) || match.find((t) => !t.format);
    } else
      obj = item, tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    if (!tagObj) {
      let name = obj && obj.constructor ? obj.constructor.name : typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  __name(getTagObject, "getTagObject");
  function stringifyProps(node, tagObj, {
    anchors,
    doc
  }) {
    let props = [], anchor = doc.anchors.getName(node);
    return anchor && (anchors[anchor] = node, props.push(`&${anchor}`)), node.tag ? props.push(stringifyTag(doc, node.tag)) : tagObj.default || props.push(stringifyTag(doc, tagObj.tag)), props.join(" ");
  }
  __name(stringifyProps, "stringifyProps");
  function stringify2(item, ctx, onComment, onChompKeep) {
    let {
      anchors,
      schema
    } = ctx.doc, tagObj;
    if (!(item instanceof resolveSeq.Node)) {
      let createCtx = {
        aliasNodes: [],
        onTagObj: (o) => tagObj = o,
        prevObjects: new Map()
      };
      item = schema.createNode(item, !0, null, createCtx);
      for (let alias of createCtx.aliasNodes) {
        alias.source = alias.source.node;
        let name = anchors.getName(alias.source);
        name || (name = anchors.newName(), anchors.map[name] = alias.source);
      }
    }
    if (item instanceof resolveSeq.Pair)
      return item.toString(ctx, onComment, onChompKeep);
    tagObj || (tagObj = getTagObject(schema.tags, item));
    let props = stringifyProps(item, tagObj, ctx);
    props.length > 0 && (ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1);
    let str = typeof tagObj.stringify == "function" ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof resolveSeq.Scalar ? resolveSeq.stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
    return props ? item instanceof resolveSeq.Scalar || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}` : str;
  }
  __name(stringify2, "stringify");
  var Anchors = class {
    static validAnchorNode(node) {
      return node instanceof resolveSeq.Scalar || node instanceof resolveSeq.YAMLSeq || node instanceof resolveSeq.YAMLMap;
    }
    constructor(prefix) {
      PlainValue._defineProperty(this, "map", {}), this.prefix = prefix;
    }
    createAlias(node, name) {
      return this.setAnchor(node, name), new resolveSeq.Alias(node);
    }
    createMergePair(...sources) {
      let merge = new resolveSeq.Merge();
      return merge.value.items = sources.map((s) => {
        if (s instanceof resolveSeq.Alias) {
          if (s.source instanceof resolveSeq.YAMLMap)
            return s;
        } else if (s instanceof resolveSeq.YAMLMap)
          return this.createAlias(s);
        throw new Error("Merge sources must be Map nodes or their Aliases");
      }), merge;
    }
    getName(node) {
      let {
        map
      } = this;
      return Object.keys(map).find((a) => map[a] === node);
    }
    getNames() {
      return Object.keys(this.map);
    }
    getNode(name) {
      return this.map[name];
    }
    newName(prefix) {
      prefix || (prefix = this.prefix);
      let names = Object.keys(this.map);
      for (let i = 1; ; ++i) {
        let name = `${prefix}${i}`;
        if (!names.includes(name))
          return name;
      }
    }
    resolveNodes() {
      let {
        map,
        _cstAliases
      } = this;
      Object.keys(map).forEach((a) => {
        map[a] = map[a].resolved;
      }), _cstAliases.forEach((a) => {
        a.source = a.source.resolved;
      }), delete this._cstAliases;
    }
    setAnchor(node, name) {
      if (node != null && !Anchors.validAnchorNode(node))
        throw new Error("Anchors may only be set for Scalar, Seq and Map nodes");
      if (name && /[\x00-\x19\s,[\]{}]/.test(name))
        throw new Error("Anchor names must not contain whitespace or control characters");
      let {
        map
      } = this, prev = node && Object.keys(map).find((a) => map[a] === node);
      if (prev)
        if (name)
          prev !== name && (delete map[prev], map[name] = node);
        else
          return prev;
      else {
        if (!name) {
          if (!node)
            return null;
          name = this.newName();
        }
        map[name] = node;
      }
      return name;
    }
  };
  __name(Anchors, "Anchors");
  var visit = /* @__PURE__ */ __name((node, tags) => {
    if (node && typeof node == "object") {
      let {
        tag
      } = node;
      node instanceof resolveSeq.Collection ? (tag && (tags[tag] = !0), node.items.forEach((n) => visit(n, tags))) : node instanceof resolveSeq.Pair ? (visit(node.key, tags), visit(node.value, tags)) : node instanceof resolveSeq.Scalar && tag && (tags[tag] = !0);
    }
    return tags;
  }, "visit"), listTagNames = /* @__PURE__ */ __name((node) => Object.keys(visit(node, {})), "listTagNames");
  function parseContents(doc, contents) {
    let comments = {
      before: [],
      after: []
    }, body, spaceBefore = !1;
    for (let node of contents)
      if (node.valueRange) {
        if (body !== void 0) {
          let msg = "Document contains trailing content not separated by a ... or --- line";
          doc.errors.push(new PlainValue.YAMLSyntaxError(node, msg));
          break;
        }
        let res = resolveSeq.resolveNode(doc, node);
        spaceBefore && (res.spaceBefore = !0, spaceBefore = !1), body = res;
      } else
        node.comment !== null ? (body === void 0 ? comments.before : comments.after).push(node.comment) : node.type === PlainValue.Type.BLANK_LINE && (spaceBefore = !0, body === void 0 && comments.before.length > 0 && !doc.commentBefore && (doc.commentBefore = comments.before.join(`
`), comments.before = []));
    if (doc.contents = body || null, !body)
      doc.comment = comments.before.concat(comments.after).join(`
`) || null;
    else {
      let cb = comments.before.join(`
`);
      if (cb) {
        let cbNode = body instanceof resolveSeq.Collection && body.items[0] ? body.items[0] : body;
        cbNode.commentBefore = cbNode.commentBefore ? `${cb}
${cbNode.commentBefore}` : cb;
      }
      doc.comment = comments.after.join(`
`) || null;
    }
  }
  __name(parseContents, "parseContents");
  function resolveTagDirective({
    tagPrefixes
  }, directive) {
    let [handle, prefix] = directive.parameters;
    if (!handle || !prefix) {
      let msg = "Insufficient parameters given for %TAG directive";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    if (tagPrefixes.some((p) => p.handle === handle)) {
      let msg = "The %TAG directive must only be given at most once per handle in the same document.";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    return {
      handle,
      prefix
    };
  }
  __name(resolveTagDirective, "resolveTagDirective");
  function resolveYamlDirective(doc, directive) {
    let [version] = directive.parameters;
    if (directive.name === "YAML:1.0" && (version = "1.0"), !version) {
      let msg = "Insufficient parameters given for %YAML directive";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    if (!documentOptions[version]) {
      let msg = `Document will be parsed as YAML ${doc.version || doc.options.version} rather than YAML ${version}`;
      doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
    }
    return version;
  }
  __name(resolveYamlDirective, "resolveYamlDirective");
  function parseDirectives(doc, directives, prevDoc) {
    let directiveComments = [], hasDirectives = !1;
    for (let directive of directives) {
      let {
        comment,
        name
      } = directive;
      switch (name) {
        case "TAG":
          try {
            doc.tagPrefixes.push(resolveTagDirective(doc, directive));
          } catch (error) {
            doc.errors.push(error);
          }
          hasDirectives = !0;
          break;
        case "YAML":
        case "YAML:1.0":
          if (doc.version) {
            let msg = "The %YAML directive must only be given at most once per document.";
            doc.errors.push(new PlainValue.YAMLSemanticError(directive, msg));
          }
          try {
            doc.version = resolveYamlDirective(doc, directive);
          } catch (error) {
            doc.errors.push(error);
          }
          hasDirectives = !0;
          break;
        default:
          if (name) {
            let msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
            doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
          }
      }
      comment && directiveComments.push(comment);
    }
    if (prevDoc && !hasDirectives && (doc.version || prevDoc.version || doc.options.version) === "1.1") {
      let copyTagPrefix = /* @__PURE__ */ __name(({
        handle,
        prefix
      }) => ({
        handle,
        prefix
      }), "copyTagPrefix");
      doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix), doc.version = prevDoc.version;
    }
    doc.commentBefore = directiveComments.join(`
`) || null;
  }
  __name(parseDirectives, "parseDirectives");
  function assertCollection(contents) {
    if (contents instanceof resolveSeq.Collection)
      return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  __name(assertCollection, "assertCollection");
  var Document = class {
    constructor(options) {
      this.anchors = new Anchors(options.anchorPrefix), this.commentBefore = null, this.comment = null, this.contents = null, this.directivesEndMarker = null, this.errors = [], this.options = options, this.schema = null, this.tagPrefixes = [], this.version = null, this.warnings = [];
    }
    add(value) {
      return assertCollection(this.contents), this.contents.add(value);
    }
    addIn(path2, value) {
      assertCollection(this.contents), this.contents.addIn(path2, value);
    }
    delete(key) {
      return assertCollection(this.contents), this.contents.delete(key);
    }
    deleteIn(path2) {
      return resolveSeq.isEmptyPath(path2) ? this.contents == null ? !1 : (this.contents = null, !0) : (assertCollection(this.contents), this.contents.deleteIn(path2));
    }
    getDefaults() {
      return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
    }
    get(key, keepScalar) {
      return this.contents instanceof resolveSeq.Collection ? this.contents.get(key, keepScalar) : void 0;
    }
    getIn(path2, keepScalar) {
      return resolveSeq.isEmptyPath(path2) ? !keepScalar && this.contents instanceof resolveSeq.Scalar ? this.contents.value : this.contents : this.contents instanceof resolveSeq.Collection ? this.contents.getIn(path2, keepScalar) : void 0;
    }
    has(key) {
      return this.contents instanceof resolveSeq.Collection ? this.contents.has(key) : !1;
    }
    hasIn(path2) {
      return resolveSeq.isEmptyPath(path2) ? this.contents !== void 0 : this.contents instanceof resolveSeq.Collection ? this.contents.hasIn(path2) : !1;
    }
    set(key, value) {
      assertCollection(this.contents), this.contents.set(key, value);
    }
    setIn(path2, value) {
      resolveSeq.isEmptyPath(path2) ? this.contents = value : (assertCollection(this.contents), this.contents.setIn(path2, value));
    }
    setSchema(id, customTags) {
      if (!id && !customTags && this.schema)
        return;
      typeof id == "number" && (id = id.toFixed(1)), id === "1.0" || id === "1.1" || id === "1.2" ? (this.version ? this.version = id : this.options.version = id, delete this.options.schema) : id && typeof id == "string" && (this.options.schema = id), Array.isArray(customTags) && (this.options.customTags = customTags);
      let opt = Object.assign({}, this.getDefaults(), this.options);
      this.schema = new Schema.Schema(opt);
    }
    parse(node, prevDoc) {
      this.options.keepCstNodes && (this.cstNode = node), this.options.keepNodeTypes && (this.type = "DOCUMENT");
      let {
        directives = [],
        contents = [],
        directivesEndMarker,
        error,
        valueRange
      } = node;
      if (error && (error.source || (error.source = this), this.errors.push(error)), parseDirectives(this, directives, prevDoc), directivesEndMarker && (this.directivesEndMarker = !0), this.range = valueRange ? [valueRange.start, valueRange.end] : null, this.setSchema(), this.anchors._cstAliases = [], parseContents(this, contents), this.anchors.resolveNodes(), this.options.prettyErrors) {
        for (let error2 of this.errors)
          error2 instanceof PlainValue.YAMLError && error2.makePretty();
        for (let warn of this.warnings)
          warn instanceof PlainValue.YAMLError && warn.makePretty();
      }
      return this;
    }
    listNonDefaultTags() {
      return listTagNames(this.contents).filter((t) => t.indexOf(Schema.Schema.defaultPrefix) !== 0);
    }
    setTagPrefix(handle, prefix) {
      if (handle[0] !== "!" || handle[handle.length - 1] !== "!")
        throw new Error("Handle must start and end with !");
      if (prefix) {
        let prev = this.tagPrefixes.find((p) => p.handle === handle);
        prev ? prev.prefix = prefix : this.tagPrefixes.push({
          handle,
          prefix
        });
      } else
        this.tagPrefixes = this.tagPrefixes.filter((p) => p.handle !== handle);
    }
    toJSON(arg, onAnchor) {
      let {
        keepBlobsInJSON,
        mapAsMap,
        maxAliasCount
      } = this.options, keep = keepBlobsInJSON && (typeof arg != "string" || !(this.contents instanceof resolveSeq.Scalar)), ctx = {
        doc: this,
        indentStep: "  ",
        keep,
        mapAsMap: keep && !!mapAsMap,
        maxAliasCount,
        stringify: stringify2
      }, anchorNames = Object.keys(this.anchors.map);
      anchorNames.length > 0 && (ctx.anchors = new Map(anchorNames.map((name) => [this.anchors.map[name], {
        alias: [],
        aliasCount: 0,
        count: 1
      }])));
      let res = resolveSeq.toJSON(this.contents, arg, ctx);
      if (typeof onAnchor == "function" && ctx.anchors)
        for (let {
          count,
          res: res2
        } of ctx.anchors.values())
          onAnchor(res2, count);
      return res;
    }
    toString() {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      let indentSize = this.options.indent;
      if (!Number.isInteger(indentSize) || indentSize <= 0) {
        let s = JSON.stringify(indentSize);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      this.setSchema();
      let lines = [], hasDirectives = !1;
      if (this.version) {
        let vd = "%YAML 1.2";
        this.schema.name === "yaml-1.1" && (this.version === "1.0" ? vd = "%YAML:1.0" : this.version === "1.1" && (vd = "%YAML 1.1")), lines.push(vd), hasDirectives = !0;
      }
      let tagNames = this.listNonDefaultTags();
      this.tagPrefixes.forEach(({
        handle,
        prefix
      }) => {
        tagNames.some((t) => t.indexOf(prefix) === 0) && (lines.push(`%TAG ${handle} ${prefix}`), hasDirectives = !0);
      }), (hasDirectives || this.directivesEndMarker) && lines.push("---"), this.commentBefore && ((hasDirectives || !this.directivesEndMarker) && lines.unshift(""), lines.unshift(this.commentBefore.replace(/^/gm, "#")));
      let ctx = {
        anchors: {},
        doc: this,
        indent: "",
        indentStep: " ".repeat(indentSize),
        stringify: stringify2
      }, chompKeep = !1, contentComment = null;
      if (this.contents) {
        this.contents instanceof resolveSeq.Node && (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker) && lines.push(""), this.contents.commentBefore && lines.push(this.contents.commentBefore.replace(/^/gm, "#")), ctx.forceBlockIndent = !!this.comment, contentComment = this.contents.comment);
        let onChompKeep = contentComment ? null : () => chompKeep = !0, body = stringify2(this.contents, ctx, () => contentComment = null, onChompKeep);
        lines.push(resolveSeq.addComment(body, "", contentComment));
      } else
        this.contents !== void 0 && lines.push(stringify2(this.contents, ctx));
      return this.comment && ((!chompKeep || contentComment) && lines[lines.length - 1] !== "" && lines.push(""), lines.push(this.comment.replace(/^/gm, "#"))), lines.join(`
`) + `
`;
    }
  };
  __name(Document, "Document");
  PlainValue._defineProperty(Document, "defaults", documentOptions);
  exports2.Document = Document;
  exports2.defaultOptions = defaultOptions;
  exports2.scalarOptions = scalarOptions;
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS((exports2) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e(), parseCst = require_parse_cst();
  require_resolveSeq_4a68b39b();
  var Document$1 = require_Document_2cf6b08c(), Schema = require_Schema_42e9705c(), warnings = require_warnings_39684f17();
  function createNode(value, wrapScalars = !0, tag) {
    tag === void 0 && typeof wrapScalars == "string" && (tag = wrapScalars, wrapScalars = !0);
    let options = Object.assign({}, Document$1.Document.defaults[Document$1.defaultOptions.version], Document$1.defaultOptions);
    return new Schema.Schema(options).createNode(value, wrapScalars, tag);
  }
  __name(createNode, "createNode");
  var Document = class extends Document$1.Document {
    constructor(options) {
      super(Object.assign({}, Document$1.defaultOptions, options));
    }
  };
  __name(Document, "Document");
  function parseAllDocuments(src, options) {
    let stream = [], prev;
    for (let cstDoc of parseCst.parse(src)) {
      let doc = new Document(options);
      doc.parse(cstDoc, prev), stream.push(doc), prev = doc;
    }
    return stream;
  }
  __name(parseAllDocuments, "parseAllDocuments");
  function parseDocument(src, options) {
    let cst = parseCst.parse(src), doc = new Document(options).parse(cst[0]);
    if (cst.length > 1) {
      let errMsg = "Source contains multiple documents; please use YAML.parseAllDocuments()";
      doc.errors.unshift(new PlainValue.YAMLSemanticError(cst[1], errMsg));
    }
    return doc;
  }
  __name(parseDocument, "parseDocument");
  function parse2(src, options) {
    let doc = parseDocument(src, options);
    if (doc.warnings.forEach((warning) => warnings.warn(warning)), doc.errors.length > 0)
      throw doc.errors[0];
    return doc.toJSON();
  }
  __name(parse2, "parse");
  function stringify2(value, options) {
    let doc = new Document(options);
    return doc.contents = value, String(doc);
  }
  __name(stringify2, "stringify");
  var YAML = {
    createNode,
    defaultOptions: Document$1.defaultOptions,
    Document,
    parse: parse2,
    parseAllDocuments,
    parseCST: parseCst.parse,
    parseDocument,
    scalarOptions: Document$1.scalarOptions,
    stringify: stringify2
  };
  exports2.YAML = YAML;
});

// node_modules/yaml/index.js
var require_yaml = __commonJS((exports2, module2) => {
  module2.exports = require_dist().YAML;
});

// actions/patch-cypress-config/index.ts
var import_core = __toModule(require_core()), import_exec = __toModule(require_exec()), import_glob = __toModule(require_glob()), import_fs = __toModule(require("fs")), path = __toModule(require("path")), yaml = __toModule(require_yaml()), API_URL = (0, import_core.getInput)("api_url", {required: !1}) || "https://next-cypress-dashboard.vercel.app";
async function resolveCachePath() {
  return await (0, import_core.group)("Verify Cypress installation", async () => {
    await (0, import_exec.exec)("npx", ["cypress", "install"]), await (0, import_exec.exec)("npx", ["cypress", "verify"]);
  }), (0, import_core.group)("Resolve Cypress cache path", async () => {
    let version = "", cacheDir = "";
    return await (0, import_exec.exec)("npx", ["cypress", "cache", "path"], {
      listeners: {
        stdout: (data) => {
          cacheDir += data.toString("utf8");
        }
      }
    }), await (0, import_exec.exec)("npx", ["cypress", "version", "--component", "binary"], {
      listeners: {
        stdout: (data) => {
          version += data.toString("utf8");
        }
      }
    }), path.join(cacheDir.trim(), version.trim());
  });
}
__name(resolveCachePath, "resolveCachePath");
async function main() {
  let cachePath = await resolveCachePath(), glob = await (0, import_glob.create)(`${cachePath}/**/app.yml`);
  await (0, import_core.group)("Patching config", async () => {
    for await (let configPath of glob.globGenerator()) {
      let configYaml = await import_fs.promises.readFile(configPath, "utf-8"), config = yaml.parse(configYaml);
      config.production.api_url !== API_URL ? (config.production.api_url = API_URL, (0, import_core.info)(`Patching ${configPath}`), await import_fs.promises.writeFile(configPath, yaml.stringify(config), "utf-8")) : (0, import_core.info)(`Skipping ${configPath}`);
    }
  });
}
__name(main, "main");
main().catch(import_core.setFailed);
