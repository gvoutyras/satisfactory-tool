const data = require("./data");
const fs = require("fs");

const buildings = data.buildings;
const miners = data.miners;
const recipes = data.recipes;
const items = data.items;
const resources = data.resources;

const remakeRecipes = () => {
  const cleanRes = resources.reduce((acc, el) => {
    acc.push(el.key_name);
  }, []);

  const finalData = recipes.reduce((acc, el) => {
    const recipeItem = {};
    recipeItem.id = el.key_name;
    recipeItem.name = el.name;
    recipeItem.time = el.time;
    recipeItem.category = el.category;
    recipeItem.ingredients = el.ingredients?.map((item) => ({
      id: item[0],
      amount: item[1],
      isRaw: cleanRes.includes(item[0]),
    }));
    recipeItem.amount = el.product[1];

    acc.push(recipeItem);

    return acc;
  }, []);

  //   fs.writeFileSync("./recipes.json", JSON.stringify(finalData));

  return finalData;
};

remakeRecipes();
