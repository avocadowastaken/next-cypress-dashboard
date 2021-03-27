var __create = Object.create, __defProp = Object.defineProperty, __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty, __getOwnPropNames = Object.getOwnPropertyNames, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __getOwnPropSymbols = Object.getOwnPropertySymbols, __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: !0, configurable: !0, writable: !0, value}) : obj[key] = value, __assign = (a, b) => {
  for (var prop in b || (b = {}))
    __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b))
      __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
  return a;
}, __markAsModule = (target) => __defProp(target, "__esModule", {value: !0}), __name = (target, value) => __defProp(target, "name", {value, configurable: !0});
var __rest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    __hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0 && (target[prop] = source[prop]);
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source))
      exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop) && (target[prop] = source[prop]);
  return target;
}, __commonJS = (callback, module2) => () => (module2 || (module2 = {exports: {}}, callback(module2.exports, module2)), module2.exports), __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, {get: all[name2], enumerable: !0});
}, __exportStar = (target, module2, desc) => {
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
  function issue(name2, message = "") {
    issueCommand(name2, {}, message);
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
  var fs = __importStar(require("fs")), os = __importStar(require("os")), utils_1 = require_utils();
  function issueCommand(command, message) {
    let filePath = process.env[`GITHUB_${command}`];
    if (!filePath)
      throw new Error(`Unable to find environment variable for file command ${command}`);
    if (!fs.existsSync(filePath))
      throw new Error(`Missing file at path: ${filePath}`);
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
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
  var command_1 = require_command(), file_command_1 = require_file_command(), utils_1 = require_utils(), os = __importStar(require("os")), path = __importStar(require("path")), ExitCode;
  (function(ExitCode2) {
    ExitCode2[ExitCode2.Success = 0] = "Success", ExitCode2[ExitCode2.Failure = 1] = "Failure";
  })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
  function exportVariable(name2, val) {
    let convertedVal = utils_1.toCommandValue(val);
    if (process.env[name2] = convertedVal, process.env.GITHUB_ENV || "") {
      let delimiter = "_GitHubActionsFileCommandDelimeter_", commandValue = `${name2}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
      file_command_1.issueCommand("ENV", commandValue);
    } else
      command_1.issueCommand("set-env", {name: name2}, convertedVal);
  }
  __name(exportVariable, "exportVariable");
  exports2.exportVariable = exportVariable;
  function setSecret(secret) {
    command_1.issueCommand("add-mask", {}, secret);
  }
  __name(setSecret, "setSecret");
  exports2.setSecret = setSecret;
  function addPath(inputPath) {
    process.env.GITHUB_PATH || "" ? file_command_1.issueCommand("PATH", inputPath) : command_1.issueCommand("add-path", {}, inputPath), process.env.PATH = `${inputPath}${path.delimiter}${process.env.PATH}`;
  }
  __name(addPath, "addPath");
  exports2.addPath = addPath;
  function getInput2(name2, options) {
    let val = process.env[`INPUT_${name2.replace(/ /g, "_").toUpperCase()}`] || "";
    if (options && options.required && !val)
      throw new Error(`Input required and not supplied: ${name2}`);
    return val.trim();
  }
  __name(getInput2, "getInput");
  exports2.getInput = getInput2;
  function setOutput(name2, value) {
    command_1.issueCommand("set-output", {name: name2}, value);
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
  function warning2(message) {
    command_1.issue("warning", message instanceof Error ? message.toString() : message);
  }
  __name(warning2, "warning");
  exports2.warning = warning2;
  function info2(message) {
    process.stdout.write(message + os.EOL);
  }
  __name(info2, "info");
  exports2.info = info2;
  function startGroup(name2) {
    command_1.issue("group", name2);
  }
  __name(startGroup, "startGroup");
  exports2.startGroup = startGroup;
  function endGroup() {
    command_1.issue("endgroup");
  }
  __name(endGroup, "endGroup");
  exports2.endGroup = endGroup;
  function group(name2, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      startGroup(name2);
      let result;
      try {
        result = yield fn();
      } finally {
        endGroup();
      }
      return result;
    });
  }
  __name(group, "group");
  exports2.group = group;
  function saveState(name2, value) {
    command_1.issueCommand("save-state", {name: name2}, value);
  }
  __name(saveState, "saveState");
  exports2.saveState = saveState;
  function getState(name2) {
    return process.env[`STATE_${name2}`] || "";
  }
  __name(getState, "getState");
  exports2.getState = getState;
});

// node_modules/@actions/github/lib/context.js
var require_context = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  exports2.Context = void 0;
  var fs_1 = require("fs"), os_1 = require("os"), Context = class {
    constructor() {
      if (this.payload = {}, process.env.GITHUB_EVENT_PATH)
        if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH))
          this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: "utf8"}));
        else {
          let path = process.env.GITHUB_EVENT_PATH;
          process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
        }
      this.eventName = process.env.GITHUB_EVENT_NAME, this.sha = process.env.GITHUB_SHA, this.ref = process.env.GITHUB_REF, this.workflow = process.env.GITHUB_WORKFLOW, this.action = process.env.GITHUB_ACTION, this.actor = process.env.GITHUB_ACTOR, this.job = process.env.GITHUB_JOB, this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10), this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
      let payload = this.payload;
      return Object.assign(Object.assign({}, this.repo), {number: (payload.issue || payload.pull_request || payload).number});
    }
    get repo() {
      if (process.env.GITHUB_REPOSITORY) {
        let [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        return {owner, repo};
      }
      if (this.payload.repository)
        return {
          owner: this.payload.repository.owner.login,
          repo: this.payload.repository.name
        };
      throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
  };
  __name(Context, "Context");
  exports2.Context = Context;
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === "https:", proxyUrl;
    if (checkBypass(reqUrl))
      return proxyUrl;
    let proxyVar;
    return usingSsl ? proxyVar = process.env.https_proxy || process.env.HTTPS_PROXY : proxyVar = process.env.http_proxy || process.env.HTTP_PROXY, proxyVar && (proxyUrl = new URL(proxyVar)), proxyUrl;
  }
  __name(getProxyUrl, "getProxyUrl");
  exports2.getProxyUrl = getProxyUrl;
  function checkBypass(reqUrl) {
    if (!reqUrl.hostname)
      return !1;
    let noProxy = process.env.no_proxy || process.env.NO_PROXY || "";
    if (!noProxy)
      return !1;
    let reqPort;
    reqUrl.port ? reqPort = Number(reqUrl.port) : reqUrl.protocol === "http:" ? reqPort = 80 : reqUrl.protocol === "https:" && (reqPort = 443);
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    typeof reqPort == "number" && upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    for (let upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x))
      if (upperReqHosts.some((x) => x === upperNoProxyItem))
        return !0;
    return !1;
  }
  __name(checkBypass, "checkBypass");
  exports2.checkBypass = checkBypass;
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS((exports2) => {
  "use strict";
  var net = require("net"), tls = require("tls"), http2 = require("http"), https2 = require("https"), events = require("events"), assert = require("assert"), util = require("util");
  exports2.httpOverHttp = httpOverHttp;
  exports2.httpsOverHttp = httpsOverHttp;
  exports2.httpOverHttps = httpOverHttps;
  exports2.httpsOverHttps = httpsOverHttps;
  function httpOverHttp(options) {
    var agent = new TunnelingAgent(options);
    return agent.request = http2.request, agent;
  }
  __name(httpOverHttp, "httpOverHttp");
  function httpsOverHttp(options) {
    var agent = new TunnelingAgent(options);
    return agent.request = http2.request, agent.createSocket = createSecureSocket, agent.defaultPort = 443, agent;
  }
  __name(httpsOverHttp, "httpsOverHttp");
  function httpOverHttps(options) {
    var agent = new TunnelingAgent(options);
    return agent.request = https2.request, agent;
  }
  __name(httpOverHttps, "httpOverHttps");
  function httpsOverHttps(options) {
    var agent = new TunnelingAgent(options);
    return agent.request = https2.request, agent.createSocket = createSecureSocket, agent.defaultPort = 443, agent;
  }
  __name(httpsOverHttps, "httpsOverHttps");
  function TunnelingAgent(options) {
    var self = this;
    self.options = options || {}, self.proxyOptions = self.options.proxy || {}, self.maxSockets = self.options.maxSockets || http2.Agent.defaultMaxSockets, self.requests = [], self.sockets = [], self.on("free", /* @__PURE__ */ __name(function(socket, host, port, localAddress) {
      for (var options2 = toOptions(host, port, localAddress), i = 0, len = self.requests.length; i < len; ++i) {
        var pending = self.requests[i];
        if (pending.host === options2.host && pending.port === options2.port) {
          self.requests.splice(i, 1), pending.request.onSocket(socket);
          return;
        }
      }
      socket.destroy(), self.removeSocket(socket);
    }, "onFree"));
  }
  __name(TunnelingAgent, "TunnelingAgent");
  util.inherits(TunnelingAgent, events.EventEmitter);
  TunnelingAgent.prototype.addRequest = /* @__PURE__ */ __name(function(req, host, port, localAddress) {
    var self = this, options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));
    if (self.sockets.length >= this.maxSockets) {
      self.requests.push(options);
      return;
    }
    self.createSocket(options, function(socket) {
      socket.on("free", onFree), socket.on("close", onCloseOrRemove), socket.on("agentRemove", onCloseOrRemove), req.onSocket(socket);
      function onFree() {
        self.emit("free", socket, options);
      }
      __name(onFree, "onFree");
      function onCloseOrRemove(err) {
        self.removeSocket(socket), socket.removeListener("free", onFree), socket.removeListener("close", onCloseOrRemove), socket.removeListener("agentRemove", onCloseOrRemove);
      }
      __name(onCloseOrRemove, "onCloseOrRemove");
    });
  }, "addRequest");
  TunnelingAgent.prototype.createSocket = /* @__PURE__ */ __name(function(options, cb) {
    var self = this, placeholder = {};
    self.sockets.push(placeholder);
    var connectOptions = mergeOptions({}, self.proxyOptions, {
      method: "CONNECT",
      path: options.host + ":" + options.port,
      agent: !1,
      headers: {
        host: options.host + ":" + options.port
      }
    });
    options.localAddress && (connectOptions.localAddress = options.localAddress), connectOptions.proxyAuth && (connectOptions.headers = connectOptions.headers || {}, connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64")), debug("making CONNECT request");
    var connectReq = self.request(connectOptions);
    connectReq.useChunkedEncodingByDefault = !1, connectReq.once("response", onResponse), connectReq.once("upgrade", onUpgrade), connectReq.once("connect", onConnect), connectReq.once("error", onError), connectReq.end();
    function onResponse(res) {
      res.upgrade = !0;
    }
    __name(onResponse, "onResponse");
    function onUpgrade(res, socket, head) {
      process.nextTick(function() {
        onConnect(res, socket, head);
      });
    }
    __name(onUpgrade, "onUpgrade");
    function onConnect(res, socket, head) {
      if (connectReq.removeAllListeners(), socket.removeAllListeners(), res.statusCode !== 200) {
        debug("tunneling socket could not be established, statusCode=%d", res.statusCode), socket.destroy();
        var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
        error.code = "ECONNRESET", options.request.emit("error", error), self.removeSocket(placeholder);
        return;
      }
      if (head.length > 0) {
        debug("got illegal response body from proxy"), socket.destroy();
        var error = new Error("got illegal response body from proxy");
        error.code = "ECONNRESET", options.request.emit("error", error), self.removeSocket(placeholder);
        return;
      }
      return debug("tunneling connection has established"), self.sockets[self.sockets.indexOf(placeholder)] = socket, cb(socket);
    }
    __name(onConnect, "onConnect");
    function onError(cause) {
      connectReq.removeAllListeners(), debug(`tunneling socket could not be established, cause=%s
`, cause.message, cause.stack);
      var error = new Error("tunneling socket could not be established, cause=" + cause.message);
      error.code = "ECONNRESET", options.request.emit("error", error), self.removeSocket(placeholder);
    }
    __name(onError, "onError");
  }, "createSocket");
  TunnelingAgent.prototype.removeSocket = /* @__PURE__ */ __name(function(socket) {
    var pos = this.sockets.indexOf(socket);
    if (pos !== -1) {
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      pending && this.createSocket(pending, function(socket2) {
        pending.request.onSocket(socket2);
      });
    }
  }, "removeSocket");
  function createSecureSocket(options, cb) {
    var self = this;
    TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
      var hostHeader = options.request.getHeader("host"), tlsOptions = mergeOptions({}, self.options, {
        socket,
        servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
      }), secureSocket = tls.connect(0, tlsOptions);
      self.sockets[self.sockets.indexOf(socket)] = secureSocket, cb(secureSocket);
    });
  }
  __name(createSecureSocket, "createSecureSocket");
  function toOptions(host, port, localAddress) {
    return typeof host == "string" ? {
      host,
      port,
      localAddress
    } : host;
  }
  __name(toOptions, "toOptions");
  function mergeOptions(target) {
    for (var i = 1, len = arguments.length; i < len; ++i) {
      var overrides = arguments[i];
      if (typeof overrides == "object")
        for (var keys = Object.keys(overrides), j = 0, keyLen = keys.length; j < keyLen; ++j) {
          var k = keys[j];
          overrides[k] !== void 0 && (target[k] = overrides[k]);
        }
    }
    return target;
  }
  __name(mergeOptions, "mergeOptions");
  var debug;
  process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG) ? debug = /* @__PURE__ */ __name(function() {
    var args = Array.prototype.slice.call(arguments);
    typeof args[0] == "string" ? args[0] = "TUNNEL: " + args[0] : args.unshift("TUNNEL:"), console.error.apply(console, args);
  }, "debug") : debug = /* @__PURE__ */ __name(function() {
  }, "debug");
  exports2.debug = debug;
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS((exports2, module2) => {
  module2.exports = require_tunnel();
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: !0});
  var http2 = require("http"), https2 = require("https"), pm = require_proxy(), tunnel, HttpCodes;
  (function(HttpCodes2) {
    HttpCodes2[HttpCodes2.OK = 200] = "OK", HttpCodes2[HttpCodes2.MultipleChoices = 300] = "MultipleChoices", HttpCodes2[HttpCodes2.MovedPermanently = 301] = "MovedPermanently", HttpCodes2[HttpCodes2.ResourceMoved = 302] = "ResourceMoved", HttpCodes2[HttpCodes2.SeeOther = 303] = "SeeOther", HttpCodes2[HttpCodes2.NotModified = 304] = "NotModified", HttpCodes2[HttpCodes2.UseProxy = 305] = "UseProxy", HttpCodes2[HttpCodes2.SwitchProxy = 306] = "SwitchProxy", HttpCodes2[HttpCodes2.TemporaryRedirect = 307] = "TemporaryRedirect", HttpCodes2[HttpCodes2.PermanentRedirect = 308] = "PermanentRedirect", HttpCodes2[HttpCodes2.BadRequest = 400] = "BadRequest", HttpCodes2[HttpCodes2.Unauthorized = 401] = "Unauthorized", HttpCodes2[HttpCodes2.PaymentRequired = 402] = "PaymentRequired", HttpCodes2[HttpCodes2.Forbidden = 403] = "Forbidden", HttpCodes2[HttpCodes2.NotFound = 404] = "NotFound", HttpCodes2[HttpCodes2.MethodNotAllowed = 405] = "MethodNotAllowed", HttpCodes2[HttpCodes2.NotAcceptable = 406] = "NotAcceptable", HttpCodes2[HttpCodes2.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", HttpCodes2[HttpCodes2.RequestTimeout = 408] = "RequestTimeout", HttpCodes2[HttpCodes2.Conflict = 409] = "Conflict", HttpCodes2[HttpCodes2.Gone = 410] = "Gone", HttpCodes2[HttpCodes2.TooManyRequests = 429] = "TooManyRequests", HttpCodes2[HttpCodes2.InternalServerError = 500] = "InternalServerError", HttpCodes2[HttpCodes2.NotImplemented = 501] = "NotImplemented", HttpCodes2[HttpCodes2.BadGateway = 502] = "BadGateway", HttpCodes2[HttpCodes2.ServiceUnavailable = 503] = "ServiceUnavailable", HttpCodes2[HttpCodes2.GatewayTimeout = 504] = "GatewayTimeout";
  })(HttpCodes = exports2.HttpCodes || (exports2.HttpCodes = {}));
  var Headers2;
  (function(Headers3) {
    Headers3.Accept = "accept", Headers3.ContentType = "content-type";
  })(Headers2 = exports2.Headers || (exports2.Headers = {}));
  var MediaTypes;
  (function(MediaTypes2) {
    MediaTypes2.ApplicationJson = "application/json";
  })(MediaTypes = exports2.MediaTypes || (exports2.MediaTypes = {}));
  function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : "";
  }
  __name(getProxyUrl, "getProxyUrl");
  exports2.getProxyUrl = getProxyUrl;
  var HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
  ], HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
  ], RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"], ExponentialBackoffCeiling = 10, ExponentialBackoffTimeSlice = 5, HttpClientError = class extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = "HttpClientError", this.statusCode = statusCode, Object.setPrototypeOf(this, HttpClientError.prototype);
    }
  };
  __name(HttpClientError, "HttpClientError");
  exports2.HttpClientError = HttpClientError;
  var HttpClientResponse = class {
    constructor(message) {
      this.message = message;
    }
    readBody() {
      return new Promise(async (resolve, reject) => {
        let output = Buffer.alloc(0);
        this.message.on("data", (chunk) => {
          output = Buffer.concat([output, chunk]);
        }), this.message.on("end", () => {
          resolve(output.toString());
        });
      });
    }
  };
  __name(HttpClientResponse, "HttpClientResponse");
  exports2.HttpClientResponse = HttpClientResponse;
  function isHttps(requestUrl) {
    return new URL(requestUrl).protocol === "https:";
  }
  __name(isHttps, "isHttps");
  exports2.isHttps = isHttps;
  var HttpClient = class {
    constructor(userAgent2, handlers, requestOptions) {
      this._ignoreSslError = !1, this._allowRedirects = !0, this._allowRedirectDowngrade = !1, this._maxRedirects = 50, this._allowRetries = !1, this._maxRetries = 1, this._keepAlive = !1, this._disposed = !1, this.userAgent = userAgent2, this.handlers = handlers || [], this.requestOptions = requestOptions, requestOptions && (requestOptions.ignoreSslError != null && (this._ignoreSslError = requestOptions.ignoreSslError), this._socketTimeout = requestOptions.socketTimeout, requestOptions.allowRedirects != null && (this._allowRedirects = requestOptions.allowRedirects), requestOptions.allowRedirectDowngrade != null && (this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade), requestOptions.maxRedirects != null && (this._maxRedirects = Math.max(requestOptions.maxRedirects, 0)), requestOptions.keepAlive != null && (this._keepAlive = requestOptions.keepAlive), requestOptions.allowRetries != null && (this._allowRetries = requestOptions.allowRetries), requestOptions.maxRetries != null && (this._maxRetries = requestOptions.maxRetries));
    }
    options(requestUrl, additionalHeaders) {
      return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
      return this.request("GET", requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
      return this.request("DELETE", requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
      return this.request("POST", requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
      return this.request("PATCH", requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
      return this.request("PUT", requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
      return this.request("HEAD", requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
      return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    async getJson(requestUrl, additionalHeaders = {}) {
      additionalHeaders[Headers2.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.Accept, MediaTypes.ApplicationJson);
      let res = await this.get(requestUrl, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers2.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.Accept, MediaTypes.ApplicationJson), additionalHeaders[Headers2.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.ContentType, MediaTypes.ApplicationJson);
      let res = await this.post(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers2.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.Accept, MediaTypes.ApplicationJson), additionalHeaders[Headers2.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.ContentType, MediaTypes.ApplicationJson);
      let res = await this.put(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers2.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.Accept, MediaTypes.ApplicationJson), additionalHeaders[Headers2.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers2.ContentType, MediaTypes.ApplicationJson);
      let res = await this.patch(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async request(verb, requestUrl, data, headers) {
      if (this._disposed)
        throw new Error("Client has already been disposed.");
      let parsedUrl = new URL(requestUrl), info2 = this._prepareRequest(verb, parsedUrl, headers), maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1, numTries = 0, response;
      for (; numTries < maxTries; ) {
        if (response = await this.requestRaw(info2, data), response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
          let authenticationHandler;
          for (let i = 0; i < this.handlers.length; i++)
            if (this.handlers[i].canHandleAuthentication(response)) {
              authenticationHandler = this.handlers[i];
              break;
            }
          return authenticationHandler ? authenticationHandler.handleAuthentication(this, info2, data) : response;
        }
        let redirectsRemaining = this._maxRedirects;
        for (; HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0; ) {
          let redirectUrl = response.message.headers.location;
          if (!redirectUrl)
            break;
          let parsedRedirectUrl = new URL(redirectUrl);
          if (parsedUrl.protocol == "https:" && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade)
            throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
          if (await response.readBody(), parsedRedirectUrl.hostname !== parsedUrl.hostname)
            for (let header in headers)
              header.toLowerCase() === "authorization" && delete headers[header];
          info2 = this._prepareRequest(verb, parsedRedirectUrl, headers), response = await this.requestRaw(info2, data), redirectsRemaining--;
        }
        if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1)
          return response;
        numTries += 1, numTries < maxTries && (await response.readBody(), await this._performExponentialBackoff(numTries));
      }
      return response;
    }
    dispose() {
      this._agent && this._agent.destroy(), this._disposed = !0;
    }
    requestRaw(info2, data) {
      return new Promise((resolve, reject) => {
        let callbackForResult = /* @__PURE__ */ __name(function(err, res) {
          err && reject(err), resolve(res);
        }, "callbackForResult");
        this.requestRawWithCallback(info2, data, callbackForResult);
      });
    }
    requestRawWithCallback(info2, data, onResult) {
      let socket;
      typeof data == "string" && (info2.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8"));
      let callbackCalled = !1, handleResult = /* @__PURE__ */ __name((err, res) => {
        callbackCalled || (callbackCalled = !0, onResult(err, res));
      }, "handleResult"), req = info2.httpModule.request(info2.options, (msg) => {
        let res = new HttpClientResponse(msg);
        handleResult(null, res);
      });
      req.on("socket", (sock) => {
        socket = sock;
      }), req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
        socket && socket.end(), handleResult(new Error("Request timeout: " + info2.options.path), null);
      }), req.on("error", function(err) {
        handleResult(err, null);
      }), data && typeof data == "string" && req.write(data, "utf8"), data && typeof data != "string" ? (data.on("close", function() {
        req.end();
      }), data.pipe(req)) : req.end();
    }
    getAgent(serverUrl) {
      let parsedUrl = new URL(serverUrl);
      return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
      let info2 = {};
      info2.parsedUrl = requestUrl;
      let usingSsl = info2.parsedUrl.protocol === "https:";
      info2.httpModule = usingSsl ? https2 : http2;
      let defaultPort = usingSsl ? 443 : 80;
      return info2.options = {}, info2.options.host = info2.parsedUrl.hostname, info2.options.port = info2.parsedUrl.port ? parseInt(info2.parsedUrl.port) : defaultPort, info2.options.path = (info2.parsedUrl.pathname || "") + (info2.parsedUrl.search || ""), info2.options.method = method, info2.options.headers = this._mergeHeaders(headers), this.userAgent != null && (info2.options.headers["user-agent"] = this.userAgent), info2.options.agent = this._getAgent(info2.parsedUrl), this.handlers && this.handlers.forEach((handler) => {
        handler.prepareRequest(info2.options);
      }), info2;
    }
    _mergeHeaders(headers) {
      let lowercaseKeys2 = /* @__PURE__ */ __name((obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {}), "lowercaseKeys");
      return this.requestOptions && this.requestOptions.headers ? Object.assign({}, lowercaseKeys2(this.requestOptions.headers), lowercaseKeys2(headers)) : lowercaseKeys2(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
      let lowercaseKeys2 = /* @__PURE__ */ __name((obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {}), "lowercaseKeys"), clientHeader;
      return this.requestOptions && this.requestOptions.headers && (clientHeader = lowercaseKeys2(this.requestOptions.headers)[header]), additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
      let agent, proxyUrl = pm.getProxyUrl(parsedUrl), useProxy = proxyUrl && proxyUrl.hostname;
      if (this._keepAlive && useProxy && (agent = this._proxyAgent), this._keepAlive && !useProxy && (agent = this._agent), agent)
        return agent;
      let usingSsl = parsedUrl.protocol === "https:", maxSockets = 100;
      if (this.requestOptions && (maxSockets = this.requestOptions.maxSockets || http2.globalAgent.maxSockets), useProxy) {
        tunnel || (tunnel = require_tunnel2());
        let agentOptions = {
          maxSockets,
          keepAlive: this._keepAlive,
          proxy: {
            proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`,
            host: proxyUrl.hostname,
            port: proxyUrl.port
          }
        }, tunnelAgent, overHttps = proxyUrl.protocol === "https:";
        usingSsl ? tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp : tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp, agent = tunnelAgent(agentOptions), this._proxyAgent = agent;
      }
      if (this._keepAlive && !agent) {
        let options = {keepAlive: this._keepAlive, maxSockets};
        agent = usingSsl ? new https2.Agent(options) : new http2.Agent(options), this._agent = agent;
      }
      return agent || (agent = usingSsl ? https2.globalAgent : http2.globalAgent), usingSsl && this._ignoreSslError && (agent.options = Object.assign(agent.options || {}, {
        rejectUnauthorized: !1
      })), agent;
    }
    _performExponentialBackoff(retryNumber) {
      retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
      let ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
      return new Promise((resolve) => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
      if (typeof value == "string") {
        let a = new Date(value);
        if (!isNaN(a.valueOf()))
          return a;
      }
      return value;
    }
    async _processResponse(res, options) {
      return new Promise(async (resolve, reject) => {
        let statusCode = res.message.statusCode, response = {
          statusCode,
          result: null,
          headers: {}
        };
        statusCode == HttpCodes.NotFound && resolve(response);
        let obj, contents;
        try {
          contents = await res.readBody(), contents && contents.length > 0 && (options && options.deserializeDates ? obj = JSON.parse(contents, HttpClient.dateTimeDeserializer) : obj = JSON.parse(contents), response.result = obj), response.headers = res.message.headers;
        } catch (err) {
        }
        if (statusCode > 299) {
          let msg;
          obj && obj.message ? msg = obj.message : contents && contents.length > 0 ? msg = contents : msg = "Failed request: (" + statusCode + ")";
          let err = new HttpClientError(msg, statusCode);
          err.result = response.result, reject(err);
        } else
          resolve(response);
      });
    }
  };
  __name(HttpClient, "HttpClient");
  exports2.HttpClient = HttpClient;
});

