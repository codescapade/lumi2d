const slugify = require("slugify");

function slug(input) {

    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true
    };

    return slugify(input, options);
}

module.exports = slug;