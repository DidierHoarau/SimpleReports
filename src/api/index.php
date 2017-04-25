<?php

/** Config/Dependencies **************************************************************************************/

require_once __DIR__ . '/vendor/autoload.php';

use TokenApp\Silex\Application;

use Silex\Provider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Response;

$app = new Application();
$app['debug'] = true;

$app->register(new Provider\DoctrineServiceProvider());
$app->register(new Provider\ServiceControllerServiceProvider());
$app->register(new Provider\UrlGeneratorServiceProvider());




/** Inits **************************************************************************************/

require_once("config/config.php");
$app['user_profile'] = 'g';



/** JSON input **************************************************************************************/

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});




/** Load the controllers ***************************************************************************/

$app->mount('/reports', include 'controllers/reports.php');
$app->run();




/** Utilities ***************************************************************************/

/**
 * Function that will generate an ID
 */
function generateID($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>
