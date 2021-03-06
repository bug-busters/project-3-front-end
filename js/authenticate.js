'use strict';

define(['cart'], function(cartModule) {
  return {
    register : function(event) {
      event.preventDefault();

      $.ajax(sa + '/signup', {
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          firstName: $('#first-name').val(),
          lastName: $('#last-name').val(),
          email: $('#reg_email').val(),
          password: $('#reg_password').val(),
          phone_number: $('#phone').val()
        }),
        method: 'POST'
      }).done(function(data, textStatus, jqxhr) {
        $('#nav-logout').show(); // show logout button
        $('#nav-account').show(); // show account info button
        $('#login-register').hide(); // hide login button
        $('#nav-past-orders').show(); // show order history nav link
        console.log('Register successful.');
        simpleStorage.set('user_info', data);
        cartModule.createCart();
      }).fail(function(jqshr, textStatus, errorThrown) {
        // console.log(jqshr);
        alert('Registration failed. Please use correct email and password.');
      });
    },

    login : function(event) {
      event.preventDefault();
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
        // TODO merge carts function
        // Get cart from DB
        // Compare with simpleStorage
        // save the merged cart in simpleStorage cart
        console.warn('login successful');
        $('#nav-logout').show(); // show logout button
        $('#nav-account').show(); // show account info button
        $('#login-register').hide(); // hide login button
        $('#nav-past-orders').show(); // show order history nav link

        console.log('login done. data: ', data);
        simpleStorage.set('user_info', data);
        // automatically log user in when they register
        console.log(simpleStorage.get('user_info'));
        // create cart if user has no cart
        if (!simpleStorage.get('user_info').hasCart) {
          cartModule.createCart();
        }

      }).fail(function(jqshr, textStatus, errorThrown) {
        console.log(jqshr);
        alert('Login failed. Please use correct email and password.');
      });
    },

    logout: function() {
      simpleStorage.flush();
      location.reload();
      $('#nav-logout').hide(); // show logout button
      $('#nav-account').hide(); // hide account info button
      $('#login-register').show(); // hide login button
      $('#nav-past-orders').hide(); // hide prompt to login
    },

    deleteUser : function() {
      console.log('user delete btn clicked');

      $.ajax(sa + '/users/' + simpleStorage.get('user_info').user_id, {
        contentType: 'application/json',
        processData: false,
        method: 'DELETE'
      }).done(function(data, textStatus, jqxhr) {
        console.warn('user delete successful');
        simpleStorage.flush();
        $('#nav-logout').hide();
        $('#nav-account').hide();
        $('#login-register').show();
        $('#nav-past-orders').hide();
      }).fail(function(jqshr, textStatus, errorThrown) {
        console.log(jqshr);
        alert('User delete failed.');
      });
    }
  }
});