// node_modules/@actions/github/lib/internal/utils.js
var require_utils2 = __commonJS((exports2) => {
  "use strict";
  var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), Object.defineProperty(o, k2, {enumerable: !0, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), o[k2] = m[k];
  }), __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: !0, value: v});
  } : function(o, v) {
    o.default = v;
  }), __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && __createBinding(result, mod, k);
    return __setModuleDefault(result, mod), result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  exports2.getApiBaseUrl = exports2.getProxyAgent = exports2.getAuthString = void 0;
  var httpClient = __importStar(require_http_client());
  function getAuthString(token2, options) {
    if (!token2 && !options.auth)
      throw new Error("Parameter token or opts.auth is required");
    if (token2 && options.auth)
      throw new Error("Parameters token and opts.auth may not both be specified");
    return typeof options.auth == "string" ? options.auth : `token ${token2}`;
  }
  __name(getAuthString, "getAuthString");
  exports2.getAuthString = getAuthString;
  function getProxyAgent(destinationUrl) {
    return new httpClient.HttpClient().getAgent(destinationUrl);
  }
  __name(getProxyAgent, "getProxyAgent");
  exports2.getProxyAgent = getProxyAgent;
  function getApiBaseUrl() {
    return process.env.GITHUB_API_URL || "https://api.github.com";
  }
  __name(getApiBaseUrl, "getApiBaseUrl");
  exports2.getApiBaseUrl = getApiBaseUrl;
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS((exports2, module2) => {
  module2.exports = register;
  function register(state, name2, method, options) {
    if (typeof method != "function")
      throw new Error("method for before hook must be a function");
    return options || (options = {}), Array.isArray(name2) ? name2.reverse().reduce(function(callback, name3) {
      return register.bind(null, state, name3, callback, options);
    }, method)() : Promise.resolve().then(function() {
      return state.registry[name2] ? state.registry[name2].reduce(function(method2, registered) {
        return registered.hook.bind(null, method2, options);
      }, method)() : method(options);
    });
  }
  __name(register, "register");
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS((exports2, module2) => {
  module2.exports = addHook;
  function addHook(state, kind, name2, hook2) {
    var orig = hook2;
    state.registry[name2] || (state.registry[name2] = []), kind === "before" && (hook2 = /* @__PURE__ */ __name(function(method, options) {
      return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
    }, "hook")), kind === "after" && (hook2 = /* @__PURE__ */ __name(function(method, options) {
      var result;
      return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
        return result = result_, orig(result, options);
      }).then(function() {
        return result;
      });
    }, "hook")), kind === "error" && (hook2 = /* @__PURE__ */ __name(function(method, options) {
      return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
        return orig(error, options);
      });
    }, "hook")), state.registry[name2].push({
      hook: hook2,
      orig
    });
  }
  __name(addHook, "addHook");
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS((exports2, module2) => {
  module2.exports = removeHook;
  function removeHook(state, name2, method) {
    if (!!state.registry[name2]) {
      var index = state.registry[name2].map(function(registered) {
        return registered.orig;
      }).indexOf(method);
      index !== -1 && state.registry[name2].splice(index, 1);
    }
  }
  __name(removeHook, "removeHook");
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS((exports2, module2) => {
  var register = require_register(), addHook = require_add(), removeHook = require_remove(), bind = Function.bind, bindable = bind.bind(bind);
  function bindApi(hook2, state, name2) {
    var removeHookRef = bindable(removeHook, null).apply(null, name2 ? [state, name2] : [state]);
    hook2.api = {remove: removeHookRef}, hook2.remove = removeHookRef, ["before", "error", "after", "wrap"].forEach(function(kind) {
      var args = name2 ? [state, kind, name2] : [state, kind];
      hook2[kind] = hook2.api[kind] = bindable(addHook, null).apply(null, args);
    });
  }
  __name(bindApi, "bindApi");
  function HookSingular() {
    var singularHookName = "h", singularHookState = {
      registry: {}
    }, singularHook = register.bind(null, singularHookState, singularHookName);
    return bindApi(singularHook, singularHookState, singularHookName), singularHook;
  }
  __name(HookSingular, "HookSingular");
  function HookCollection() {
    var state = {
      registry: {}
    }, hook2 = register.bind(null, state);
    return bindApi(hook2, state), hook2;
  }
  __name(HookCollection, "HookCollection");
  var collectionHookDeprecationMessageDisplayed = !1;
  function Hook() {
    return collectionHookDeprecationMessageDisplayed || (console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'), collectionHookDeprecationMessageDisplayed = !0), HookCollection();
  }
  __name(Hook, "Hook");
  Hook.Singular = HookSingular.bind();
  Hook.Collection = HookCollection.bind();
  module2.exports = Hook;
  module2.exports.Hook = Hook;
  module2.exports.Singular = Hook.Singular;
  module2.exports.Collection = Hook.Collection;
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports2, module2) => {
  module2.exports = wrappy;
  function wrappy(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn != "function")
      throw new TypeError("need wrapper function");
    return Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    }), wrapper;
    function wrapper() {
      for (var args = new Array(arguments.length), i = 0; i < args.length; i++)
        args[i] = arguments[i];
      var ret = fn.apply(this, args), cb2 = args[args.length - 1];
      return typeof ret == "function" && ret !== cb2 && Object.keys(cb2).forEach(function(k) {
        ret[k] = cb2[k];
      }), ret;
    }
    __name(wrapper, "wrapper");
  }
  __name(wrappy, "wrappy");
});

