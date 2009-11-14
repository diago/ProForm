var ProForm = Class.create({
	initialize: function(name, props, options){
		this.props = Object.extend({
			id: name,
			action: '',
			method: 'post'
		}, props || {});
		
		this.options = Object.extend({
			labelMaker: function(str){
				return str.gsub('_', ' ').ucwords() + ': ';
			}
		}, options || {});		
		
		this.form = new Element('form', this.props);
		this.id = this.props.id;
	},
	
	_buildOptions: function(name, options){
		
		var options = Object.extend({
			id: name,
			name: name,
			value: '',
			label: true
		}, options || {});
		
		var label = options.label;
		delete options.label;
		if(label){
			this._label(options.id, label);
		}
		
		return options;
	},
	
	/**
	 * Used to generate input elements
	 */
	_input: function(type, name, options){
		
		var input = new Element('input', this._buildOptions(name, Object.extend({
			type: type
		}, options)));
		
		return input;			
	},
	
	hidden: function(name, value){
		this.form.insert(this._input('hidden', name, {value: value, label: false}));			
		return this;			
	},
	/**
	 * an input text
	 */
	text: function(name, options){
		this.form.insert(this._input('text', name, options));			
		return this;
	},
	
	textarea: function(name, options){

		var options = this._buildOptions(name, options);
		
		var value = options.value;
		delete options.value;
		
		var textarea = new Element('textarea', options);
		
		this.form.insert(textarea.setValue(value));
		return this;
	},		
	
	submit: function(name, options){
		this.form.insert(this._input('submit', name, options));
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
		
		this.form.insert(l);
		
		return this;
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