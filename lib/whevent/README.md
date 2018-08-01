whevent
==============

### A lite and convenient event system

Just a simple singleton event system used by myself :)

Usage
-----

```js
var whevent = require('whevent');

// Bind the signal with the event function: whevent.bind(signal, func, context);
whevent.bind('SPEAK', function1, this);

// Bind the signal with another event function, but this function will always get called first!
whevent.bindPriority('SPEAK', function2, this);

// Bind the signal with a 3rd event function
// But once the function3 get called, the binding of this function with this signal will be destroyed
whevent.bindOnce('SPEAK', function3, this);

// Call the event: whevent.call(signal, data);
// Calls order: function2, function1, function3
whevent.call('SPEAK', 'Hello!');

// Unbind the binded function with the signal
whevent.unbind('SPEAK', function1);

// Destory the signal, all bindings will be destroyed
whevent.destroy('SPEAK');
```
