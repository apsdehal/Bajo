/* Create a config object */

var config = {
	api_root: "http://tools.wmflabs.org/widar",
	wd_root: "//www.wikidata.org/w/api.php",
	lang: 'en'
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

	/**
	 * This function checks the ouath status by regularly pinging up the Widar and then clears its timeout once the OAuth is
	 * complete, makes changes to the html and then calls getAnnotations to handle annotations
	 */	
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
		});
	},

	/**
	 * The main player in the game this object takes notebooks, set through PHP and iterates over each
	 * notebook to get their annotations and in turn analyze them and finally add them to the table present
	 * in the html
	 *
	 * @param Function cb The callback function which is applied on the data received 
	 */	
	getAnnotations: function(cb){
		var self = this;
		if( notebooks != undefined )
			for(i in notebooks){
				$.ajax({
					url:'http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/notebooks/'+notebooks[i],
					type: 'GET',
					dataType: 'json',

					/**
					 * Handles the data received after making the request to pundit's open API for a information
					 * on a particular notebook
					 *
					 * @param object ann Data retrieved from Pundit's API
					 */
					success: function(ann){
						self.setStageForAnnotations();
						var annotations = JSON.parse(ann['annotations']);
						var retreived = cb(annotations['items']);
				        self.addAnnotationToMainView(retreived);
					},

					/**
					 * This is to specifically add headers to request before sending it to api
					 * 
					 * @param object xhr The object XML HTTP Request Object that is the main player
					 */
					beforeSend: function(xhr){
						xhr.setRequestHeader('Accept','application/json')
					},
				});
			}
	},

	/**
	 * Handles a annotation retrieved from Pundit's Open Server
	 * Analyzes the annotation and bring it to wikidata format and then
	 * append it table predent in the html
	 *
	 * @param object ann Annotation to be analyzed as retreived from the Pundit Server
	 */	
	handleAnnotations: function(ann){
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
				 + '<td class="item">' + item+ '</td>';
		if(item[0] == 'Q'){
			html += '<td class="item-selector"><p class="q-item">' + item + '</p></td>';
		}	else {
			itemSubstr = item.substr(0,7);
			html += '<td class="item-selector '+ itemSubstr + '"><img src="assets/images/loading.gif"/></td>';
			Bajo.getRelatedItems(item);
		}	 
			html += '<td class="prop">' + prop + '</td>'
				 + '<td class="value">' + value + '</td>'
				 + '<td class="checkbox">'
				 + '<input type="checkbox" name="annotationCheckbox" value="checked"/>'
				 + '</td>' 
				 + '</tr>'; 
		$('.annotations').append(html);	
		Bajo.setPushHandler();
    },

    getRelatedItems: function(item){
    	var params = {
			action: 'wbsearchentities',
			type:'item',
			format: 'json',
			language: config.lang,
			search: item
		};
		$.getJSON(config.wd_root + '?callback=?', params, function(data){
			if( data.search.length == 0 ){
				var dropdowns = '<p class="non-existant">We don\'t find any suggestion for your item. <a>Want to create one?</a> </p>' 
			} else {
				var dropdowns = '<p class="list"><select class="item-dropdown">'
				$.each(data.search, function(i){
					dropdowns += '<options value="'+data.search[i].id +'">' + data.search[i].description + '</option>';
				});
				dropdowns += '</select></p>';
			}
			var itemSubstr = '.' + item.substr(0,7);
			$(itemSubstr).html(dropdowns);
		});

    },

    /**
     * Function for adding table to html dynamically after the user has been authenticated via 
     * oauth
     */	
	setStageForAnnotations: function(){
		var html = '<table class="annotations">'
				 + '<tr><td colspan="4">Your Annotations</td></tr>'
				 + '<tr class="tableHeading"><th>Item</th><th>Item Selector</th><th>Property</th><th>Value</th><th>Select</th></tr>'
				 + '</table>'
				 + '<button class="push">Push Selected Annotations</button>';
		$('body').append(html);
	},

	/**
	 * Sets click event handler on push button
	 */	
	setPushHandler: function(){
		$('body').delegate('.push', 'click', function(){
			$('input[type=checkbox]:selected').each(function(i){
				var item = $(i).find('.item').html();
				var prop = $(i).find('.prop').html();
				var value = $(i).find('.value').html();
			});
		});
	},
	addAnnotationToMainView: function(ann){

	}
}

/* Sets config */
Bajo.setConfig();

Bajo.getAnnotations(Bajo.handleAnnotations);

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
})	
