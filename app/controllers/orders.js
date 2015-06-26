import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  queryParams: ['status'],

  selectedPrice: null,
  selectedStatus: null,

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
    return ENV.APP.serviceURL + '/orders/invoice_data.html' + params;

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

    var that = this;

    this.store.save('order', o).then(
      function(response) {

        console.log(response);
        that.send('refreshModel');
        that.set('importData', null);

      },
      function(error) {

        console.log('gick int att spara order');

      }
    );
  },


  // this is just a dummy function
  updateOrders: function() {

    var o1 = {
      id: 1,
      lf_number: data.ill_requests[0].lf_number,
      json: data,
      price: this.get('selectedPrice.value'),
      invoiced: false
    };

    var o2 = {
      id: 2,
      lf_number: data.ill_requests[0].lf_number,
      json: data,
      price: this.get('selectedPrice.value'),
      invoiced: false
    };

    var orders = {1: o1, 2: o2};

  },

  actions: {

    createOrder: function() {

      console.log('createOrder');

      this.createOrder();

    },

    deleteOrder: function(id) {

      var that = this;

      this.store.destroy('order', id).then(
        function(response) {

          that.send('refreshModel');

        },
        function(error) {


        }
      )
    },

    markOrderAsDone: function(id) {

      var that = this;

      var o = {id: id, invoiced: true};

      this.store.save('order', o).then(
        function(response) {
          that.send('refreshModel');
        },
        function(error) {


        }
      )
    }
  }
});
