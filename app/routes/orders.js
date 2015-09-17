import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    status: {
      refreshModel: true
    },
    sigel: {
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
    controller.set('model', model.orders);
    controller.set('sigels', model.sigels);

  },

  beforeModel: function(transition) {

    if (!transition.queryParams.status) {
      this.transitionTo({queryParams: {status: 'todo'}});
    }

    Ember.$('body').addClass('loading');

  },

  model: function(params) {

    var p = {};

    if (params.status) {
      p.status = params.status;
    }
    if (params.sigel) {
      p.sigel = params.sigel;
    }

    return Ember.RSVP.hash({
      orders: this.store.find('order', p),
      sigels: this.store.find('sigel')
    });

  },

  afterModel: function() {

    Ember.$('body').removeClass('loading');

  },

  actions: {

    refreshModel: function() {

      this.refresh();

    }
  }


});
