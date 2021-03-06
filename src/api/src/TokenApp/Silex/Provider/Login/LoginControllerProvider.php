<?php

namespace TokenApp\Silex\Provider\Login;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Silex\ControllerProviderInterface;
use Silex\Application;

class LoginControllerProvider implements ControllerProviderInterface
{
    const VALIDATE_CREDENTIALS = '/validateCredentials';
    const TOKEN_HEADER_KEY     = 'X-Token';
    const TOKEN_REQUEST_KEY    = '_token';

    private $baseRoute;

    public function setBaseRoute($baseRoute)
    {
        $this->baseRoute = $baseRoute;

        return $this;
    }

    public function connect(Application $app)
    {
        $this->setUpMiddlewares($app);

        return $this->extractControllers($app);
    }

    private function extractControllers(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get(self::VALIDATE_CREDENTIALS, function (Request $request) use ($app) {
            $user   = $request->get('user');
            $pass   = $request->get('pass');
            $status = $app[LoginServiceProvider::AUTH_VALIDATE_CREDENTIALS]($user, $pass);

            return $app->json([
                'status' => $status,
                'info'   => $status ? ['token' => $app[LoginServiceProvider::AUTH_NEW_TOKEN]($user)] : []
            ]);
        });

        return $controllers;
    }

    private function setUpMiddlewares(Application $app)
    {
        $app['user_token'] = "";
        $app->before(function (Request $request) use ($app) {
            if (!$this->isAuthRequiredForPath($request->getPathInfo())) {
                // TODO: Check token and role
                // $app['user_token'] = $this->getTokenFromRequest($request);
                // $records = $app['db']->fetchAll('SELECT role FROM users WHERE token=?', array( $app['user_token'] ) );
                // if (count($records)==0) {
                    $app['user_role'] = 'g';
                // } else {
                //    $app['user_role'] = $records[0]["role"];
                //}
            }
        });
    }

    private function getTokenFromRequest(Request $request)
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
            $token = $request->request->get(self::TOKEN_REQUEST_KEY);
            if (isset($token)) {
                return $token;
            } else {
                return "";
            }
        } else {
            return $request->headers->get(self::TOKEN_HEADER_KEY, $request->get(self::TOKEN_REQUEST_KEY));
        }
    }

    private function isAuthRequiredForPath($path)
    {
        return in_array($path, [$this->baseRoute . self::VALIDATE_CREDENTIALS]);
    }

    private function isValidTokenForApplication(Application $app, $token)
    {
        return $app[LoginServiceProvider::AUTH_VALIDATE_TOKEN]($token);
    }
}