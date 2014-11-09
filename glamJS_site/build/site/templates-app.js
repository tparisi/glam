angular.module('templates-app', ['about/about.tpl.html', 'faq/faq.tpl.html', 'home/home.tpl.html']);

angular.module("about/about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("about/about.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <h1 class=\"page-header\">\n" +
    "    About GLAM\n" +
    "  </h1>\n" +
    "  <p class=\"p17\">\n" +
    "\n" +
    "GLAM (GL And Markup) is a declarative language for creating 3D content for browsers. It\n" +
    "\n" +
    "renders with WebGL, using the graphics power of Three.js. GLAM adds behaviors,\n" +
    "\n" +
    "interaction and lots of easy­to­use features on top of Three.js, but most importantly, it\n" +
    "\n" +
    "defines a markup language and set of stylesheet extensions that make 3D programming\n" +
    "\n" +
    "a snap.\n" +
    "\n" +
    "With GLAM, 3D authoring is like any other web authoring. To make 3D, you create\n" +
    "\n" +
    "elements, set their attributes, add event listeners, and define styles. Just like DOM used\n" +
    "\n" +
    "to make! Content is easy to animate: keyframes and tweens can be defined in a compact\n" +
    "\n" +
    "set of markup tags, or as standard CSS3 animations or transitions. GLAM is also fully\n" +
    "\n" +
    "extensible: to add custom behavior, write JavaScript event handlers. If you want fancy\n" +
    "\n" +
    "shading written in GLSL, simply specify your vertex and fragment shaders as properties\n" +
    "\n" +
    "of the object's style.\n" +
    "\n" +
    "GLAM was created by Tony Parisi, the guy who made the Virtual Reality Markup\n" +
    "\n" +
    "Language (VRML), 20 years before anybody knew they needed it. Since then, Tony's\n" +
    "\n" +
    "learned a few more things about graphics, web browsers have grown up, and the world\n" +
    "\n" +
    "has caught up with his vision. GLAM is still quite young. We're adding features and\n" +
    "\n" +
    "demos at a rapid clip, and we are also looking closely at related technologies such as\n" +
    "\n" +
    "Web Components as they come of age. We'd love your feedback and contributions!\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("faq/faq.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("faq/faq.tpl.html",
    "<div class=\"row\">\n" +
    "\n" +
    "    <h1 class=\"page-header\">\n" +
    "    Why GLAM?\n" +
    "  </h1>\n" +
    "\n" +
    "    <p class=\"p17\">\n" +
    "\n" +
    "GLAM (GL And Markup) is a declarative language for creating 3D content for browsers. It\n" +
    "\n" +
    "renders with WebGL, using the graphics power of Three.js. GLAM adds behaviors,\n" +
    "\n" +
    "interaction and lots of easy to use features on top of Three.js, but most importantly, it\n" +
    "\n" +
    "defines a markup language and set of stylesheet extensions that make 3D programming\n" +
    "\n" +
    "a snap.\n" +
    "\n" +
    "With GLAM, 3D authoring is like any other web authoring. To make 3D, you create\n" +
    "\n" +
    "elements, set their attributes, add event listeners, and define styles. Just like DOM used\n" +
    "\n" +
    "to make! Content is easy to animate: keyframes and tweens can be defined in a compact\n" +
    "\n" +
    "set of markup tags, or as standard CSS3 animations or transitions. GLAM is also fully\n" +
    "\n" +
    "extensible: to add custom behavior, write JavaScript event handlers. If you want fancy\n" +
    "\n" +
    "shading written in GLSL, simply specify your vertex and fragment shaders as properties\n" +
    "\n" +
    "of the object's style.\n" +
    "\n" +
    "GLAM was created by Tony Parisi, the guy who made the Virtual Reality Markup\n" +
    "\n" +
    "Language (VRML), 20 years before anybody knew they needed it. Since then, Tony's\n" +
    "\n" +
    "learned a few more things about graphics, web browsers have grown up, and the world\n" +
    "\n" +
    "has caught up with his vision. GLAM is still quite young. We're adding features and\n" +
    "\n" +
    "demos at a rapid clip, and we are also looking closely at related technologies such as\n" +
    "\n" +
    "Web Components as they come of age. We'd love your feedback and contributions!\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "    <h1 class=\"page-header\">\n" +
    "    Why Now?\n" +
    "  </h1>\n" +
    "\n" +
    "    <p class=\"p17\">\n" +
    "\n" +
    "WebGL is ubiquitous. With the release of iOS8, WebGL now runs on all major desktop\n" +
    "\n" +
    "and mobile browsers, across all devices. That's 3 billion seats ready for connected 3D\n" +
    "\n" +
    "applications, everywhere, powered by JavaScript. This is an incredible opportunity to\n" +
    "\n" +
    "change the face of computing.\n" +
    "\n" +
    "The last few years have seen an explosion of interest in building WebGL. But there is a\n" +
    "\n" +
    "huge skill gap. 3D is inherently hard, yes; we have that extra dimension to worry about,\n" +
    "\n" +
    "plus cameras, shaders, skinned animations, etc... But there is no reason to make 3D\n" +
    "\n" +
    "harder than it has to be. For the simple 3D stuff, there should be a simple way to do it,\n" +
    "\n" +
    "with an approach that is familiar to the millions of web developers ready to try something\n" +
    "\n" +
    "new. Until GLAM, this didn't exist. GLAM is here to make your 3D job easier, so you can\n" +
    "\n" +
    "focus on the fun part: building a killer 3D web app.\n" +
    "\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "    <h1 class=\"page-header\">\n" +
    "    How Do I Use GLAM?\n" +
    "  </h1>\n" +
    "\n" +
    "    <p class=\"p17\">\n" +
    "\n" +
    "\n" +
    "To add GLAM to your application, simply include either the debug or minified version of\n" +
    "\n" +
    "the library:\n" +
    "\n" +
    "&lt;script src=\"pathtoglam/glam.js\"&gt; &lt;/script&gt;\n" +
    "\n" +
    "OR\n" +
    "\n" +
    "&lt;script src=\"pathtoglamlib/glam.min.js\"&gt; &lt;/script&gt;\n" +
    "\n" +
    "... and then you can start adding 3D tags to your page. To see what those tags look like,\n" +
    "\n" +
    "read the Getting Started Tutorial (link)\n" +
    "\n" +
    "</p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "    <h1 class=\"page-header\">\n" +
    "    How Do I Author GLAM?\n" +
    "  </h1>\n" +
    "\n" +
    "    <p class=\"p17\">\n" +
    "\n" +
    "Right now, authoring GLAM requires a text editor. Someday, maybe, we'll build an\n" +
    "\n" +
    "interactive tool for authoring, or at least a syntax assisted in browser editor a la JSFiddle.\n" +
    "\n" +
    "To test, you will most likely need a web server ... so that you can see your texture maps\n" +
    "\n" +
    "and shaders. Launching HTML files from your Finder/Explorer usually results in the\n" +
    "\n" +
    "browser yakking about cross­origin restrictions.\n" +
    "\n" +
    "How Can I Participate?\n" +
    "\n" +
    "GLAM is new. We're just getting started, and we need your help! We are looking for help\n" +
    "\n" +
    "with code, content and documentation. Check out the Github repo and examples (links\n" +
    "\n" +
    "here) and join the GLAM revolution!\n" +
    "\n" +
    "CAN YOU DIG IT?\n" +
    "\n" +
    "</p>\n" +
    "</div>");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    " <section class=\"row\" id=\"featured\">\n" +
    "\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcubeanimated\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">Featured Demo</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcubeanimated.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcube\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Photo Cube</h3>\n" +
    "              <p>Basic Demo - Textured cube with CSS animations.</p>\n" +
    "            </div>\n" +
    "            <a data-url='demos/glamcubeanimated.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcubeanimated'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "          <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"bubblepop\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">Featured Demo</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/bubblepop.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"bubblepop\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Bubblepop!</h3>\n" +
    "              <p>Bubble Pop! Shaders, environment maps, and using the DOM to create and destroy objects.</p>\n" +
    "            </div>\n" +
    "            <a data-url='demos/bubblepop.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='bubblepop'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcube\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">Featured Demo</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcity.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcity\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Glam City</h3>\n" +
    "              <p>Glam City - an imported COLLADA model with an animated camera.</p>\n" +
    "            </div>\n" +
    "            <a data-url='demos/glamcity.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcity'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamsceneanimatedeffects\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">Featured Demo</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamsceneanimatedeffects.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamsceneanimatedeffects\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Postprocessing</h3>\n" +
    "              <p>Post-Processing and Particle Systems demo.</p>\n" +
    "            </div>\n" +
    "            <a data-url='demos/glamsceneanimatedeffects.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamsceneanimatedeffects'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        </section>\n" +
    "\n" +
    "        <section class=\"row\" id=\"examples\">\n" +
    "\n" +
    "          <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcube\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">basic</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcube.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcube\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">cube</h3>\n" +
    "              <p> A simple textured cube. Interactive 3D content in 8 lines of markup and CSS.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/basic/glamcube.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcube'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamscene\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">hierarchy</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamscene.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamscene\">\n" +
    "           </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">scene</h3>\n" +
    "              <p>A hierarchical scene, demonstrating several visual types and grouping.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/hierarchy/glamscene.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamscene'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcubeanimated\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">animation</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcubeanimated.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcubeanimated\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">animated cube</h3>\n" +
    "              <p>Animation basics: using CSS to drive 3D animations.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/animation/glamcubeanimated.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcubeanimated'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamsceneanimated\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">animation</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamsceneanimated.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamsceneanimated\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">animated scene</h3>\n" +
    "              <p> An animated hierarchical scene with several CSS keyframes.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/animation/glamsceneanimated.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamsceneanimated'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcubeinteractive\" >\n" +
    "             <div class=\"imgT\">\n" +
    "              <div class=\"type\">interaction</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcubeinteractive.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcubeinteractive\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">cube with interaction</h3>\n" +
    "              <p>Basic interaction. Add DOM event handlers to any object.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/interaction/glamcubeinteractive.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcubeinteractive'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glammesh\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">visuals</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glammesh.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glammesh\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">meshes</h3>\n" +
    "              <p>Create meshes with vertices, normals, colors and texture coordinates.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/visuals/glammesh.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glammesh'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamlines\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">visuals</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamlines.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamlines\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">lines</h3>\n" +
    "              <p>Create line sets with GLAM.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/visuals/glamlines.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamlines'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamtext\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">visuals</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamtext.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamtext\">\n" +
    "          </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">3D text</h3>\n" +
    "              <p> 3D text, flat and extruded.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/visuals/glamtext.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamtext'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamparticles\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">visuals</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamparticles.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamparticles\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">particle systems</h3>\n" +
    "              <p>Particle systems demo.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/visuals/glamparticles.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamparticles'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamimport\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">visuals</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcity.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamimport\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">importing models</h3>\n" +
    "              <p>Demonstrates importing an external model in a 3D standard 3D format.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/imports/glamimport.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamimport'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glambumpmap\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">materials</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glambumpmap.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glambumpmap\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">bump mapping</h3>\n" +
    "              <p>Sphere with bump-mapping.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/materials/glambumpmap.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glambumpmap' class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamearth\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">materials</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamearth.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamearth\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">normal mapping</h3>\n" +
    "              <p> Earth sphere with normal-mapping.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/materials/glamearth.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamearth' class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamshaderfresnel\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">shaders</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/bubblepop.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamshaderfresnel\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">fresnel shader</h3>\n" +
    "              <p> Fresnel-shaded reflection and refraction effect.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/shaders/glamshaderfresnel.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamshaderfresnel'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamsun\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">shaders</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamsun.jpg\" data-src=\"holder.js/300x200/#000:#fff/text:glam/glam\" alt=\"glamsun\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">sun shader</h3>\n" +
    "              <p>Animate textures using a programmable shader.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/shaders/glamsun.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamsun'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamskybox\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">backgrounds</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamskybox.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamskybox\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">sky box</h3>\n" +
    "              <p>Skybox (cube map) scene background.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/backgrounds/glamskybox.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamskybox'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamskysphere\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">backgrounds</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamskysphere.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamskysphere\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">sky sphere</h3>\n" +
    "              <p> Skysphere (panoram) scene background.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/backgrounds/glamskysphere.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamskysphere'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcubeeffects\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">effects</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcubeeffects.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcubeeffects\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Cube - Dot Shader</h3>\n" +
    "              <p>Simple cube with dot-shader \"Lichtenstein\" post-processing effect.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/effects/glamcubeeffects.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcubeeffects'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamsceneanimatedeffects\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">effects</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamsceneanimatedeffects.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamsceneanimatedeffects\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">Scene - Bloom Shader</h3>\n" +
    "              <p>Scene with several post-processing effects and particle systems.</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/effects/glamsceneanimatedeffects.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamsceneanimatedeffects'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamcityvr\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">vr</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamcityvr.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamcityvr\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">city</h3>\n" +
    "              <p>Glam City demo using Web VR APIs (Oculus Renderer and Camera Controller)</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/vr/glamcityvr.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamcityvr'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamshaderfresnelvr\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">vr</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamshaderfresnelvr.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamshaderfresnelvr\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">fresnel shader</h3>\n" +
    "              <p>Fresnel shader demo in VR (Oculus Renderer and Camera Controller).</p>\n" +
    "              \n" +
    "            </div>\n" +
    "            <a data-url='examples/vr/glamshaderfresnelvr.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamshaderfresnelvr'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6 col-md-3\">\n" +
    "          <div class=\"thumbnail\" id=\"glamskyspherevr\" >\n" +
    "            <div class=\"imgT\">\n" +
    "              <div class=\"type\">vr</div>\n" +
    "            <img class='lazy' data-original=\"site/images/demo/glamskyspherevr.jpg\" data-src=\"holder.js/300x300/#000:#fff/text:glam/glam\" alt=\"glamskyspherevr\">\n" +
    "            </div>\n" +
    "            <div class=\"caption\">\n" +
    "              <h3  class=\"Uppercase\">sky sphere</h3>\n" +
    "              <p> Spherical pano viewer in VR ( (Oculus Renderer and Camera Controller).</p>\n" +
    "            </div>\n" +
    "            <a data-url='examples/vr/glamskyspherevr.html' class=\"btn btn-glam\" role=\"button\">View</a> <a data-source='glamskyspherevr'  class=\"btn btn-glam\" role=\"button\">Source</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "      \n" +
    "      </section>");
}]);
