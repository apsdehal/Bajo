( function ( QUnit, $, Bajo ) {

QUnit.module('fetch');

//#1
Qunit.test( 'Is WAL working', 1, function ( assert ) {
	var waf_status_length = $('.waf-status').length;
	assert.ok( waf_status_length > 0, 'WAF has returned some status, i.e. WAF is working' );
});

//#2
QUnit.asyncTest( 'Are we able to fetch annotations?', 2, function (assert) {
	Bajo = Bajo || {};

	//Set my own notebook for testing purposes
	Bajo.notebooks = ['8dcf39e0'];

	var tester = function( anns ) {
		assert.ok( true, 'Callback is getting called' );

		var propertyNo = 'http://www.wikidata.org/wiki/Property:P18'		
		var whatShouldBe = 'image';

		ann = JSON.parse( annotations[ann][0] )['items'][propertyNo][ns.rdfs_label][0].value;

		assert.equal( anns, whatShouldBe, 'We are getting correct objects' );

		start();
	};

	Bajo.getAnnotations( tester );
});

} ( QUnit, jQuery, Bajo ) );