var test = require('tap').test
var BitBuffer = require('../bit-buffer')
var ByteData = require('../byte-data')
var Mode = require('../mode')

test('Byte Data', function (t) {
  var text = '1234'
  var textByte = [49, 50, 51, 52] // 1, 2, 3, 4

  var byteData = new ByteData(text)

  t.equal(byteData.mode, Mode.BYTE, 'Mode should be BYTE')
  t.equal(byteData.getLength(), text.length, 'Should return correct length')

  t.ok(ByteData.getCharCountIndicator, 'getCharCountIndicator should be defined')

  for (var v = 1; v <= 40; v++) {
    t.ok(byteData.getCharCountIndicator(v), 'Should return a positive number')
  }

  t.throw(function () { byteData.getCharCountIndicator(0) }, 'Should throw if invalid version')

  var bitBuffer = new BitBuffer()
  byteData.write(bitBuffer)
  t.deepEqual(bitBuffer.buffer, textByte, 'Should write correct data to buffer')

  t.end()
})