// node_modules/once/once.js
var require_once = __commonJS((exports2, module2) => {
  var wrappy = require_wrappy();
  module2.exports = wrappy(once2);
  module2.exports.strict = wrappy(onceStrict);
  once2.proto = once2(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once2(this);
      },
      configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: !0
    });
  });
  function once2(fn) {
    var f = /* @__PURE__ */ __name(function() {
      return f.called ? f.value : (f.called = !0, f.value = fn.apply(this, arguments));
    }, "f");
    return f.called = !1, f;
  }
  __name(once2, "once");
  function onceStrict(fn) {
    var f = /* @__PURE__ */ __name(function() {
      if (f.called)
        throw new Error(f.onceError);
      return f.called = !0, f.value = fn.apply(this, arguments);
    }, "f"), name2 = fn.name || "Function wrapped with `once`";
    return f.onceError = name2 + " shouldn't be called more than once", f.called = !1, f;
  }
  __name(onceStrict, "onceStrict");
});

// node_modules/@octokit/core/dist-web/index.js
var require_dist_web = __commonJS((exports2) => {
  __markAsModule(exports2);
  __export(exports2, {
    Octokit: () => Octokit
  });
  var import_before_after_hook = __toModule(require_before_after_hook()), VERSION4 = "3.3.1", Octokit = class {
    constructor(options = {}) {
      let hook2 = new import_before_after_hook.Collection(), requestDefaults = {
        baseUrl: request.endpoint.DEFAULTS.baseUrl,
        headers: {},
        request: Object.assign({}, options.request, {
          hook: hook2.bind(null, "request")
        }),
        mediaType: {
          previews: [],
          format: ""
        }
      };
      if (requestDefaults.headers["user-agent"] = [
        options.userAgent,
        `octokit-core.js/${VERSION4} ${getUserAgent()}`
      ].filter(Boolean).join(" "), options.baseUrl && (requestDefaults.baseUrl = options.baseUrl), options.previews && (requestDefaults.mediaType.previews = options.previews), options.timeZone && (requestDefaults.headers["time-zone"] = options.timeZone), this.request = request.defaults(requestDefaults), this.graphql = withCustomRequest(this.request).defaults(requestDefaults), this.log = Object.assign({
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      }, options.log), this.hook = hook2, options.authStrategy) {
        let {authStrategy} = options, otherOptions = __rest(options, ["authStrategy"]), auth2 = authStrategy(Object.assign({
          request: this.request,
          log: this.log,
          octokit: this,
          octokitOptions: otherOptions
        }, options.auth));
        hook2.wrap("request", auth2.hook), this.auth = auth2;
      } else if (!options.auth)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      else {
        let auth2 = createTokenAuth(options.auth);
        hook2.wrap("request", auth2.hook), this.auth = auth2;
      }
      this.constructor.plugins.forEach((plugin) => {
        Object.assign(this, plugin(this, options));
      });
    }
    static defaults(defaults) {
      return /* @__PURE__ */ __name(class extends this {
        constructor(...args) {
          let options = args[0] || {};
          if (typeof defaults == "function") {
            super(defaults(options));
            return;
          }
          super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
            userAgent: `${options.userAgent} ${defaults.userAgent}`
          } : null));
        }
      }, "OctokitWithDefaults");
    }
    static plugin(...newPlugins) {
      var _a;
      let currentPlugins = this.plugins;
      return _a = /* @__PURE__ */ __name(class extends this {
      }, "_a"), _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a;
    }
  };
  __name(Octokit, "Octokit");
  Octokit.VERSION = VERSION4;
  Octokit.plugins = [];
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-web/index.js
var require_dist_web2 = __commonJS((exports2) => {
  __markAsModule(exports2);
  __export(exports2, {
    restEndpointMethods: () => restEndpointMethods
  });
  var Endpoints = {
    actions: {
      addSelectedRepoToOrgSecret: [
        "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
      ],
      cancelWorkflowRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
      ],
      createOrUpdateEnvironmentSecret: [
        "PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
      createOrUpdateRepoSecret: [
        "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
      ],
      createRegistrationTokenForOrg: [
        "POST /orgs/{org}/actions/runners/registration-token"
      ],
      createRegistrationTokenForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/registration-token"
      ],
      createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
      createRemoveTokenForRepo: [
        "POST /repos/{owner}/{repo}/actions/runners/remove-token"
      ],
      createWorkflowDispatch: [
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
      ],
      deleteArtifact: [
        "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
      ],
      deleteEnvironmentSecret: [
        "DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
      deleteRepoSecret: [
        "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
      ],
      deleteSelfHostedRunnerFromOrg: [
        "DELETE /orgs/{org}/actions/runners/{runner_id}"
      ],
      deleteSelfHostedRunnerFromRepo: [
        "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
      ],
      deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
      deleteWorkflowRunLogs: [
        "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
      ],
      disableSelectedRepositoryGithubActionsOrganization: [
        "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
      ],
      disableWorkflow: [
        "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
      ],
      downloadArtifact: [
        "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
      ],
      downloadJobLogsForWorkflowRun: [
        "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
      ],
      downloadWorkflowRunLogs: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
      ],
      enableSelectedRepositoryGithubActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
      ],
      enableWorkflow: [
        "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
      ],
      getAllowedActionsOrganization: [
        "GET /orgs/{org}/actions/permissions/selected-actions"
      ],
      getAllowedActionsRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
      ],
      getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      getEnvironmentPublicKey: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"
      ],
      getEnvironmentSecret: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
      ],
      getGithubActionsPermissionsOrganization: [
        "GET /orgs/{org}/actions/permissions"
      ],
      getGithubActionsPermissionsRepository: [
        "GET /repos/{owner}/{repo}/actions/permissions"
      ],
      getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
      getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
      getPendingDeploymentsForRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
      ],
      getRepoPermissions: [
        "GET /repos/{owner}/{repo}/actions/permissions",
        {},
        {renamed: ["actions", "getGithubActionsPermissionsRepository"]}
      ],
      getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
      getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      getReviewsForRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
      ],
      getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
      getSelfHostedRunnerForRepo: [
        "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
      ],
      getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
      getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
      getWorkflowRunUsage: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
      ],
      getWorkflowUsage: [
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
      ],
      listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
      listEnvironmentSecrets: [
        "GET /repositories/{repository_id}/environments/{environment_name}/secrets"
      ],
      listJobsForWorkflowRun: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
      ],
      listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
      listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
      listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
      listRunnerApplicationsForRepo: [
        "GET /repos/{owner}/{repo}/actions/runners/downloads"
      ],
      listSelectedReposForOrgSecret: [
        "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
      ],
      listSelectedRepositoriesEnabledGithubActionsOrganization: [
        "GET /orgs/{org}/actions/permissions/repositories"
      ],
      listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
      listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
      listWorkflowRunArtifacts: [
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
      ],
      listWorkflowRuns: [
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
      ],
      listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
      reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
      removeSelectedRepoFromOrgSecret: [
        "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
      ],
      reviewPendingDeploymentsForRun: [
        "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
      ],
      setAllowedActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/selected-actions"
      ],
      setAllowedActionsRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
      ],
      setGithubActionsPermissionsOrganization: [
        "PUT /orgs/{org}/actions/permissions"
      ],
      setGithubActionsPermissionsRepository: [
        "PUT /repos/{owner}/{repo}/actions/permissions"
      ],
      setSelectedReposForOrgSecret: [
        "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
      ],
      setSelectedRepositoriesEnabledGithubActionsOrganization: [
        "PUT /orgs/{org}/actions/permissions/repositories"
      ]
    },
    activity: {
      checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
      deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
      deleteThreadSubscription: [
        "DELETE /notifications/threads/{thread_id}/subscription"
      ],
      getFeeds: ["GET /feeds"],
      getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
      getThread: ["GET /notifications/threads/{thread_id}"],
      getThreadSubscriptionForAuthenticatedUser: [
        "GET /notifications/threads/{thread_id}/subscription"
      ],
      listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
      listNotificationsForAuthenticatedUser: ["GET /notifications"],
      listOrgEventsForAuthenticatedUser: [
        "GET /users/{username}/events/orgs/{org}"
      ],
      listPublicEvents: ["GET /events"],
      listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
      listPublicEventsForUser: ["GET /users/{username}/events/public"],
      listPublicOrgEvents: ["GET /orgs/{org}/events"],
      listReceivedEventsForUser: ["GET /users/{username}/received_events"],
      listReceivedPublicEventsForUser: [
        "GET /users/{username}/received_events/public"
      ],
      listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
      listRepoNotificationsForAuthenticatedUser: [
        "GET /repos/{owner}/{repo}/notifications"
      ],
      listReposStarredByAuthenticatedUser: ["GET /user/starred"],
      listReposStarredByUser: ["GET /users/{username}/starred"],
      listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
      listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
      listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
      listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
      markNotificationsAsRead: ["PUT /notifications"],
      markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
      markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
      setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
      setThreadSubscription: [
        "PUT /notifications/threads/{thread_id}/subscription"
      ],
      starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
      unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
    },
    apps: {
      addRepoToInstallation: [
        "PUT /user/installations/{installation_id}/repositories/{repository_id}"
      ],
      checkToken: ["POST /applications/{client_id}/token"],
      createContentAttachment: [
        "POST /content_references/{content_reference_id}/attachments",
        {mediaType: {previews: ["corsair"]}}
      ],
      createFromManifest: ["POST /app-manifests/{code}/conversions"],
      createInstallationAccessToken: [
        "POST /app/installations/{installation_id}/access_tokens"
      ],
      deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
      deleteInstallation: ["DELETE /app/installations/{installation_id}"],
      deleteToken: ["DELETE /applications/{client_id}/token"],
      getAuthenticated: ["GET /app"],
      getBySlug: ["GET /apps/{app_slug}"],
      getInstallation: ["GET /app/installations/{installation_id}"],
      getOrgInstallation: ["GET /orgs/{org}/installation"],
      getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
      getSubscriptionPlanForAccount: [
        "GET /marketplace_listing/accounts/{account_id}"
      ],
      getSubscriptionPlanForAccountStubbed: [
        "GET /marketplace_listing/stubbed/accounts/{account_id}"
      ],
      getUserInstallation: ["GET /users/{username}/installation"],
      getWebhookConfigForApp: ["GET /app/hook/config"],
      listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
      listAccountsForPlanStubbed: [
        "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
      ],
      listInstallationReposForAuthenticatedUser: [
        "GET /user/installations/{installation_id}/repositories"
      ],
      listInstallations: ["GET /app/installations"],
      listInstallationsForAuthenticatedUser: ["GET /user/installations"],
      listPlans: ["GET /marketplace_listing/plans"],
      listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
      listReposAccessibleToInstallation: ["GET /installation/repositories"],
      listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
      listSubscriptionsForAuthenticatedUserStubbed: [
        "GET /user/marketplace_purchases/stubbed"
      ],
      removeRepoFromInstallation: [
        "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
      ],
      resetToken: ["PATCH /applications/{client_id}/token"],
      revokeInstallationAccessToken: ["DELETE /installation/token"],
      scopeToken: ["POST /applications/{client_id}/token/scoped"],
      suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
      unsuspendInstallation: [
        "DELETE /app/installations/{installation_id}/suspended"
      ],
      updateWebhookConfigForApp: ["PATCH /app/hook/config"]
    },
    billing: {
      getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
      getGithubActionsBillingUser: [
        "GET /users/{username}/settings/billing/actions"
      ],
      getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
      getGithubPackagesBillingUser: [
        "GET /users/{username}/settings/billing/packages"
      ],
      getSharedStorageBillingOrg: [
        "GET /orgs/{org}/settings/billing/shared-storage"
      ],
      getSharedStorageBillingUser: [
        "GET /users/{username}/settings/billing/shared-storage"
      ]
    },
    checks: {
      create: ["POST /repos/{owner}/{repo}/check-runs"],
      createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
      get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
      getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
      listAnnotations: [
        "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
      ],
      listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
      listForSuite: [
        "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
      ],
      listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
      rerequestSuite: [
        "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
      ],
      setSuitesPreferences: [
        "PATCH /repos/{owner}/{repo}/check-suites/preferences"
      ],
      update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
    },
    codeScanning: {
      deleteAnalysis: [
        "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
      ],
      getAlert: [
        "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
        {},
        {renamedParameters: {alert_id: "alert_number"}}
      ],
      getAnalysis: [
        "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
      ],
      getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
      listAlertsInstances: [
        "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
      ],
      listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
      updateAlert: [
        "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
      ],
      uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
    },
    codesOfConduct: {
      getAllCodesOfConduct: [
        "GET /codes_of_conduct",
        {mediaType: {previews: ["scarlet-witch"]}}
      ],
      getConductCode: [
        "GET /codes_of_conduct/{key}",
        {mediaType: {previews: ["scarlet-witch"]}}
      ],
      getForRepo: [
        "GET /repos/{owner}/{repo}/community/code_of_conduct",
        {mediaType: {previews: ["scarlet-witch"]}}
      ]
    },
    emojis: {get: ["GET /emojis"]},
    enterpriseAdmin: {
      disableSelectedOrganizationGithubActionsEnterprise: [
        "DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"
      ],
      enableSelectedOrganizationGithubActionsEnterprise: [
        "PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"
      ],
      getAllowedActionsEnterprise: [
        "GET /enterprises/{enterprise}/actions/permissions/selected-actions"
      ],
      getGithubActionsPermissionsEnterprise: [
        "GET /enterprises/{enterprise}/actions/permissions"
      ],
      listSelectedOrganizationsEnabledGithubActionsEnterprise: [
        "GET /enterprises/{enterprise}/actions/permissions/organizations"
      ],
      setAllowedActionsEnterprise: [
        "PUT /enterprises/{enterprise}/actions/permissions/selected-actions"
      ],
      setGithubActionsPermissionsEnterprise: [
        "PUT /enterprises/{enterprise}/actions/permissions"
      ],
      setSelectedOrganizationsEnabledGithubActionsEnterprise: [
        "PUT /enterprises/{enterprise}/actions/permissions/organizations"
      ]
    },
    gists: {
      checkIsStarred: ["GET /gists/{gist_id}/star"],
      create: ["POST /gists"],
      createComment: ["POST /gists/{gist_id}/comments"],
      delete: ["DELETE /gists/{gist_id}"],
      deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
      fork: ["POST /gists/{gist_id}/forks"],
      get: ["GET /gists/{gist_id}"],
      getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
      getRevision: ["GET /gists/{gist_id}/{sha}"],
      list: ["GET /gists"],
      listComments: ["GET /gists/{gist_id}/comments"],
      listCommits: ["GET /gists/{gist_id}/commits"],
      listForUser: ["GET /users/{username}/gists"],
      listForks: ["GET /gists/{gist_id}/forks"],
      listPublic: ["GET /gists/public"],
      listStarred: ["GET /gists/starred"],
      star: ["PUT /gists/{gist_id}/star"],
      unstar: ["DELETE /gists/{gist_id}/star"],
      update: ["PATCH /gists/{gist_id}"],
      updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
    },
    git: {
      createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
      createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
      createRef: ["POST /repos/{owner}/{repo}/git/refs"],
      createTag: ["POST /repos/{owner}/{repo}/git/tags"],
      createTree: ["POST /repos/{owner}/{repo}/git/trees"],
      deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
      getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
      getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
      getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
      getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
      getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
      listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
      updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
    },
    gitignore: {
      getAllTemplates: ["GET /gitignore/templates"],
      getTemplate: ["GET /gitignore/templates/{name}"]
    },
    interactions: {
      getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
      getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
      getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
      getRestrictionsForYourPublicRepos: [
        "GET /user/interaction-limits",
        {},
        {renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]}
      ],
      removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
      removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
      removeRestrictionsForRepo: [
        "DELETE /repos/{owner}/{repo}/interaction-limits"
      ],
      removeRestrictionsForYourPublicRepos: [
        "DELETE /user/interaction-limits",
        {},
        {renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]}
      ],
      setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
      setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
      setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
      setRestrictionsForYourPublicRepos: [
        "PUT /user/interaction-limits",
        {},
        {renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]}
      ]
    },
    issues: {
      addAssignees: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
      ],
      addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
      create: ["POST /repos/{owner}/{repo}/issues"],
      createComment: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
      ],
      createLabel: ["POST /repos/{owner}/{repo}/labels"],
      createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
      deleteComment: [
        "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
      ],
      deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
      deleteMilestone: [
        "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
      ],
      get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
      getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
      getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
      getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
      list: ["GET /issues"],
      listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
      listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
      listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
      listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
      listEventsForTimeline: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
        {mediaType: {previews: ["mockingbird"]}}
      ],
      listForAuthenticatedUser: ["GET /user/issues"],
      listForOrg: ["GET /orgs/{org}/issues"],
      listForRepo: ["GET /repos/{owner}/{repo}/issues"],
      listLabelsForMilestone: [
        "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
      ],
      listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
      listLabelsOnIssue: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
      ],
      listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
      lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      removeAllLabels: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
      ],
      removeAssignees: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
      ],
      removeLabel: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
      ],
      setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
      updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
      updateMilestone: [
        "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
      ]
    },
    licenses: {
      get: ["GET /licenses/{license}"],
      getAllCommonlyUsed: ["GET /licenses"],
      getForRepo: ["GET /repos/{owner}/{repo}/license"]
    },
    markdown: {
      render: ["POST /markdown"],
      renderRaw: [
        "POST /markdown/raw",
        {headers: {"content-type": "text/plain; charset=utf-8"}}
      ]
    },
    meta: {
      get: ["GET /meta"],
      getOctocat: ["GET /octocat"],
      getZen: ["GET /zen"],
      root: ["GET /"]
    },
    migrations: {
      cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
      deleteArchiveForAuthenticatedUser: [
        "DELETE /user/migrations/{migration_id}/archive",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      deleteArchiveForOrg: [
        "DELETE /orgs/{org}/migrations/{migration_id}/archive",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      downloadArchiveForOrg: [
        "GET /orgs/{org}/migrations/{migration_id}/archive",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      getArchiveForAuthenticatedUser: [
        "GET /user/migrations/{migration_id}/archive",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
      getImportStatus: ["GET /repos/{owner}/{repo}/import"],
      getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
      getStatusForAuthenticatedUser: [
        "GET /user/migrations/{migration_id}",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      getStatusForOrg: [
        "GET /orgs/{org}/migrations/{migration_id}",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      listForAuthenticatedUser: [
        "GET /user/migrations",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      listForOrg: [
        "GET /orgs/{org}/migrations",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      listReposForOrg: [
        "GET /orgs/{org}/migrations/{migration_id}/repositories",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      listReposForUser: [
        "GET /user/migrations/{migration_id}/repositories",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
      setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
      startForAuthenticatedUser: ["POST /user/migrations"],
      startForOrg: ["POST /orgs/{org}/migrations"],
      startImport: ["PUT /repos/{owner}/{repo}/import"],
      unlockRepoForAuthenticatedUser: [
        "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      unlockRepoForOrg: [
        "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock",
        {mediaType: {previews: ["wyandotte"]}}
      ],
      updateImport: ["PATCH /repos/{owner}/{repo}/import"]
    },
    orgs: {
      blockUser: ["PUT /orgs/{org}/blocks/{username}"],
      cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
      checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
      checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
      checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
      convertMemberToOutsideCollaborator: [
        "PUT /orgs/{org}/outside_collaborators/{username}"
      ],
      createInvitation: ["POST /orgs/{org}/invitations"],
      createWebhook: ["POST /orgs/{org}/hooks"],
      deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
      get: ["GET /orgs/{org}"],
      getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
      getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
      getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
      getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
      list: ["GET /organizations"],
      listAppInstallations: ["GET /orgs/{org}/installations"],
      listBlockedUsers: ["GET /orgs/{org}/blocks"],
      listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
      listForAuthenticatedUser: ["GET /user/orgs"],
      listForUser: ["GET /users/{username}/orgs"],
      listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
      listMembers: ["GET /orgs/{org}/members"],
      listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
      listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
      listPendingInvitations: ["GET /orgs/{org}/invitations"],
      listPublicMembers: ["GET /orgs/{org}/public_members"],
      listWebhooks: ["GET /orgs/{org}/hooks"],
      pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
      removeMember: ["DELETE /orgs/{org}/members/{username}"],
      removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
      removeOutsideCollaborator: [
        "DELETE /orgs/{org}/outside_collaborators/{username}"
      ],
      removePublicMembershipForAuthenticatedUser: [
        "DELETE /orgs/{org}/public_members/{username}"
      ],
      setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
      setPublicMembershipForAuthenticatedUser: [
        "PUT /orgs/{org}/public_members/{username}"
      ],
      unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
      update: ["PATCH /orgs/{org}"],
      updateMembershipForAuthenticatedUser: [
        "PATCH /user/memberships/orgs/{org}"
      ],
      updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
      updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
    },
    packages: {
      deletePackageForAuthenticatedUser: [
        "DELETE /user/packages/{package_type}/{package_name}"
      ],
      deletePackageForOrg: [
        "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
      ],
      deletePackageVersionForAuthenticatedUser: [
        "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      deletePackageVersionForOrg: [
        "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getAllPackageVersionsForAPackageOwnedByAnOrg: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
      ],
      getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}/versions"
      ],
      getAllPackageVersionsForPackageOwnedByUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}/versions"
      ],
      getPackageForAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}"
      ],
      getPackageForOrganization: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}"
      ],
      getPackageForUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}"
      ],
      getPackageVersionForAuthenticatedUser: [
        "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getPackageVersionForOrganization: [
        "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      getPackageVersionForUser: [
        "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
      ],
      restorePackageForAuthenticatedUser: [
        "POST /user/packages/{package_type}/{package_name}/restore"
      ],
      restorePackageForOrg: [
        "POST /orgs/{org}/packages/{package_type}/{package_name}/restore"
      ],
      restorePackageVersionForAuthenticatedUser: [
        "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
      ],
      restorePackageVersionForOrg: [
        "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
      ]
    },
    projects: {
      addCollaborator: [
        "PUT /projects/{project_id}/collaborators/{username}",
        {mediaType: {previews: ["inertia"]}}
      ],
      createCard: [
        "POST /projects/columns/{column_id}/cards",
        {mediaType: {previews: ["inertia"]}}
      ],
      createColumn: [
        "POST /projects/{project_id}/columns",
        {mediaType: {previews: ["inertia"]}}
      ],
      createForAuthenticatedUser: [
        "POST /user/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      createForOrg: [
        "POST /orgs/{org}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      createForRepo: [
        "POST /repos/{owner}/{repo}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      delete: [
        "DELETE /projects/{project_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      deleteCard: [
        "DELETE /projects/columns/cards/{card_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      deleteColumn: [
        "DELETE /projects/columns/{column_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      get: [
        "GET /projects/{project_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      getCard: [
        "GET /projects/columns/cards/{card_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      getColumn: [
        "GET /projects/columns/{column_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      getPermissionForUser: [
        "GET /projects/{project_id}/collaborators/{username}/permission",
        {mediaType: {previews: ["inertia"]}}
      ],
      listCards: [
        "GET /projects/columns/{column_id}/cards",
        {mediaType: {previews: ["inertia"]}}
      ],
      listCollaborators: [
        "GET /projects/{project_id}/collaborators",
        {mediaType: {previews: ["inertia"]}}
      ],
      listColumns: [
        "GET /projects/{project_id}/columns",
        {mediaType: {previews: ["inertia"]}}
      ],
      listForOrg: [
        "GET /orgs/{org}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      listForRepo: [
        "GET /repos/{owner}/{repo}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      listForUser: [
        "GET /users/{username}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      moveCard: [
        "POST /projects/columns/cards/{card_id}/moves",
        {mediaType: {previews: ["inertia"]}}
      ],
      moveColumn: [
        "POST /projects/columns/{column_id}/moves",
        {mediaType: {previews: ["inertia"]}}
      ],
      removeCollaborator: [
        "DELETE /projects/{project_id}/collaborators/{username}",
        {mediaType: {previews: ["inertia"]}}
      ],
      update: [
        "PATCH /projects/{project_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      updateCard: [
        "PATCH /projects/columns/cards/{card_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      updateColumn: [
        "PATCH /projects/columns/{column_id}",
        {mediaType: {previews: ["inertia"]}}
      ]
    },
    pulls: {
      checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      create: ["POST /repos/{owner}/{repo}/pulls"],
      createReplyForReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
      ],
      createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      createReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
      ],
      deletePendingReview: [
        "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      deleteReviewComment: [
        "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
      ],
      dismissReview: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
      ],
      get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
      getReview: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      list: ["GET /repos/{owner}/{repo}/pulls"],
      listCommentsForReview: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
      ],
      listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
      listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
      listRequestedReviewers: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      listReviewComments: [
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
      ],
      listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
      listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      removeRequestedReviewers: [
        "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      requestReviewers: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
      ],
      submitReview: [
        "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
      ],
      update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
      updateBranch: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
        {mediaType: {previews: ["lydian"]}}
      ],
      updateReview: [
        "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
      ],
      updateReviewComment: [
        "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
      ]
    },
    rateLimit: {get: ["GET /rate_limit"]},
    reactions: {
      createForCommitComment: [
        "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      createForIssue: [
        "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      createForIssueComment: [
        "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      createForPullRequestReviewComment: [
        "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      createForTeamDiscussionCommentInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      createForTeamDiscussionInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForCommitComment: [
        "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForIssue: [
        "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForIssueComment: [
        "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForPullRequestComment: [
        "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForTeamDiscussion: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteForTeamDiscussionComment: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      deleteLegacy: [
        "DELETE /reactions/{reaction_id}",
        {mediaType: {previews: ["squirrel-girl"]}},
        {
          deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://docs.github.com/rest/reference/reactions/#delete-a-reaction-legacy"
        }
      ],
      listForCommitComment: [
        "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      listForIssue: [
        "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      listForIssueComment: [
        "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      listForPullRequestReviewComment: [
        "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      listForTeamDiscussionCommentInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ],
      listForTeamDiscussionInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
        {mediaType: {previews: ["squirrel-girl"]}}
      ]
    },
    repos: {
      acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
      addAppAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        {mapToData: "apps"}
      ],
      addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
      addStatusCheckContexts: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        {mapToData: "contexts"}
      ],
      addTeamAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        {mapToData: "teams"}
      ],
      addUserAccessRestrictions: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        {mapToData: "users"}
      ],
      checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
      checkVulnerabilityAlerts: [
        "GET /repos/{owner}/{repo}/vulnerability-alerts",
        {mediaType: {previews: ["dorian"]}}
      ],
      compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
      createCommitComment: [
        "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
      ],
      createCommitSignatureProtection: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        {mediaType: {previews: ["zzzax"]}}
      ],
      createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
      createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
      createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
      createDeploymentStatus: [
        "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
      ],
      createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
      createForAuthenticatedUser: ["POST /user/repos"],
      createFork: ["POST /repos/{owner}/{repo}/forks"],
      createInOrg: ["POST /orgs/{org}/repos"],
      createOrUpdateEnvironment: [
        "PUT /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
      createPagesSite: [
        "POST /repos/{owner}/{repo}/pages",
        {mediaType: {previews: ["switcheroo"]}}
      ],
      createRelease: ["POST /repos/{owner}/{repo}/releases"],
      createUsingTemplate: [
        "POST /repos/{template_owner}/{template_repo}/generate",
        {mediaType: {previews: ["baptiste"]}}
      ],
      createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
      declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
      delete: ["DELETE /repos/{owner}/{repo}"],
      deleteAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
      ],
      deleteAdminBranchProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      deleteAnEnvironment: [
        "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      deleteBranchProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
      deleteCommitSignatureProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        {mediaType: {previews: ["zzzax"]}}
      ],
      deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
      deleteDeployment: [
        "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
      ],
      deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
      deleteInvitation: [
        "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
      ],
      deletePagesSite: [
        "DELETE /repos/{owner}/{repo}/pages",
        {mediaType: {previews: ["switcheroo"]}}
      ],
      deletePullRequestReviewProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
      deleteReleaseAsset: [
        "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
      ],
      deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
      disableAutomatedSecurityFixes: [
        "DELETE /repos/{owner}/{repo}/automated-security-fixes",
        {mediaType: {previews: ["london"]}}
      ],
      disableVulnerabilityAlerts: [
        "DELETE /repos/{owner}/{repo}/vulnerability-alerts",
        {mediaType: {previews: ["dorian"]}}
      ],
      downloadArchive: [
        "GET /repos/{owner}/{repo}/zipball/{ref}",
        {},
        {renamed: ["repos", "downloadZipballArchive"]}
      ],
      downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
      downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
      enableAutomatedSecurityFixes: [
        "PUT /repos/{owner}/{repo}/automated-security-fixes",
        {mediaType: {previews: ["london"]}}
      ],
      enableVulnerabilityAlerts: [
        "PUT /repos/{owner}/{repo}/vulnerability-alerts",
        {mediaType: {previews: ["dorian"]}}
      ],
      get: ["GET /repos/{owner}/{repo}"],
      getAccessRestrictions: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
      ],
      getAdminBranchProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
      getAllStatusCheckContexts: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
      ],
      getAllTopics: [
        "GET /repos/{owner}/{repo}/topics",
        {mediaType: {previews: ["mercy"]}}
      ],
      getAppsWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
      ],
      getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
      getBranchProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
      getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
      getCollaboratorPermissionLevel: [
        "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
      ],
      getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
      getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
      getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
      getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
      getCommitSignatureProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
        {mediaType: {previews: ["zzzax"]}}
      ],
      getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
      getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
      getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
      getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
      getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
      getDeploymentStatus: [
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
      ],
      getEnvironment: [
        "GET /repos/{owner}/{repo}/environments/{environment_name}"
      ],
      getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
      getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
      getPages: ["GET /repos/{owner}/{repo}/pages"],
      getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
      getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
      getPullRequestReviewProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
      getReadme: ["GET /repos/{owner}/{repo}/readme"],
      getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
      getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
      getStatusChecksProtection: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      getTeamsWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
      ],
      getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
      getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
      getUsersWithAccessToProtectedBranch: [
        "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
      ],
      getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
      getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
      getWebhookConfigForRepo: [
        "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
      ],
      listBranches: ["GET /repos/{owner}/{repo}/branches"],
      listBranchesForHeadCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
        {mediaType: {previews: ["groot"]}}
      ],
      listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
      listCommentsForCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
      ],
      listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
      listCommitStatusesForRef: [
        "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
      ],
      listCommits: ["GET /repos/{owner}/{repo}/commits"],
      listContributors: ["GET /repos/{owner}/{repo}/contributors"],
      listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
      listDeploymentStatuses: [
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
      ],
      listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
      listForAuthenticatedUser: ["GET /user/repos"],
      listForOrg: ["GET /orgs/{org}/repos"],
      listForUser: ["GET /users/{username}/repos"],
      listForks: ["GET /repos/{owner}/{repo}/forks"],
      listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
      listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
      listLanguages: ["GET /repos/{owner}/{repo}/languages"],
      listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
      listPublic: ["GET /repositories"],
      listPullRequestsAssociatedWithCommit: [
        "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
        {mediaType: {previews: ["groot"]}}
      ],
      listReleaseAssets: [
        "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
      ],
      listReleases: ["GET /repos/{owner}/{repo}/releases"],
      listTags: ["GET /repos/{owner}/{repo}/tags"],
      listTeams: ["GET /repos/{owner}/{repo}/teams"],
      listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
      merge: ["POST /repos/{owner}/{repo}/merges"],
      pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
      removeAppAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        {mapToData: "apps"}
      ],
      removeCollaborator: [
        "DELETE /repos/{owner}/{repo}/collaborators/{username}"
      ],
      removeStatusCheckContexts: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        {mapToData: "contexts"}
      ],
      removeStatusCheckProtection: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      removeTeamAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        {mapToData: "teams"}
      ],
      removeUserAccessRestrictions: [
        "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        {mapToData: "users"}
      ],
      renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
      replaceAllTopics: [
        "PUT /repos/{owner}/{repo}/topics",
        {mediaType: {previews: ["mercy"]}}
      ],
      requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
      setAdminBranchProtection: [
        "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
      ],
      setAppAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        {},
        {mapToData: "apps"}
      ],
      setStatusCheckContexts: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        {},
        {mapToData: "contexts"}
      ],
      setTeamAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        {},
        {mapToData: "teams"}
      ],
      setUserAccessRestrictions: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        {},
        {mapToData: "users"}
      ],
      testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
      transfer: ["POST /repos/{owner}/{repo}/transfer"],
      update: ["PATCH /repos/{owner}/{repo}"],
      updateBranchProtection: [
        "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
      ],
      updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
      updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
      updateInvitation: [
        "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
      ],
      updatePullRequestReviewProtection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
      ],
      updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
      updateReleaseAsset: [
        "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
      ],
      updateStatusCheckPotection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        {},
        {renamed: ["repos", "updateStatusCheckProtection"]}
      ],
      updateStatusCheckProtection: [
        "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
      ],
      updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
      updateWebhookConfigForRepo: [
        "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
      ],
      uploadReleaseAsset: [
        "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
        {baseUrl: "https://uploads.github.com"}
      ]
    },
    search: {
      code: ["GET /search/code"],
      commits: ["GET /search/commits", {mediaType: {previews: ["cloak"]}}],
      issuesAndPullRequests: ["GET /search/issues"],
      labels: ["GET /search/labels"],
      repos: ["GET /search/repositories"],
      topics: ["GET /search/topics", {mediaType: {previews: ["mercy"]}}],
      users: ["GET /search/users"]
    },
    secretScanning: {
      getAlert: [
        "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
      ],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
      updateAlert: [
        "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
      ]
    },
    teams: {
      addOrUpdateMembershipForUserInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      addOrUpdateProjectPermissionsInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      addOrUpdateRepoPermissionsInOrg: [
        "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      checkPermissionsForProjectInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        {mediaType: {previews: ["inertia"]}}
      ],
      checkPermissionsForRepoInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      create: ["POST /orgs/{org}/teams"],
      createDiscussionCommentInOrg: [
        "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
      ],
      createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
      deleteDiscussionCommentInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      deleteDiscussionInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
      getByName: ["GET /orgs/{org}/teams/{team_slug}"],
      getDiscussionCommentInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      getDiscussionInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      getMembershipForUserInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      list: ["GET /orgs/{org}/teams"],
      listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
      listDiscussionCommentsInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
      ],
      listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
      listForAuthenticatedUser: ["GET /user/teams"],
      listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
      listPendingInvitationsInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/invitations"
      ],
      listProjectsInOrg: [
        "GET /orgs/{org}/teams/{team_slug}/projects",
        {mediaType: {previews: ["inertia"]}}
      ],
      listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
      removeMembershipForUserInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
      ],
      removeProjectInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
      ],
      removeRepoInOrg: [
        "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
      ],
      updateDiscussionCommentInOrg: [
        "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
      ],
      updateDiscussionInOrg: [
        "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
      ],
      updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
    },
    users: {
      addEmailForAuthenticated: ["POST /user/emails"],
      block: ["PUT /user/blocks/{username}"],
      checkBlocked: ["GET /user/blocks/{username}"],
      checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
      checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
      createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
      createPublicSshKeyForAuthenticated: ["POST /user/keys"],
      deleteEmailForAuthenticated: ["DELETE /user/emails"],
      deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
      deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
      follow: ["PUT /user/following/{username}"],
      getAuthenticated: ["GET /user"],
      getByUsername: ["GET /users/{username}"],
      getContextForUser: ["GET /users/{username}/hovercard"],
      getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
      getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
      list: ["GET /users"],
      listBlockedByAuthenticated: ["GET /user/blocks"],
      listEmailsForAuthenticated: ["GET /user/emails"],
      listFollowedByAuthenticated: ["GET /user/following"],
      listFollowersForAuthenticatedUser: ["GET /user/followers"],
      listFollowersForUser: ["GET /users/{username}/followers"],
      listFollowingForUser: ["GET /users/{username}/following"],
      listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
      listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
      listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
      listPublicKeysForUser: ["GET /users/{username}/keys"],
      listPublicSshKeysForAuthenticated: ["GET /user/keys"],
      setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
      unblock: ["DELETE /user/blocks/{username}"],
      unfollow: ["DELETE /user/following/{username}"],
      updateAuthenticated: ["PATCH /user"]
    }
  }, VERSION4 = "4.13.5";
  function endpointsToMethods(octokit2, endpointsMap) {
    let newMethods = {};
    for (let [scope, endpoints] of Object.entries(endpointsMap))
      for (let [methodName, endpoint2] of Object.entries(endpoints)) {
        let [route, defaults, decorations] = endpoint2, [method, url] = route.split(/ /), endpointDefaults = Object.assign({method, url}, defaults);
        newMethods[scope] || (newMethods[scope] = {});
        let scopeMethods = newMethods[scope];
        if (decorations) {
          scopeMethods[methodName] = decorate(octokit2, scope, methodName, endpointDefaults, decorations);
          continue;
        }
        scopeMethods[methodName] = octokit2.request.defaults(endpointDefaults);
      }
    return newMethods;
  }
  __name(endpointsToMethods, "endpointsToMethods");
  function decorate(octokit2, scope, methodName, defaults, decorations) {
    let requestWithDefaults = octokit2.request.defaults(defaults);
    function withDecorations(...args) {
      let options = requestWithDefaults.endpoint.merge(...args);
      if (decorations.mapToData)
        return options = Object.assign({}, options, {
          data: options[decorations.mapToData],
          [decorations.mapToData]: void 0
        }), requestWithDefaults(options);
      if (decorations.renamed) {
        let [newScope, newMethodName] = decorations.renamed;
        octokit2.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
      }
      if (decorations.deprecated && octokit2.log.warn(decorations.deprecated), decorations.renamedParameters) {
        let options2 = requestWithDefaults.endpoint.merge(...args);
        for (let [name2, alias] of Object.entries(decorations.renamedParameters))
          name2 in options2 && (octokit2.log.warn(`"${name2}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`), alias in options2 || (options2[alias] = options2[name2]), delete options2[name2]);
        return requestWithDefaults(options2);
      }
      return requestWithDefaults(...args);
    }
    return __name(withDecorations, "withDecorations"), Object.assign(withDecorations, requestWithDefaults);
  }
  __name(decorate, "decorate");
  function restEndpointMethods(octokit2) {
    return endpointsToMethods(octokit2, Endpoints);
  }
  __name(restEndpointMethods, "restEndpointMethods");
  restEndpointMethods.VERSION = VERSION4;
});

