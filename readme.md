Dject Core
==========

Dject Core is the core dependency injection system for the Dject dependency injection container. This package is not intended to be used as a standalone DI container.  Instead this is built to support the internal needs for the Dject system, allowing the rest of Dject to be built with good separation of concerns.

For more information on the Dject library, please see the following package:

https://www.npmjs.com/package/dject

## API ##

### New container creation ###

To create a new container, simply call the DjectCoreFactory function provided by the JS module:

```javascript
// In node:
const container = require('dject-core')();

// In the browser:
const container = window.djectCoreFactory();
```

### Registering a New Module ###

Module registration requires a name, a function which constructs the module and an array of dependency names (as strings).  You can only register a module factory to a name once. Any subsequent registrations will throw an error. Module registration is chainable.

```javascript
container
    .register('myDependency', () => { foo: 'bar' }, [])
    .register('anotherModule', (myDependency) => { baz: myDependency }, ['myDependency']);

container
    .register('myDependency', () => { foo: 'bar' }, [])
    .register('myDependency', () => { foo: 'bar' }, []); // Throws an error
```

### Building Modules ###

Building a module can be done simply by calling the build method with the module name.  This will construct all dependencies and the top-level module.  Considering the registration example above, build will result in the following:

```javascript
const myModuleInstance = container.build('anotherModule');

// produces the following:

// {
//     baz: {
//         foo: 'bar'
//     }
// }
```

### Overriding Modules ###

Overriding a module is necessary for situations where a module has been registered, but you need to inject something different into the dependency tree.  This is most common in testing scenarios.

```javascript
container
    .register('myDependency', () => { foo: 'bar' }, [])
    .override('myDependency', () => { foo: 'bar' }, []); // Doesn't throw an error
```

## Version History ##

**1.0.0**

Initial release