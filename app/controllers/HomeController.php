<?php

class HomeController{
	function get(){
		global $config;
		$notebooks = array();
		foreach($_GET as $key=>$value)
			array_push($notebooks, $key);
		session_start();
		$_SESSION['notebooks'] = $notebooks;
		View::make('home');
	}

	function makeGET( $url ){
		$curl = curl_init();
		curl_setopt_array($curl,array( 
			CURLOPT_URL=> $url,
			CURLOPT_RETURNTRANSFER => 1
			));
		$resp = curl_exec($curl);
		curl_close($curl);
		return $resp;
	}

	function post(){
		if(isset($_POST['ids']) && $_POST['ids'] ){
			$_SESSION['ids'] = $_POST['ids'];
			echo "yes";
		}
	}
}