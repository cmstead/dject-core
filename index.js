(function (djectCoreFactory) {
    'use strict';

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = djectCoreFactory;
    } else {
        window.djectCoreFactory = djectCoreFactory;
    }

})(function () {

    var registry = {};
    var api = {};

    function build(moduleName) {
        return registry[moduleName]();
    }

    function set(obj, key, value) {
        obj[key] = value;
        return obj
    }

    function createBuilder(moduleFactory, dependencies) {
        function moduleBuilder() {
            return moduleFactory.apply(null, dependencies.map(build));
        }

        return set(moduleBuilder, 'dependencies', dependencies);
    }

    function throwOnRegistered(moduleName) {
        if(typeof registry[moduleName] !== 'undefined') {
            throw new Error('Cannot reregister module ' + moduleName);
        }
    }

    function registerModule(moduleName, moduleFactory, dependencies) {
        registry[moduleName] = createBuilder(moduleFactory, dependencies);
        return api;
    }

    function register(moduleName, moduleFactory, dependencies) {
        throwOnRegistered(moduleName);
        return registerModule(moduleName, moduleFactory, dependencies);
    }

    function override(moduleName, moduleFactory, dependencies) {
        return registerModule(moduleName, moduleFactory, dependencies);
    }

    function attachRegistryKey(outputRegistry, key) {
        return set(outputRegistry, key, registry[key]);
    }

    function getModuleRegistry() {
        return Object.keys(registry).reduce(attachRegistryKey, {});
    }

    api.build = build;
    api.getModuleRegistry = getModuleRegistry;
    api.override = override;
    api.register = register;

    return api;

});