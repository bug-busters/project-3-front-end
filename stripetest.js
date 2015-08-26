'use strict';

var stripe = require('stripe')('sk_test_qIUAG5X1c0eLOiBzX0fZwEtx');

var token = {
	number: 4242424242424242,
	cvc: 123,
	exp_month: 1,
	exp_year: 2016
};

var charge = {
	amount: 42069,
	currency: 'usd',
	source: token,
	description: 'test charge'
};

stripe.charges.create(charge, function(error, charge) {
	console.error('error');
	console.error(error);
	console.log('charge');
	console.log(charge);
});
