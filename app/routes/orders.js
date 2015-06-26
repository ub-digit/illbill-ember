import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    status: {
      refreshModel: true
    }
  },

  setupController:function (controller, model) {

    var prices = [
      {value: 80, label: '80 SEK'},
      {value: 160, label: '160 SEK'},
      {value: 320, label: '320 SEK'}
    ];

    var statuses = [
      {value: 'todo', label: 'Ohanterade'},
      {value: 'done', label: 'Hanterade'},
      {value: 'all', label: 'Alla'}
    ];

    controller.set('prices', prices);
    controller.set('statuses', statuses);
    controller.set('model', model);

  },

  beforeModel: function(transition) {

    if (!transition.queryParams.status) {
      this.transitionTo({queryParams: {status: 'todo'}});
    }

    Ember.$('body').addClass('loading');

  },

  model: function(params) {

    var p = {};

    if (params.status) p.status = params.status;

    return this.store.find('order', p);

  },

  afterModel: function() {

    Ember.$('body').removeClass('loading');

  },

  actions: {

    fetchOrder: function(id) {

      var that = this;

      var p = '50001';
      if (id.substring(0, p.length) === p) {
        id = id.substring(id.indexOf(p) + p.length);
      }

      Ember.$('body').addClass('loading');

      this.store.find('fetchOrder', id).then(

        function(response) {

          Ember.$('body').removeClass('loading');

          that.controllerFor('orders').set('importData', response);
          that.controllerFor('orders').set('request_id', null);
          that.controllerFor('orders').set('selectedPrice', null);

        },
        function(error) {            

        }
      )
    },

    refreshModel: function() {

      this.refresh();

    }
  }


});