// node_modules/@octokit/plugin-paginate-rest/dist-web/index.js
var require_dist_web3 = __commonJS((exports2) => {
  __markAsModule(exports2);
  __export(exports2, {
    composePaginateRest: () => composePaginateRest,
    isPaginatingEndpoint: () => isPaginatingEndpoint,
    paginateRest: () => paginateRest,
    paginatingEndpoints: () => paginatingEndpoints
  });
  var VERSION4 = "2.13.3";
  function normalizePaginatedListResponse(response) {
    if (!("total_count" in response.data && !("url" in response.data)))
      return response;
    let incompleteResults = response.data.incomplete_results, repositorySelection = response.data.repository_selection, totalCount = response.data.total_count;
    delete response.data.incomplete_results, delete response.data.repository_selection, delete response.data.total_count;
    let namespaceKey = Object.keys(response.data)[0], data = response.data[namespaceKey];
    return response.data = data, typeof incompleteResults != "undefined" && (response.data.incomplete_results = incompleteResults), typeof repositorySelection != "undefined" && (response.data.repository_selection = repositorySelection), response.data.total_count = totalCount, response;
  }
  __name(normalizePaginatedListResponse, "normalizePaginatedListResponse");
  function iterator(octokit2, route, parameters) {
    let options = typeof route == "function" ? route.endpoint(parameters) : octokit2.request.endpoint(route, parameters), requestMethod = typeof route == "function" ? route : octokit2.request, method = options.method, headers = options.headers, url = options.url;
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!url)
            return {done: !0};
          let response = await requestMethod({method, url, headers}), normalizedResponse = normalizePaginatedListResponse(response);
          return url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1], {value: normalizedResponse};
        }
      })
    };
  }
  __name(iterator, "iterator");
  function paginate(octokit2, route, parameters, mapFn) {
    return typeof parameters == "function" && (mapFn = parameters, parameters = void 0), gather(octokit2, [], iterator(octokit2, route, parameters)[Symbol.asyncIterator](), mapFn);
  }
  __name(paginate, "paginate");
  function gather(octokit2, results, iterator2, mapFn) {
    return iterator2.next().then((result) => {
      if (result.done)
        return results;
      let earlyExit = !1;
      function done() {
        earlyExit = !0;
      }
      return __name(done, "done"), results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data), earlyExit ? results : gather(octokit2, results, iterator2, mapFn);
    });
  }
  __name(gather, "gather");
  var composePaginateRest = Object.assign(paginate, {
    iterator
  }), paginatingEndpoints = [
    "GET /app/installations",
    "GET /applications/grants",
    "GET /authorizations",
    "GET /enterprises/{enterprise}/actions/permissions/organizations",
    "GET /enterprises/{enterprise}/actions/runner-groups",
    "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations",
    "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners",
    "GET /enterprises/{enterprise}/actions/runners",
    "GET /enterprises/{enterprise}/actions/runners/downloads",
    "GET /events",
    "GET /gists",
    "GET /gists/public",
    "GET /gists/starred",
    "GET /gists/{gist_id}/comments",
    "GET /gists/{gist_id}/commits",
    "GET /gists/{gist_id}/forks",
    "GET /installation/repositories",
    "GET /issues",
    "GET /marketplace_listing/plans",
    "GET /marketplace_listing/plans/{plan_id}/accounts",
    "GET /marketplace_listing/stubbed/plans",
    "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
    "GET /networks/{owner}/{repo}/events",
    "GET /notifications",
    "GET /organizations",
    "GET /orgs/{org}/actions/permissions/repositories",
    "GET /orgs/{org}/actions/runner-groups",
    "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories",
    "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners",
    "GET /orgs/{org}/actions/runners",
    "GET /orgs/{org}/actions/runners/downloads",
    "GET /orgs/{org}/actions/secrets",
    "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
    "GET /orgs/{org}/blocks",
    "GET /orgs/{org}/credential-authorizations",
    "GET /orgs/{org}/events",
    "GET /orgs/{org}/failed_invitations",
    "GET /orgs/{org}/hooks",
    "GET /orgs/{org}/installations",
    "GET /orgs/{org}/invitations",
    "GET /orgs/{org}/invitations/{invitation_id}/teams",
    "GET /orgs/{org}/issues",
    "GET /orgs/{org}/members",
    "GET /orgs/{org}/migrations",
    "GET /orgs/{org}/migrations/{migration_id}/repositories",
    "GET /orgs/{org}/outside_collaborators",
    "GET /orgs/{org}/projects",
    "GET /orgs/{org}/public_members",
    "GET /orgs/{org}/repos",
    "GET /orgs/{org}/team-sync/groups",
    "GET /orgs/{org}/teams",
    "GET /orgs/{org}/teams/{team_slug}/discussions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    "GET /orgs/{org}/teams/{team_slug}/members",
    "GET /orgs/{org}/teams/{team_slug}/projects",
    "GET /orgs/{org}/teams/{team_slug}/repos",
    "GET /orgs/{org}/teams/{team_slug}/team-sync/group-mappings",
    "GET /orgs/{org}/teams/{team_slug}/teams",
    "GET /projects/columns/{column_id}/cards",
    "GET /projects/{project_id}/collaborators",
    "GET /projects/{project_id}/columns",
    "GET /repos/{owner}/{repo}/actions/artifacts",
    "GET /repos/{owner}/{repo}/actions/runners",
    "GET /repos/{owner}/{repo}/actions/runners/downloads",
    "GET /repos/{owner}/{repo}/actions/runs",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
    "GET /repos/{owner}/{repo}/actions/secrets",
    "GET /repos/{owner}/{repo}/actions/workflows",
    "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
    "GET /repos/{owner}/{repo}/assignees",
    "GET /repos/{owner}/{repo}/branches",
    "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
    "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
    "GET /repos/{owner}/{repo}/code-scanning/alerts",
    "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    "GET /repos/{owner}/{repo}/collaborators",
    "GET /repos/{owner}/{repo}/comments",
    "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/commits",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
    "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
    "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
    "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
    "GET /repos/{owner}/{repo}/contributors",
    "GET /repos/{owner}/{repo}/deployments",
    "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
    "GET /repos/{owner}/{repo}/events",
    "GET /repos/{owner}/{repo}/forks",
    "GET /repos/{owner}/{repo}/git/matching-refs/{ref}",
    "GET /repos/{owner}/{repo}/hooks",
    "GET /repos/{owner}/{repo}/invitations",
    "GET /repos/{owner}/{repo}/issues",
    "GET /repos/{owner}/{repo}/issues/comments",
    "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/issues/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
    "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
    "GET /repos/{owner}/{repo}/keys",
    "GET /repos/{owner}/{repo}/labels",
    "GET /repos/{owner}/{repo}/milestones",
    "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
    "GET /repos/{owner}/{repo}/notifications",
    "GET /repos/{owner}/{repo}/pages/builds",
    "GET /repos/{owner}/{repo}/projects",
    "GET /repos/{owner}/{repo}/pulls",
    "GET /repos/{owner}/{repo}/pulls/comments",
    "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
    "GET /repos/{owner}/{repo}/releases",
    "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
    "GET /repos/{owner}/{repo}/secret-scanning/alerts",
    "GET /repos/{owner}/{repo}/stargazers",
    "GET /repos/{owner}/{repo}/subscribers",
    "GET /repos/{owner}/{repo}/tags",
    "GET /repos/{owner}/{repo}/teams",
    "GET /repositories",
    "GET /repositories/{repository_id}/environments/{environment_name}/secrets",
    "GET /scim/v2/enterprises/{enterprise}/Groups",
    "GET /scim/v2/enterprises/{enterprise}/Users",
    "GET /scim/v2/organizations/{org}/Users",
    "GET /search/code",
    "GET /search/commits",
    "GET /search/issues",
    "GET /search/labels",
    "GET /search/repositories",
    "GET /search/topics",
    "GET /search/users",
    "GET /teams/{team_id}/discussions",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments",
    "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
    "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
    "GET /teams/{team_id}/invitations",
    "GET /teams/{team_id}/members",
    "GET /teams/{team_id}/projects",
    "GET /teams/{team_id}/repos",
    "GET /teams/{team_id}/team-sync/group-mappings",
    "GET /teams/{team_id}/teams",
    "GET /user/blocks",
    "GET /user/emails",
    "GET /user/followers",
    "GET /user/following",
    "GET /user/gpg_keys",
    "GET /user/installations",
    "GET /user/installations/{installation_id}/repositories",
    "GET /user/issues",
    "GET /user/keys",
    "GET /user/marketplace_purchases",
    "GET /user/marketplace_purchases/stubbed",
    "GET /user/memberships/orgs",
    "GET /user/migrations",
    "GET /user/migrations/{migration_id}/repositories",
    "GET /user/orgs",
    "GET /user/public_emails",
    "GET /user/repos",
    "GET /user/repository_invitations",
    "GET /user/starred",
    "GET /user/subscriptions",
    "GET /user/teams",
    "GET /users",
    "GET /users/{username}/events",
    "GET /users/{username}/events/orgs/{org}",
    "GET /users/{username}/events/public",
    "GET /users/{username}/followers",
    "GET /users/{username}/following",
    "GET /users/{username}/gists",
    "GET /users/{username}/gpg_keys",
    "GET /users/{username}/keys",
    "GET /users/{username}/orgs",
    "GET /users/{username}/projects",
    "GET /users/{username}/received_events",
    "GET /users/{username}/received_events/public",
    "GET /users/{username}/repos",
    "GET /users/{username}/starred",
    "GET /users/{username}/subscriptions"
  ];
  function isPaginatingEndpoint(arg) {
    return typeof arg == "string" ? paginatingEndpoints.includes(arg) : !1;
  }
  __name(isPaginatingEndpoint, "isPaginatingEndpoint");
  function paginateRest(octokit2) {
    return {
      paginate: Object.assign(paginate.bind(null, octokit2), {
        iterator: iterator.bind(null, octokit2)
      })
    };
  }
  __name(paginateRest, "paginateRest");
  paginateRest.VERSION = VERSION4;
});

