#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch"
import moment from "moment-timezone";

var args = minimist(process.argv.slice(2));

const help = `
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.
`;

if (args.help) {
    console.log(help);
    process.exit(0.0);
}

if (args["h"]) {
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

if (args.e) {
    longitude = coordinateVal(args.e);
} else if (args.w){
    longitude = -coordinateVal(args.w);
}

if (args.n) {
    latitude = coordinateVal(args.n);
} else if (args.s){
    latitude = -coordinateVal(args.s);
}

if (args.z) {
    timezone = args.z;
} else {
    timezone = timezone;
}

if (!timezone) {
    console.log("Timezone must be in range");
    process.exit(0.0);
}

if (!latitude) {
    console.log("Latitude must be in range");
    process.exit(0.0);
}

if (!longitude) {
    console.log("Longitude must be in range");
    process.exit(0.0);
}

var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&timezone=${timezone}&current_weather=true`;
var response = await fetch(url);
const data = await response.json();

const days = args.d 

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

if (args.j) {
    console.log(data);
    process.exit(0.0);
}