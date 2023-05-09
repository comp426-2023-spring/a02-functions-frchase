#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch"
import moment from "moment-timezone";

var argvMin = minimist(process.argv.slice(2));

const help = `
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.
`;

if (argvMin.help) {
    console.log(help);
    process.exit(0.0);
}

if (argvMin["h"]) {
    console.log(help);
    process.exit(0.0);
}

function coordinateVal(coordinate) {
    if(isNaN(parseFloat(coordinate))) {
        process.exit(0.0);
    }

    return coordinate;
}

let latitude;
let longitude;
var timezone = moment.tz.guess();

if (argvMin.e) {
    longitude = coordinateVal(argvMin.e);
} else if (argvMin.w){
    longitude = -coordinateVal(argvMin.w);
}

if (argvMin.n) {
    latitude = coordinateVal(argvMin.n);
} else if (argvMin.s){
    latitude = -coordinateVal(argvMin.s);
}

if (argvMin.z) {
    timezone = argvMin.z;
} else {
    timezone = timezone;
}

if (!timezone) {
    console.log("no timezone");
    process.exit(0.0);
}

if (!latitude) {
    console.log("no latitude");
    process.exit(0.0);
}

if (!longitude) {
    console.log("no longitude");
    process.exit(0.0);
}

var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&timezone=${timezone}&current_weather=true`;
var response = await fetch(url);
const data = await response.json();