'use strict';
// url root
var sa = 'http://localhost:8000';

// Handlebars helper function for formatting currency.
Handlebars.registerHelper('currency', function(price) {
	return '$' + price.toFixed(2);
});

$(document).ready(function() {
	$('#logout').hide();

	$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		}
	});

	$('#testbutton').on('click', function(event) {
		event.preventDefault();

		$.ajax(sa + '/cart', {
				contentType: 'application/json',
				processData: false,
				dataType: 'json',
				method: 'POST'
			})
			.done(function(response) {

			})
			.fail(function(response) {

			});
	});

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
			console.log(data);
			simpleStorage.set('userid', data);
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

	//
	// TODO: load products on index.html
	$.ajax(sa + '/products', {
		contentType: 'application/json',
		processData: false,
		dataType: 'json',
		method: 'GET'
	}).done(function(data, textStatus, jqxhr) {
		console.log(data);
		var productsList = productsIndexTemplate({
			products: data
		});

		$('#products-index').html(productsList);

		$('.purchase').on('click', function() {
			var qt = $(this).prev('input').val();
			$(this).prev('input').val(++qt);
			var sku = $(this).attr('id');
			simpleStorage.set(sku, qt);
			console.log(simpleStorage.get(sku));
			console.log(simpleStorage.index());
		});

	}).fail(function(jqshr, textStatus, errorThrown) {
		console.log('products index failed');
	});

	// handlebars template for products index
	var productsIndexTemplate = Handlebars.compile($('#products-index-template').html());

	// handlebars template for shopping cart
	var cartTemplate = Handlebars.compile($('#cart-template').html());

	// handlebars template for order history
	var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());
});
