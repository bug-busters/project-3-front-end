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
				var newQt = 1 + Number(products[key].quantity);
				console.log("newQt", newQt);

				storageCart[key].quantity = newQt;

				// FIX ME--- on buy click. all inputs get filled with cart vals.
				// but maybe this should happen on login?
				// show new qt per item in coresponding input with id-sku
				var id = '#' + key;
				id.toString();
				$(id).val(storageCart[key].quantity);

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


				// FIX ME--- on buy click. all inputs get filled with cart vals.
				// but maybe this should happen on login?
				// show new qt per item in coresponding input with id-sku
				var id = '#' + key;
				id.toString();
				$(id).val(products[key].quantity);

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


	// click event for buy
	cart.buyHandler = function(button) {
		console.log('buy button clicked');

		var qt = Number(button.prev('input').val()) + 1;
		// button.prev('input').val(qt);
		var price = button.prev('input').data('price');
		var title = button.data('name');
		var sku = button.attr('id');


		// if current clicked product is new to the cart
		if (!cart.localCart[sku]) {
			var product = {
				sku: sku,
				title: title,
				price: price,
				quantity: Number(qt)
			};
			cart.localCart[sku] = product;
		} else {
			cart.localCart[sku].quantity = qt;
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
