<!DOCTYPE html>
<html>
<head>
	<title>Push to Wikidata</title>
	<link rel="stylesheet" type="text/css" href="assets/css/main.css">
</head>
<body>
<p class="info">You must login to Wikimedia before pushing annotations</p>
<a title="You must login before pushing" href="//tools.wmflabs.org/widar?action=authorize" target="_blank" class="login"><button>Login to Wikimedia</button></a>
<div class="oauth_status"></div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="assets/js/jquery.min.js"><\/script>')</script>
<script src="assets/js/main.js"></script>
</body>
</html>
<script>
function setAnnotations(){
	
	<?php 
		if(isset($_SESSION['ann']) && $_SESSION['ann'])
			echo 'Bajo.annotations = ' . json_encode($_SESSION['ann']);
	?>
	if(Bajo.annotations != undefined)
		window.clearTimeout(Bajo.annotationsTimer)
}

Bajo.annotationsTimer = window.setTimeout(setAnnotations, 2000);
</script>