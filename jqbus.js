_define_('jqbus', function(jqbus){
	
	var jQuery = _module_("jQuery");
	var globalBus = jQuery("<globalBus>");
	var dotToDash = function(moduleName){
		return moduleName.replace('\.',"-","g")
	}
	var toNameClass = function(moduleName){
		return ".bus-"+dotToDash(moduleName);
	}

	//APIS Starts from Here
	return  {
		__nameSpace__ : "div",
		target : globalBus,
		_instance_ : function(nameSpace,id){
			this.__nameSpace__ = __nameSpace__ || __nameSpace__;
			this.target = jQuery("<"+this.__nameSpace__+">");
			globalBus.append(this.target);
			this.ids = [];
		},
		instance : function(){
			var ins = Object.create(this);
			ins._instance_.apply(ins,arguments);
			return ins;
		},
		trigger : function(){
			return this.publish.apply(this,arguments);
		},
		publish : function(eventName,data){
			this.target.trigger(eventName,data);
			return this;
		},
		on : function(eventHash, fun){
			if(is.Valid(this.ids,"instantiate before using `on`")){
				var eventName = eventHash.split(" ");
				this.ids.push({eventName : eventName[0], filter : eventName[1],fun : fun});
				if(eventName[1]){
					var hash = toNameClass(eventName[1]);
					globalBus.on(eventName[0],hash,fun);
				} else globalBus.on(eventName[0],fun);
			};
			return this;				
		},
		off : function(eventHash,fun){
			if(is.Valid(this.ids,"instantiate before using `on`")){
				var _eventName = is.String(eventHash) ? eventHash.split(" ") : undefined;
				var _fun = is.Function(eventHash) ? eventHash : _fun;
				var funNotDefined = ;
				var eventNotDefined = ;
				for(var i in this.ids){
					if(this.ids[i] && ( _fun === undefined || this.ids[i].fun === _fun) 
							&& (_eventName === undefined 
								|| (this.ids[i].eventName === _eventName[0] 
									&& (_eventName[1]===undefined || _eventName[1] === this.ids[i].filter )))
					){
						globalBus.off(this.ids[i].eventName, this.ids[i].fun);
						delete this.ids[i];
					}
				}
			}
			return this;
		},
		bind : function(self,mapping){
			if(is.Valid(this.ids,"instantiate before using `bind`")){
				var mapping = mapping || self.globalEvents;
				this.target.removeClass().addClass(toNameClass(this.name));
				this.target.attr("id",dotToDash(this.id));
				for(var en in mapping){
					(function(jqb,self,eventname,method){
						jqb.on(eventname,function(){
							if(is.Function(self[method])){
								self[method].apply(self,arguments);
							}
						});
					})(this,ins,en,mapping[eventname]);
				}	
			}
		}
	};
});
