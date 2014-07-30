( function ( QUnit, $, Bajo ) {

	QUnit.module( 'fetch' );

	//#1
	QUnit.test( 'Is WAL working', 1, function ( assert ) {
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

	//#4
	QUnit.asyncTest( 'checkIfClaimExists is working, in case of no claims?', 4, function ( assert ) {
		Bajo = Bajo || {};

		var o = {
			item: 'Q2336535',
			prop: 'P100',
			value: 'Q100'

		};

		var callback = function ( o ) {
			assert.equal( o.log, 'Q2336535 has no claims for P100', 'Its working' );
			assert.equal( o.item, 'Q2336535', 'Passed Item is correct' );
			assert.equal( o.prop, 'P100', 'Passed Prop is correct' );
			assert.equal( o.value, 'Q100', 'Passed Value is correct' );

			QUnit.start()
		};

		Bajo.checkIfClaimExists( o, callback );
	});

	//#5
	QUnit.asyncTest( 'checkIfClaimExists is working, in case of claim exists', 1 , function ( assert ) {
		Bajo = Bajo || {};

		var o = {
			item: 'Q2336535',
			prop: 'P106',
			value : 'Q11900058'
		};

		var BajoClone = Bajo;
		
		BajoClone.setReference = function ( o , statement_id, lastrev ) {
			assert.equal ( o.status.html, "Property with same target already exists,<span class='reference_status'>"
											+ " Now pushing references</span>", 'Its working' );
		};

		var callback = function ( o ) {
			assert.ok ( 1 == 0 ); //Failing the test
		}
		Bajo.checkIfClaimExists( o, callback );
	});

	//#6
	QUnit.test( 'Is setPushHandler working?', 1, function ( assert ) {
		Bajo = Bajo || {};

		Bajo.setPushHandler();

		var ev = $._data( element, 'events' );

		if( ev && ev.click  )  {
			ok( 1==1 , 'Its working' );
		}
	});

	//#7
	QUnit.test( 'Is pushFinally working', , function ( assert ) {
		var getJSON = $.getJSON;

		$.getJSON = function ( url, params, callback ) {
			var d = {
				error : 'OK',
				res : {
					claim : {
						id : params.id
					},
					pageinfo : {
						lastrevid : params.prop
					} 
				}
			};

			callback( d ); 
		};

		Bajo = Bajo || {};

		var o = {
			item: 'Q2336535',
			prop: 'P106',
			value : 'Q11900058',
			status : {
				html : function ( string ) {
					//Do nothing
				}
			}
		};

		var BajoClone = Bajo;
			var o = {
			item: 'Q2336535',
			prop: 'P106',
			value : 'Q11900058'
		};

		BajoClone.setReference = function ( o , claimId, revId ) {
			assert.equal( o.log, 'OK Done', 'Its working');
			assert.equal( claimId, 'Q2336535', 'Returns correct claimId');
			assert.equal( revId, 'P106', 'Returns correct revid');
		};

		BajoClone.pushFinally( o );

		$.getJSON = getJSON;
	});

} ( QUnit, jQuery, Bajo ) );