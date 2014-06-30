/* Creating a global object */

var Bajo = {
	/* Variable for storing config */
	config: null,
	
	/**
	 *	Helper for setting the config variable, gets config,json and sets it to config
	 */	
	setConfig: function(){
		var self = this;
		$.getJSON('config/config.json', function(data){
			self.config = data;
		});
	},
	checkOauthStatus: function () {
	var self = this;	
	$.getJSON ( self.config.api_root , {
		action:'get_rights',
		botmode:1
	} , function ( d ) {
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
	} ) ;
}

}

/* Sets config */
Bajo.setConfig();

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
})	

Bajo.oauthTimeout = window.setTimeout(Bajo.checkOauthStatus, 1000);