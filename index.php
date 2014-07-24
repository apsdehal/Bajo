<?php
require_once('helpers/headers.php');
require("config/bootstrap.php");

$routes = array(
	'/bajo' => 'HomeController'
	);

global $config;

if( $config['environment'] == 'development' ){
	$routes['/bajo/test'] = 'TestController';
}

Toro::serve( $routes );