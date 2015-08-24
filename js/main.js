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
      simpleStorage.set('token', data.token();  //set token
      // automatically log user in when they register
      $('#logout').show();  // show logout button
      $('#login-register').hide();  // hide login button
      $('#order-hist-msg').hide();  // hide prompt to login
    }).fail(function(jqshr, textStatus, errorThrown){
      alert('Login failed. Please use correct email and password.');
    });
  });

  // FIX ME -- need to match credentials keys to backend db
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
    }).done(function(data, textStatus, jqxhr){
      simpleStorage.deleteKey('token'); // delete token
      // automatically log user in when they register
      $('#logout').hide();  // hide logout button
      $('#login-register').show();  // show login button
      $('#order-hist-msg').show();  // show prompt to login
    }).fail(function(jqshr, textStatus, errorThrown){
      console.log('logout failed');
    });
  });


});

