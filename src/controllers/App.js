var App = angular.module('Reports', ['ngRoute', 'ngSanitize', 'reportslistctrl', 'reportsgeneratectrl', 'reportseditctrl'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    // Reports
    when('/', {
      templateUrl: 'src/partials/reports_list.html',
      controller: 'ReportsListCtrl'
    }).
    when('/edit/:param', {
      templateUrl: 'src/partials/reports_edit.html',
      controller: 'ReportsEditCtrl'
    }).
    when('/edit/', {
      templateUrl: 'src/partials/reports_edit.html',
      controller: 'ReportsEditCtrl'
    }).
    when('/generate/:param', {
      templateUrl: 'src/partials/reports_generate.html',
      controller: 'ReportsGenerateCtrl'
    }).
    when('/activities/details/:param', {
      templateUrl: 'src/partials/activity_details.html',
      controller: 'ActivityDetailsCtrl'
    }).
    // Default
    otherwise({
      redirectTo: '/'
    });
}]);

// Init server
App.run(function (httpT) {
    httpT.setHost(SERVER_URL);
});
