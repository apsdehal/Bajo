/* Creating a global object */

var Bajo = {
	/* Variable for storing config */
	config: null,
	
	/**
	 *	Helper for setting the config variable, gets config,json and sets it to config
	 */	
	setConfig: function(){
		var self = this;
		$.getJSON('/config/config.json', function(data){
			self.config = data;
		}).done( function(){
			/**
			 * Add the ajaxRoot to each ajax request
			 */
			$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
			  //Some urls may actually be complete
			  if(options.url.substr(0,4)!='http')
				options.url=self.config.api_root+options.url;  
			});
		});
	},
}

/* Sets config */
Bajo.setConfig();

/* Hooks */
$(".login button").click( function(){
	$(this).html('Loading ...');
})	