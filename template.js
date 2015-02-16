var INFILE = process.argv[2];

if (!INFILE) {
    console.log("Please provide an input file");
    process.exit();
}

var data = require("./" + INFILE);
    header = data.header,
    coords = data.data;

if (!header || !coords) {
    console.log("Input file must have a 'header' field, and a 'coords' field");
    process.exit();
}

var HEIGHT = header.height * 10, 
    WIDTH = header.width * 10,
    BGCOLOR = header.bgcolor ? header.bgcolor : "#ffffff",
    MAX_DIST = findMaxDist(data.data),
    gm = require("gm"),
    image = gm(WIDTH, HEIGHT, BGCOLOR);

for (var i = 0, len = coords.length; i < len; i += 1) {
    (function(point) {

        var light = point.light,
             dist = point.dist,
                x = point.x * 10,
                y = point.y * 10;
        drawPoint(light, dist, x, y);

    })(coords[i]);
}

image.write("test.png", function(error) {
  if (error) {
    console.log("FUCKING DRAW ERROR", error);
    process.exit();
  } else {
    console.log("HOLY SHIT IT WORKED");
  }
});

function findMaxDist(data) {
    var max = data[0].dist;
    for (var i = 0, len = data.length; i < len; i += 1) {
        if (data[i].dist > max) {
            max = data[i].dist;
        }
    }
    return max;
}

function drawPoint (light, dist, x, y) {

    var STROKE_WIDTH = 1, 
        TOTAL_SIDE = 10,
        size = Math.floor((MAX_DIST - dist) / (MAX_DIST / TOTAL_SIDE)),
        gap = (TOTAL_SIDE - size) / 2;
    // (TOTAL_SIDE - size) + (size / 2)
/*    var x0 = x + gap + (size / 2),
        y0 = y + gap + (size / 2),
        x1 = x + gap + size,
        y1 = y + gap + size;

    console.log("x : " + x + ", y: " + y + ", dist : " + dist + ", size: " + size);
    image.drawCircle(x0,y0,x1,y1) */

    var x0 = x + gap,
        y0 = y + gap,
        x1 = x + gap + size,
        y1 = y + gap + size;

    console.log("(x0, y0, x1, y1) -> ("+x0+","+y0+","+x1+","+y1+")");
    image.drawRectangle(x0,y0,x1,y1);
}
