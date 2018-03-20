var critical = require("critical");

critical.generate({
  inline: true,
  base: "dist/",
  src: "index.html",
  dest: "index.html",
  width: 500,
  height: 900
});

console.log("Critical CSS rendered.");
