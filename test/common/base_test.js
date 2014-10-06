/* global cohesive */
describe('cohesive base', function() {
  describe('#isUndefined', function() {
    var isUndefined = cohesive.isUndefined, undef

    it('should test for undefined vars', function() {
      (function test(undef2) { assert.isTrue(isUndefined(undef2)) })()
      assert.isTrue(isUndefined(void 0))
      assert.isTrue(isUndefined(undef))

      assert.isFalse(isUndefined("foo"))
      assert.isFalse(isUndefined(null))
    })
  })

  describe('#isString', function() {
    var isString = cohesive.isString

    it('should test for valid strings', function() {
      assert.isTrue(isString("test"))
      assert.isTrue(isString(""))

      assert.isFalse(isString(1))
      assert.isFalse(isString(false))
      assert.isFalse(isString(void(0)))
    })
  })

  describe('#isNumber', function() {
    var isNumber = cohesive.isNumber

    it('should test for valid numbers', function() {
      assert.isTrue(isNumber(1))
      assert.isTrue(isNumber(Number(1)))

      assert.isFalse(isNumber("test"))
      assert.isFalse(isNumber(""))
      assert.isFalse(isNumber(false))
      assert.isFalse(isNumber(void(0)))
    })
  })

  describe('#isObject', function() {
    var isObject = cohesive.isObject

    it('should test for valid objects', function() {
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
    })
  })

  describe('#isFunction', function() {
    var isFunction = cohesive.isFunction

    it('should test for valid functions', function() {
      function Func() {}

      assert.isTrue(isFunction(Func))

      assert.isFalse(isFunction({}))
      assert.isFalse(isFunction(new Func()))
      assert.isFalse(isFunction("test"))
      assert.isFalse(isFunction(""))
      assert.isFalse(isFunction(1))
      assert.isFalse(isFunction(Number(1)))
      assert.isFalse(isFunction(false))
      assert.isFalse(isFunction(void(0)))

    })
  })

  describe('#isArray', function() {
    var isArray = cohesive.isArray

    it('should test for valid arrays', function() {
      var arrayWithLengthSet = [1, 2, 3];
      arrayWithLengthSet.length = 2;

      function Func() {}

      assert.isTrue(isArray([1,2,3]))
      assert.isTrue(isArray(arrayWithLengthSet))

      assert.isFalse(isArray(Func))
      assert.isFalse(isArray({}))
      assert.isFalse(isArray(new Func()))
      assert.isFalse(isArray("test"))
      assert.isFalse(isArray(1))
      assert.isFalse(isArray(false))
    })
  })

  describe('#isArrayLike', function() {
    var isArrayLike = cohesive.isArrayLike, undef;

    it('should test for valid array like objects', function() {
      assert.isTrue(isArrayLike([1, 2, 3]))
      assert.isTrue(isArrayLike({length: 2}))

      assert.isFalse(isArrayLike({length: 'a'}))
      assert.isFalse(isArrayLike( {a: 1, b: 2}))
      assert.isFalse(isArrayLike(null))
      assert.isFalse(isArrayLike(undef))
    })
  })

  describe('#noop', function() {
    var noop = cohesive.noop

    it('should result in a no operation', function() {
      assert.isFunction(noop)
      noop()
      noop(1,"b",null)
    })
  })

  describe('#bind', function() {
    it('should bind a function to an object', function() {
      var foo = {bar:"baz"}
      function test() {
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
      /* jshint unused: false */
      function test(arg1, arg2) {
        var result = [this.bar], args = Array.prototype.slice.call(arguments, 0);
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
      assert.equal(curryTest(1)()(2,3), ":1:2:3")
      assert.equal(curryTest(1,2,3,4), ":1:2:3")
    })
  })

  describe('#partial', function() {
    it('should partially compleate the function', function() {
      function test(/* var_args */) {
        var result = ["foo"], args = Array.prototype.slice.call(arguments, 0);
        return result.push.apply(result, args) && result.join(':')
      }

      var partialTest1 = cohesive.partial(test)
      assert.isFunction(partialTest1)
      assert.equal(partialTest1(), "foo")
      assert.equal(partialTest1(1), "foo:1")

      var partialTest2 = cohesive.partial(test, "bar")
      assert.equal(partialTest2(), "foo:bar")
      assert.equal(partialTest2(2), "foo:bar:2")
    })
  })

  describe('#bindPartial', function() {
    it('should partially compleate the bound function', function() {
      var foo = {bar:"baz"}
      function test(/* var_args */) {
        var result = [this.bar], args = Array.prototype.slice.call(arguments, 0);
        return result.push.apply(result, args) && result.join(':')
      }

      var partialTest1 = cohesive.bindPartial(test, foo)
      assert.isFunction(partialTest1)
      assert.equal(partialTest1(), "baz")
      assert.equal(partialTest1(1), "baz:1")

      var partialTest2 = cohesive.bindPartial(test, foo, "bar")
      assert.equal(partialTest2(), "baz:bar")
      assert.equal(partialTest2(2), "baz:bar:2")
    })
  })

  describe('#partialRight', function() {
    it('should partially compleate the bound function binding args to the right', function() {
      function test(/* var_args */) {
        var result = ["foo"], args = Array.prototype.slice.call(arguments, 0);
        return result.push.apply(result, args) && result.join(':')
      }

      var partialTest1 = cohesive.partialRight(test)
      assert.isFunction(partialTest1)
      assert.equal(partialTest1(), "foo")
      assert.equal(partialTest1(1), "foo:1")

      var partialTest2 = cohesive.partialRight(test, "bar")
      assert.equal(partialTest2(), "foo:bar")
      assert.equal(partialTest2(2), "foo:2:bar")
    })
  })

  describe.skip('#compose', function() {
    it('should ', function() {
      // todo
    })
  })

  describe('#once', function() {
    it('should only execute a function once', function() {
      var count, runArgs, runOnce;
      function reset() {
        count = 0; runArgs = void 0; runOnce = cohesive.once(function () {
          count++; runArgs = Array.prototype.slice.call(arguments, 0)
        })
      }
      reset()

      assert.isUndefined(runArgs)
      assert.equal(count, 0)
      runOnce()
      assert.deepEqual(runArgs, [])
      assert.equal(count, 1)
      runOnce()
      runOnce()
      assert.equal(count, 1)

      reset()
      runOnce("Hello")
      runOnce("Hello2")
      assert.deepEqual(runArgs, ["Hello"])
      assert.equal(count, 1)

      reset()
      runOnce = cohesive.once(function () {
          count++; runArgs = Array.prototype.slice.call(arguments, 0)
      }, "Hello", "World")

      runOnce("JS", "Test")
      runOnce("Hello")
      assert.deepEqual(runArgs, ["Hello", "World", "JS", "Test"])
      assert.equal(count, 1)
    })
  })

  describe('#forEach', function() {
    it('should call a function for each item in array', function() {
      var total = 0, items = []
      cohesive.forEach(function(v, i, values) {
        assert.equal(total++, i)
        items.push(v)
        assert.equal(values.length, 3)
      }, ['a',1,'foobar'])

      assert.deepEqual(items, ['a',1,'foobar'])
    })
  })

  describe('#bindForEach', function() {
    it('should call a bound function for each item in array', function() {
      var scope = {total:0, items:[]}
      cohesive.bindForEach(function(v, i, values) {
        assert.equal(this.total++, i)
        this.items.push(v)
        assert.equal(values.length, 3)
      }, scope, ['a',1,'foobar'])

      assert.deepEqual(scope.items, ['a',1,'foobar'])
    })

  })

  describe('#find', function() {
    var find = cohesive.find

    it('should find an element in an array like collection', function() {
      function isPrime(element, index, array) {
        var start = 2;
        while (start <= Math.sqrt(element)) {
          if (element % start++ < 1) return false;
        }
        return element > 1;
      }
      assert.isUndefined(find(isPrime, [4, 6, 8, 12]))
      assert.equal(find(isPrime, [4, 5, 8, 12]), 5)

      // todo find in object
    })
  })

  describe('#toArray', function() {
    it('should convert objects to arrays', function() {
      var a = [0, 1, 2, 3],
          b = {0: 0, 1: 1, 2: 2, 3: 3, length: 4}
      assert.deepEqual(cohesive.toArray(a), a)
      assert.deepEqual(cohesive.toArray(b), a)
    })
  })

  describe('#indexOf', function() {
    var indexOf = cohesive.indexOf

    it('should find item in array', function() {
      assert.equal(indexOf([0, 1, 2, 3], 1), 1)
      assert.equal(indexOf([0, 1, 1, 1], 1), 1)
      assert.equal(indexOf([0, 1, 2, 3], 4), -1)
      assert.equal(indexOf([0, 1, 2, 3], 1, 1), 1)
      assert.equal(indexOf([0, 1, 2, 3], 1, 2), -1)
      assert.equal(indexOf([0, 1, 2, 3], 1, -3), 1)
      assert.equal(indexOf([0, 1, 2, 3], 1, -2), -1)
    })

    it('should find character in array', function() {
      assert.equal(indexOf('abcd', 'd'), 3);
      assert.equal(indexOf('abbb', 'b', 2), 2);
      assert.equal(indexOf('abcd', 'e'), -1);
      assert.equal(indexOf('abcd', 'cd'), -1);
      assert.equal(indexOf('0123', 1), -1);
    })
  })

  describe.skip('#extend', function() {
    var extend = cohesive.extend
    it('should', function() {
      // todo implement
    })
  })

  describe('#filter', function() {
    var filter = cohesive.filter

    it('should filter an array', function() {
      var a = [0, 1, 2, 3], count=0;
      a = filter(function(v, i, a2) {
        assert.equal(a, a2);
        assert.equal(i, count++);
        return v > 1;
      }, a);
      assert.deepEqual(a, [2, 3])
      assert.deepEqual(count, 4)
    })

    it('should filter an array ommiting deleted', function() {
      var a = [0, 1, 2, 3], count=0;
      delete a[1]
      delete a[3]
      a = filter(function(v, i, a2) {
        assert.equal(a, a2);
        assert.equal(typeof i, 'number');
        count++
        return v > 1;
      }, a);
      assert.deepEqual(a, [2])
      assert.deepEqual(count, 2)
    })
  })

  describe('#bindFilter', function() {
    var bindFilter = cohesive.bindFilter

    it('should filter an array', function() {
      var a = [0, 1, 2, 3], scope = { count: 0 }
      a = bindFilter(function(v, i, a2) {
        assert.equal(a, a2);
        assert.equal(i, this.count++);
        return v > 1;
      }, scope, a);
      assert.deepEqual(a, [2, 3])
      assert.deepEqual(scope.count, 4)
    })

    it('should filter an array ommiting deleted', function() {
      var a = [0, 1, 2, 3], scope = { count: 0 };
      delete a[1]
      delete a[3]
      a = bindFilter(function(v, i, a2) {
        assert.equal(a, a2);
        assert.equal(typeof i, 'number');
        this.count++
        return v > 1;
      }, scope, a);
      assert.deepEqual(a, [2])
      assert.deepEqual(scope.count, 2)
    })
  })

  describe('#map', function() {
    var map = cohesive.map
    it('should map over an array', function() {
      var a = [0, 1, 2, 3];
      var result = map(function(v, i, a2) {
        assert.equal(a, a2);
        assert.equal(typeof i, 'number');
        return v * v;
      }, a);
      assert.deepEqual(result, [0, 1, 4, 9]);
    })
  })

  describe('#bindMap', function() {
    var bindMap = cohesive.bindMap
    it('should map over an array', function() {
      var a = [0, 1, 2, 3], scope = {count:0};
      var result = bindMap(function(v, i, a2) {
        this.count++
        assert.equal(a, a2);
        assert.equal(typeof i, 'number');
        return v * v;
      }, scope, a);
      assert.deepEqual(result, [0, 1, 4, 9]);
    })
  })

  describe.skip('#reduce', function() {
    // todo implement
  })

  describe.skip('#bindReduce', function() {
    // todo implement
  })

  describe('#escapeHTML', function() {
    it('should escape HTML characters', function() {
      assert.equal(cohesive.escapeHTML("test"), "test")
      assert.equal(cohesive.escapeHTML("<&>\"'"), "&lt;&amp;&gt;&quot;&#39;")
      assert.equal(cohesive.escapeHTML(""), "")
      assert.equal(cohesive.escapeHTML(null), '')
    })
  })

  describe('#unescapeHTML', function() {
    it('should unescape HTML', function() {
      assert.equal(cohesive.unescapeHTML("test"), "test")
      assert.equal(cohesive.unescapeHTML("&lt;&amp;&gt;&quot;&#39;"), "<&>\"'")
      assert.equal(cohesive.unescapeHTML(""), "")
      assert.equal(cohesive.unescapeHTML(null), '')
    })
  })
})
