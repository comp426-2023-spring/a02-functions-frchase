#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch"
import moment from "moment-timezone";

var argvMin = minimist(process.argv.slice(2));

