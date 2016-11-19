var spawn = require('child_process').spawn
var fs = require('fs')

var q = [
  function () {
    if (!fs.existsSync('./build')) {
      fs.mkdirSync('./build')
    }

    done()
  },

  function () {
    var browserify = spawn('node', [
      'node_modules/.bin/browserify',
      'lib/browser.js',
      '-d',
      '-o', 'build/qrcode.js'
    ])

    browserify.stdin.end()
    browserify.stdout.pipe(process.stdout)
    browserify.stderr.pipe(process.stderr)
    browserify.on('exit', function (code) {
      if (code) {
        console.error('browserify failed!')
        process.exit(code)
      }
      done()
    })
  },

  function () {
    var uglify = spawn('node', [
      'node_modules/.bin/uglifyjs',
      '--compress', '--mangle',
      '--source-map', 'build/qrcode.min.js.map',
      '--source-map-url', 'qrcode.min.js.map',
      '--', 'build/qrcode.js'])

    var minStream = fs.createWriteStream('build/qrcode.min.js')
    uglify.stdout.pipe(minStream)
    uglify.stdin.end()
    uglify.on('exit', function (code) {
      if (code) {
        console.error('uglify failed!')
        fs.unlink('build/qrcode.min.js', function () {
          process.exit(code)
        })
      }
      done()
    })
  }
]

var done = function () {
  var j = q.shift()
  if (j) j()
  else complete()
}

var complete = function () {
  console.log('build complete =)')
}

done()
