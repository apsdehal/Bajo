<?php

class View {
  public static function make ( $view ) {
    require_once("./app/views/" .  $view . '.php');
  }
}