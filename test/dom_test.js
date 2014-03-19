describe('cohesive.js DOM', function() {

  var DOM = cohesive.DOM

  it('should expose cohesive.DOM in the global path', function() {
    assert.isNotNull(DOM)
  })

  describe('#escapeHTML', function() {
    it('should escape HTML characters', function() {     
      assert.equal(DOM.escapeHTML("test"), "test")
      assert.equal(DOM.escapeHTML("<&>\"'"), "&lt;&amp;&gt;&quot;&#39;")
      assert.equal(DOM.escapeHTML(""), "")
      assert.equal(DOM.escapeHTML(null), '')
    })
  })

  describe('#unescapeHTML', function() {
    it('should unescape HTML', function() {     
      assert.equal(DOM.unescapeHTML("test"), "test")
      assert.equal(DOM.unescapeHTML("&lt;&amp;&gt;&quot;&#39;"), "<&>\"'")
      assert.equal(DOM.unescapeHTML(""), "")
      assert.equal(DOM.unescapeHTML(null), '')
    })
  })

})
