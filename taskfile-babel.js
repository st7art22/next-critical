// taskr babel plugin with Babel 7 support
// https://github.com/lukeed/taskr/pull/305
'use strict'

const extname = require('path').extname
const transform = require('@babel/core').transform

module.exports = function(task) {
  task.plugin('babel', {}, function*(file, babelOpts, { stripExtension } = {}) {
    const options = {
      ...babelOpts,
      compact: true,
      babelrc: false,
      configFile: false,
      filename: file.base,
    }
    const output = transform(file.data, options)
    const ext = extname(file.base)

    // Include declaration files as they are
    if (file.base.endsWith('.d.ts')) return

    // Replace `.ts|.tsx` with `.js` in files with an extension
    if (ext) {
      const extRegex = new RegExp(ext.replace('.', '\\.') + '$', 'i')
      // Remove the extension if stripExtension is enabled or replace it with `.js`
      file.base = file.base.replace(extRegex, stripExtension ? '' : '.js')
    }

    file.data = Buffer.from(output.code)
  })
}
