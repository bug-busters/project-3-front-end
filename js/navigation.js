'use strict';

define(function() {
  return {
    navCart : function() {
      console.log('navigation CART button clicked');

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
    },

    navPastOrders : function() {
      console.log('navigation PAST ORDERS button clicked');
      $.ajax(sa + '/pastorders/' + simpleStorage.get('user_id'), {
        contentType: 'application/json',
        processData: false,
        dataType: 'json',
        method: 'GET'
      }).done(function(data, textStatus, jqxhr) {
        var pastOrdersTemplate = Handlebars.compile($('#order-history-template').html());
        $('#page').html(pastOrdersTemplate({
          products: data
        }));
        console.log('Past Orders shown');
        console.log('data: ', data);
      }).fail(function(jqshr, textStatus, errorThrown) {
        console.error(errorThrown);
      });
    }
  }
});
