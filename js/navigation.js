'use strict';

define(function() {

	return {
		navCart: function() {
			// if user is not logged in and the cart is empty
			if (!simpleStorage.get('user_info') && simpleStorage.get('cart') === undefined) {
				alert("Your cupcake cart is empty :(");
				return;
			}

			// if the user is not logged but the cart is not empty
			else if (!simpleStorage.get('user_info') && simpleStorage.get('cart')) {
				// check if user is logged in
				console.log('CART IS NOT EMPTY simple storage cart:', simpleStorage.get('cart'));

				var cartTemplate = Handlebars.compile($('#simple-storage-cart-template').html());
				$('#page').html(cartTemplate({
					cart: simpleStorage.get('cart')
				}));
				console.log('Cart shown');
			}

			// if the user is logged and the simpleStorage cart is empty
			else if (simpleStorage.get('user_info')) {

				console.log("logged in user");
				var userDbCart = {};

				$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
					contentType: 'application/json',
					processData: false,
					dataType: 'json',
					method: 'GET'
				}).done(function(data, textStatus, jqxhr) {
					console.log("data back from the ajax: ", data);
					var prCount = Object.keys(data.products).length;

					if (prCount === 0 && simpleStorage.get('cart') === undefined) {
						alert("Your cupcake cart is empty :(");
					}

					else if (prCount === 0 && simpleStorage.get('cart') !== undefined) {
						// display the simpleStorage cart
						var cartTemplate = Handlebars.compile($('#cart-template').html());
						$('#page').html(cartTemplate({
							cart: simpleStorage.get('cart')
						}));
					}

					else if (prCount > 0 && simpleStorage.get('cart') === undefined) {
						console.log("user has cart in db, no simpleStorage cart");
						for (var sku in data.totals.subtotals) {
							if (data.totals.subtotals.hasOwnProperty(sku)) {
								data.products[sku].subtotal = data.totals.subtotals[sku];
							}
						}
						userDbCart = data;

						var cartTemplate = Handlebars.compile($('#cart-template').html());
						$('#page').html(cartTemplate({
							cart: userDbCart
						}));
					}
					else if (prCount > 0 && simpleStorage.get('cart') !== undefined) {
						// MERGE ME
						console.log("inside MERGE ME");
						cart.mergeCarts(data);
					}
				}).fail(function(jqshr, textStatus, errorThrown) {
					console.error(errorThrown);
				});
			}
		},

		navPastOrders: function() {
			console.log('navigation PAST ORDERS button clicked');
			$.ajax(sa + '/pastorders/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'GET'
			}).done(function(data, textStatus, jqxhr) {
				console.log('Past Orders shown');

				// Calculate subtotal(s) and grand total and format date.
				data.forEach(function(pastOrder) {
					pastOrder.grandTotal = 0;
					pastOrder.products.forEach(function(product) {
						product.subtotal = product.quantity * product.price;
						pastOrder.grandTotal += product.subtotal;
					});
				});

				var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());
				$('#page').html(pastOrdersTemplate({
					pastorders: data
				}));
			}).fail(function(jqshr, textStatus, errorThrown) {
				console.error(errorThrown);
			});
		},

		navAccount: function() {
			console.log('my account button clicked');
			$.ajax(sa + '/users/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'GET'
			}).done(function(data, textStatus, jqxhr) {
				console.log('User Account info shown');
				console.log('user: ', data);
				var useraccountTemplate = Handlebars.compile($('#user-account-template').html());
				$('#page').html(useraccountTemplate({data}));

			}).fail(function(jqshr, textStatus, errorThrown) {
				console.error(errorThrown);
			});
		}
	};
});
