/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'illbill-ember',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      defaultLocale: 'sv'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.APP.serviceURL = 'http://localhost:3000/v1';
    // ENV.APP.authenticationBaseURL = 'http://guppi-test.ub.gu.se/session';
    ENV.contentSecurityPolicyHeader = 'Disabled-Content-Security-Policy';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production-live') {
    ENV.APP.serviceURL = '<backend live server name>';
    ENV.APP.authenticationBaseURL = '<backend live authentication server name>';
  }

  if (environment === 'production-test') {
    ENV.APP.serviceURL = 'http://illbill-server-test.ub.gu.se/v1';
    // ENV.APP.authenticationBaseURL = 'https://guppi-test.ub.gu.se/session';
  }
  return ENV;
};
