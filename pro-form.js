var ProForm = Class.create({
	initialize: function(name, attr, options){
		this.attr = Object.extend({
			id: name,
			action: '',
			method: 'post'
		}, attr || {});
		
		this.options = Object.extend({
			labelMaker: function(str){
				return str.gsub('_', ' ').ucwords() + ': ';
			}
		}, options || {});		
		
		this.form = new Element('form', this.attr);
		this.id = this.attr.id;
		this.set = false;
	},
	
	_buildAttr: function(name, attr){
		
		var attr = Object.extend({
			id: name,
			name: name,
			value: '',
			label: true
		}, attr || {});
		
		var label = attr.label;
		delete attr.label;
		if(label){
			this._label(attr.id, label);
		}
		
		return attr;
	},
	
	/**
	 * Used to generate input elements
	 */
	_input: function(type, name, attr){
		
		var input = new Element('input', this._buildAttr(name, Object.extend({
			type: type
		}, attr)));
		
		return input;			
	},
	
	hidden: function(name, value){
		this.form.insert(this._input('hidden', name, {value: value, label: false}));			
		return this;			
	},
	/**
	 * an input text
	 */
	text: function(name, attr){
		this._insert(this._input('text', name, attr));			
		return this;
	},
	
	checkbox: function(name, attr){
		var name = name + '[]';

		this._insert(this._input('checkbox' ,name, attr));

		return this;
	},
	
	radio: function(name, attr){
		this._insert(this._input('radio', name, attr));			
		return this;		
	},
	
	textarea: function(name, attr){

		var attr = this._buildAttr(name, attr);
		
		var value = attr.value;
		delete attr.value;
		
		var textarea = new Element('textarea', attr);
		
		this._insert(textarea.setValue(value));
		return this;
	},		
	
	submit: function(name, attr){
		this._insert(this._input('submit', name, attr));
		return this;			
	},
	
	fieldset: function(text, attr){
		if(text === false){
			this.form.insert(this.set);
			this.set = false;
			return this;
		}
		this.set = new Element('fieldset', attr || {});
		var legend = new Element('legend');
		this.set.insert(legend.update(text));
		return this;
	},
	
	_label: function(forElem, label){
		
		if(label === true){
			var label = this.options.labelMaker(forElem);
		}
		
		var l = new Element('label', {
			'for': forElem
		});
		
		l.update(label);

		this._insert(l);

	},
	
	_insert: function(item){
		if(this.set){
			this.set.insert(item);
		} else {
			this.form.insert(item);
		}
	},
	
	/**
	 * Returns the full form
	 */
	get: function(){
		return this.form;
	},
	
	/**
	 * Prototype form.request()
	 */
	request: function(options){
		this.sentRequest = this.form.request(options);
		return this;
	}
});


Object.extend(String.prototype, (function(){
	
	function ucwords(){
		var str = this;
	    // Uppercase the first character of every word in a string  
	    // 
	    // version: 909.322
	    // discuss at: http://phpjs.org/functions/ucwords
	    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	    // +   improved by: Waldo Malqui Silva
	    // +   bugfixed by: Onno Marsman
	    // *     example 1: ucwords('kevin van zonneveld');
	    // *     returns 1: 'Kevin Van Zonneveld'
	    // *     example 2: ucwords('HELLO WORLD');
	    // *     returns 2: 'HELLO WORLD'
	    return (str+'').replace(/^(.)|\s(.)/g, function ( $1 ) { return $1.toUpperCase( ); } );
	}
	
	return {
		ucwords: ucwords
	}
})());