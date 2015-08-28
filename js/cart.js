'use strict';

define(function() {

	var localCart = {};

	var cart = {};
	// create new cart in database
	cart.createCart = function() {
		simpleStorage.set('cart', JSON.stringify(localCart));
		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'POST',
				data: JSON.stringify({
					products: simpleStorage.get('cart')
				}),
				header: {
					user_id: simpleStorage.get('user_info').user_id
				}
			})
			.done(function(response) {
				simpleStorage.set('user_info', {
					user_id: simpleStorage.get('user_info').user_id,
					hasCart: true
				});
				console.log('Cart created');
			})
			.fail(function(response) {
				console.error(response);
			});
	};
	// update cart in database
	cart.updateCart = function() {
		simpleStorage.set('cart', JSON.stringify(localCart));

		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				// dataType: 'json',
				method: 'PATCH',
				data: JSON.stringify({
					products: simpleStorage.get('cart')
				}),
				header: {
					user_id: simpleStorage.get('user_info').user_id
				}
			})
			.done(function(response) {
				console.log('Cart updated');
			})
			.fail(function(response) {
				console.error(response);
			});
	};

	// change value for HTML input element
	cart.onChangeValue = function(element) {
		console.log('onchangevalue');

		var sku = $(element).attr('id');
		var qt = $(element).val();
		localCart[sku] = qt;

		//create or update simpleStorage cart
		simpleStorage.set('cart', localCart);

		//update database cart only if the user is logged in
		if (simpleStorage.get('user_info')) {
			if (!simpleStorage.get('user_info').hasCart) {
				this.createCart();
			}
			this.updateCart();
		}
	};

	// click event for buy
	cart.buyHandler = function(button) {
		console.log('purchase clicked');
		var qt = button.prev('input').val();
		button.prev('input').val(++qt);
		var sku = button.attr('id');
		localCart[sku] = qt;

		//create or update simpleStorage cart
		simpleStorage.set('cart', localCart);

		//update database cart only if the user is logged in
		if (simpleStorage.get('user_info')) {
			if (simpleStorage.get('user_id')) {
				this.createCart();
			}
			this.updateCart();
		}
	};

	cart.finalCheckoutHandler = function() {

		// check if user is logged in
		if (!simpleStorage.get('user_info').user_id) {
			alert('You must login or register to checkout!');
			$('#loginModal').modal('show');
		}

		// TO DO
		// call STRIPE CHECKOUT FUNCTIONS IF USER LOGGED IN

	};

	return cart;

});
