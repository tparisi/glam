BUILDDIR=../build
OUTPUT="$BUILDDIR/glam.js"
SOURCES="../src/glam.js \
../src/animation.js \
../src/arc.js \
../src/background.js \
../src/camera.js \
../src/circle.js \
../src/cone.js \
../src/controller.js \
../src/cube.js \
../src/cylinder.js \
../src/document.js \
../src/group.js \
../src/import.js \
../src/input.js \
../src/material.js \
../src/node.js \
../src/parser.js \
../src/rect.js \
../src/renderer.js \
../src/sphere.js \
../src/style.js \
../src/text.js \
../src/transform.js \
../src/types.js \
../src/viewer.js"
LIBS="../libs/parsecss/jquery.parsecss.js \
../libs/vizi/vizi.js"

cat $LIBS $SOURCES > $OUTPUT
