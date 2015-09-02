'use strict';


define(function() {

	return {

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

