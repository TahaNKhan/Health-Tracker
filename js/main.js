$(function(){
	var Food = Backbone.Model.extend({
		defaults:{
			name: 'food',
			brand: 'branded',
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

	var foods = new	foodList([]);




	var foodView = Backbone.View.extend({
		self: this,
		el: '.app',
		allItems:'#items',
		total: '#totalCalories',

		initialize: function() {
			this.render();
		},


		events: {
			'keyup #foodName' : 'lookForFoods',
			'click .add-button' : 'addFood'
		},

		render: function(){

			// put results from api here
			var totals = 0;
			var foodstr = '';
			for(var i = 0; i < foods.models.length;i++){
				var food = foods.models[i];
				foodstr += `\n<li>  ${food.get('name')} : ${food.get('calories')} calories. </li>`;
				totals += foods.models[i].get('calories');
			}
			$(this.allItems).html(foodstr);
			$(this.total).html(totals);

		},

		lookForFoods : function(){
			var food = $('#foodName').val().split(' ').join();
			if(food.length > 0){
				var nutrXUrl = 'https://api.nutritionix.com/v1_1/search/' + food + '?results=0:10&fields=item_name,brand_name,item_id,nf_calories&appId=38e9b898&appKey=674f526031aa68144af92428d45228de'

				$.getJSON(nutrXUrl, function(data){


					var result = $('#results');
					result.html('');
					data.hits.forEach((ele)=>{
						result.append(`<tr>
							<td>${ele.fields.item_name} </td>
							<td>${ele.fields.brand_name}</td>
							<td> ${ele.fields.nf_calories} </td>
							<td><button class="btn btn-primary add-button" id='${ele.fields.item_id}'>Add</button></td>
							</tr>`);
					});

				}).fail((error)=>{alert('Couldnt reach nutritionix')});

			}else{
				$('#results').html('');
			}
		},
		addFood : function(event){

			var food_id = $(event.target).attr('id');
			var nutrXUrl = `https://api.nutritionix.com/v1_1/item?id=${food_id}&appId=38e9b898&appKey=674f526031aa68144af92428d45228de&fields=item_name,brand_name,item_id,nf_calories`;
			
			$.ajax(nutrXUrl).done((data)=>{

				foods.push(new Food({name: data.item_name, calories: data.nf_calories, brand: data.brand_name}));

				this.render();
			});


		}
	});

	var foodView = new foodView();

});

