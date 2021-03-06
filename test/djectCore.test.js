'use strict';

const assert = require('chai').assert;

const djectCoreFactory = require('../index');


describe('djectCore', function () {
    
    let container;

    beforeEach(function () {
        container = djectCoreFactory();
    });
    
    it('should register and build a single module', function () {
        container.register('testModule', () => 'foo', []);
        
        const result = container.build('testModule');

        assert.equal(result, 'foo');
    });

    
    it('should handle dependency tree construction', function () {
        container
            .register('dependencyModule', () => ({ value: 'bar' }), [])
            .register('testModule', (dependencyModule) => ({ foo: dependencyModule.value }), ['dependencyModule']);

        const result = container.build('testModule');

        assert.equal(JSON.stringify(result), '{"foo":"bar"}');
    });

    
    it('should throw an error when trying to register a module which already exists', function () {
        container.register('testModule', () => 'foo', []);
        
        assert.throws(
            container.register.bind(null, 'testModule', () => 'foo', []),
            'Cannot reregister module testModule');
    });
    
    
    
    it('should provide a way to verify if a module was registered', function () {
        container.register('testModule', () => 'foo', []);

        const result = container.isRegistered('testModule');

        assert.isTrue(result);
    });
    

    it('should allow overriding of an existing module', function () {
        container
            .register('testModule', () => 'foo', [])
            .override('testModule', () => 'bar', []);
        
        const result = container.build('testModule');

        assert.equal(result, 'bar');
    });
    
    
    it('should return an object containiner all registered builders', function () {
        container.register('testModule', (dependencyModule) => 'foo', ['bar']);
        const result = container.getModuleRegistry();

        const testBuilder = result.testModule;

        assert.equal(typeof testBuilder, 'function');
        assert.equal(testBuilder.name, 'moduleBuilder');
        assert.equal(JSON.stringify(container.getDependencies('testModule')), '["bar"]');
    });
    

});
