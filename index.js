const { forEach } = require("lodash");
const data = require("./data/active/newRecipes.json");

let depth = 0;
let id = -1;
const rawMats = [];
const steps = [];
let multiplier = 1;

const baseRecipe = (selectedItem, amount = -1) => {
  if (amount !== -1) {
    const itemData = getItemData(selectedItem);
    multiplier =
      amount /
      itemData[1].produce.find((el) => el.id === selectedItem).perMinute.amount;
    console.log("🚀 ~ file: index.js:14 ~ multiplier:", multiplier);
  }
  const rawMats = [];
  const targetRecipe = data.reduce((acc, recipe) => {
    const products = recipe.produce.reduce((acc, el) => {
      acc.push(el.id);

      return acc;
    }, []);

    if (products.includes(selectedItem)) {
      acc.push(recipe);
    }

    return acc;
  }, []);

  if (targetRecipe.length > 1)
    console.log(`Multiple recipes for ${targetRecipe[0].name}`);

  targetRecipe[0].ingredients.forEach((item, i) => {
    if (i === 0) depth++;

    console.log(`Resolved ${item.name} for ${selectedItem}`);

    steps.push({
      id: item.id,
      name: item.name,
      depth,
    });
    if (!item.raw) baseRecipe(item.id);
    else rawMats.includes(item.id) ? "" : rawMats.push(item.id);
  });
  depth--;
};

const prettyPrintData = () => {
  steps.forEach((el, i) => {
    if (i === 0) {
      console.log(el.id);
      return;
    }
    const depth = el.depth;

    const tab = "   ";
    let tabs = "";
    for (let i = 0; i < depth; i++) tabs += tab;

    const printalbe = `${el.amount} x ${el.name} @ ${el.producedIn}`;

    console.log(tabs + printalbe);
  });
};

const getItemData = (itemId) => {
  // return data.filter((item) => item.produce[0].id === itemId);
  return data.filter((item) => {
    const wantedProduceItem = item.produce.map((prod) => {
      if (prod.id === itemId) return true;
      return false;
    });

    if (wantedProduceItem.includes(true)) return item;
  });
};

const findRecipesForItem = (produceId, useDefaults = false) => {
  const recipes = [];
  data.forEach((recipe) => {
    recipe.produce.forEach((prod, i) => {
      if (prod.id === produceId) recipes.push({ recipe, i });
    });
  });

  if (useDefaults)
    return recipes.filter((el) => !el.recipe.name.includes("Alternate"));
  return recipes;
};

const main = (selectedItem, amount = -1) => {
  steps.push({
    id: selectedItem,
    name: getItemData(selectedItem)[0].name,
    depth,
  });
  baseRecipe(selectedItem, 900);
  prettyPrintData();
};

main("Desc_AluminumIngot_C");
