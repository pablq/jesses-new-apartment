this is an art program and is intended to be 'off-the-cuff' and specific. 

this repository exists as a record and for redundancy.

the data from this program came from an experiment with arduino.

a friend and i set up an arduino controlled rig with 2 servos, a light sensor, and an ultrasonic distance sensor.

we had the arduino scan a grid of arbitrary space and record the light and distance data at each (x,y) coordinate.

the data was sent to my computer via Serial port 9600 and recorded in a (semi) csv form with Processing.

that data was then trimmed and converted to json using mrdataconverter.com and a bit of manual adjusting.

the image output isn't the most accurate rendition of the space scanned by the arduino but i think it looks pretty nice.

this is just a sketch program.

if you are interested in seeing the output this program can be run using node.js:
node draw-blips.js data/<data-file>.json <outputfilename>
