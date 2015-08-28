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
		console.log(charge);
		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
			contentType: 'application/json',
			processData: false,
			dataType: 'json',
			method: 'GET'
		})
		.done(function(response) {
			orderInfo = response;
			console.log('orderinfo');
			// console.log(orderInfo);
			charge.amount = 100 * orderInfo.totals.grandTotal;
			// console.log(charge);
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
			// console.log(response);

			// Construct object to insert into past orders.
			var order = {};
			order.products = [];
			order.userId = simpleStorage.get('user_info').user_id;
			Object.keys(orderInfo.products).forEach(function(product) {
				order.products.push(
					{
						sku: +product,
						title: orderInfo.products[product].title,
						price: +orderInfo.products[product].price,
						quantity: +orderInfo.products[product].quantity
					}
				);
			});
			order.status = 'Order being processed.';
			// console.log('order object');
			// console.log(order);

			// Refactor this later.
			if (response.status === 'succeeded') {
				$.ajax(sa + '/pastorders/' + simpleStorage.get('user_info').user_id, {
					contentType: 'application/json',
					processData: false,
					dataType: 'json',
					method: 'POST',
					data: JSON.stringify(order)
				})
				.done(function(response) {
					console.log('current order successfully inserted into past orders');
				})
				.fail(function(response) {
					console.log('current order failed to be inserted into past orders');
				});
			}

			location.reload();
			alert('Your charge has been successful. Look for cupcakes coming to a mouth near you!');
		})
		.fail(function(response) {
			console.error('stripe.sendCharge() error');
			console.error(response);
		});
	};

	return stripe;
});
