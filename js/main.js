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
		getFromStorage : function() {
			var storedFood = JSON.parse(localStorage.getItem('foods'));
			for(var i = 0; i < storedFood.length;i++){
				foods.push(new Food({name: storedFood[i].name, calories: storedFood[i].nf_calories, brand: storedFood[i].brand}));
			}
		},
		initialize: function() {
			if(localStorage.getItem('foods') == ''){
				localStorage.setItem('foods', JSON.stringify(foods));
			}else{
				this.getFromStorage();
			}
			this.render();
		},

		
		events: {
			'keyup #foodName' : 'lookForFoods',
			'click .add-button' : 'addFood',
			'click .remove-button' : 'removeFood'
		},

		render: function(){

			// put results from api here
			var totals = 0;
			var foodstr = '';
			for(var i = 0; i < foods.models.length;i++){
				var food = foods.models[i];
				foodstr += `<tr>
				<td>${food.get('brand')} </td>
				<td>${food.get('name')}</td>
				<td>${food.get('calories')} </td>
				<td><button class="btn btn-danger remove-button" id="${i}">Remove</button></td>
				</tr>`
				totals += foods.models[i].get('calories');
			}
			$(this.allItems).html(foodstr);
			$(this.total).html(totals);

		},

		lookForFoods : function(){
			var food = $('#foodName').val();
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
			var food_id = event.target.id;
			var nutrXUrl = `https://api.nutritionix.com/v1_1/item?id=${food_id}&appId=38e9b898&appKey=674f526031aa68144af92428d45228de&fields=item_name,brand_name,item_id,nf_calories`;
			
			$.ajax(nutrXUrl).done((data)=>{

				foods.push(new Food({name: data.item_name, calories: data.nf_calories, brand: data.brand_name}));
				localStorage.setItem('foods', JSON.stringify(foods));
				var result = $('#results');
				result.html('');
				this.render();
			});

			


		},
		removeFood : function(event){
			console.log(foods);
			foods.models.splice(event.target.id,1);
			localStorage.setItem('foods', JSON.stringify(foods));
			this.render();
		}
	});

	var foodView = new foodView();

});

