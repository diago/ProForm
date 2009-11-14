var ProForm = Class.create({
	initialize: function(name, props, options){
		this.props = Object.extend({
			id: name,
			action: '',
			method: 'post'
		}, props || {});
		
		this.options = Object.extend({
	
		}, options || {});		
		
		this.form = new Element('form', this.props);
		this.id = this.props.id;
	},
	
	/**
	 * Used to generate input elements
	 */
	_input: function(type, name, options){
		var options = Object.extend({
			id: name,
			name: name,
			value: '',
			className: '',
			label: false
		}, options || {});
		
		var input = new Element('input', {
			type: type,
			id: options.id,
			name: options.name,
			value: options.value,
			'class': options.className
		});
		
		if(options.label){
			this.label(name, options.label);
		}
		
		this.form.insert(input);			
	},
	
	hidden: function(name, options){
		this.form.insert(this._input('hidden', name, options));			
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
		var options = Object.extend({
			id: name,
			name: name,
			value: '',
			className: '',
			label: false				
		}, options || {});
		
		var textarea = new Element('textarea', {
			id: options.id,
			name: options.name,
			'class': options.className
		});
		
		textarea.update(options.value);
		
		if(options.label){
			this.label(name, options.label);
		}
		
		this.form.insert(textarea);
		return this;
	},		
	
	submit: function(name, options){
		this.form.insert(this._input('submit', name, options));
		return this;			
	},
	
	label: function(forElem, label){
		
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
		var options = Object.extend(
			Outland.requestDefaults
		, options || {});
		
		this.sentRequest = this.form.request(options);
		return this;
	}
});