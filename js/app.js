'use strict';
// url root
var sa = 'http://localhost:8000';

// Handlebars helper function for formatting currency.
Handlebars.registerHelper('currency', function(price) {
	return '$' + price.toFixed(2);
});

var localCart = {};

// create new cart in database
var createCart = function() {
	simpleStorage.set('cart', JSON.stringify(localCart));

	$.ajax(sa + '/cart/' + simpleStorage.get('user_info'), {
			contentType: 'application/json',
			processData: false,
			dataType: 'json',
			method: 'POST',
			data: JSON.stringify({
				user_id: simpleStorage.get('user_info').user_id,
				products: simpleStorage.get('cart')
			}),
			header: {
				user_id: parseInt(simpleStorage.get('user_info').user_id)
			}
		})
		.done(function(response) {
			console.log('Cart created');
		})
		.fail(function(response) {
			console.error(response);
		});
};

// update cart in database
var updateCart = function() {
	simpleStorage.set('cart', JSON.stringify(localCart));

	$.ajax(sa + '/cart/' + simpleStorage.get('user_info'), {
			contentType: 'application/json',
			processData: false,
			// dataType: 'json',
			method: 'PATCH',
			data: JSON.stringify({
				user_id: simpleStorage.get('user_info').user_id,
				products: simpleStorage.get('cart')
			}),
			header: {
				user_id: parseInt(simpleStorage.get('user_info').user_id)
			}
		})
		.done(function(response) {
			console.log('Cart updated');
		})
		.fail(function(response) {
			console.error(response);
		});
};

// change value for HTML input element
var onChangeValue = function(element) {
	console.log('onchangevalue');
	var sku = $(element).attr('id');
	var qt = $(element).val();
	localCart[sku] = qt;
	//update database cart only if the user is logged in
	if (simpleStorage.get('user_info')) {
		if (simpleStorage.get('user_info').hasCart === false) {
			createCart();
		}
		updateCart();
	}
};

$(document).ready(function() {

	$('#logout').hide();

	$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		}
	});

	// user register
	$('#register').on('click', function(event) {
		event.preventDefault();

		$.ajax(sa + '/signup', {
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				firstName: $('#first-name').val(),
				lastName: $('#last-name').val(),
				email: $('#reg_email').val(),
				password: $('#reg_password').val(),
				phone_number: $('#phone').val(),
				is_admin: false //This needs to be removed and set automatically to false in the back end for security reasons in the back end. Users could edit this line in their console to true and mess with the web site.
			}),
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			$('#logout').show(); // show logout button
			$('#login-register').hide(); // hide login button
			$('#order-hist-msg').hide(); // hide prompt to login
			console.log('Register successful.');
			simpleStorage.set('user_info', data);
		}).fail(function(jqshr, textStatus, errorThrown) {
			// console.log(jqshr);
			alert('Registration failed. Please use correct email and password.');
		});
	});

	// User Login
	$('#login').on('click', function(e) {
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
			//TODO merge carts function
			// Get cart from DB
			// Compare with simpleStorage
			// save the merged cart in simpleStorage cart

			console.warn('login successful');
			// console.log('Data: ', data);
			// console.log('Data.hasCart: ', data.hasCart);
			$('#logout').show(); // show logout button
			$('#login-register').hide(); // hide login button
			$('#order-hist-msg').hide(); // hide prompt to login
			console('login done. data: ' + data);
			simpleStorage.set('user_info', data);
			// create cart if user has no cart
			if (simpleStorage.get('user_info').hasCart === false) {
				createCart();
			}
		}).fail(function(jqshr, textStatus, errorThrown) {
			console.log(jqshr);
			alert('Login failed. Please use correct email and password.');
		});
		e.preventDefault();
	});

	// user log out
	// TODO Check if they are logged in
	// TODO Delete session
	$('#logout').on('click', function() {
		$.ajax(sa + '/logout', {
			contentType: 'application/json',
			processData: false,
			method: 'POST'
		}).done(function(data, textStatus, jqxhr) {
			simpleStorage.flush();
			$('#logout').hide(); // show logout button
			$('#login-register').show(); // hide login button
			$('#order-hist-msg').show(); // hide prompt to login
		}).fail(function(jqshr, textStatus, errorThrown) {
			console.log('logout failed');
		});
	});

	// populate simpleStorage cart
	$('#products-index').on('click', '.purchase', function() {
		console.log('purchase clicked');
		var qt = $(this).prev('input').val();
		$(this).prev('input').val(++qt);
		var sku = $(this).attr('id');
		localCart[sku] = qt;
		// simpleStorage.set(sku, qt);
		if (simpleStorage.get('user_info')) {
			if (simpleStorage.get('user_info').hasCart === false) {
				createCart();
			}
			updateCart();
		}
	});

	// prompt for login and update cart
	$('#products-index').on('click', '.checkout', function() {
		var inputs = $('input[type=number]');
		var cart = {};

		for (var i = 0; i < inputs.length; i++) {
			var sku = inputs[i].attributes.id.value;
			if (inputs[i].value > 0) {
				cart[sku] = $('input[id=' + sku + ']').val();
			}
		}

		simpleStorage.set('cart', JSON.stringify(cart));
		//console.log('simpleStorage.get("cart")', simpleStorage.get('cart'));

		console.log(simpleStorage.get('cart'));

		window.location.href = 'shopping-cart.html';
	});

	$('#testbutton').on('click', function() {
		createCart();
		console.log('testbutton clicked');
	});

	$('#getpagedata').on('click', function() {
		updateCart();
	});
});
//--------end document ready-------------

// Handlebars template for products index.
var productsIndexTemplate = Handlebars.compile($('#products-index-template').html());

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

	$('input[type=number]').on('change', function() {
		onChangeValue(this);
	});
}).fail(function(jqshr, textStatus, errorThrown) {
	console.log('products index failed');
});

// Handlebars template for shopping cart.
var cartTemplate = Handlebars.compile($('#cart-template').html());

// load shopping cart on shopping-cart.html
$.ajax(sa + '/cart/' + simpleStorage.get('user_info'), {
	contentType: 'application/json',
	processData: false,
	dataType: 'json',
	method: 'GET'
}).done(function(data, textStatus, jqxhr) {
	$('#cartTable').html(cartTemplate({
		products: data
	}));
	console.log('Cart shown');
	console.log(data);
}).fail(function(jqshr, textStatus, errorThrown) {
	console.error(errorThrown);
});

// // Handlebars template for order history.
// var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());

// ----- code to be used for the shopping cart
// -----
// if (!cartJSON.user_id) {
//      $('#loginModal').modal('show');
// }

// console.log('simpleStorage.get("cart")', simpleStorage.get('cart'));

// cartJSON.user_id = simpleStorage.get('user_info');
// createCart();
// console.log("end of event handler");
