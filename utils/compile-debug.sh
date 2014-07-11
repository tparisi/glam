BUILDDIR=../build
OUTPUT="$BUILDDIR/glam.js"
SOURCES="../src/glam.js \
../src/animation.js \
../src/arc.js \
../src/background.js \
../src/camera.js \
../src/circle.js \
../src/classList.js \
../src/cone.js \
../src/controller.js \
../src/cube.js \
../src/cylinder.js \
../src/document.js \
../src/group.js \
../src/import.js \
../src/input.js \
../src/light.js \
../src/line.js \
../src/material.js \
../src/mesh.js \
../src/node.js \
../src/parser.js \
../src/particles.js \
../src/particleEmitter.js \
../src/particleSystem.js \
../src/rect.js \
../src/renderer.js \
../src/sphere.js \
../src/style.js \
../src/text.js \
../src/transform.js \
../src/transition.js \
../src/types.js \
../src/viewer.js \
../src/visual.js"

LIBS="../libs/parsecss/jquery.parsecss.js \
../libs/vizi/vizi.js \
../libs/ParticleEngine/ShaderParticles.min.js"

FONTS="../fonts/helvetiker_bold.typeface.js \
../fonts/helvetiker_regular.typeface.js"

cat $LIBS $SOURCES $FONTS > $OUTPUT
