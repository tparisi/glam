angular.module( 'ngGlam.about', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'About - GLAM' }
  });
})

.controller( 'AboutCtrl', function AboutCtrl( $scope ) {
  $('html').velocity("scroll", { duration: 1500, easing: "easeInSine", offset: $('#about').offset().top - 55  });


})

;
