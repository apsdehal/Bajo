( function (QUnit, $, Bajo) {

QUnit.module('fetch');

Qunit.test( 'Is WAL working', 1, function ( assert ) {
	var waf_status_length = $('.waf-status').length;
	assert.ok( waf_status_length > 0, 'WAF has returned some status, i.e. WAF is working' );
});

QUnit.asyncTest( 'Annotations are being fetched', 2, function (assert) {
	Bajo = Bajo || {};

	//Set my own notebook for testing purposes
	Bajo.notebooks = ['8dcf39e0'];

	var tester = function( anns ) {
		assert.ok('Callback is getting called');

		var whatShouldBe = {

		};

		assert.same( anns, whatShouldBe, 'We are getting correct objects');
	}
});

} (QUnit, jQuery, Bajo) )