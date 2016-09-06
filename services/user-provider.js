

/**
 * `UserProvider` constructor.
 */
function UserProvider(providerName) {
	this._providerName = providerName;
} 


UserProvider.prototype.getProviderName = function() {
	return this._providerName;
}




UserProvider.prototype.getOrCreateUserByAuthInfo = function(autenticateInfo) {
	throw new Error('UserProvider#getOrCreateUserByAuthInfo must be overridden by subclass');
}

UserProvider.prototype.getOrCreateUserByEmail = function(email) {
	throw new Error('UserProvider#getOrCreateUserByEmail must be overridden by subclass');
}





module.exports = UserProvider;
