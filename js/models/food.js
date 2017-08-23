
/*jshint esversion: 6 */

var app = app || {};

(function () {
	app.Food = Backbone.Model.extend({
		defaults:{
			name: 'food',
			brand: 'branded',
			calories: 100,
			id: 0
		}
	});
})();