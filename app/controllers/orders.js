import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  queryParams: ['status', 'sigel'],

  selectedPrice: null,
  errorGeneralMsg: null,
  markSelectedAsDone: false,

  isRequestIdValid: Ember.computed.notEmpty('request_id'),

  allPrices: Ember.computed.mapBy('model', 'price'),
  summedPrices: Ember.computed.sum('allPrices'),

  selectedOrders: Ember.computed.filterBy('model', 'isChecked', true),
  selectedOrderIds: Ember.computed.mapBy('selectedOrders', 'id'),
  printInvoiceDataUrl: Ember.computed('selectedOrderIds.@each', function() {

    var params = '?';
    this.get('selectedOrderIds').forEach(function(item) {
      params += 'ids[]=' + item + '&';
    });
    params = params.slice(0, params.lastIndexOf('&', 0));
    return ENV.APP.serviceURL + '/orders/invoice_data.pdf' + params;

  }),


  observeCheckAll: Ember.observer('checkAll', function() {
    this.get('model').forEach(function(item) {
      Ember.set(item, 'isChecked', this.get('checkAll'));
    }, this);
  }),


  areAnyOrdersSelected: Ember.computed.notEmpty('selectedOrderIds'),

  createOrder: function() {

    var data = this.get('importData');

    var o = {
      lf_number: data.ill_requests[0].lf_number,
      json: data,
      price: this.get('selectedPrice.value'),
      invoiced: false
    };

    this.resetErrors();

    var that = this;

    this.store.save('order', o).then(
      function(response) {

        console.log(response);
        that.send('refreshModel');
        Ember.$('.order-preview').slideToggle(250, function() {
          that.set('importData', null);
        });

      },
      function(error) {

        Ember.$('.order-preview').slideToggle(250, function() {
          that.set('importData', null);
        });
        that.setErrors(error.error.msg, error.error.errors);

      }
    );
  },

  updateOrder: function(order) {

    var that = this;

    this.store.save('order', order).then(
      function(response) {
        that.send('refreshModel');
      },
      function(error) {


      }
    );
  },

  setErrors: function(msg, errors) {

    console.log(errors);

    this.set('errorGeneralMsg', msg);

    if (errors) {
      this.set('errorSpecificMsg', errors);
    }

  },

  resetErrors: function() {

    this.set('errorGeneralMsg', null);
    this.set('errorSpecificMsg', null);

  },

  actions: {

    fetchOrder: function(id) {

      this.resetErrors();

      var that = this;

      var p = '50001';
      if (id.substring(0, p.length) === p) {
        id = id.substring(id.indexOf(p) + p.length);
      }

      Ember.$('body').addClass('loading');

      this.store.find('fetchOrder', id).then(

        function(response) {
          Ember.$('body').removeClass('loading');
          that.set('importData', response);

          that.set('request_id', null);
          that.set('selectedPrice', null);
        },
        function(error) {

          Ember.$('body').removeClass('loading');
          that.setErrors('Hittade ingen order.');
          that.set('request_id', null);

        }
      );
    },

    toggleDone: function(order) {

      console.log(order.invoiced);
      Ember.set(order, 'invoiced', !order.invoiced);
      console.log(order.invoiced);
      this.updateOrder(order);

    },

    createOrder: function() {

      this.createOrder();

    },

    deleteOrder: function(id) {

      var that = this;

      if (confirm("Vill du ta bort ordern helt?")) {

        this.store.destroy('order', id).then(
          function(response) {

            that.send('refreshModel');

          },
          function(error) {

          }
        );
      }
    },

    openLibrisOrderCard: function(id) {

      var url = 'http://iller.libris.kb.se/illse/api/illrequests/G/' + id + '?format=pdf';

      window.open(url);


    },

    printInvoiceData: function() {

      if (this.get('markSelectedAsDone')) {
        var that = this;

        this.get('selectedOrders').forEach(function(order) {
          Ember.set(order, 'invoiced', true);
          that.updateOrder(order);
        });
      }

      window.open(this.get('printInvoiceDataUrl'));

    }

  }
});
