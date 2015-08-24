'use strict';

$(document).ready(function () {

  // url root
  var sa = 'http://localhost:3000';

  // hide logout button until user is logged in
  $('#logout').hide();

  // FIX ME -- need to match credentials keys to backend db
  // user register
  $('#register').on('click', function() {
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
    }).done(function(data, textStatus, jqxhr){
      //set token and store
      // automatically log user in when they register
      $('#logout').show();  // show logout button
      $('#login-register').hide();  // hide login button
      $('#order-hist-msg').hide();  // hide prompt to login
    }).fail(function(jqshr, textStatus, errorThrown){
      alert('Login failed. Please use correct email and password.');
    });
  });

  // FIX ME -- need to match credentials keys to backend db
  // user login
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
    }).done(function(data, textStatus, jqxhr){
      // set token and store
      // automatically log user in when they register
      $('#logout').show();  // show logout button
      $('#login-register').hide();  // hide login button
      $('#order-hist-msg').hide();  // hide prompt to login
    }).fail(function(jqshr, textStatus, errorThrown){
      console.log('login failed');
      alert('Login failed. Please make sure your email and password are correct.');
    });
  });


});

