angular.module('reportsgeneratectrl', [ 'toaster' ])



/** List ************************************************************************/
.controller('ReportsGenerateCtrl', ['$scope', 'httpT', '$routeParams', 'toaster', '$timeout', function($scope, httpT, $routeParams, toaster, $timeout) {

    // Init
    $scope.report = { id: $routeParams.param, subreports: [ ] };
    $scope.report_cur_pos = 0;

    // Color
    var colors = [  "rgba(244,67,54,1)", "rgba(33,150,243,1)", "rgba(76,175,80,1)", "rgba(255,152,0,1)", "rgba(103,58,183,1)", "rgba(255,235,59,1)", "rgba(132,85,72,1)" ];
    var colorsBack = [  "rgba(244,67,54,0.05)", "rgba(33,150,243,0.05)", "rgba(76,175,80,0.05)", "rgba(255,152,0,0.05)", "rgba(103,58,183,0.05)", "rgba(255,235,59,0.05)", "rgba(132,85,72,0.05)" ];

    // Config
    Chart.defaults.global.responsive = true;

    // Get Report
    $scope.loadReport = function() {
        httpT.get("/api/reports/get/"+$scope.report.id).then(
            function successCallback(response) {
                $scope.report = response.data;
                for (var i=0;i<$scope.report.subreports.length;i++) {
                    $scope.report.subreports[i].position=i;
                    if ($scope.report.subreports[i].type == 'table') {
                        $scope.report.subreports[i].ui_size = 'col-md-12'
                    } else {
                        $scope.report.subreports[i].ui_size = 'col-md-6'
                    }
                }
                // Delayed calculation
                $timeout(function() {
                    $scope.executeReport();
                }, 0);
            }, 
            function errorCallback(response) {
                toaster.pop('error', "Report", "Error loading Report");
            });
    };
    $scope.loadReport();

    // Query
    $scope.executeReport = function() {

        if ($scope.report.subreports.length<=$scope.report_cur_pos) {
            return;
        }

        // Titles
        if ($scope.report.subreports[$scope.report_cur_pos].type=='title') {

            $scope.report.subreports[$scope.report_cur_pos].is_title=true;
            $scope.report.subreports[$scope.report_cur_pos].width=12;
            // Next 
            $scope.report_cur_pos++;
            $scope.executeReport();
            return;
        }

        // Others: Queries
        httpT.get("/api/reports/execute/"+$scope.report.id+"/"+$scope.report_cur_pos).then(
            function successCallback(response) {

                var subreport = $scope.report.subreports[$scope.report_cur_pos];

                // Specific cases for colors
                if (subreport.type=='bar') {
                    colorsBack_toUse = colors;
                } else {
                    colorsBack_toUse = colorsBack;
                }

                // Prepare data
                var t_labels = [];
                var x_labels = [];
                var x_label_title = "";
                var t_dataset = []
                for(var i=0; i<Object.keys(response.data).length; i++) {
                    var row = response.data[i];
                    x_labels.push(row[Object.keys(row)[0]]);
                    // If first row, init the array
                    if (i==0) {
                        x_label_title = Object.keys(row)[0];
                        for (var j=1; j<Object.keys(row).length; j++) {
                            t_dataset.push( { label : 'Label'+j, borderColor: colors[j-1], backgroundColor: colorsBack_toUse[j-1], data: [] } );
                        }                        
                    }
                    // Fill data
                    for (var j=1; j<Object.keys(row).length; j++) {
                        if (i==0) {
                            t_dataset[j-1].label = Object.keys(row)[j];
                            t_labels.push(Object.keys(row)[j]);
                        }
                        t_dataset[j-1].data.push( Number( row[Object.keys(row)[j]] ) );
                    }
                }

                // Table
                if (false || subreport.type=='table') {
                    subreport.is_table=true;
                    var tmp_html = "";
                    tmp_html += "<table class=\"table table-hover\">";
                    tmp_html += "<thead><tr>";
                    tmp_html += "<th>"+x_label_title+"<th>";
                    for (var i=0; i<t_labels.length; i++) {
                        tmp_html += "<th>"+t_labels[i]+"<th>";
                    }
                    tmp_html += "</tr></thead>";
                    for (var i=0; i<t_dataset[0].data.length; i++) {
                        tmp_html += "<tr>";
                        tmp_html += "<td>"+x_labels[i]+"<td>";
                        for (var j=0; j<t_labels.length; j++) {
                            tmp_html += "<td>"+t_dataset[j].data[i]+"<td>";
                        }
                        tmp_html += "</tr>";
                    }
                    tmp_html += "<tbody>";
                    tmp_html += "</tbody>";
                    tmp_html += "</table>";
                    $scope.report_html = tmp_html;
                }

                // Line
                if (false || subreport.type=='line') {
                    subreport.is_graph=true;

                    // Display
                    var ctx = document.getElementById("subreport_"+subreport.position);

                    var myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: x_labels,
                            datasets: t_dataset
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    });
                }

                // bar
                if (false || subreport.type=='bar') {
                    subreport.is_graph=true;

                    // Display
                    var ctx = document.getElementById("subreport_"+subreport.position);

                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: x_labels,
                            datasets: t_dataset
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    });
                }

                // Next 
                $scope.report_cur_pos++;
                $scope.executeReport();

            },
            function errorCallback(response) {
                $scope.report.subreports[$scope.report_cur_pos].is_message = true;
                $scope.report.subreports[$scope.report_cur_pos].message = response.data;

                // Next 
                $scope.report_cur_pos++;
                $scope.executeReport();
            }
        );
    };


}]);