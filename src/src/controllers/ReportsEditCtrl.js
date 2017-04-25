angular.module('reportseditctrl', [ 'toaster' ])



/** List ************************************************************************/
.controller('ReportsEditCtrl', ['$scope', 'httpT', 'toaster', '$routeParams', function($scope, httpT, toaster, $routeParams) {

    // Init
    $scope.report = { id: "", title: "", subreports: [], variables: [] };
    var param_report_id = $routeParams.param;
    $scope.mode_new = true;
    if (param_report_id==null) {
        $scope.mode_new = true;
    } else {
        $scope.mode_new = false;
        $scope.report.id = param_report_id;
        loadReport($scope.report.id);
    }

    // Load a report
    function loadReport(report_id) {
        httpT.get("/api/reports/get/"+report_id).then(
            function successCallback(response) {
                for (var i=0;i<response.data.subreports.length;i++) {
                    response.data.subreports[i].hidden=true;
                }
                $scope.report = response.data;
            },
            function errorCallback(response) {
                toaster.pop('error', "Report", "Error loading Report");
            });
    };

    // Save a report
    $scope.save = function() {
        var url = "/api/reports/add";
        if (!$scope.mode_new) {
            url = "/api/reports/edit/"+$scope.report.id;
        }
        httpT.post(url, $scope.report).then(
            function successCallback(response) {
                $scope.report.id = response.data.id;
                $scope.mode_new = false;
                toaster.pop('success', "Report", "Report Saved");
            },
            function errorCallback(response) {
                toaster.pop('error', "Report", "Error Saving Report");
            });
    };

    // Delete a report
    $scope.delete = function() {
        var r = confirm("Delete Report?");
        if (r == true) {
            httpT.get("/api/reports/delete/"+$scope.report.id).then(
                function successCallback(response) {
                    toaster.pop('success', "Report", "Report Deleted");
                    $scope.changeRoute('#/');
                },
                function errorCallback(response) {
                    toaster.pop('error', "Report", "Error Deleting Report");
                });
        }
    };

    // Add a sub-report
    $scope.addSubReport = function() {
        var new_subreport = { title: "", type: "t", sql: "", hidden: false }
        $scope.report.subreports.push(new_subreport);
    };

    // Move a subreport up
    $scope.moveSubreportUp = function(origin_position) {
        if (origin_position==0) {
            return;
        }
        var new_array = [];
        for (var i=0;i<$scope.report.subreports.length;i++) {
            if (i==origin_position-1) {
                new_array.push($scope.report.subreports[origin_position]);
            } else if (i==origin_position) {
                new_array.push($scope.report.subreports[origin_position-1]);
            } else {
                new_array.push($scope.report.subreports[i]);
            }
        }
        $scope.report.subreports = new_array;
    };

    // Move a subreport down
    $scope.moveSubreportDown = function(origin_position) {
        if (origin_position==$scope.report.subreports.length-1) {
            return;
        }
        var new_array = [];
        for (var i=0;i<$scope.report.subreports.length;i++) {
            if (i==origin_position) {
                new_array.push($scope.report.subreports[origin_position+1]);
            } else if (i==origin_position+1) {
                new_array.push($scope.report.subreports[origin_position]);
            } else {
                new_array.push($scope.report.subreports[i]);
            }
        }
        $scope.report.subreports = new_array;
    };

    // Delete a subreport down
    $scope.deleteSubreport = function(position) {
        var new_array = [];
        for (var i=0;i<$scope.report.subreports.length;i++) {
            if (i!=position) {
                new_array.push($scope.report.subreports[i]);
            }
        }
        $scope.report.subreports = new_array;
    };

    // Toggle Expand/Colapse
    $scope.toggleExpandCollapse = function(position) {
        $scope.report.subreports[position].hidden=!$scope.report.subreports[position].hidden;
    };


    // Check if the record is not a title
    $scope.isNotTitle = function(subreport) {
        if (subreport.type=='title') {
            return false;
        } else {
            return true;
        }
    }

    // Check if the record is not a title
    $scope.saveAsNew = function() {
        $scope.mode_new = true;
        $scope.save();
    }

    // Check if the record is not a title
    $scope.isNew = function() {
        if ($scope.report.id==null || $scope.report.id=="") {
            return true;
        } else {
            return false;
        }
    }


    // Should the legend for variable be displayed
    $scope.variableDisplayLegend = function() {
        if ($scope.report.variables==null || $scope.report.variables.length==0) {
            return false;
        }
        return true;
    }

    // Add a new variable
    $scope.variableAdd = function() {
        if ($scope.report.variables==null) {
            $scope.report.variables=[];
        }
        $scope.report.variables.push({ name: "", label: "", value: "" });
    };

    // Delete a variable
    $scope.variableDelete = function(position) {
        var new_array = [];
        for (var i=0;i<$scope.report.variables.length;i++) {
            if (i!=position) {
                new_array.push($scope.report.variables[i]);
            }
        }
        $scope.report.variables = new_array;
    };

    // Force the format of variables
    $scope.variableNameChanged = function(position) {
        var var_name = $scope.report.variables[position].name;
        var_name = var_name.toUpperCase();
        var_name = var_name.replace(/ /g,'');
        $scope.report.variables[position].name = var_name;
    };


}]);
