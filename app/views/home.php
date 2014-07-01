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
<script>
<?php
	if(isset($_SESSION['notebooks']) && $_SESSION['notebooks']) 
		echo 'var notebooks =' . json_encode($_SESSION['notebooks']); 
?>
</script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="assets/js/jquery.min.js"><\/script>')</script>
<script src="assets/js/main.js"></script>
</body>
</html>
<script>
	for(i in notebooks){
		$.ajax({
			url:'http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/notebooks/'+notebooks[i],
			type: 'GET',
			dataType: 'json',
			success: function(data){
				console.log(data);
			},
			beforeSend: function(xhr){
				xhr.setRequestHeader('Accept','application/json')
			},
		});
	}
</script>
