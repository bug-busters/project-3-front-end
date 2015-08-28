'use strict';
// url root

var sa = 'http://localhost:8000';

require(['cart', 'authenticate', 'navigation', 'stripe'], function(cartModule, authModule, navModule, stripeModule) {
	// Handlebars helper function for formatting currency.
	Handlebars.registerHelper('currency', function(price) {
		return '$' + price.toFixed(2);
	});

	console.log('cart module: ', cartModule);
	console.log('auth module: ', authModule);

	$(document).ready(function() {

		var localCart = {};

		if (simpleStorage.get('user_info')) {
			$('#login-register').hide();
			$('#nav-logout').show();
			$('#nav-past-orders').show();
			$('#nav-account').show();
		} else {
			$('#nav-logout').hide();
			$('#login-register').show();
			$('#nav-past-orders').hide();
			$('#nav-account').hide();
		}

		$.ajaxSetup({
			xhrFields: {
				withCredentials: true
			}
		});

		$('#page').on('change', 'input[type="number"]', function(e) {
			console.log('e: ', e);
			cartModule.onChangeValue($(this));
		});

		// user register
		$('#register').on('click', function(event) {
			authModule.register(event);
		});

		// User Login
		$('#login').on('click', function(event) {
			authModule.login(event);
		});
		// user log out
		// TODO Check if they are logged in
		// TODO Delete session
		$('#nav-logout').on('click', function(event) {
			authModule.logout();
		});

		$('#nav-cart').on('click', function(event) {
			navModule.navCart();
		});

		$('#nav-past-orders').on('click', function(event) {
			navModule.navPastOrders();
		});

		$('#nav-account').on('click', function(event) {
			navModule.navAccount();
		});

		// delete User
		$('#page').on('click', '#delete_account', function(event) {
			authModule.deleteUser();
		});

		// populate simpleStorage cart
		$('#page').on('click', '.buy', function(event) {
			cartModule.buyHandler($(this));
		});

		// prompt for login and update cart
		$('#page').on('click', '.checkout', function(event) {
			navModule.navCart();
		});

		$('#page').on('click', '#stripe-test', function(event) {
			// event.preventDefault();
			// console.log('stripe test button clicked');
			stripeModule.createCharge();
		});
	});
	//--------end document ready-------------

	// load products on index.html
	$.ajax(sa + '/products', {
		contentType: 'application/json',
		processData: false,
		dataType: 'json',
		method: 'GET'
	}).done(function(data, textStatus, jqxhr) {
		// console.log(data);
		var productsIndexTemplate = Handlebars.compile($('#products-index-template').html());
		var productsList = productsIndexTemplate({
			products: data
		});
		// populate index.html with products from db
		$('#page').html(productsList);

		// $('input[type=number]').on('change', function() {
		// 	cartModule.onChangeValue(this);
		// });
	}).fail(function(jqshr, textStatus, errorThrown) {
		console.log('products index failed');
	});
});
