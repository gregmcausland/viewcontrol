
var Controller = require('../core/controller');
var Mustache   = require('../core/libs/mustache');

var todoController = Controller.extend('todoController', {

	itemTemplate: '{{#items}}<li class="list-group-item {{state}}">{{item}}<span class="pull-right"><button data-remove data-index="{{index}}" class="btn btn-xs btn-info">Delete</button> <button data-toggle data-index="{{index}}" class="btn btn-xs btn-info">toggle</button></span></li>{{/items}}',

	init: function( options ) {
		this.items = [];
		this.index = 0;
		this.elements.newItem.focus();

		$(this.elements.list)
			.on('click', '[data-remove]', this.removeItem.bind(this) )
			.on('click', '[data-toggle]', this.toggleItem.bind(this) );

		try {
			this.items = JSON.parse(localStorage['todo']).items || [];
			this.renderList();

			var top = 0;
			for ( var i=0, len=this.items.length; i<len; i++ ) {
				top = ( this.items[i].index > top ) ? this.items[i].index : top;
			}
			this.index = top + 1;
		} catch( e ) {};
	},

	addItem: function( e ) {
		e.preventDefault();

		var item = this.elements.newItem.value;
		if ( !item.length ) return;

		this.elements.newItem.value = '';
		this.items.push({ item: item, index: this.index, state: 'inactive' });
		this.index ++;
		this.renderList();
	},

	renderList: function() {
		this.elements.list.innerHTML = Mustache.render(this.itemTemplate, { items: this.items });
		localStorage.setItem('todo', JSON.stringify({ items: this.items }));
	},

	removeItem: function( e ) {
		e.preventDefault();
		var target = e.currentTarget;

		this.items.splice( this.findIndex( target.dataset.index ), 1 );
		this.renderList();
	},

	toggleItem: function( e ) {
		e.preventDefault();
		var target = e.currentTarget;
		var item = this.items[this.findIndex( target.dataset.index )];

		item.state = ( item.state === 'inactive' ) ? 'active' : 'inactive';

		this.renderList();
	},

	findIndex: function( index ) {
		for ( var i=0, len=this.items.length; i<len; i++ ) {
			if ( this.items[i].index == index ) {
				return i;
			}
		}
	}

});

module.exports = todoController;