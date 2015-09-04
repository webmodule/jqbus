_define_('jqbus', function (jqbus) {

  var jQuery = _module_("jQuery");
  var globalBus = jQuery("<globalBus>");
  var dotToDash = function (moduleName) {
    return moduleName.replace('\.', "-", "g");
  };
  var toNameClass = function (moduleName) {
    return "bus-" + dotToDash(moduleName);
  };

  var setDummyDomProp = function (target, __targetId__, __nameSpace__) {
    target.removeClass().addClass(toNameClass(__nameSpace__));
    target.attr("id", dotToDash(__targetId__ || ""));
    return target;
  };

  var bc, $dummyDom;
  if (window.BroadcastChannel) {
    bc = new BroadcastChannel("jqbus");
    $dummyDom = jQuery("<div/>")
    globalBus.append($dummyDom);
    bc.addEventListener('message', function (e) {
      setDummyDomProp($dummyDom, e.data.__targetId__, e.data.__nameSpace__).trigger(e.data.eventName, e.data.data);
    });
  }

  //APIS Starts from Here
  return  {
    __nameSpace__: "div",
    __targetId__: "",
    target: globalBus,
    _instance_: function (name, id) {
      var _targteScope = is.Object(name) ? name : null;
      this.__nameSpace__ = is.String(name) ? name : this.__nameSpace__;
      this.__targetId__ = is.String(id) ? id : this.__targetId__;
      this.target = jQuery("<div/>");
      globalBus.append(this.target);
      this.ids = [];
      if (!_targteScope) {
        _targteScope = {
          name: this.__nameSpace__, id: this.__targetId__
        };
      }
      this.bind(_targteScope);
    },
    instance: function () {
      var ins = Object.create(this);
      ins._instance_.apply(ins, arguments);
      return ins;
    },
    trigger: function () {
      return this.publish.apply(this, arguments);
    },
    publish: function (eventName, data) {
      this.target.trigger(eventName, data);
      if (bc) {
        try {
          bc.postMessage(JSON.parse(JSON.stringify({
            eventName: eventName,
            data: data,
            __nameSpace__: this.__nameSpace__,
            __targetId__: this.__targetId__
          })));
        } catch (e) {
          console.log(eventName, data);
          console.error("BUS:EXCEPTION", e);
        }
      }
      return this;
    },
    on: function (eventHash, fun) {
      if (is.Valid(this.ids, "instantiate before using `on`")) {
        var eventName = eventHash.split(" ");
        var callback = function (e, data) {
          return fun.call(this, e, e.target, data);
        };
        this.ids.push({eventName: eventName[0], filter: eventName[1], fun: callback});
        if (eventName[1]) {
          var hash = "." + toNameClass(eventName[1]);
          globalBus.on(eventName[0], hash, callback);
        } else globalBus.on(eventName[0], callback);
      }
      ;
      return this;
    },
    off: function (eventHash, fun) {
      if (is.Valid(this.ids, "instantiate before using `on`")) {
        var _eventName = is.String(eventHash) ? eventHash.split(" ") : undefined;
        var _fun = is.Function(eventHash) ? eventHash : _fun;
        for (var i in this.ids) {
          if (this.ids[i] && ( _fun === undefined || this.ids[i].fun === _fun)
            && (_eventName === undefined
              || (this.ids[i].eventName === _eventName[0]
                && (_eventName[1] === undefined || _eventName[1] === this.ids[i].filter )))
            ) {
            globalBus.off(this.ids[i].eventName, this.ids[i].fun);
            delete this.ids[i];
          }
        }
      }
      return this;
    },
    bind: function (self, mapping) {
      if (is.Valid(this.ids)) {
        var mapping = mapping || self.globalEvents;
        setDummyDomProp(this.target, self.id, self.name);
        for (var en in mapping) {
          (function (jqb, ins, eventname, method) {
            jqb.on(eventname, function () {
              if (is.Function(ins[method])) {
                ins[method].apply(ins, arguments);
              }
            });
          })(this, self, en, mapping[en]);
        }
        return this;
      } else {
        return this.instance().bind(self, mapping);
      }
    }
  };
});
