var path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {dashboard:'./src/reactcom/dashboard.js',
         questionWizard:'./src/reactcom/questionsWizard',
         profile:'./src/reactcom/profile',
         search:'./src/reactcom/search',
         inbox:'./src/reactcom/inbox',
         blog:'./src/reactcom/blog',
         events:'./src/reactcom/events',
         likes:'./src/reactcom/likes',
         edit:'./src/reactcom/edit',
         login:'./src/reactcom/login',
         register:'./src/reactcom/register'},
  output: {
    path: path.resolve(__dirname, 'static/js/'),
    filename: '[name].js'
  },
  module: {
    rules: [
       {
          test:/\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader'
       }
    ]
 }
};