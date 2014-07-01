<?php
require_once('helpers/headers.php');
require("config/bootstrap.php");

$routes = array(
	'/bajo' => 'HomeController'
	);

Toro::serve( $routes );