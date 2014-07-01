/* Create a config object */

var config = {
	api_root: "http://tools.wmflabs.org/widar"
}

/* Creating a global object */
var Bajo = {
	/* Variable for storing config */
	config: config,

	annotations: null,
	
	/**
	 *	Helper for setting the config variable, gets config,json and sets it to config
	 */	
	setConfig: function(){
		var self = this;
		self.oauthTimeout = window.setTimeout(self.checkOauthStatus, 1000);
	},
	checkOauthStatus: function () {
		var self = this;
		$.getJSON ( self.config.api_root , {
			action:'get_rights',
			botmode:1
		}, function ( d ) {
			var h = '' ;
			if ( d.error != 'OK' || typeof (d.result||{}).error != 'undefined' ) {
				h += "<div><a title='You need to authorise WiDaR to edit on your behalf if you want this tool to edit Wikidata.' target='_blank' href='/widar/index.php?action=authorize'>WiDaR</a><br/>not authorised.</div>" ;
			} else {
				h += "<div>Logged into <a title='WiDaR authorised' target='_blank' href='/widar/'>WiDaR</a> as <span class='username'>" + d.result.query.userinfo.name + "</span></div>" ;
				$.each ( d.result.query.userinfo.groups , function ( k , v ) {
					if ( v != 'bot' ) return ;
					h += "<div><b>You are a bot</b>, no throttling for you!</div>" ;
				} ) ;
				window.clearTimeout(self.oauthTimeout);
			}
			$('.oauth_status').html ( h ) ;
			// $.each ( (((((d||{}).result||{}).query||{}).userinfo||{}).groups||[]) , function ( k , v ) {
			// 	if ( v == 'bot' ) {
			// 		max_widar_concurrent = 5 ;
			// 		widar_edit_delay = 1 ;
			// 	}
			// } ) ;
		});
	},

	getAnnotations: function(cb){
		if( notebooks != undefined )
			for(i in notebooks){
				$.ajax({
					url:'http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/notebooks/'+notebooks[i],
					type: 'GET',
					dataType: 'json',
					success: function(data){
						cb(data);
					},
					beforeSend: function(xhr){
						xhr.setRequestHeader('Accept','application/json')
					},
				});
			}
	},
	analyzeData: function(ann){
		// function annotation( item, property, value ){
  //           this.item = item;
  //           this.property = property;
  //           this.value = value;
  //       }
        console.log(ann);
        return 'hello';

	},

	handleAnnotations: function(ann){
		var self = this;
		var annotations = JSON.parse(ann['annotations']);
		console.log(annotations);

		for( var i in annotations ){
			self.analyzeData(annotations[i]);
			// self.addAnnotationToMainView(returnedAnn);
		}
	},
}

/* Sets config */
Bajo.setConfig();

Bajo.getAnnotations(Bajo.handleAnnotations);

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
})	
