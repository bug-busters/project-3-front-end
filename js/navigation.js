'use strict';

define(function() {
	return {
		navCart: function() {
			console.log('navigation CART button clicked');

			// if (simpleStorage.get('cart') === undefined) {
			if (!simpleStorage.get('user_info') && simpleStorage.get('cart') === undefined) {
				alert("Your cupcake cart is empty :(");
				return;
			} else if (!simpleStorage.get('user_info') && simpleStorage.get('cart')) {
				// check if user is logged in
				alert('You must login or register to checkout!');
				$('#loginModal').modal('show');
			}

			$.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'GET'
			}).done(function(data, textStatus, jqxhr) {
				for (var sku in data.totals.subtotals) {
					if (data.totals.subtotals.hasOwnProperty(sku)) {
						data.products[sku].subtotal = data.totals.subtotals[sku];
					}
				}
				var cartTemplate = Handlebars.compile($('#cart-template').html());
				$('#page').html(cartTemplate({
					cart: data
				}));
				console.log('Cart shown');
				console.log(data);
			}).fail(function(jqshr, textStatus, errorThrown) {
				console.error(errorThrown);
			});
		},

		navPastOrders: function() {
			console.log('navigation PAST ORDERS button clicked');
			$.ajax(sa + '/pastorders/' + simpleStorage.get('user_info').user_id, {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'GET'
			}).done(function(data, textStatus, jqxhr) {
				var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());
				$('#page').html(pastOrdersTemplate({
					pastorder: data
				}));
				console.log('Past Orders shown');
				console.log('data: ', data);
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
