var INFILE = process.argv[2],
    OUTFILE = process.argv[3];

if (!INFILE || !OUTFILE) {
    console.log("Please provide an input file and an output file.");
    process.exit();
}

var data = require("./" + INFILE);
    header = data.header,
    coords = data.data;

if (!header || !coords) {
    console.log("Input file must have a 'header' field, and a 'coords' field");
    process.exit();
}

var UNIT_SIZE = 20,
    HEIGHT = header.height * UNIT_SIZE, 
    WIDTH = header.width * UNIT_SIZE,
    BGCOLOR = header.bgcolor ? header.bgcolor : "#000000",
    MAX_DIST = findMaxOfProp(data.data,"dist"),
    MAX_LIGHT = findMaxOfProp(data.data,"light"),
    MIN_LIGHT = findMinOfProp(data.data, "light"),
    gm = require("gm"),
    image = gm(WIDTH, HEIGHT, BGCOLOR);

for (var i = 0, len = coords.length; i < len; i += 1) {
    (function(point) {

        var light = point.light,
             dist = point.dist,
                x = point.x * 10,
                y = point.y * 10;
        drawData(light, dist, x, y);

    })(coords[i]);
}

image.write(OUTFILE+".png", function(error) {
  if (error) {
    console.log("FUCKING DRAW ERROR", error);
    process.exit();
  } else {
    console.log("HOLY SHIT IT WORKED");
  }
});

function findMaxOfProp(array, prop) {
    var max = array[0][prop];
    for (var i = 0, len = array.length; i < len; i += 1) {
        if (array[i][prop] > max) {
            max = array[i][prop];
        }
    }
    return max;
}

function findMinOfProp(array, prop) {
    var min = array[0][prop];
    for (var i = 0, len = array.length; i < len; i += 1) {
        if (array[i][prop] < min) {
            min = array[i][prop];
        }
    }
    return min;
}

function getColor(light) {

    var relativeMax = MAX_LIGHT - MIN_LIGHT,
        relativeLight = light - MIN_LIGHT,
        shade = Math.floor((relativeLight * 255) / relativeMax),
        compToHex = function(comp) {
            var hex = comp.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

    return "#" + compToHex(shade) + "" + compToHex(shade) + "" + compToHex(shade);
} 

function drawData (light, dist, x, y) {

    var STROKE_WIDTH = 1, 
        size = Math.floor((MAX_DIST - dist) / (MAX_DIST / UNIT_SIZE)),
        gap = (TOTAL_SIDE - size) / 2;

    var x0 = x + gap + (size / 2),
        y0 = y + gap + (size / 2),
        x1 = x + gap + size - STROKE_WIDTH,
        y1 = y + gap + size - STROKE_WIDTH;

    var color = getColor(light);
    image.fill(color)
         .stroke(color)
         .drawCircle(x0,y0,x1,y1)
}
