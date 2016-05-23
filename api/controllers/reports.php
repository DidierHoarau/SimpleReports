<?php

/** Reports **************************************************************************************/

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
$reports = $app['controllers_factory'];


/**
 * Reports list
 */
$reports->match("/list", function(Request $request) use ($app) {

    // Init
    $response_array = [];
    $folder_name = $app['folder_data'];

    // Parse the folder
    if ($handle = opendir($folder_name)) {

        while (false !== ($file = readdir($handle))) {    
            if ( strlen($file)>5 && substr($file, -5)==".json" ) {
                $report_string = file_get_contents($app['folder_data'].'/'.$file);
                $report_json = json_decode($report_string, true);
                $report_data = new stdClass();
                $report_data->{'id'}    = $report_json['id'];
                $report_data->{'title'} = $report_json['title'];
                array_push($response_array,$report_data);
            }
        }
        closedir($handle);

        // Sort
        sort($response_array);
    }

    // Return 
    return $app->json($response_array, 201);    
});



/**
 * Execute a report
 */
$reports->match("/execute/{report_id}/{subreport_posiion}", function($report_id,$subreport_posiion) use ($app) {

    // Open the report file
    $report_string = file_get_contents($app['folder_data'].$report_id.".json");
    $report_json = json_decode($report_string, true);

    // Get the subreport
    $sql = $report_json['subreports'][$subreport_posiion]['sql'];

    // Query
    $records = $app['db']->fetchAll( $sql );

    // Return 
    return $app->json($records, 201);    
});



/**
 * Get a report
 */
$reports->match("/get/{report_id}", function($report_id) use ($app) {

    // Open the report file
    $report_string = file_get_contents($app['folder_data'].$report_id.".json");
    $report_json = json_decode($report_string, true);

    // Return 
    return $app->json($report_json, 201);    
});



/**
 * Save a report
 */
$reports->post("/edit/{report_id}", function($report_id,Request $request) use ($app) {
    // Data
    $report_data = new stdClass();
    $report_data->{'id'}    = $report_id;
    $report_data->{'title'} = $request->request->get('title');
    $report_data->{'subreports'}  = $request->request->get('subreports');

    $data_json = json_encode( $report_data );

    $fp = fopen($app['folder_data'].$report_data->{'id'}.".json", 'w');
    fwrite($fp, $data_json);
    fclose($fp);

    return $app->json( $data_json, 201);    
});

/**
 * New report
 */
$reports->post("/add", function(Request $request) use ($app) {
    // Data
    $report_data = new stdClass();
    $report_data->{'id'}    = generateID(30);
    $report_data->{'title'} = $request->request->get('title');
    $report_data->{'subreports'}  = $request->request->get('subreports');

    $data_json = json_encode( $report_data );

    $fp = fopen($app['folder_data'].$report_data->{'id'}.".json", 'w');
    fwrite($fp, $data_json);
    fclose($fp);

    return $app->json( $data_json, 201);    
});

/**
 * Delete a report
 */
$reports->match("/delete/{report_id}", function($report_id, Request $request) use ($app) {
    unlink($app['folder_data'].$report_id.".json");
    return $app->json( null , 200);
});


return $reports;

?>