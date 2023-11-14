const luamin = require('luamin');
const fs = require('fs');


async function minify() {
  const buffer = await fs.promises.readFile('export/main.lua');
  const content = buffer.toString();

  const minified = luamin.minify(content);

  await fs.promises.writeFile('export/main.lua', minified);
}

minify();
