/*jshint esversion: 6 */

var app = app || {};


(function(){


	app.SearchView = Backbone.View.extend({

		el: '.search-app', 	
		template : _.template($('#search_template').html()),

		initialize: function() {

			app.appview = new app.AppView();
			this.render();
		},

		render: function() {
			this.$el.find('#results').html('');

			if(app.SearchedFoods.models.length > 0){

				app.SearchedFoods.models.forEach(function(model) {

					this.$el.find('tbody').append(this.template(model.toJSON()));

				}.bind(this));
			}else{
				this.$el.find('tbody').html('');
			}
			return this;
		},

		events: {
			'keyup #foodName' : 'lookForFoods',
			'click .add-button' : 'addFood'
		},

		lookForFoods : function(){
			var food = $('#foodName').val().split(' ').join();
			if(food.length > 0 && food != ' '){
				var nutrXUrl = `https://api.nutritionix.com/v1_1/search/${food}?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=38e9b898&appKey=674f526031aa68144af92428d45228de`;
				this.$el.find('tbody').html('<img src="img/loading.gif"></img>');
				// to test out the loading image
				// setTimeout(()=>{
				$.getJSON(nutrXUrl, (data)=>{

					app.SearchedFoods = new app.FoodList([]);
					var index = 0;
					data.hits.forEach((ele)=>{
						var name = ele.fields.item_name;
						var brand = ele.fields.brand_name;
						var calories = ele.fields.nf_calories;
						app.SearchedFoods.push(new app.Food({name:name, brand: brand, calories: calories, id: index}));
						index++;
						
					});

					this.render();
				}).fail((error)=>{alert('Couldnt reach nutritionix');});
			// }, 3000 );

			}else{
				app.SearchedFoods = new app.FoodList([]);
				this.render();
			}
			app.appview.render();
		},


		addFood : function(event){
			var food_id = event.target.id;
			app.foodList.models.push(app.SearchedFoods.models[food_id]);
			localStorage.setItem('foods', JSON.stringify(app.foodList.models));
			app.SearchedFoods = new app.FoodList([]);
			app.appview.render();
			this.render();
		}
	});


})();