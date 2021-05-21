"use strict";

const crypto = require("crypto");

console.log("NCD_SECRET='%s'", crypto.randomBytes(32).toString("base64"));
console.log("SESSION_SECRET='%s'", crypto.randomBytes(32).toString("base64"));
