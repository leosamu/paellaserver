/**
 * Module dependencies.
 */
var Strategy = require('./strategy');
var ApiCallError = require('./errors/apicallerror')

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
exports.ApiCallError = ApiCallError;