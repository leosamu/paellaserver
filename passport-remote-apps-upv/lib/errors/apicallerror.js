/**
 * `APICallError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [code]
 * @access public
 */
function APICallError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'APICallError';
  this.message = message;
  this.code = code;
}

// Inherit from `Error`.
APICallError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = APICallError;