// node_modules/@actions/github/lib/utils.js
var require_utils3 = __commonJS((exports2) => {
  "use strict";
  var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), Object.defineProperty(o, k2, {enumerable: !0, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), o[k2] = m[k];
  }), __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: !0, value: v});
  } : function(o, v) {
    o.default = v;
  }), __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && __createBinding(result, mod, k);
    return __setModuleDefault(result, mod), result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  exports2.getOctokitOptions = exports2.GitHub = exports2.context = void 0;
  var Context = __importStar(require_context()), Utils = __importStar(require_utils2()), core_1 = require_dist_web(), plugin_rest_endpoint_methods_1 = require_dist_web2(), plugin_paginate_rest_1 = require_dist_web3();
  exports2.context = new Context.Context();
  var baseUrl = Utils.getApiBaseUrl(), defaults = {
    baseUrl,
    request: {
      agent: Utils.getProxyAgent(baseUrl)
    }
  };
  exports2.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
  function getOctokitOptions(token2, options) {
    let opts = Object.assign({}, options || {}), auth2 = Utils.getAuthString(token2, opts);
    return auth2 && (opts.auth = auth2), opts;
  }
  __name(getOctokitOptions, "getOctokitOptions");
  exports2.getOctokitOptions = getOctokitOptions;
});

