const a = data.reduce((acc, el) => {
  if (!acc[el.produce[0].id]) acc[el.produce[0].id] = [];
  acc[el.produce[0].id].push(el.ingredients);

  return acc;
}, {});

const fs = require("fs");

fs.writeFileSync("./test.json", JSON.stringify(a));
