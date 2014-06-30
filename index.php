<?php

require("config/bootstrap.php");

$routes = array(
	'/' => 'HomeController'
	);

Link::all( $routes );