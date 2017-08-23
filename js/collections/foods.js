/*jshint esversion: 6 */

var app = app || {};

(function(){
	app.FoodList = Backbone.Collection.extend({
		model: app.Food,
		saveFoodToLocalStorage: function(){

			localStorage.setItem('foods', JSON.stringify(app.foodList));

		},
		loadFoodFromLocalStorage: function(){
			let storedFood = JSON.parse(localStorage.getItem('foods'));
			for(var i = 0; i < storedFood.length;i++){
				app.foodList.push(new Food({name: storedFood[i].name, calories: storedFood[i].nf_calories, brand: storedFood[i].brand}));
			}
		}
	});

	app.foodList = new app.FoodList([]);
})();