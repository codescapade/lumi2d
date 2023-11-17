const markdownIt = require('markdown-it');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const dateFilter = require('./src/filters/nunjucks-date');

const MARKDOWN_OPTIONS = {
    html: true,
    breaks: false,
    linkify: true
};

const md = markdownIt(MARKDOWN_OPTIONS);

module.exports = (config) => {
  config.addPassthroughCopy('src/static');
  config.addPassthroughCopy({'src/experimentFiles': 'experiments'});

  config.setLibrary("md", md);

  config.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postcss([tailwindcss(require('./tailwind.config.js')), autoprefixer()])
      .process(cssCode)
      .then(
        (r) => done(null, r.css),
        (e) => done(e, null)
      );
  });

  config.addWatchTarget('styles/**/*.css');

  config.addNunjucksFilter('date', dateFilter);

  config.addCollection('experiments', (collection) => {
    return collection.getFilteredByGlob('./src/experiments/**/*.md');
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: '../docs'
    },
    pathPrefix: '/lumi2d/'
  };
};