angular.module( 'ngGlam.faq', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'faq', {
    url: '/faq',
    views: {
      "main": {
        controller: 'FaqCtrl',
        templateUrl: 'faq/faq.tpl.html'
      }
    },
    data:{ pageTitle: 'FAQ - GLAM' }
  });
})

.controller( 'FaqCtrl', function FaqCtrl( $scope ) {
 $('html').velocity("scroll", { duration: 1500, easing: "easeInSine", offset: $('#faq').offset().top - 55  });
})

;
