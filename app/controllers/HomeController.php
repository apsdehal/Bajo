<?php

class HomeController{
	function get(){
		global $config;
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
		// $res = file_get_contents($url);
		// return $res;
	}
}