class MyFormatter {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyFormatter', (compilation, callback) => {
      console.log('compilation', compilation.assets);
      callback();
    });
  }
}

module.exports = MyFormatter;
