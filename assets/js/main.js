/* Creating a global object */

var Bajo = {
	/* Variable for storing config */
	config: null,
	
	/**
	 *	Helper for setting the config variable, gets config,json and sets it to config
	 */	
	setConfig: function(){
		var self = this;
		$.getJSON('/config/config,json', function(data){
			self.config = data;
		});
	},
}

/* Sets config */

Bajo.setConfig();