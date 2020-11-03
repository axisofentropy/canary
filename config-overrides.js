const { override, fixBabelImports, addLessLoader, disableEsLint } = require('customize-cra');

module.exports = override(
  fixBabelImports('antd-mobile', {
    libraryDirectory: 'es',
    libraryName: 'antd-mobile',
    style: true
  }),
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    libraryName: 'antd',
    style: true
  }),
  // disableEsLint(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      'primary-color': '#ffb300',
    },
  }),
);