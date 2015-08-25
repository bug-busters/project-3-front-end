'use strict';
// url root
var sa = 'http://localhost:8000';

$(document).ready(function() {
	if (!simpleStorage.get('token')) {
		$('#logout').hide(); // show logout button
		$('#login-register').show(); // hide login button
		$('#order-hist-msg').hide(); // hide prompt to login
	}

	// user register
	$('#register').on('click', function(event) {
		$.ajax(sa + '/signup', {
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				credentials: {
					firstname: $('#first-name').val(),
					lastname: $('#last-name').val(),
					email: $('#reg_email').val(),
					password: $('#reg_password').val()
				}
			}),
			dataType: 'json',
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			simpleStorage.set('token', data.token()); //set token
			// automatically log user in when they register
		}).fail(function(jqshr, textStatus, errorThrown) {
			alert('Registration failed. Please use correct email and password.');
		});
	});

	// User Login
	$('#login').on('click', function() {
		$.ajax(sa + '/login', {
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				credentials: {
					email: $('#lg_email').val(),
					password: $('#lg_password').val()
				}
			}),
			dataType: 'json',
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			simpleStorage.set('token', data.token()); //set token
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

	// handlebars template for products index
	var productsIndexTemplate = Handlebars.compile($('#products-index-template').html());

	// handlebars template for shopping cart
	var cartTemplate = Handlebars.compile($('#cart-template').html());

	// handlebars template for order history
	var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());

});
