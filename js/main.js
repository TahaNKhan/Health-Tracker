$(function(){
	var Food = Backbone.Model.extend({
		defaults:{
			name: 'food',
			calories: 100
		},
		// constructor-ish

		getName: function(){
			return this.get('name');
		},
		getCalories: function(){
			return this.get('calories');
		}
	});
	
	var foodList = Backbone.Collection.extend({
		model: Food,


	});

	// TODO: Use a DB instead of static items

	var foods = new	foodList([
		new Food({name: 'egg', calories: 100}),
		new Food({name: 'toast', calories: 200}),
		]);




	var foodView = Backbone.View.extend({
		results:'#results',
		allItems:'#items',
		total: '#totalCalories',

		initialize: function() {
			this.render();
		},


		events: {
			'keypress #foodName' : 'lookForFoods'
		},

		render: function(){

			// put results from api here
			console.log()
			this.$el.html('<li>' + foods.models[0].get('name')  + '</li>');
			var totals = 0;
			for(var i = 0; i < foods.models.length;i++){
				var food = foods.models[i];
				$(this.allItems).html($(this.allItems).html() + '\n<li>' + food.get('name') + ' : ' + food.get('calories') + ' calories. </li>')
				totals += foods.models[i].get('calories');
			}
			$(this.total).html(totals);

		},

		lookForFoods : function(){
			var nutrXUrl = 'https://api.nutritionix.com/v1_1/search?appKey=674f526031aa68144af92428d45228de&appId=38e9b898&item_name=';

		}
	});

	var foodView = new foodView();

});

