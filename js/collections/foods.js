/*jshint esversion: 6 */

var app = app || {};

(function(){
	app.FoodList = Backbone.Collection.extend({
		model: app.Food
	});

	app.foodList = new app.FoodList([]);
})();