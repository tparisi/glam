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
  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
})

;
