var app = app || {};


(function(){
	app.AppView = Backbone.View.extend({
		el: '.main-app',
		events: {
			'click .remove-button ' : 'removeItem'
		},
		template : _.template($('#food_template').html()),
		initialize : function(){
			if(localStorage.getItem('foods')){
				let localFoodStore = JSON.parse(localStorage.getItem('foods'));
				localFoodStore.forEach((data)=>{
					app.foodList.push(data);
				});
			} else {
				localStorage.setItem('foods', '[]');
			}
			this.render();
		},
		render: function() {
			let total = 0;
			if(app.foodList.models.length){
				this.$el.find('tbody').html('');
				app.foodList.models.forEach((model) => {
					total+=model.get('calories');
					this.$el.find('tbody').append(this.template(model.toJSON()));
				});
			}else{
				this.$el.find('tbody').html('');
			}
			this.$el.find('#totalCalories').html(total);
			return this;
		},
		removeItem: function(event){
			let index = event.target.id;
			app.foodList.models.splice(index,1);
			localStorage.setItem('foods', JSON.stringify(app.foodList.models));
			this.render();
		}
	});
})();