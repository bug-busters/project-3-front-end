'use strict';
// url root

// var sa = 'https://syntsugar.herokuapp.com';
var sa = 'http://api.c0re.net/syntactic_sugar';

require(['cart', 'authenticate', 'navigation', 'stripe'], function(cartModule, authModule, navModule, stripeModule) {

	// Handlebars helper function for formatting currency.
	Handlebars.registerHelper('currency', function(price) {
		if(price) return '$' + price.toFixed(2);
	});

	// Handlebars helper function for formatting date.
	Handlebars.registerHelper('formatDate', function(isoDate) {
		return moment(isoDate).format('YYYY-MM-DD');
	});

	Handlebars.registerHelper('subtotal_calc', function(quantity, price) {
		var pr = price.substring(1, price.length);
		return (Number(quantity) * Number(pr)).toFixed(2);
	});

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

		// user register
		$('#register').on('click', function(event) {
			authModule.register(event);
		});

		// User Login
		$('#login').on('click', function(event) {
			authModule.login(event);
		});

		// user log out
		// TODO Delete session
		$('#nav-logout').on('click', function(event) {
			authModule.logout();
		});

		// show cart on cart navbar click
		$('#nav-cart').on('click', function(event) {
			cartModule.navCart();
		});

		// show past orders on pastorders navbar click
		$('#nav-past-orders').on('click', function(event) {
			navModule.navPastOrders();
		});

		// show user account on my account navbar click
		$('#nav-account').on('click', function(event) {
			navModule.navAccount();
		});

		// delete User
		$('#page').on('click', '#delete_account', function(event) {
			authModule.deleteUser();
		});

		// populate simpleStorage cart
		$('#page').on('click', '.buy', function(event) {
			var sku = $(this).attr('id');
			var button = $(this);
			cartModule.buyHandler(sku, button);
		});

		// populate simpleStorage cart
		$('#page').on('click', '#final-checkout', function(event) {
			cartModule.finalCheckoutHandler();
		});

		// prompt for login and update cart
		$('#page').on('click', '.checkout', function(event) {
			cartModule.navCart();
		});

		// delete cupcakes from cart
		$('#page').on('click', 'table > tbody > tr > td', function(event) {
			var sku = $(this).attr('id');
			cartModule.deleteCupcake(sku);
		});

		$('#stripe-test').on('click', function(event) {
			event.preventDefault();
			console.log('stripe test clicked');
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
