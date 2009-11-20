var ProForm = (function(){
	
	var ProForm = Class.create({});
	
	ProForm.options = {
		labelMaker: function(str){
			return str.gsub('_', ' ').ucwords() + ': ';
		}
	}
	
	ProForm.prototype = {
		initialize: function(name, attr, options){
			this.attr = Object.extend({
				id: name,
				action: '',
				method: 'post'
			}, attr || {});
			
			this.options = Object.extend(ProForm.options, options || {});		
			
			this.form = new Element('form', this.attr);
			this.id = this.attr.id;
			this.set = false;
		},
		
		/**
		 * Returns the full form
		 */
		get: function(){
			return this.form;
		},
		
		/**
		 * Inserts the form into the passed in element
		 */
		insert: function(elem){
			$(elem).insert(this.form);
			return this.form;
		},
		
		/**
		 * Prototype form.request()
		 */
		request: function(options){
			this.sentRequest = this.form.request(options);
			return this;
		},
		
		hidden: function(name, value){
			this.form.insert(this._input('hidden', name, {value: value, label: false}));			
			return this;			
		},
		/**
		 * an input text
		 */
		text: function(name, attr){
			if(Object.isString(attr)){
				var attr = {value: attr};
			}
			this._insert(this._input('text', name, attr));			
			return this;
		},
		
		checkbox: function(name, boxes, attr){
			var name = name + '[]';
			var attr;
			if( Object.isString(boxes) ){
				
				attr = Object.extend({id: boxes, value: boxes}, attr || {});
				
			} else if( Object.isArray(boxes) ){
				name = name.gsub('[]', '');
				for(i=0;i<boxes.length;i++){
					
					if(Object.isString(boxes[i])){
						this.checkbox(name, boxes[i]);
					} else {
						for(x in boxes[i]){
							this.checkbox(name, x, {checked: boxes[i][x]});
						}
					}
					
				}
				return this;
				
			} else {
				
				attr = Object.extend(boxes, attr || {});
				
			}
				
			this._insert(this._input('checkbox', name, attr));
			return this;
		},
		
		radio: function(name, radios, attr){
			var attr;
			if(Object.isString(radios)){
			
				attr = Object.extend({id: radios, value: radios}, attr || {});
				
			} else if(Object.isArray(radios)){
			
				for(i=0;i<radios.length;i++){
					
					this.radio(name, radios[i], attr);
					
				}			
				return this;
	
			} else { // It's an Object
	
				attr = Object.extend(radios, attr || {});
				
			}
			
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
		
		select: function(name, options, attr){
			var attr = this._buildAttr(name, attr);
			delete attr.value; // no value for selects
			
			var select = new Element('select', attr);
			
			var allOptions = this._buildOptions(options);
			for(i=0;i<allOptions.length;i++){
				select.insert(allOptions[i]);
			}
			
			this._insert(select);
			return this;
		},
		
		submit: function(name, attr){
			this._insert(this._input('submit', name, this._buildButton(name, attr)));
			return this;			
		},
		
		reset: function(name, attr){
			this._insert(this._input('reset', name, this._buildButton(name, attr)));
			return this;			
		},
	
		button: function(name, attr){		
			this._insert(this._input('button', name, this._buildButton(name, attr)));
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
	
		_buildButton: function(name, attr){
			var buttonAttr;
			if(Object.isUndefined(attr)){
				buttonAttr = {label: false, value: name.ucwords()};			
			} else if(Object.isString(attr)){
				buttonAttr = {value: attr, label: false};
			} else {
				buttonAttr = Object.extend({label: false, value: name.ucwords()}, attr || {});				
			}	
			return buttonAttr;
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
	
		_buildOptions: function(options){
			var allOptions = [];
			var newOptions; 
			if(Object.isArray(options)){
				for(i=0;i<options.length;i++){
					if(typeof options[i] != 'object'){
						allOptions.push( this._option(options[i]) );
					} else {
						newOptions = this._buildOptions(options[i]);
						for(o=0;o<newOptions.length;o++){
							allOptions.push(newOptions[o]);
						}
					}
				}
			} else {
				if(Object.isUndefined(options.optGroup)){
					for(x in options){
						allOptions.push( this._option(x, options[x]) );
					}
				} else {
					var attr = Object.extend({label: options.optGroup}, options.attr || {});
					var group = new Element('optgroup', attr);
					newOptions = this._buildOptions(options.options);
					for(g=0;g<newOptions.length;g++){
						group.insert(newOptions[g]);
					}
					allOptions.push(group);
				}
			}
			return allOptions;		
		},
		
		_option: function(name, attr){
	
			var optionAttr;
			if(Object.isUndefined(attr)){
				optionAttr = {value: name};
			} else if(Object.isArray(attr)){
				optionAttr = {value:attr[0], selected:attr[1]};
			} else if(typeof attr === 'object') {
				optionAttr = attr;
			} else {
				if(typeof attr === 'boolean'){
					optionAttr = {value: name, selected: attr}
				} else {
					optionAttr = {value: attr};
				}
			}
	
			var option = new Element('option', optionAttr || {});
			return option.update(name);
		},
		
		/**
		 * Used to generate input elements
		 */
		_input: function(type, name, attr){
			
			var input = new Element('input', this._buildAttr(name, Object.extend({
				type: type
			}, attr || {})));
			
			return input;			
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
		}
	}

	
	return ProForm;
	
})(); 


if(!Object.isFunction('ucwords')){
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
		};
	})());
}