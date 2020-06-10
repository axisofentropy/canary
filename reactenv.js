var fs = require('fs');

try {
  fs.unlinkSync('./public/env-config.js')
} catch (err) { }

var envData;
fs.readFile('.env', 'utf8', function (err, data) {
  envData = data;
  var pairs = envData.split('\n');
  var transformedPairs = pairs.map(pair => {
    let split = pair.split('=')
    let varName = split[0]
    let varValue = split.slice(1).join('=').replace(/\n|\r/, '')
    return `\t${varName}: '${varValue}',`
  })
  fs.writeFile('./public/env-config.js', `window._env_ = {\n${transformedPairs.join('\n')}\n}`, function (err) { });
});
