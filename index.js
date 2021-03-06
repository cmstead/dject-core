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


    function isRegistered(moduleName) {
        return typeof registry[moduleName] !== 'undefined';
    }

    function throwOnUnregistered(moduleName) {
        if (!isRegistered(moduleName)) {
            throw new Error('Module ' + moduleName + ' has not been registered');
        }
    }

    function throwOnImproperOverride(moduleName) {
        if (!isRegistered(moduleName)) {
            throw new Error('Cannot override module, ' + moduleName + '; it has not been registered');
        }
    }

    function build(moduleName) {
        throwOnUnregistered(moduleName);
        return registry[moduleName]();
    }

    function buildWithObject(moduleName) {
        throwOnUnregistered(moduleName);
        return registry[moduleName].buildWithObject();
    }

    function set(obj, key, value) {
        obj[key] = value;
        return obj
    }

    function createBuilder(moduleFactory, dependencies) {
        function moduleBuilder() {
            return moduleFactory.apply(null, dependencies.map(build));
        }

        function buildModuleWithObject() {
            var dependencyInstances = dependencies.map(buildWithObject);

            var dependencyMap = dependencies.reduce(
                function (result, dependencyName, index) {
                    result[dependencyName] = dependencyInstances[index];
                    return result;
                },
                {}
            );

            return moduleFactory(dependencyMap);
        }

        function getDependencies() {
            return dependencies.slice(0);
        }

        Object.defineProperty(moduleBuilder, 'originalModule', {
            value: moduleFactory,
            writeable: false,
            configurable: false
        });

        Object.defineProperty(moduleBuilder, 'buildWithObject', {
            value: buildModuleWithObject,
            writeable: false,
            configurable: false
        });

        return set(moduleBuilder, 'dependencies', getDependencies);
    }

    function throwOnRegistered(moduleName) {
        if (isRegistered(moduleName)) {
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
        throwOnImproperOverride(moduleName);
        return registerModule(moduleName, moduleFactory, dependencies);
    }

    function attachRegistryKey(outputRegistry, key) {
        return set(outputRegistry, key, registry[key]);
    }

    function getModuleRegistry() {
        return Object.keys(registry).reduce(attachRegistryKey, {});
    }

    function getDependencies(moduleName) {
        throwOnUnregistered(moduleName);

        return registry[moduleName].dependencies();
    }

    function getModuleBuilder(moduleName) {
        return registry[moduleName];
    }

    api.build = build;
    api.buildWithObject = buildWithObject;
    api.getModuleBuilder = getModuleBuilder;
    api.getModuleRegistry = getModuleRegistry;
    api.isRegistered = isRegistered;
    api.getDependencies = getDependencies;
    api.override = override;
    api.register = register;

    return api;

});