/* global cohesive */
describe('cohesive base', function() {
  it('should expose `cohesive` in the global path', function() {
    assert.isNotNull(cohesive)
  });

  describe('#isArrayLike', function() {
    it('should test for valid array like objects', function() {
      var isArrayLike = cohesive.isArrayLike

      assert.isTrue(isArrayLike(document.body.childNodes))
      // var text = document.getElementById('text').firstChild;
    })
  })

})
