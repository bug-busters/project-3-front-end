'use strict';
// url root
var sa = 'http://localhost:8000';

// Handlebars helper function for formatting currency.
Handlebars.registerHelper('currency', function(price) {
	return '$' + price.toFixed(2);
});

$(document).ready(function() {
	var cartJSON = { products: {} };

	$('#logout').hide();

	$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		}
	});

	var createCart = function() {
		$.ajax(sa + '/cart/' + simpleStorage.get('user_id'), {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'POST',
				data: JSON.stringify(cartJSON.products),
				headers: {
					user_id: cartJSON.user_id,
				}
			})
			.done(function(response) {
				console.log('Cart created');
			})
			.fail(function(response) {
				console.erro(response);
			});
	};

	// user register
	$('#register').on('click', function(e) {
		$.ajax(sa + '/signup', {
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				firstname: $('#first-name').val(),
				lastname: $('#last-name').val(),
				email: $('#reg_email').val(),
				password: $('#reg_password').val(),
				phone_number: $('#phone').val(),
				is_admin: false //This needs to be removed and set automatically to false in the back end for security reasons in the back end. Users could edit this line in their console to true and mess with the web site.
			}),
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			// automatically log user in when they register
			$('#logout').show(); // show logout button
			$('#login-register').hide(); // hide login button
			$('#order-hist-msg').hide(); // hide prompt to login
			console.log('Register successful.');
			simpleStorage.set('user_id', data);
		}).fail(function(jqshr, textStatus, errorThrown) {
			console.log(jqshr);
			alert('Registration failed. Please use correct email and password.');
		});
		e.preventDefault();
	});

	// User Login
	$('#login').on('click', function() {
		console.log('login btn clicked');
		$.ajax(sa + '/login', {
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				email: $('#lg_email').val(),
				password: $('#lg_password').val()
			}),
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			console.warn('login successful');
			console.log('Data: ', data);
			simpleStorage.set('user_id', data);
			// automatically log user in when they register
		}).fail(function(jqshr, textStatus, errorThrown) {
			alert('Login failed. Please use correct email and password.');
		});
	});

	// user log out
	$('#logout').on('click', function() {
		$.ajax(sa + '/logout', {
			contentType: 'application/json',
			processData: false,
			headers: {
				Authorization: 'Token token=' + simpleStorage.get('token')
			},
			dataType: 'json',
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			simpleStorage.deleteKey('token'); // delete token
			// automatically log user in when they register
		}).fail(function(jqshr, textStatus, errorThrown) {
			console.log('logout failed');
		});
	});



	// Handlebars template for products index.
	var productsIndexTemplate = Handlebars.compile($('#products-index-template').html());
	console.log(productsIndexTemplate);

	// load products on index.html
	$.ajax(sa + '/products', {
		contentType: 'application/json',
		processData: false,
		dataType: 'json',
		method: 'GET'
	}).done(function(data, textStatus, jqxhr) {
		// console.log(data);
		var productsList = productsIndexTemplate({
			products: data
		});
		// populate index.html with products from db
		$('#products-index').html(productsList);

		// populate simpleStorage cart
		$('.purchase').on('click', function() {
			var qt = $(this).prev('input').val();
			$(this).prev('input').val(++qt);
			var sku = $(this).attr('id');
			simpleStorage.set(sku, qt);
		});

		// prompt for login and update cart
		$('.checkout').on('click', function() {
			console.log('clicked');
			console.log(cartJSON.user_id);
			console.log(cartJSON);
			if (!cartJSON.user_id) {
				$('#loginModal').modal('show');
			}
			// refactor
			var inputs = $('input[type=number]');
			var skus = [];
			var quantity = 0;
			// FIX ME so that it only gets sku's with vals>0
			for (var i = 0; i < inputs.length; i++) {
				skus.push(inputs[i].attributes.id.value);
			}

			skus.forEach(function(sku) {
				quantity = $('input[id=' + sku + ']').val();
				simpleStorage.set(sku, quantity);
			});

			simpleStorage.index().forEach(function(key) {
				if (!isNaN(key)) {
					cartJSON.products[key] = simpleStorage.get(key);
				}
			});

			cartJSON.user_id = simpleStorage.get('user_id');
			createCart();
		});

	}).fail(function(jqshr, textStatus, errorThrown) {
		console.log('products index failed');
	});


	// Handlebars template for shopping cart.
	var cartTemplate = Handlebars.compile($('#cart-template').html());

	// load shopping cart on shopping-cart.html
	$.ajax(sa + '/cart/' + simpleStorage.get('user_id'), {
		contentType: 'application/json',
		processData: false,
		dataType: 'json',
		method: 'GET'
	}).done(function(data, textStatus, jqxhr) {
		$('#cartTable').html(cartTemplate({data}));
		console.log('Cart shown');
		console.log(data);
	}).fail(function(jqshr, textStatus, errorThrown){
		console.error(errorThrown);
	});




	// // Handlebars template for order history.
	// var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());

});
