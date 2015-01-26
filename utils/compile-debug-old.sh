BUILDDIR=../build
OUTPUT="$BUILDDIR/glam.js"
SOURCES="../src/dom/glam.js \
../src/dom/dom.js \
../src/dom/animation.js \
../src/dom/arc.js \
../src/dom/background.js \
../src/dom/camera.js \
../src/dom/circle.js \
../src/dom/classList.js \
../src/dom/box.js \
../src/dom/cone.js \
../src/dom/controller.js \
../src/dom/cylinder.js \
../src/dom/document.js \
../src/dom/effect.js \
../src/dom/group.js \
../src/dom/import.js \
../src/dom/input.js \
../src/dom/light.js \
../src/dom/line.js \
../src/dom/material.js \
../src/dom/mesh.js \
../src/dom/node.js \
../src/dom/parser.js \
../src/dom/particles.js \
../src/dom/rect.js \
../src/dom/renderer.js \
../src/dom/sphere.js \
../src/dom/style.js \
../src/dom/text.js \
../src/dom/transform.js \
../src/dom/transition.js \
../src/dom/types.js \
../src/dom/viewer.js \
../src/dom/visual.js"

LIBS="../libs/parsecss/jquery.parsecss.js \
../libs/vizi/vizi.js"

FONTS="../fonts/helvetiker_bold.typeface.js \
../fonts/helvetiker_regular.typeface.js"

cat $LIBS $SOURCES $FONTS > $OUTPUT
