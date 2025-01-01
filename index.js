const data = require("./data/active/GameData.json");
const colors = require("colors");
const fs = require("fs");

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
      ingredientNo: i,
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

    // const printalbe = `${el.amount} x ${el.name} @ ${el.producedIn}`;
    const printalbe = `${el.name}-> ${el.depth}:${el.ingredientNo}`;

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

// const main = (selectedItem, amount = -1) => {
//   steps.push({
//     id: selectedItem,
//     name: getItemData(selectedItem)[0].name,
//     depth,
//   });
//   baseRecipe(selectedItem, 900);
//   prettyPrintData();
// };

// main("Desc_AluminumIngot_C");

const dataO = {};
let calls = 0;
const main = (itemId, raw, dataCopy) => {
  calls++;
  if (calls > 100)
    return fs.writeFileSync("./out.json", JSON.stringify(dataCopy));
  if (itemId === null) return;
  if (raw) return;

  const recipes = recipesForItem(itemId);
  recipes.forEach((recipe) => {
    const produces = [];
    recipe.produce.forEach((el) => produces.push({ id: el.id, name: el.name }));
    dataCopy[recipe.id] = { recipeName: recipe.name, produces };
    recipe.ingredients.forEach((el) => {
      if (!dataCopy[recipe.id].ingredients)
        dataCopy[recipe.id].ingredients = [];
      dataCopy[recipe.id].ingredients.push({
        id: el.id,
        name: el.name,
      });
    });
    const items = getItemsForRecipe(recipe);
    items.forEach((item) => {
      if (!dataCopy[recipe.id].items) dataCopy[recipe.id].items = [];
      dataCopy[recipe.id].items.push(item);
      console.log("🚀 ~ file: index.js:132 ~ res:", item);
      main(item.id, item.raw, dataCopy[recipe.id]);
    });
  });
};

const recipesForItem = (itemId) =>
  data.filter((item) => {
    const wantedProduceItem = item.produce?.map((prod) => {
      if (prod.id === itemId) return true;
      return false;
    });
    if (wantedProduceItem?.includes(true)) return item;
  });

const getItemsForRecipe = (recipe) => {
  console.log(`Resolve recipe ${`${recipe.id}`.red}`);

  return recipe.ingredients.map((el) => {
    return { id: el.id, raw: el.raw };
  });
};

main("Desc_Cement_C", false, dataO);

fs.writeFileSync("./out.json", JSON.stringify(dataO));
