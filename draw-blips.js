"use strict";

var INFILE = process.argv[2];

if (!INFILE) {
    console.log("Please provide an .JSON input file.");
    process.exit();
}

var data = require("./" + INFILE),
    header = data.header,
    coords = data.data;

if (!header || !coords) {
    console.log("Input data must have a 'header' field, and a 'coords' field");
    process.exit();
}

function findMaxOfProp(array, prop) {
    return array.reduce(function (prev, curr) {
        var val0 = prev,
            val1 = parseInt(curr[prop]);
        return val0 > val1 ? val0 : val1;
    }, -Infinity);
}

function findMinOfProp(array, prop) {
    return array.reduce(function (prev, curr) {
        var val0 = prev,
            val1 = parseInt(curr[prop]);
        return val0 > val1 ? val1 : val0;
    }, Infinity);
}

var UNIT_SIZE = 20,
    HEIGHT = header.height * UNIT_SIZE,
    WIDTH = header.width * UNIT_SIZE,
    BGCOLOR = header.bgcolor || "#000000",
    MAX_DIST = findMaxOfProp(data.data, "dist"),
    MIN_DIST = findMinOfProp(data.data, "dist"),
    MAX_LIGHT = findMaxOfProp(data.data, "light"),
    MIN_LIGHT = findMinOfProp(data.data, "light"),
    gm = require("gm"),
    image = gm(WIDTH, HEIGHT, BGCOLOR);

coords.sort(function (a, b) {
    return parseInt(a.dist) - parseInt(b.dist);
});

coords.map(function (point) {
    var light = point.light,
        dist = point.dist,
        x = point.x * UNIT_SIZE,
        y = point.y * UNIT_SIZE;

    drawData(light, dist, x, y);
});

var OUTFILE = INFILE.split("/")[1].replace(".json", ".png");

image.write("./output/" + OUTFILE, function (error) {
    if (error) {
        console.log(error);
        process.exit();
    } else {
        console.log("IT WORKED!");
    }
});

function getColor(light) {
    var relativeMax = MAX_LIGHT - MIN_LIGHT,
        relativeLight = light - MIN_LIGHT,
        shade = Math.floor((relativeLight * 255) / relativeMax),
        compToHex = function (comp) {
            var hex = comp.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
    return "#" + compToHex(shade) + "" + compToHex(shade) + "" + compToHex(shade);
}

function drawData(light, dist, x, y) {
    var STROKE_WIDTH = 2,
        relativeMax = MAX_DIST - MIN_DIST,
        relativeDist = dist - MIN_DIST,
        size = Math.floor((relativeMax - relativeDist) / (relativeMax / UNIT_SIZE)),
        gap = (UNIT_SIZE - size) / 2;

    var x0 = x + gap + (size / 2),
        y0 = y + gap + (size / 2),
        x1 = x + gap + size - STROKE_WIDTH,
        y1 = y + gap + size - STROKE_WIDTH;

    var color = getColor(light);

    image.fill(color)
        .stroke(color)
        .drawCircle(x0, y0, x1, y1);
}