// node_modules/@actions/github/lib/github.js
var require_github = __commonJS((exports2) => {
  "use strict";
  var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), Object.defineProperty(o, k2, {enumerable: !0, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    k2 === void 0 && (k2 = k), o[k2] = m[k];
  }), __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: !0, value: v});
  } : function(o, v) {
    o.default = v;
  }), __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        Object.hasOwnProperty.call(mod, k) && __createBinding(result, mod, k);
    return __setModuleDefault(result, mod), result;
  };
  Object.defineProperty(exports2, "__esModule", {value: !0});
  exports2.getOctokit = exports2.context = void 0;
  var Context = __importStar(require_context()), utils_1 = require_utils3();
  exports2.context = new Context.Context();
  function getOctokit2(token2, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token2, options));
  }
  __name(getOctokit2, "getOctokit");
  exports2.getOctokit = getOctokit2;
});

// actions/exec-task/index.ts
var import_core = __toModule(require_core());

// node_modules/universal-user-agent/dist-web/index.js
function getUserAgent() {
  return typeof navigator == "object" && "userAgent" in navigator ? navigator.userAgent : typeof process == "object" && "version" in process ? `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})` : "<environment undetectable>";
}
__name(getUserAgent, "getUserAgent");

// node_modules/is-plain-object/dist/is-plain-object.mjs
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
__name(isObject, "isObject");
function isPlainObject(o) {
  var ctor, prot;
  return isObject(o) === !1 ? !1 : (ctor = o.constructor, ctor === void 0 ? !0 : (prot = ctor.prototype, !(isObject(prot) === !1 || prot.hasOwnProperty("isPrototypeOf") === !1)));
}
__name(isPlainObject, "isPlainObject");

// node_modules/@octokit/endpoint/dist-web/index.js
function lowercaseKeys(object) {
  return object ? Object.keys(object).reduce((newObj, key) => (newObj[key.toLowerCase()] = object[key], newObj), {}) : {};
}
__name(lowercaseKeys, "lowercaseKeys");
function mergeDeep(defaults, options) {
  let result = Object.assign({}, defaults);
  return Object.keys(options).forEach((key) => {
    isPlainObject(options[key]) ? key in defaults ? result[key] = mergeDeep(defaults[key], options[key]) : Object.assign(result, {[key]: options[key]}) : Object.assign(result, {[key]: options[key]});
  }), result;
}
__name(mergeDeep, "mergeDeep");
function removeUndefinedProperties(obj) {
  for (let key in obj)
    obj[key] === void 0 && delete obj[key];
  return obj;
}
__name(removeUndefinedProperties, "removeUndefinedProperties");
function merge(defaults, route, options) {
  if (typeof route == "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {method, url} : {url: method}, options);
  } else
    options = Object.assign({}, route);
  options.headers = lowercaseKeys(options.headers), removeUndefinedProperties(options), removeUndefinedProperties(options.headers);
  let mergedOptions = mergeDeep(defaults || {}, options);
  return defaults && defaults.mediaType.previews.length && (mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews)), mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, "")), mergedOptions;
}
__name(merge, "merge");
function addQueryParameters(url, parameters) {
  let separator = /\?/.test(url) ? "&" : "?", names = Object.keys(parameters);
  return names.length === 0 ? url : url + separator + names.map((name2) => name2 === "q" ? "q=" + parameters.q.split("+").map(encodeURIComponent).join("+") : `${name2}=${encodeURIComponent(parameters[name2])}`).join("&");
}
__name(addQueryParameters, "addQueryParameters");
var urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
__name(removeNonChars, "removeNonChars");
function extractUrlVariableNames(url) {
  let matches = url.match(urlVariableRegex);
  return matches ? matches.map(removeNonChars).reduce((a, b) => a.concat(b), []) : [];
}
__name(extractUrlVariableNames, "extractUrlVariableNames");
function omit(object, keysToOmit) {
  return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => (obj[key] = object[key], obj), {});
}
__name(omit, "omit");
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    return /%[0-9A-Fa-f]/.test(part) || (part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]")), part;
  }).join("");
}
__name(encodeReserved, "encodeReserved");
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
__name(encodeUnreserved, "encodeUnreserved");
function encodeValue(operator, value, key) {
  return value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value), key ? encodeUnreserved(key) + "=" + value : value;
}
__name(encodeValue, "encodeValue");
function isDefined(value) {
  return value != null;
}
__name(isDefined, "isDefined");
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
__name(isKeyOperator, "isKeyOperator");
function getValues(context2, operator, key, modifier) {
  var value = context2[key], result = [];
  if (isDefined(value) && value !== "")
    if (typeof value == "string" || typeof value == "number" || typeof value == "boolean")
      value = value.toString(), modifier && modifier !== "*" && (value = value.substring(0, parseInt(modifier, 10))), result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    else if (modifier === "*")
      Array.isArray(value) ? value.filter(isDefined).forEach(function(value2) {
        result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
      }) : Object.keys(value).forEach(function(k) {
        isDefined(value[k]) && result.push(encodeValue(operator, value[k], k));
      });
    else {
      let tmp = [];
      Array.isArray(value) ? value.filter(isDefined).forEach(function(value2) {
        tmp.push(encodeValue(operator, value2));
      }) : Object.keys(value).forEach(function(k) {
        isDefined(value[k]) && (tmp.push(encodeUnreserved(k)), tmp.push(encodeValue(operator, value[k].toString())));
      }), isKeyOperator(operator) ? result.push(encodeUnreserved(key) + "=" + tmp.join(",")) : tmp.length !== 0 && result.push(tmp.join(","));
    }
  else
    operator === ";" ? isDefined(value) && result.push(encodeUnreserved(key)) : value === "" && (operator === "&" || operator === "?") ? result.push(encodeUnreserved(key) + "=") : value === "" && result.push("");
  return result;
}
__name(getValues, "getValues");
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
__name(parseUrl, "parseUrl");
function expand(template, context2) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
    if (expression) {
      let operator = "", values = [];
      if (operators.indexOf(expression.charAt(0)) !== -1 && (operator = expression.charAt(0), expression = expression.substr(1)), expression.split(/,/g).forEach(function(variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context2, operator, tmp[1], tmp[2] || tmp[3]));
      }), operator && operator !== "+") {
        var separator = ",";
        return operator === "?" ? separator = "&" : operator !== "#" && (separator = operator), (values.length !== 0 ? operator : "") + values.join(separator);
      } else
        return values.join(",");
    } else
      return encodeReserved(literal);
  });
}
__name(expand, "expand");
function parse(options) {
  let method = options.method.toUpperCase(), url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), headers = Object.assign({}, options.headers), body, parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]), urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters), /^http/.test(url) || (url = options.baseUrl + url);
  let omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl"), remainingParameters = omit(parameters, omittedParameters);
  if (!/application\/octet-stream/i.test(headers.accept) && (options.mediaType.format && (headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",")), options.mediaType.previews.length)) {
    let previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
    headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
      let format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
      return `application/vnd.github.${preview}-preview${format}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(method) ? url = addQueryParameters(url, remainingParameters) : "data" in remainingParameters ? body = remainingParameters.data : Object.keys(remainingParameters).length ? body = remainingParameters : headers["content-length"] = 0, !headers["content-type"] && typeof body != "undefined" && (headers["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(method) && typeof body == "undefined" && (body = ""), Object.assign({method, url, headers}, typeof body != "undefined" ? {body} : null, options.request ? {request: options.request} : null);
}
__name(parse, "parse");
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
__name(endpointWithDefaults, "endpointWithDefaults");
function withDefaults(oldDefaults, newDefaults) {
  let DEFAULTS2 = merge(oldDefaults, newDefaults), endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
__name(withDefaults, "withDefaults");
var VERSION = "6.0.11", userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`, DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
}, endpoint = withDefaults(null, DEFAULTS);

