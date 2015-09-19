#JQBUS


#### In my module1 in some file module1.js
```javascript
var bus = jqbus.instance();

bus.on("when_something_happens", function(){
    console.log("I want to be notified, so that i can do something");
});

```

### In my module2, maybe in some other file module.js
```javascript
var bus = jqbus.instance();

bus.publish("when_something_happens");

```

Now as you can see module1 has never interacted with mmodule2 or vice-versa, they are not even being discussed, but both modules have knowledge of jqbus and they created their own instances
 and somehow are able to communicate !!Hurray!!
 
 So we have triggered some function in module1 from inside module2 without even having reference of module1, similarly we can have as many listeneres as we want in as many modules as we can.
 Optionally we can also pass data along with, triggering the callback function.


```javascript
bus.on("when_something_happens", function(e,target,data){
    //data sent by trigger function
    console.log("I want to be notified, so that i can do something");
});

bus.publish("when_something_happens", { name : "Hello" });
`````

In addition to passing data to different module, JQBUS is able to send data to different tab also for same domain.




