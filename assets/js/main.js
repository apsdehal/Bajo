/* Create a config object */

var config = {
	api_root: "http://tools.wmflabs.org/widar"
}

/* Creating a global object */
var Bajo = {
	/* Variable for storing config */
	config: config,

	annotations: [],
	
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
				Bajo.getAnnotations(Bajo.handleAnnotations);
				var info = $('.info').detach();
				var anchor = $('.login').detach();
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
		var self = this;
		if( notebooks != undefined )
			for(i in notebooks){
				$.ajax({
					url:'http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/notebooks/'+notebooks[i],
					type: 'GET',
					dataType: 'json',
					success: function(ann){
						self.setStageForAnnotations();
						var annotations = JSON.parse(ann['annotations']);
						var retreived = cb(annotations['items']);
				        self.addAnnotationToMainView(retreived);
					},
					beforeSend: function(xhr){
						xhr.setRequestHeader('Accept','application/json')
					},
				});
			}
	},

	handleAnnotations: function(ann){
        function annotation( item, property, value ){
            this.item = item;
            this.property = property;
            this.value = value;
        }
        var i = 0;
        var prop, item, value;
        for( type in  ann){
            if( i == 0 ){
                value = type.split('/')[4];
            }
            else if( i == 2 ){
                item = ann[type][ns.rdfs_label][0].value;
                item = item.replace(/(\n)/g,"").trim()
            } else if( i == 4 ){
                prop = type.split('/')[4].split(':')[1];
            }
            i++;
        }
        console.log(item + value + prop);
		var html = '<tr class="tableRow">'
				 + '<td class="item">' + item+ '</td>'
				 + '<td class="prop">' + prop + '</td>'
				 + '<td class="value">' + value + '</td>'
				 + '<td class="checkbox">'
				 + '<input type="checkbox" name="annotationCheckbox" value="checked"/>'
				 + '</td>' 
				 + '</tr>' 
		$('.annotations').append(html);		 

    },
	setStageForAnnotations: function(){
		var html = '<table class="annotations">'
				 + '<tr><td colspan="4">Your Annotations</td></tr>'
				 + '<tr class="tableHeading"><th>Item</th><th>Property</th><th>Value</th><th>Select</th></tr>'
				 + '</table>'
		$('body').append(html);
	},
	addAnnotationToMainView: function(ann){
	}
}

/* Sets config */
Bajo.setConfig();

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
})	
