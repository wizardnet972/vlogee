const fs = require('fs');
const axios = require('axios');
var UglifyJS = require('uglify-js');

const ejs = fs.readFileSync('./src/logs.ejs', 'utf-8');
const cheerio = require('cheerio');

const $ = cheerio.load(ejs);

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
function unescapeHTML(escapedHTML) {
  return escapedHTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

(async () => {
  await asyncForEach($('link'), async el => {
    var url = el.attribs.href;

    // $(this).prepend('<div>blabla</div>');
    const response = await axios.get(url);
    console.log(response.data);

    $(el).replaceWith(`<style>${response.data}</style>`);
  });

  await asyncForEach($('script'), async el => {
    var url = el.attribs.src;

    if (url) {
      const response = await axios.get(url);
      console.log(response.data);

      $(el).replaceWith(`<script>${response.data}</script>`);
    }
  });

  fs.writeFileSync('./src/logs.offline.ejs', unescapeHTML($.html()));
})();
