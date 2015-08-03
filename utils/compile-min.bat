REM Usage:
REM setup environment variables for CLOSURE_PATH

SET BUILDDIR=..\build
SET TARGET=%BUILDDIR%\glam-nodeps.min.js
SET OUTPUT=%BUILDDIR%\glam.min.js
SET THREEDIR=..\libs\three.js.r68
SET THREE=%THREEDIR%\three.min.js
SET STATS=%THREEDIR%\stats.min.js
SET LOADERS=%THREEDIR%\controls\VRControls.js+^
%THREEDIR%\loaders\ColladaLoader.js+^
%THREEDIR%\loaders\glTF\glTF-parser.js+^
%THREEDIR%\loaders\glTF\glTFLoader.js+^
%THREEDIR%\loaders\glTF\glTFLoaderUtils.js+^
%THREEDIR%\loaders\glTF\glTFAnimation.js+^
%THREEDIR%\postprocessing\EffectComposer.js+^
%THREEDIR%\postprocessing\FilmPass.js+^
%THREEDIR%\postprocessing\BloomPass.js+^
%THREEDIR%\postprocessing\MaskPass.js+^
%THREEDIR%\postprocessing\RenderPass.js+^
%THREEDIR%\postprocessing\ShaderPass.js+^
%THREEDIR%\renderers\StereoEffect.js+^
%THREEDIR%\renderers\VREffect.js+^
%THREEDIR%\shaders\ConvolutionShader.js+^
%THREEDIR%\shaders\CopyShader.js+^
%THREEDIR%\shaders\DotScreenShader.js+^
%THREEDIR%\shaders\DotScreenRGBShader.js+^
%THREEDIR%\shaders\FilmShader.js+^
%THREEDIR%\shaders\FXAAShader.js+^
%THREEDIR%\shaders\RGBShiftShader.js+^
%THREEDIR%\ParticleEngine\ShaderParticles.min.js

SET RAF=..\libs\requestAnimationFrame\RequestAnimationFrame.js
SET TWEEN=..\libs\tween.js\tween.min.js
SET LIBS=%THREE%+%STATS%+%LOADERS%+%TWEEN%+%RAF%
SET NODEPS=..\src\config\nodeps.js
SET FLAGS='--language_in=ECMASCRIPT5'
SET FONTS=..\fonts\helvetiker_bold.typeface.js+^
..\fonts\helvetiker_regular.typeface.js

SET BASE=%CLOSURE_PATH%\closure\goog\base.js
REM replaced --root=%CLOSURE_PATH% with BASE
%CLOSURE_PATH%\closure\bin\build\closurebuilder.py %BASE% --root=..\src\animations --root=..\src\behaviors --root=..\src\cameras --root=..\src\controllers --root=..\src\config --root=..\src\core  --root=..\src\dom  --root=..\src\events --root=..\src\graphics --root=..\src\helpers --root=..\src\input --root=..\src\lights  --root=..\src\loaders --root=..\src\objects --root=..\src\particles  --root=..\src\postprocessing --root=..\src\prefabs --root=..\src\scene --root=..\src\scripts --root=..\src\system --root=..\src\time --root=..\src\viewer --namespace="glam" --namespace="glam.Object" --namespace="glam.Modules" --compiler_flags=%FLAGS% --output_mode=compiled --compiler_jar=compiler.jar --output_file=%TARGET%

copy %LIBS%+%NODEPS%+%FONTS%+%TARGET% %OUTPUT%

