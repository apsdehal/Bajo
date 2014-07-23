module('fetch');
test('Is WAL working', function(){
	expect(1);
	var waf_status_length = $('.waf-status').length;
	ok( waf_status_length > 0 );
});