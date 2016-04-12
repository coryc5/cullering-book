module.exports = {
  entry: './app/App.js',
  output: {
    filename: './public/bundle.js'
  },
  module: {
    loaders: [
      {
        loader:
          'babel',
        test: /\.jsx?$/,
        query: {
          presets: [
            'react',
            'es2015'
          ]
        },
        exclude: /node_modules|bower_components/
      }
    ]
  },
  plugins: [
  ]
}