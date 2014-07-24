<!DOCTYPE html>
<html>
<head>
	<title>Push to Wikidata</title>
	<link rel="stylesheet" type="text/css" href="assets/css/main.css">
</head>
<body>
<div class="main">
	<div class="login-status">
	Please Wait.. Checking Login Status
	</div>
</div>
<div class="oauth_status"></div>
<script src="assets/js/namespace_helper.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="assets/js/jquery.min.js"><\/script>')</script>
<script src="config/config.js"></script>
<script>
<?php
	if(isset($_SESSION['notebooks']) && $_SESSION['notebooks']) 
		echo 'Bajo.notebooks =' . json_encode($_SESSION['notebooks']); 
?>
</script>
<script src="assets/js/main.js"></script>
</body>
</html>