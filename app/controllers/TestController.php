<?php

class TestController{
	public function get(){
		var_dump('hello');
		die();
		require_once('./test/test.html');
	}
}