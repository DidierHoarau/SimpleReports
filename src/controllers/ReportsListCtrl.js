angular.module('reportslistctrl', [ ])



/** List ************************************************************************/
.controller('ReportsListCtrl', ['$scope', 'httpT', function($scope, httpT) {

    // Init
    $scope.displayMessage( { } );
    $scope.reports = [];

    // Query
    httpT.get("/api/reports/list").then(
        function successCallback(response) {
            $scope.reports = response.data;
        }, 
        function errorCallback(response) {
            $scope.displayMessage( { level: 'e', text: "Error retrieving reports" } );
        });

}]);