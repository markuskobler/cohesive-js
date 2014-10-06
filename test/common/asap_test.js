/* global cohesive, chai */
describe('cohesive asap', function() {
  var slice = Array.prototype.slice, err = new Error("not async");
  describe('#asap', function() {
    it('should execute a task shortly after ', function(done) {
      var count=0, run = true;
      cohesive.asap(function() {
        count++
        assert.deepEqual(slice.call(arguments,0), [])
      })
      cohesive.asap(function() {
        assert.equal(count, 1)
        done(run ? void 0 : err)
      })
      run = true
    })

    it('should execute a task shortly after with 1 arg', function(done) {
      var count=0, run = false;
      cohesive.asap(function() {
        count++
        assert.deepEqual(slice.call(arguments,0), [1])
      }, 1)
      cohesive.asap(function() {
        assert.equal(count, 1)
        assert.deepEqual(slice.call(arguments,0), [2])
        done(run ? void 0 : err)
      }, 2)
      run = true
    })

    it('should execute a task shortly after with 2 args', function(done) {
      var count=0, run = false;
      cohesive.asap(function() {
        count++
        assert.deepEqual(slice.call(arguments,0), [1,2])
      }, 1, 2)
      cohesive.asap(function() {
        assert.equal(count, 1)
        assert.deepEqual(slice.call(arguments,0), [3, 4])
        done(run ? void 0 : err)
      }, 3, 4)
      run = true
    })

    it('should execute a task shortly after with 3 args', function(done) {
      var count=0, run = false;
      cohesive.asap(function() {
        count++
        assert.deepEqual(slice.call(arguments,0), [1,2,3])
      }, 1, 2, 3)
      cohesive.asap(function() {
        assert.equal(count, 1)
        assert.deepEqual(slice.call(arguments,0), [4, 5])
        done(run ? void 0 : err)
      }, 4, 5)
      run = true
    })
  })
})