// node_modules/node-fetch/lib/index.mjs
var import_stream = __toModule(require("stream")), import_http = __toModule(require("http")), import_url = __toModule(require("url")), import_https = __toModule(require("https")), import_zlib = __toModule(require("zlib")), Readable = import_stream.default.Readable, BUFFER = Symbol("buffer"), TYPE = Symbol("type"), Blob = class {
  constructor() {
    this[TYPE] = "";
    let blobParts = arguments[0], options = arguments[1], buffers = [], size = 0;
    if (blobParts) {
      let a = blobParts, length = Number(a.length);
      for (let i = 0; i < length; i++) {
        let element = a[i], buffer;
        element instanceof Buffer ? buffer = element : ArrayBuffer.isView(element) ? buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength) : element instanceof ArrayBuffer ? buffer = Buffer.from(element) : element instanceof Blob ? buffer = element[BUFFER] : buffer = Buffer.from(typeof element == "string" ? element : String(element)), size += buffer.length, buffers.push(buffer);
      }
    }
    this[BUFFER] = Buffer.concat(buffers);
    let type = options && options.type !== void 0 && String(options.type).toLowerCase();
    type && !/[^\u0020-\u007E]/.test(type) && (this[TYPE] = type);
  }
  get size() {
    return this[BUFFER].length;
  }
  get type() {
    return this[TYPE];
  }
  text() {
    return Promise.resolve(this[BUFFER].toString());
  }
  arrayBuffer() {
    let buf = this[BUFFER], ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return Promise.resolve(ab);
  }
  stream() {
    let readable = new Readable();
    return readable._read = function() {
    }, readable.push(this[BUFFER]), readable.push(null), readable;
  }
  toString() {
    return "[object Blob]";
  }
  slice() {
    let size = this.size, start = arguments[0], end = arguments[1], relativeStart, relativeEnd;
    start === void 0 ? relativeStart = 0 : start < 0 ? relativeStart = Math.max(size + start, 0) : relativeStart = Math.min(start, size), end === void 0 ? relativeEnd = size : end < 0 ? relativeEnd = Math.max(size + end, 0) : relativeEnd = Math.min(end, size);
    let span = Math.max(relativeEnd - relativeStart, 0), slicedBuffer = this[BUFFER].slice(relativeStart, relativeStart + span), blob = new Blob([], {type: arguments[2]});
    return blob[BUFFER] = slicedBuffer, blob;
  }
};
__name(Blob, "Blob");
Object.defineProperties(Blob.prototype, {
  size: {enumerable: !0},
  type: {enumerable: !0},
  slice: {enumerable: !0}
});
Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  value: "Blob",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
function FetchError(message, type, systemError) {
  Error.call(this, message), this.message = message, this.type = type, systemError && (this.code = this.errno = systemError.code), Error.captureStackTrace(this, this.constructor);
}
__name(FetchError, "FetchError");
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = "FetchError";
var convert;
try {
  convert = require("encoding").convert;
} catch (e) {
}
var INTERNALS = Symbol("Body internals"), PassThrough = import_stream.default.PassThrough;
function Body(body) {
  var _this = this, _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
  let size = _ref$size === void 0 ? 0 : _ref$size;
  var _ref$timeout = _ref.timeout;
  let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
  body == null ? body = null : isURLSearchParams(body) ? body = Buffer.from(body.toString()) : isBlob(body) || Buffer.isBuffer(body) || (Object.prototype.toString.call(body) === "[object ArrayBuffer]" ? body = Buffer.from(body) : ArrayBuffer.isView(body) ? body = Buffer.from(body.buffer, body.byteOffset, body.byteLength) : body instanceof import_stream.default || (body = Buffer.from(String(body)))), this[INTERNALS] = {
    body,
    disturbed: !1,
    error: null
  }, this.size = size, this.timeout = timeout, body instanceof import_stream.default && body.on("error", function(err) {
    let error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
    _this[INTERNALS].error = error;
  });
}
__name(Body, "Body");
Body.prototype = {
  get body() {
    return this[INTERNALS].body;
  },
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  },
  arrayBuffer() {
    return consumeBody.call(this).then(function(buf) {
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    });
  },
  blob() {
    let ct = this.headers && this.headers.get("content-type") || "";
    return consumeBody.call(this).then(function(buf) {
      return Object.assign(new Blob([], {
        type: ct.toLowerCase()
      }), {
        [BUFFER]: buf
      });
    });
  },
  json() {
    var _this2 = this;
    return consumeBody.call(this).then(function(buffer) {
      try {
        return JSON.parse(buffer.toString());
      } catch (err) {
        return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
      }
    });
  },
  text() {
    return consumeBody.call(this).then(function(buffer) {
      return buffer.toString();
    });
  },
  buffer() {
    return consumeBody.call(this);
  },
  textConverted() {
    var _this3 = this;
    return consumeBody.call(this).then(function(buffer) {
      return convertBody(buffer, _this3.headers);
    });
  }
};
Object.defineProperties(Body.prototype, {
  body: {enumerable: !0},
  bodyUsed: {enumerable: !0},
  arrayBuffer: {enumerable: !0},
  blob: {enumerable: !0},
  json: {enumerable: !0},
  text: {enumerable: !0}
});
Body.mixIn = function(proto) {
  for (let name2 of Object.getOwnPropertyNames(Body.prototype))
    if (!(name2 in proto)) {
      let desc = Object.getOwnPropertyDescriptor(Body.prototype, name2);
      Object.defineProperty(proto, name2, desc);
    }
};
function consumeBody() {
  var _this4 = this;
  if (this[INTERNALS].disturbed)
    return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
  if (this[INTERNALS].disturbed = !0, this[INTERNALS].error)
    return Body.Promise.reject(this[INTERNALS].error);
  let body = this.body;
  if (body === null)
    return Body.Promise.resolve(Buffer.alloc(0));
  if (isBlob(body) && (body = body.stream()), Buffer.isBuffer(body))
    return Body.Promise.resolve(body);
  if (!(body instanceof import_stream.default))
    return Body.Promise.resolve(Buffer.alloc(0));
  let accum = [], accumBytes = 0, abort = !1;
  return new Body.Promise(function(resolve, reject) {
    let resTimeout;
    _this4.timeout && (resTimeout = setTimeout(function() {
      abort = !0, reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
    }, _this4.timeout)), body.on("error", function(err) {
      err.name === "AbortError" ? (abort = !0, reject(err)) : reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
    }), body.on("data", function(chunk) {
      if (!(abort || chunk === null)) {
        if (_this4.size && accumBytes + chunk.length > _this4.size) {
          abort = !0, reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
          return;
        }
        accumBytes += chunk.length, accum.push(chunk);
      }
    }), body.on("end", function() {
      if (!abort) {
        clearTimeout(resTimeout);
        try {
          resolve(Buffer.concat(accum, accumBytes));
        } catch (err) {
          reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
        }
      }
    });
  });
}
__name(consumeBody, "consumeBody");
function convertBody(buffer, headers) {
  if (typeof convert != "function")
    throw new Error("The package `encoding` must be installed to use the textConverted() function");
  let ct = headers.get("content-type"), charset = "utf-8", res, str;
  return ct && (res = /charset=([^;]*)/i.exec(ct)), str = buffer.slice(0, 1024).toString(), !res && str && (res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str)), !res && str && (res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str), res || (res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str), res && res.pop()), res && (res = /charset=(.*)/i.exec(res.pop()))), !res && str && (res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str)), res && (charset = res.pop(), (charset === "gb2312" || charset === "gbk") && (charset = "gb18030")), convert(buffer, "UTF-8", charset).toString();
}
__name(convertBody, "convertBody");
function isURLSearchParams(obj) {
  return typeof obj != "object" || typeof obj.append != "function" || typeof obj.delete != "function" || typeof obj.get != "function" || typeof obj.getAll != "function" || typeof obj.has != "function" || typeof obj.set != "function" ? !1 : obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort == "function";
}
__name(isURLSearchParams, "isURLSearchParams");
function isBlob(obj) {
  return typeof obj == "object" && typeof obj.arrayBuffer == "function" && typeof obj.type == "string" && typeof obj.stream == "function" && typeof obj.constructor == "function" && typeof obj.constructor.name == "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}
__name(isBlob, "isBlob");
function clone(instance) {
  let p1, p2, body = instance.body;
  if (instance.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return body instanceof import_stream.default && typeof body.getBoundary != "function" && (p1 = new PassThrough(), p2 = new PassThrough(), body.pipe(p1), body.pipe(p2), instance[INTERNALS].body = p1, body = p2), body;
}
__name(clone, "clone");
function extractContentType(body) {
  return body === null ? null : typeof body == "string" ? "text/plain;charset=UTF-8" : isURLSearchParams(body) ? "application/x-www-form-urlencoded;charset=UTF-8" : isBlob(body) ? body.type || null : Buffer.isBuffer(body) || Object.prototype.toString.call(body) === "[object ArrayBuffer]" || ArrayBuffer.isView(body) ? null : typeof body.getBoundary == "function" ? `multipart/form-data;boundary=${body.getBoundary()}` : body instanceof import_stream.default ? null : "text/plain;charset=UTF-8";
}
__name(extractContentType, "extractContentType");
function getTotalBytes(instance) {
  let body = instance.body;
  return body === null ? 0 : isBlob(body) ? body.size : Buffer.isBuffer(body) ? body.length : body && typeof body.getLengthSync == "function" && (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) ? body.getLengthSync() : null;
}
__name(getTotalBytes, "getTotalBytes");
function writeToStream(dest, instance) {
  let body = instance.body;
  body === null ? dest.end() : isBlob(body) ? body.stream().pipe(dest) : Buffer.isBuffer(body) ? (dest.write(body), dest.end()) : body.pipe(dest);
}
__name(writeToStream, "writeToStream");
Body.Promise = global.Promise;
var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/, invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
function validateName(name2) {
  if (name2 = `${name2}`, invalidTokenRegex.test(name2) || name2 === "")
    throw new TypeError(`${name2} is not a legal HTTP header name`);
}
__name(validateName, "validateName");
function validateValue(value) {
  if (value = `${value}`, invalidHeaderCharRegex.test(value))
    throw new TypeError(`${value} is not a legal HTTP header value`);
}
__name(validateValue, "validateValue");
function find(map, name2) {
  name2 = name2.toLowerCase();
  for (let key in map)
    if (key.toLowerCase() === name2)
      return key;
}
__name(find, "find");
var MAP = Symbol("map"), Headers = class {
  constructor() {
    let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    if (this[MAP] = Object.create(null), init instanceof Headers) {
      let rawHeaders = init.raw(), headerNames = Object.keys(rawHeaders);
      for (let headerName of headerNames)
        for (let value of rawHeaders[headerName])
          this.append(headerName, value);
      return;
    }
    if (init != null)
      if (typeof init == "object") {
        let method = init[Symbol.iterator];
        if (method != null) {
          if (typeof method != "function")
            throw new TypeError("Header pairs must be iterable");
          let pairs = [];
          for (let pair of init) {
            if (typeof pair != "object" || typeof pair[Symbol.iterator] != "function")
              throw new TypeError("Each header pair must be iterable");
            pairs.push(Array.from(pair));
          }
          for (let pair of pairs) {
            if (pair.length !== 2)
              throw new TypeError("Each header pair must be a name/value tuple");
            this.append(pair[0], pair[1]);
          }
        } else
          for (let key of Object.keys(init)) {
            let value = init[key];
            this.append(key, value);
          }
      } else
        throw new TypeError("Provided initializer must be an object");
  }
  get(name2) {
    name2 = `${name2}`, validateName(name2);
    let key = find(this[MAP], name2);
    return key === void 0 ? null : this[MAP][key].join(", ");
  }
  forEach(callback) {
    let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0, pairs = getHeaders(this), i = 0;
    for (; i < pairs.length; ) {
      var _pairs$i = pairs[i];
      let name2 = _pairs$i[0], value = _pairs$i[1];
      callback.call(thisArg, value, name2, this), pairs = getHeaders(this), i++;
    }
  }
  set(name2, value) {
    name2 = `${name2}`, value = `${value}`, validateName(name2), validateValue(value);
    let key = find(this[MAP], name2);
    this[MAP][key !== void 0 ? key : name2] = [value];
  }
  append(name2, value) {
    name2 = `${name2}`, value = `${value}`, validateName(name2), validateValue(value);
    let key = find(this[MAP], name2);
    key !== void 0 ? this[MAP][key].push(value) : this[MAP][name2] = [value];
  }
  has(name2) {
    return name2 = `${name2}`, validateName(name2), find(this[MAP], name2) !== void 0;
  }
  delete(name2) {
    name2 = `${name2}`, validateName(name2);
    let key = find(this[MAP], name2);
    key !== void 0 && delete this[MAP][key];
  }
  raw() {
    return this[MAP];
  }
  keys() {
    return createHeadersIterator(this, "key");
  }
  values() {
    return createHeadersIterator(this, "value");
  }
  [Symbol.iterator]() {
    return createHeadersIterator(this, "key+value");
  }
};
__name(Headers, "Headers");
Headers.prototype.entries = Headers.prototype[Symbol.iterator];
Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
  value: "Headers",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
Object.defineProperties(Headers.prototype, {
  get: {enumerable: !0},
  forEach: {enumerable: !0},
  set: {enumerable: !0},
  append: {enumerable: !0},
  has: {enumerable: !0},
  delete: {enumerable: !0},
  keys: {enumerable: !0},
  values: {enumerable: !0},
  entries: {enumerable: !0}
});
function getHeaders(headers) {
  let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
  return Object.keys(headers[MAP]).sort().map(kind === "key" ? function(k) {
    return k.toLowerCase();
  } : kind === "value" ? function(k) {
    return headers[MAP][k].join(", ");
  } : function(k) {
    return [k.toLowerCase(), headers[MAP][k].join(", ")];
  });
}
__name(getHeaders, "getHeaders");
var INTERNAL = Symbol("internal");
function createHeadersIterator(target, kind) {
  let iterator = Object.create(HeadersIteratorPrototype);
  return iterator[INTERNAL] = {
    target,
    kind,
    index: 0
  }, iterator;
}
__name(createHeadersIterator, "createHeadersIterator");
var HeadersIteratorPrototype = Object.setPrototypeOf({
  next() {
    if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype)
      throw new TypeError("Value of `this` is not a HeadersIterator");
    var _INTERNAL = this[INTERNAL];
    let target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index, values = getHeaders(target, kind), len = values.length;
    return index >= len ? {
      value: void 0,
      done: !0
    } : (this[INTERNAL].index = index + 1, {
      value: values[index],
      done: !1
    });
  }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
  value: "HeadersIterator",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
function exportNodeCompatibleHeaders(headers) {
  let obj = Object.assign({__proto__: null}, headers[MAP]), hostHeaderKey = find(headers[MAP], "Host");
  return hostHeaderKey !== void 0 && (obj[hostHeaderKey] = obj[hostHeaderKey][0]), obj;
}
__name(exportNodeCompatibleHeaders, "exportNodeCompatibleHeaders");
function createHeadersLenient(obj) {
  let headers = new Headers();
  for (let name2 of Object.keys(obj))
    if (!invalidTokenRegex.test(name2))
      if (Array.isArray(obj[name2]))
        for (let val of obj[name2])
          invalidHeaderCharRegex.test(val) || (headers[MAP][name2] === void 0 ? headers[MAP][name2] = [val] : headers[MAP][name2].push(val));
      else
        invalidHeaderCharRegex.test(obj[name2]) || (headers[MAP][name2] = [obj[name2]]);
  return headers;
}
__name(createHeadersLenient, "createHeadersLenient");
var INTERNALS$1 = Symbol("Response internals"), STATUS_CODES = import_http.default.STATUS_CODES, Response = class {
  constructor() {
    let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    Body.call(this, body, opts);
    let status = opts.status || 200, headers = new Headers(opts.headers);
    if (body != null && !headers.has("Content-Type")) {
      let contentType = extractContentType(body);
      contentType && headers.append("Content-Type", contentType);
    }
    this[INTERNALS$1] = {
      url: opts.url,
      status,
      statusText: opts.statusText || STATUS_CODES[status],
      headers,
      counter: opts.counter
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  clone() {
    return new Response(clone(this), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected
    });
  }
};
__name(Response, "Response");
Body.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
  url: {enumerable: !0},
  status: {enumerable: !0},
  ok: {enumerable: !0},
  redirected: {enumerable: !0},
  statusText: {enumerable: !0},
  headers: {enumerable: !0},
  clone: {enumerable: !0}
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
  value: "Response",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
var INTERNALS$2 = Symbol("Request internals"), parse_url = import_url.default.parse, format_url = import_url.default.format, streamDestructionSupported = "destroy" in import_stream.default.Readable.prototype;
function isRequest(input) {
  return typeof input == "object" && typeof input[INTERNALS$2] == "object";
}
__name(isRequest, "isRequest");
function isAbortSignal(signal) {
  let proto = signal && typeof signal == "object" && Object.getPrototypeOf(signal);
  return !!(proto && proto.constructor.name === "AbortSignal");
}
__name(isAbortSignal, "isAbortSignal");
var Request = class {
  constructor(input) {
    let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, parsedURL;
    isRequest(input) ? parsedURL = parse_url(input.url) : (input && input.href ? parsedURL = parse_url(input.href) : parsedURL = parse_url(`${input}`), input = {});
    let method = init.method || input.method || "GET";
    if (method = method.toUpperCase(), (init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    Body.call(this, inputBody, {
      timeout: init.timeout || input.timeout || 0,
      size: init.size || input.size || 0
    });
    let headers = new Headers(init.headers || input.headers || {});
    if (inputBody != null && !headers.has("Content-Type")) {
      let contentType = extractContentType(inputBody);
      contentType && headers.append("Content-Type", contentType);
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init && (signal = init.signal), signal != null && !isAbortSignal(signal))
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    this[INTERNALS$2] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    }, this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20, this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : !0, this.counter = init.counter || input.counter || 0, this.agent = init.agent || input.agent;
  }
  get method() {
    return this[INTERNALS$2].method;
  }
  get url() {
    return format_url(this[INTERNALS$2].parsedURL);
  }
  get headers() {
    return this[INTERNALS$2].headers;
  }
  get redirect() {
    return this[INTERNALS$2].redirect;
  }
  get signal() {
    return this[INTERNALS$2].signal;
  }
  clone() {
    return new Request(this);
  }
};
__name(Request, "Request");
Body.mixIn(Request.prototype);
Object.defineProperty(Request.prototype, Symbol.toStringTag, {
  value: "Request",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
Object.defineProperties(Request.prototype, {
  method: {enumerable: !0},
  url: {enumerable: !0},
  headers: {enumerable: !0},
  redirect: {enumerable: !0},
  clone: {enumerable: !0},
  signal: {enumerable: !0}
});
function getNodeRequestOptions(request2) {
  let parsedURL = request2[INTERNALS$2].parsedURL, headers = new Headers(request2[INTERNALS$2].headers);
  if (headers.has("Accept") || headers.set("Accept", "*/*"), !parsedURL.protocol || !parsedURL.hostname)
    throw new TypeError("Only absolute URLs are supported");
  if (!/^https?:$/.test(parsedURL.protocol))
    throw new TypeError("Only HTTP(S) protocols are supported");
  if (request2.signal && request2.body instanceof import_stream.default.Readable && !streamDestructionSupported)
    throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
  let contentLengthValue = null;
  if (request2.body == null && /^(POST|PUT)$/i.test(request2.method) && (contentLengthValue = "0"), request2.body != null) {
    let totalBytes = getTotalBytes(request2);
    typeof totalBytes == "number" && (contentLengthValue = String(totalBytes));
  }
  contentLengthValue && headers.set("Content-Length", contentLengthValue), headers.has("User-Agent") || headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"), request2.compress && !headers.has("Accept-Encoding") && headers.set("Accept-Encoding", "gzip,deflate");
  let agent = request2.agent;
  return typeof agent == "function" && (agent = agent(parsedURL)), !headers.has("Connection") && !agent && headers.set("Connection", "close"), Object.assign({}, parsedURL, {
    method: request2.method,
    headers: exportNodeCompatibleHeaders(headers),
    agent
  });
}
__name(getNodeRequestOptions, "getNodeRequestOptions");
function AbortError(message) {
  Error.call(this, message), this.type = "aborted", this.message = message, Error.captureStackTrace(this, this.constructor);
}
__name(AbortError, "AbortError");
AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = "AbortError";
var PassThrough$1 = import_stream.default.PassThrough, resolve_url = import_url.default.resolve;
function fetch(url, opts) {
  if (!fetch.Promise)
    throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
  return Body.Promise = fetch.Promise, new fetch.Promise(function(resolve, reject) {
    let request2 = new Request(url, opts), options = getNodeRequestOptions(request2), send = (options.protocol === "https:" ? import_https.default : import_http.default).request, signal = request2.signal, response = null, abort = /* @__PURE__ */ __name(function() {
      let error = new AbortError("The user aborted a request.");
      reject(error), request2.body && request2.body instanceof import_stream.default.Readable && request2.body.destroy(error), !(!response || !response.body) && response.body.emit("error", error);
    }, "abort");
    if (signal && signal.aborted) {
      abort();
      return;
    }
    let abortAndFinalize = /* @__PURE__ */ __name(function() {
      abort(), finalize();
    }, "abortAndFinalize"), req = send(options), reqTimeout;
    signal && signal.addEventListener("abort", abortAndFinalize);
    function finalize() {
      req.abort(), signal && signal.removeEventListener("abort", abortAndFinalize), clearTimeout(reqTimeout);
    }
    __name(finalize, "finalize"), request2.timeout && req.once("socket", function(socket) {
      reqTimeout = setTimeout(function() {
        reject(new FetchError(`network timeout at: ${request2.url}`, "request-timeout")), finalize();
      }, request2.timeout);
    }), req.on("error", function(err) {
      reject(new FetchError(`request to ${request2.url} failed, reason: ${err.message}`, "system", err)), finalize();
    }), req.on("response", function(res) {
      clearTimeout(reqTimeout);
      let headers = createHeadersLenient(res.headers);
      if (fetch.isRedirect(res.statusCode)) {
        let location = headers.get("Location"), locationURL = location === null ? null : resolve_url(request2.url, location);
        switch (request2.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request2.url}`, "no-redirect")), finalize();
            return;
          case "manual":
            if (locationURL !== null)
              try {
                headers.set("Location", locationURL);
              } catch (err) {
                reject(err);
              }
            break;
          case "follow":
            if (locationURL === null)
              break;
            if (request2.counter >= request2.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request2.url}`, "max-redirect")), finalize();
              return;
            }
            let requestOpts = {
              headers: new Headers(request2.headers),
              follow: request2.follow,
              counter: request2.counter + 1,
              agent: request2.agent,
              compress: request2.compress,
              method: request2.method,
              body: request2.body,
              signal: request2.signal,
              timeout: request2.timeout,
              size: request2.size
            };
            if (res.statusCode !== 303 && request2.body && getTotalBytes(request2) === null) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), finalize();
              return;
            }
            (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request2.method === "POST") && (requestOpts.method = "GET", requestOpts.body = void 0, requestOpts.headers.delete("content-length")), resolve(fetch(new Request(locationURL, requestOpts))), finalize();
            return;
        }
      }
      res.once("end", function() {
        signal && signal.removeEventListener("abort", abortAndFinalize);
      });
      let body = res.pipe(new PassThrough$1()), response_options = {
        url: request2.url,
        status: res.statusCode,
        statusText: res.statusMessage,
        headers,
        size: request2.size,
        timeout: request2.timeout,
        counter: request2.counter
      }, codings = headers.get("Content-Encoding");
      if (!request2.compress || request2.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
        response = new Response(body, response_options), resolve(response);
        return;
      }
      let zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings == "gzip" || codings == "x-gzip") {
        body = body.pipe(import_zlib.default.createGunzip(zlibOptions)), response = new Response(body, response_options), resolve(response);
        return;
      }
      if (codings == "deflate" || codings == "x-deflate") {
        res.pipe(new PassThrough$1()).once("data", function(chunk) {
          (chunk[0] & 15) == 8 ? body = body.pipe(import_zlib.default.createInflate()) : body = body.pipe(import_zlib.default.createInflateRaw()), response = new Response(body, response_options), resolve(response);
        });
        return;
      }
      if (codings == "br" && typeof import_zlib.default.createBrotliDecompress == "function") {
        body = body.pipe(import_zlib.default.createBrotliDecompress()), response = new Response(body, response_options), resolve(response);
        return;
      }
      response = new Response(body, response_options), resolve(response);
    }), writeToStream(req, request2);
  });
}
__name(fetch, "fetch");
fetch.isRedirect = function(code) {
  return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};
