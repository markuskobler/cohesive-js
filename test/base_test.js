describe('cohesive.js base', function() {
  it('should expose cohesive in the global path', function() {
    assert.isNotNull(cohesive)
  });

  describe('#isString', function() {
    it('should test for valid strings', function() {
      var isString = cohesive.isString
      assert.isTrue(isString("test"))
      assert.isTrue(isString(""))

      assert.isFalse(isString(1))
      assert.isFalse(isString(false))
      assert.isFalse(isString(void(0)))
    });

  })

  describe('#isNumber', function() {
    it('should test for valid numbers', function() {
      var isNumber = cohesive.isNumber
      assert.isTrue(isNumber(1))
      assert.isTrue(isNumber(Number(1)))

      assert.isFalse(isNumber("test"))
      assert.isFalse(isNumber(""))
      assert.isFalse(isNumber(false))
      assert.isFalse(isNumber(void(0)))
    });
  })

  describe('#isObject', function() {
    it('should test for valid objects', function() {
      var isObject = cohesive.isObject 
      function Func() {}

      assert.isTrue(isObject({}))
      assert.isTrue(isObject(new Func()))
      assert.isTrue(isObject(Func))

      assert.isFalse(isObject("test"))
      assert.isFalse(isObject(""))
      assert.isFalse(isObject(1))
      assert.isFalse(isObject(Number(1)))
      assert.isFalse(isObject(false))
      assert.isFalse(isObject(void(0)))
    });
  })

  describe('#isFunction', function() {
    it('should test for valid functions', function() {
      var isFunction = cohesive.isFunction 
      function Func() {}

      assert.isTrue(isFunction(Func))

      assert.isFalse(isFunction({}))
      assert.isFalse(isFunction(new Func()))
      assert.isFalse(isFunction("test"))
      assert.isFalse(isFunction(""))
      assert.isFalse(isFunction(1))
      assert.isFalse(isFunction(Number(1)))
      assert.isFalse(isFunction(false))

      assert.throw(function() {
        assert.isFalse(isFunction(void(0)))
      })

    });
  })

  describe('#isArray', function() {
    it('should test for valid arrays', function() {
      var isArray = cohesive.isArray
      function Func() {}

      assert.isTrue(isArray([]))

      assert.isFalse(isArray(Func))
      assert.isFalse(isArray({}))
      assert.isFalse(isArray(new Func()))
      assert.isFalse(isArray("test"))
      assert.isFalse(isArray(""))
      assert.isFalse(isArray(1))
      assert.isFalse(isArray(Number(1)))
      assert.isFalse(isArray(false))
    });
  })

  describe('#bind', function() {
    it('should bind a function to an object', function() {
      var foo = {bar:"baz"}      

      function test(arg1, arg2) {
        var result = [this.bar], args = Array.prototype.slice.call(arguments, 0)
        return result.push.apply(result, args) && result.join(':')
      }
      var boundTest = cohesive.bind(test, foo)
      
      assert.equal(test(), "")
      assert.equal(boundTest(), "baz") 
      assert.equal(boundTest(1), "baz:1")
    })
  })

  describe('#curry', function() {
    it('should curry a function', function() {
      var foo = {bar:"baz"}

      function test(arg1, arg2) {
        var result = [this.bar], args = Array.prototype.slice.call(arguments, 0)
        return result.push.apply(result, args) && result.join(':')
      }
      var curryTest = cohesive.curry(test, foo)
      
      assert.isFunction(curryTest())
      assert.isFunction(curryTest(1))
      assert.equal(curryTest(1,2), "baz:1:2")
      assert.equal(curryTest(1)(2), "baz:1:2")
      assert.equal(curryTest(1,2,3,4), "baz:1:2")

      curryTest = cohesive.curry(test, null, 3)
      
      assert.isFunction(curryTest())
      assert.equal(curryTest(1,2,3), ":1:2:3")
      assert.equal(curryTest(1)(2,3), ":1:2:3")
      assert.equal(curryTest(1,2,3,4), ":1:2:3")
    })
  })
})
