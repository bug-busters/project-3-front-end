'use strict';

define(function() {

	var cart = {};

	cart.localCart = {};

	var mergeCarts = function(dbCart) {

		var storageCart = cart.localCart;
		console.log("storageCart", storageCart);
		var productsKeys = Object.keys(dbCart.products);
		console.log('productsKeys:', productsKeys);

		var products = dbCart.products;
		console.log("database products: ", products);

		for (var i = 0; i < productsKeys.length; i++) {

			var key = productsKeys[i];
			console.log('key: is :', key);
			console.log("Object.keys(storageCart):", Object.keys(storageCart));
			console.log("Object.keys(storageCart).indexOf(key)", Object.keys(storageCart).indexOf(key));

			if (Object.keys(storageCart).indexOf(key) >= 0) {
				console.log("storageCart['170431']: ", storageCart["170431"]);

				// update the quantity in the storageCart;
				var newQt = Number(storageCart[key].quantity) + Number(products[key].quantity);
				console.log("newQt", newQt);

				storageCart[key].quantity = newQt;
			}
			else {
				// create new simple storageCart entry and save it in simpleStorage

				storageCart[key] = {
					'sku': key,
					'title': products[key].title,
					'price': products[key].price,
					'quantity': products[key].quantity
				};

				cart.localCart = storageCart;
				console.log("current storage cart: ", storageCart[key]);
			}


		}
	};

	// create new cart in database
	cart.createCart = function() {

		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'POST',
				data: JSON.stringify({
					products: cart.localCart
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
		console.log("inside update cart");
		// TODO merge cart
		var dbCart = {};
		$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				// dataType: 'json',
				method: 'GET',
				header: {
					user_id: simpleStorage.get('user_info').user_id
				}
			})
			.done(function(response) {
				dbCart = response;
				console.log('dbCart', dbCart);

				mergeCarts(dbCart);

				$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
						contentType: 'application/json',
						processData: false,
						// dataType: 'json',
						method: 'PATCH',
						data: JSON.stringify({
							products: cart.localCart
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
			})
			.fail(function(response) {
				console.error(response);
			});


	};

	// change value for HTML input element
	cart.onChangeValue = function(element) {

		var sku = $(element).attr('id');
		var qt = $(element).val();
		console.log('qt', qt);
		var title = $(element).data('name');
		var price = $(element).data('price').substring(1, $(element).data('price').length);

		// if current clicked product is new to the cart
		if (!cart.localCart[sku]) {
			var product = {
				'sku': sku,
				'title': $(element).data('name'),
				'price': $(element).data('price'),
				'quantity': Number(qt)
			};
			cart.localCart[sku] = product;
		} else {
			cart.localCart[sku].quantity = qt
			;
		}

		//update database cart only if the user is logged in
		if (simpleStorage.get('user_info')) {
			if (!simpleStorage.get('user_info').hasCart) {
				this.createCart();
			}
			console.log("before update cart is called");
			this.updateCart();
		}
	};

	// click event for buy
	cart.buyHandler = function(button) {
		console.log('purchase clicked');


		var qt = Number(button.prev('input').val()) + 1;
		button.prev('input').val(qt);
		var qtVal = qt.val();
		console.log("qtVal: ", button.prev('input').val());
		var price = button.prev('input').data('price');
		var title = button.data('name');
		var sku = button.attr('id');

		// if current clicked product is new to the cart
		if (!cart.localCart[sku]) {
			var product = {
				sku: sku,
				title: title,
				price: price,
				quantity: qtVal
			};
			cart.localCart[sku] = product;
		} else {
			cart.localCart[sku].quantity = qtVal;
		}

		//update database cart only if the user is logged in
		if (simpleStorage.get('user_info')) {
			if (simpleStorage.get('user_id')) {
				this.createCart();
			}
			this.updateCart();
		}
	};

	cart.finalCheckoutHandler = function() {
		console.log('final checkout clicked');
		// TODO
		// check if user is logged in
		if (simpleStorage.get('user_info').user_id) {
			// load shopping cart on shopping-cart.html
			$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'GET'
			}).done(function(data, textStatus, jqxhr) {
				console.log('Cart shown');
				console.log(data);
			}).fail(function(jqshr, textStatus, errorThrown) {
				console.error(errorThrown);
			});
		} else { // force the user to login
			alert("You must login or register to checkout!");
			$('#loginModal').modal('show');
		}
		// call STRIPE CHECKOUT FUNCTIONS IF USER LOGGED IN
		$('#checkoutModal').modal('show');
	};

	return cart;
});
