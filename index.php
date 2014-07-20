<?php
require_once('helpers/headers.php');
require("config/bootstrap.php");

$routes = array(
	'/bajo' => 'HomeController'
	);

global $config;

if( $config == 'development' ){
	array_push(
		'/test' => 'TestController'
		);
}
Toro::serve( $routes );