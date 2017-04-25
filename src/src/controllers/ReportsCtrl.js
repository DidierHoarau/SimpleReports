App.controller('ReportsCtrl', ['$scope', 'httpT', '$location', function($scope, httpT, $location) {

    // Go to another URL
    $scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) {
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };

    // Authentification

    // Check authentication
    $scope.my_user = { name: "" , role: "", authenticated: false };
    $scope.checkAuthentication = function() {
    }
    $scope.checkAuthentication();
    
    // Home
    $scope.goHome = function() {
        $scope.changeRoute('#/');
        $scope.selectedIndex = 0;
    };

    // Displays a message in the UI
    $scope.result = { output:"", return_code:"", show:false, processing:false, class: "bg-info" };
    $scope.displayMessage = function(message) {

        // No message
        if (Object.keys(message).length === 0) {
            $scope.result.show = false;
            $scope.result.class = "bg-info";
            $scope.result.output = "";

        // Message
        } else {
            if (message.level == 'i') {
                $scope.result.show = true;
                $scope.result.class = "bg-info";
                $scope.result.output = message.text;
            } else if (message.level == 'e') {
                $scope.result.show = true;
                $scope.result.class = "bg-danger";
                $scope.result.output = message.text;
            }
        }

        if (message.autohide == true) {
            setTimeout( function() {
                $scope.result.show = false;
                $scope.result.class = "bg-info";
                $scope.result.output = "";
            }, 5000);
        }
    };

}]);

function formatDate(date) {
    data = date.trim();
    if (date.length==10) {
        return date.replace(/-/g,"/");
    } else {
        // Split timestamp into [ Y, M, D, h, m, s ]
        var date_n = date.split(/[- :]/);
        return date_n[2]+"/"+date_n[1]+"/"+date_n[0];        
    }
}