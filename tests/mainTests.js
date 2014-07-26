( function ( QUnit, $, Bajo ) {

QUnit.module( 'fetch' );

//#1
Qunit.test( 'Is WAL working', 1, function ( assert ) {
	var waf_status_length = $('.waf-status').length;
	assert.ok( waf_status_length > 0, 'WAF has returned some status, i.e. WAF is working' );
});

//#2
QUnit.asyncTest( 'Are we able to fetch annotations?', 2, function ( assert ) {
	Bajo = Bajo || {};

	//Set my own notebook for testing purposes
	Bajo.notebooks = ['8dcf39e0'];

	var tester = function( anns ) {
		assert.ok( true, 'Callback is getting called' );

		var propertyNo = 'http://www.wikidata.org/wiki/Property:P18'		
		var whatShouldBe = 'image';

		ann = JSON.parse( annotations[ann][0] )['items'][propertyNo][ns.rdfs_label][0].value;

		assert.equal( anns, whatShouldBe, 'We are getting correct objects' );

		QUnit.start();
	};

	Bajo.getAnnotations( tester );
});

QUnit.module( 'Page Sync and Addition' );

//#3
QUnit.asyncTest( 'Are we able to add annotations', 10, function ( assert ) {
	Bajo = Bajo || {};

	var BajoClone = Bajo;
	//Set my own notebook for testing purposes
	BajoClone.notebooks = ['8dcf39e0'];

	//Currently this is the only workaround or I should use setTimout but I won't prefer that
	BajoClone.setPushHandler = function(){
		//Start assertions
		assert.equal( $('table').length, 1, 'We have a table' );
		assert.equal( $('.annotations').length, 1, 'We have a annotations table' );
		assert.ok( $('.tableRow').length > 0 , 'We have rows' );
		assert.ok( $('.item').length > 0 ,  'We have atleast one item' );
		assert.ok( $('.prop').length > 0 ,  'We have atleast one property' );
		assert.ok( $('.value').length > 0 ,  'We have atleast one value' );
		assert.equal( $('.item')[3].html(), 'Pundit', 'Server is returning correct items' );
		assert.equal( $('.propNo')[3].html(), 'P277', 'Server is returning correct property' );
		assert.equal( $('.valueNo')[3].html(),'Q2005', 'Server is returning correct value' );
		assert.equal( $('.non-existant a').html(), 'Want to create one?', 'Bajo.getRelatedItems is working' );
		QUnit.start();
	}

	BajoClone.getAnnotations( BajoClone.handleAnnotations );


});
} ( QUnit, jQuery, Bajo ) );