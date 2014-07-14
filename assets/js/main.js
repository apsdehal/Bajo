/* Create a config object */

var config = {
	api_root: "http://tools.wmflabs.org/wikidata-annotation-tool",
	wd_api: "//www.wikidata.org/w/api.php",
	pundit_api: 'http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/notebooks/',
	loading_gif: '<img src="assets/images/loading.gif"/>',
	lang: 'en',
	wd_base: '//www.wikidata.org/wiki/'
}

function annotation ( item, prop, value, resource, status ) {
	this.item = item;
	this.prop = prop;
	this.value = value;
	this.resource = resource;
	this.status = status;
}

function resource ( value, prop, datatype ){
	this.value = value;
	this.prop = prop;
	this.datatype = datatype;
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
				h += "<div><a title='You need to authorise WAF to edit on your behalf if you want this tool to edit Wikidata.' target='_blank' href='/wikidata-annotation-tool/index.php?action=authorize'>WAF</a><br/>not authorised.</div>" ;
			} else {
				console.log(d);
				h += "<div>Logged into <a title='WAF authorised' target='_blank' href='//tools.wmflabs.org/wikidata-annotation-tool'>WAF</a> as <span class='username'>" + d.result.query.userinfo.name + "</span></div>" ;
		
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
					url: config.pundit_api+notebooks[i],
					type: 'GET',
					dataType: 'json',

					/**
					 * Handles the data received after making the request to pundit's open API for a information
					 * on a particular notebook
					 *
					 * @param object ann Data retrieved from Pundit's API
					 */
					success: function(anns){
						self.setStageForAnnotations();
						cb(anns['annotations']);
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
	handleAnnotations: function(annotations){
		var html = '';

	    for(ann in annotations){
	    	ann = JSON.parse(annotations[ann]);
	    	console.log(ann);
	    	info = ann['items'];
	    	graph = ann['graph'];
	    	
	    	var i = 0;
	        var prop, propValue, item, itemLink, itemNo, value, valueValue, url;
	    	
	    	for(i in ann['metadata']){
	    		url =  ann['metadata'][i][ns.items.pageContext][0].value;
	    		date = ann['metadata'][i][ns.pundit_annotationDate][0].value;
	    		break;
	    	}

	    	for(i in graph){
	    		itemLink = i;
	    		for(j in graph[itemLink])
	    			prop = j;
	    			value = graph[itemLink][prop][0].value;
	    			break;
	    		break;	
	    	}

	    	item = info[itemLink][ns.rdfs_label][0].value;
	    	item = item.replace(/(\n)/g,"").trim()
	    	itemNo = itemLink.split('/')[4];

	    	propValue = info[prop][ns.rdfs_label][0].value;
	    	prop = prop.split('/')[4].split(':')[1];

			valueValue = info[value][ns.rdfs_label][0].value;
			value = value.split('/')[4];

	    	console.log( item[0] + ' ' + itemNo + ' ' + propValue + ' ' + prop + ' ' + value + ' ' + valueValue);

			html += '<tr class="tableRow">'
				 + '<td class="item">' + item + '</td>';
		
			if(itemNo[0] == 'Q'){
				html += '<td class="item-selector"><p class="q-item"><span class="itemNo">' + itemNo + '</span></p></td>';
			}	else {
				itemSubstr = item.substr(0,7).split(' ');
				itemSubstr = itemSubstr.join('');
		
				html += '<td class="item-selector ' + itemSubstr + '">' + config.loading_gif + '</td>';
		
				Bajo.getRelatedItems(item, itemSubstr);
			}	 
		
			html += '<td class="prop">' + propValue + ' (<span class="propNo">' + prop + '</span>)</td>'
				 + '<td class="value">' + valueValue + ' (<span class="valueNo">' + value + '</span>)</td>'
				 + '<td class="checkbox">'
				 + '<input type="checkbox" name="annotationCheckbox" value="checked"/>'
				 + '</td>'
				 + '<td class="status">Not pushed yet</td>'
				 + '<td class="resource"><span class="url">' + url + '</span>'
				 + '<span class="date_created">' + date + '</span></td>' 
				 + '</tr>';
		}		  
		
		var pushButton = '<button class="push">Push Selected Annotations</button>';	 
		
		$('.annotations').append(html);
		$('body').append(pushButton);	
		
		Bajo.setPushHandler();
    },

    getRelatedItems: function(item, itemSubstr){
    	var params = {
			action: 'wbsearchentities',
			type:'item',
			format: 'json',
			language: config.lang,
			search: item
		};
		
		$.getJSON(config.wd_api + '?callback=?', params, function(data){
			if( data.search.length == 0 ){
				var dropdowns = '<p class="non-existant">No related items. <a>Want to create one?</a> </p>' 
			} else {
				var dropdowns = '<p class="list"><select class="item-dropdown">'
			
				$.each(data.search, function(i){
					dropdowns += '<options value="'+data.search[i].id +'">' + data.search[i].description + '</option>';
				});
			
				dropdowns += '</select></p>';
			}

			itemSubstr = '.' + itemSubstr;
			$(itemSubstr).html(dropdowns);
		});

    },

    /**
     * Function for adding table to html dynamically after the user has been authenticated via 
     * oauth
     */	
	setStageForAnnotations: function(){
		var html = '<table class="annotations">'
				 + '<tr><td colspan="6" class="annotationsHeader">Your Annotations</td></tr>'
				 + '<tr class="tableHeading"><th class="item">Item</th>'
				 + '<th class="item-selector">Item Selector</th>'
				 + '<th class="prop">Property</th><th class="value">Value</th><th class="checkbox">Select</th>'
				 + '<th class="status">Status</th>'
				 + '<th class="resource">Resource</th>'
				 + '</tr>'
				 + '</table>';
	
		$('body').append(html);
	},

	/**
	 * Sets click event handler on push button
	 */	
	setPushHandler: function() {
		$('body').delegate('.push', 'click', function(){
			$('.push').html('Pushing Now...');
			
			var checkedBoxes = $('input[type=checkbox]:checked');
			var lengthChecked = checkedBoxes.length;
			
			checkedBoxes.each(function(i){
				var parent = $(this).parent().parent();

				var item = parent.find('.itemNo').html();
				var prop = parent.find('.propNo').html();
				var value = parent.find('.valueNo').html();
				var url = parent.find('.url').html();
				var date = parent.find('.date_created').html();
				var yearIndex = date.indexOf('T');
				date = date.substr(0, yearIndex+1);
				date = '+0000000' + date + '00:00:00Z';

				var resources = [];
				resources.push( new resource( url, 'P854', 'url' ) );
				resources.push( new resource( date, 'P813', 'time' ) );
								
				var status = parent.find('.status');
				status.html(config.loading_gif);
				
				var currentAnn = new annotation( item, prop, value, resources, status );
				Bajo.checkIfClaimExists( currentAnn, Bajo.pushFinally );
				if ( i == lengthChecked - 1 )
					$('.push').html('Pushed');
			});
		});
	},

	checkIfClaimExists: function( o, cb ) {
		var ids = o.item;
		var prop = o.prop;
		var target = o.value;

		$.getJSON( config.wd_api + '?callback=?', {
			action: 'wbgetentities',
			ids: ids,
			format: 'json',
			props: 'claims|info'
		}, function ( d ){
			console.log(d);
			var claims = ((((d.entities||{})[ids]||{}).claims||{})[prop]) ;
			
			if ( typeof claims == 'undefined' ) {
				console.log( ids + " has no claims for " + prop ) ;
				cb(o);
				return ;
			}
			
			var statement_id ;
			
			$.each ( (claims||[]) , function ( k , v ) {
				var nid = (((((v||{}).mainsnak||{}).datavalue||{}).value||{})['numeric-id']) ;
				
				if ( typeof nid == 'undefined' ) {
					cb(o);
					return ;
				}
				nid = 'Q' + nid ;
				
				if ( nid == target ){
					o.status.html("Property with same target already exists<span class='reference_status'>, now pushing references</span>"); 
					statement_id = v.id;
					cb(o, statement_id, d.entities[ids]['lastrevid']);
					return ; // No need to push so
				}
				
				return false ; // Got one
			} ) ;
			
			if ( typeof statement_id == 'undefined' ) {
				o.status.html( prop + " exists for " + ids + ", but no target " + target + "Pushing Now" ) ;
				cb(o);
				return ;
			}
		});

	},

	pushFinally: function( o ) {
		var params = {
			action: 'set_claims',
			ids: o.item,
			prop: o.prop,
			target: o.value,
			botmode: 1
		};

		$.getJSON ( config.api_root, params, function ( d ) {
			console.log(d);
			
			if ( d.error == 'OK' ) {
				o.status.html(
					'The <a title="Claim" href="' +  
					self.config.wd_base + o.item + '#' + o.prop + '" target="_blank">claim</a> has been pushed. <span class="reference_status">'
					+ 'Adding references now</span>'
				);

				var claimId = d.res.claim.id;
				var revId = d.res.pageinfo.lastrevid;
				console.log(claimId + revId);
				
				Bajo.setReference( o, claimId, revId );
			} else{
				o.status.html('<span class="error">Failed to push</span>');
			}
		}).fail( function () {
			o.status.html('<span class="error">Failed to push</span>');
		});

	},

	setReference: function( o , claimId, revId ){
		var params = {
			action: 'set_reference',
			statement: claimId,
			botmode: 1,
			revid: revId,
			refprop: '',
			value: '',
			datatype: ''
		}
		for( i in o.resource ){
			console.log(o.resource[i]);
			params.refprop += o.resource[i].prop + ',';
			params.value += o.resource[i].value + ',';
			params.datatype += o.resource[i].datatype + ',';
			console.log(params);
		}
		Bajo.apiAddReference( o, params );
	},

	apiAddReference: function( o, params ){
		$.getJSON( config.api_root, params, function (d) {
			console.log(d);

			if( d.error == 'OK' ) {
				console.log('reference added');
				o.status.find('.reference_status').html('References have been added');
			}
		});
	},

	addAnnotationToMainView: function( ann ) {
	}
}

/* Sets config */
Bajo.setConfig();
// Bajo.setReference();
// Bajo.getAnnotations(Bajo.handleAnnotations);

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
});	
