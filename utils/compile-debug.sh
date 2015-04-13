
. ./common.sh

THREE="$THREEDIR/build/three.js"
LIBS="$THREE $STATS $LOADERS $TWEEN $RAF"

TARGET="$BUILDDIR/glam-nodeps.js"
OUTPUT="$BUILDDIR/glam.js"

$CLOSURE_PATH/closure/bin/build/closurebuilder.py \
    --root=$CLOSURE_PATH \
    --root=../src/animations \
    --root=../src/behaviors \
    --root=../src/cameras \
    --root=../src/controllers \
    --root=../src/config \
    --root=../src/core  \
    --root=../src/dom  \
    --root=../src/events \
    --root=../src/graphics \
    --root=../src/helpers \
    --root=../src/input \
    --root=../src/lights  \
    --root=../src/loaders \
    --root=../src/objects \
    --root=../src/particles \
    --root=../src/postprocessing \
    --root=../src/prefabs \
    --root=../src/scene \
    --root=../src/scripts \
    --root=../src/system \
    --root=../src/time \
    --root=../src/viewer \
    --namespace="glam" \
    --namespace="glam.Object" \
    --namespace="glam.Modules" \
    --output_mode=script \
    --compiler_jar=compiler.jar \
    --output_file=$TARGET

cat $LIBS $NODEPS $FONTS $TARGET > $OUTPUT