fetch.Promise = global.Promise;
var lib_default = fetch;

// node_modules/deprecation/dist-web/index.js
var Deprecation = class extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "Deprecation";
  }
};
__name(Deprecation, "Deprecation");

// node_modules/@octokit/request-error/dist-web/index.js
var import_once = __toModule(require_once()), logOnce = (0, import_once.default)((deprecation) => console.warn(deprecation)), RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = statusCode, Object.defineProperty(this, "code", {
      get() {
        return logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")), statusCode;
      }
    }), this.headers = options.headers || {};
    let requestCopy = Object.assign({}, options.request);
    options.request.headers.authorization && (requestCopy.headers = Object.assign({}, options.request.headers, {
      authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
    })), requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = requestCopy;
  }
};
__name(RequestError, "RequestError");

// node_modules/@octokit/request/dist-web/index.js
var VERSION2 = "5.4.14";
function getBufferResponse(response) {
  return response.arrayBuffer();
}
__name(getBufferResponse, "getBufferResponse");
function fetchWrapper(requestOptions) {
  (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) && (requestOptions.body = JSON.stringify(requestOptions.body));
  let headers = {}, status, url;
  return (requestOptions.request && requestOptions.request.fetch || lib_default)(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then((response) => {
    url = response.url, status = response.status;
    for (let keyAndValue of response.headers)
      headers[keyAndValue[0]] = keyAndValue[1];
    if (status === 204 || status === 205)
      return;
    if (requestOptions.method === "HEAD") {
      if (status < 400)
        return;
      throw new RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }
    if (status === 304)
      throw new RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    if (status >= 400)
      return response.text().then((message) => {
        let error = new RequestError(message, status, {
          headers,
          request: requestOptions
        });
        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors;
          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {
        }
        throw error;
      });
    let contentType = response.headers.get("content-type");
    return /application\/json/.test(contentType) ? response.json() : !contentType || /^text\/|charset=utf-8$/.test(contentType) ? response.text() : getBufferResponse(response);
  }).then((data) => ({
    status,
    url,
    headers,
    data
  })).catch((error) => {
    throw error instanceof RequestError ? error : new RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}
__name(fetchWrapper, "fetchWrapper");
function withDefaults2(oldEndpoint, newDefaults) {
  let endpoint2 = oldEndpoint.defaults(newDefaults);
  return Object.assign(/* @__PURE__ */ __name(function(route, parameters) {
    let endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook)
      return fetchWrapper(endpoint2.parse(endpointOptions));
    let request2 = /* @__PURE__ */ __name((route2, parameters2) => fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2))), "request");
    return Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    }), endpointOptions.request.hook(request2, endpointOptions);
  }, "newApi"), {
    endpoint: endpoint2,
    defaults: withDefaults2.bind(null, endpoint2)
  });
}
__name(withDefaults2, "withDefaults");
var request = withDefaults2(endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION2} ${getUserAgent()}`
  }
});

// node_modules/@octokit/graphql/dist-web/index.js
var VERSION3 = "4.6.1", GraphqlError = class extends Error {
  constructor(request2, response) {
    let message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data), Object.assign(this, {headers: response.headers}), this.name = "GraphqlError", this.request = request2, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
};
__name(GraphqlError, "GraphqlError");
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
], FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"], GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query == "string" && "query" in options)
      return Promise.reject(new Error('[@octokit/graphql] "query" cannot be used as variable name'));
    for (let key in options)
      if (!!FORBIDDEN_VARIABLE_OPTIONS.includes(key))
        return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
  }
  let parsedOptions = typeof query == "string" ? Object.assign({query}, options) : query, requestOptions = Object.keys(parsedOptions).reduce((result, key) => NON_VARIABLE_OPTIONS.includes(key) ? (result[key] = parsedOptions[key], result) : (result.variables || (result.variables = {}), result.variables[key] = parsedOptions[key], result), {}), baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  return GHES_V3_SUFFIX_REGEX.test(baseUrl) && (requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql")), request2(requestOptions).then((response) => {
    if (response.data.errors) {
      let headers = {};
      for (let key of Object.keys(response.headers))
        headers[key] = response.headers[key];
      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }
    return response.data.data;
  });
}
__name(graphql, "graphql");
function withDefaults3(request$1, newDefaults) {
  let newRequest = request$1.defaults(newDefaults);
  return Object.assign(/* @__PURE__ */ __name((query, options) => graphql(newRequest, query, options), "newApi"), {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: request.endpoint
  });
}
__name(withDefaults3, "withDefaults");
var graphql$1 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION3} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}
__name(withCustomRequest, "withCustomRequest");

// node_modules/@octokit/auth-token/dist-web/index.js
async function auth(token2) {
  let tokenType = token2.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token2) ? "installation" : "oauth";
  return {
    type: "token",
    token: token2,
    tokenType
  };
}
__name(auth, "auth");
function withAuthorizationPrefix(token2) {
  return token2.split(/\./).length === 3 ? `bearer ${token2}` : `token ${token2}`;
}
__name(withAuthorizationPrefix, "withAuthorizationPrefix");
async function hook(token2, request2, route, parameters) {
  let endpoint2 = request2.endpoint.merge(route, parameters);
  return endpoint2.headers.authorization = withAuthorizationPrefix(token2), request2(endpoint2);
}
__name(hook, "hook");
var createTokenAuth = /* @__PURE__ */ __name(function(token2) {
  if (!token2)
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  if (typeof token2 != "string")
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  return token2 = token2.replace(/^(token|bearer) +/i, ""), Object.assign(auth.bind(null, token2), {
    hook: hook.bind(null, token2)
  });
}, "createTokenAuth");

// actions/exec-task/index.ts
var import_github = __toModule(require_github());
var token = (0, import_core.getInput)("token", {required: !0}), name = (0, import_core.getInput)("name", {required: !0}), environment = (0, import_core.getInput)("environment", {required: !0}), ignoreErrors = (0, import_core.getInput)("ignore_errors", {required: !1}) === "true", octokit = (0, import_github.getOctokit)(token);
async function findDeploymentURL() {
  for await (let {data: deployments} of octokit.paginate.iterator("GET /repos/{owner}/{repo}/deployments", __assign(__assign({}, import_github.context.repo), {
    environment,
    per_page: 10,
    task: "deploy"
  })))
    for (let {id} of deployments) {
      let {
        data: statuses
      } = await octokit.request("GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", __assign(__assign({}, import_github.context.repo), {deployment_id: id}));
      for (let {state, target_url} of statuses)
        if (state === "success" && target_url)
          return target_url;
    }
}
__name(findDeploymentURL, "findDeploymentURL");
async function main() {
  let deploymentURL = await findDeploymentURL();
  if (!deploymentURL)
    return (0, import_core.warning)(`There are no deployments for the environment '${environment}'`);
  (0, import_core.info)(`Making request to: '${deploymentURL}' with '${name}'\u2026`);
  let response = await lib_default(`${deploymentURL}/api/tasks/${name}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.TASKS_API_SECRET}`
    }
  }), responseText = await response.text().catch(() => null);
  if (response.ok)
    responseText && (0, import_core.info)(responseText);
  else
    throw new Error(`Failed to execute task.
${response.statusText}
${responseText}`);
}
__name(main, "main");
main().catch((error) => {
  ignoreErrors ? (0, import_core.warning)(error) : (0, import_core.setFailed)(error);
});
