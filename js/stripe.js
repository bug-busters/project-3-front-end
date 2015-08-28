'use strict';

define(function() {
	var orderInfo;
	var stripe = {};

	// charge object should look like this. these are just placeholder
	// default values.
	var charge = {
		amount: 0,
		currency: 'usd',
		source:  {
			number: 4242424242424242,
			cvc: 123,
			exp_month: 3,
			exp_year: 2018
		},
		description: 'Purchase description.'
	};

	stripe.createCharge = function() {
		console.log('create charge clicked');
		charge.currency = 'usd';
		charge.description = 'Syntactic Sugar Purchase';
		charge.source.number = $('#cc-number').val();
		charge.source.exp_month =$('#exp-month').val();
		charge.source.exp_year = $('#exp-year').val();
		charge.source.cvc = $('#cvc').val();

		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
			contentType: 'application/json',
			processData: false,
			dataType: 'json',
			method: 'GET'
		})
		.done(function(response) {
			orderInfo = response;
			charge.amount = 100 * orderInfo.totals.grandTotal;
			console.log(charge);
			console.log('sending charge');
			stripe.sendCharge(charge);
		})
		.fail(function(response) {
			console.error('stripe.createCharge() error');
			console.error(response);
		});
	};

	stripe.sendCharge = function(charge) {
		$.ajax(sa + '/checkout', {
			contentType: 'application/json',
			processData: false,
			dataType: 'json',
			method: 'POST',
			data: JSON.stringify(charge)
		})
		.done(function(response) {
			// if response is successful then add cart contents to past orders
			console.log('success');
			console.log(response);
		})
		.fail(function(response) {
			console.error('stripe.sendCharge() error');
			console.error(response);
		});
	};

	return stripe;
});
