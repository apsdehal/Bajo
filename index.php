<?php

require("config/bootstrap.php");

$routes = array(
	'/bajo' => 'HomeController'
	);

Toro::serve( $routes );