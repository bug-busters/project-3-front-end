'use strict';

define(function() {

  var localCart = {};

  var cart = {};
    // create new cart in database
    cart.createCart = function() {
      simpleStorage.set('cart', JSON.stringify(localCart));
      $.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
          contentType: 'application/json',
          processData: false,
          dataType: 'json',
          method: 'POST',
          data: JSON.stringify({
            products: simpleStorage.get('cart')
          }),
          header: {
            user_id: simpleStorage.get('user_info').user_id
          }
        })
        .done(function(response) {
          simpleStorage.set('user_info', {
            user_id: simpleStorage.get('user_info').user_id,
            hasCart: true
          });
          console.log('Cart created');
        })
        .fail(function(response) {
          console.error(response);
        });
    };
    // update cart in database
    cart.updateCart = function() {
      simpleStorage.set('cart', JSON.stringify(localCart));

      $.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
          contentType: 'application/json',
          processData: false,
          // dataType: 'json',
          method: 'PATCH',
          data: JSON.stringify({
            products: simpleStorage.get('cart')
          }),
          header: {
            user_id: simpleStorage.get('user_info').user_id
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
    cart.onChangeValue = function(element) {
      console.log('onchangevalue');

      var sku = $(element).attr('id');
      var qt = $(element).val();
      localCart[sku] = qt;
      //update database cart only if the user is logged in
      if (simpleStorage.get('user_info')) {
        if (!simpleStorage.get('user_info').hasCart) {
          this.createCart();
        }
        this.updateCart();
      }
    };

    // click event for buy
    cart.buyHandler = function() {
      console.log('purchase clicked');

      var qt = $(this).prev('input').val();
      $(this).prev('input').val(++qt);
      var sku = $(this).attr('id');
      localCart[sku] = qt;
      //update database cart only if the user is logged in
      if (simpleStorage.get('user_info')) {
        if (simpleStorage.get('user_id')) {
          this.createCart();
        }
        this.updateCart();
      }
    };

    cart.checkoutHandler = function() {
      console.log("checkout clicked");
      var inputs = $('input[type=number]');
      var cart = {};

      for (var i = 0; i < inputs.length; i++) {
        var sku = inputs[i].attributes.id.value;
        if (inputs[i].value > 0) {
          cart[sku] = $('input[id=' + sku + ']').val();
        }
      }
      simpleStorage.set('cart', JSON.stringify(cart));
      console.log(simpleStorage.get('cart'));

      // check if user is logged in
      if (simpleStorage.get('user_info').user_id) {
        // load shopping cart on shopping-cart.html
        $.ajax(sa + '/cart/' + simpleStorage.get('user_info').user_id, {
          contentType: 'application/json',
          processData: false,
          dataType: 'json',
          method: 'GET'
        }).done(function(data, textStatus, jqxhr) {
          var cartTemplate = Handlebars.compile($('#cart-template').html());
          $('#page').html(cartTemplate({
            // data
          }));
          console.log('Cart shown');
          console.log(data);
        }).fail(function(jqshr, textStatus, errorThrown) {
          console.error(errorThrown);
        });
      } else { // if the user is not logged in get the cart from simpleStorage
        var cartTemplate = Handlebars.compile($('#cart-template').html());
        var data = simpleStorage.get('cart');
        $('#page').html(cartTemplate({
          // data
        }));
      }
    };

  return cart;
});
