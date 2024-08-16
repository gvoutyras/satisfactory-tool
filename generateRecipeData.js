const data = require("./data/active/GameData.json");
const liquids = require("./data/active/liquids.json");
const rawMaterials = require("./data/active/rawMaterials.json");
const fs = require("fs");

const isLiquid = (name) => {
  return liquids.includes(name);
};

const isRaw = (name) => {
  return rawMaterials.includes(name);
};

const unifyData = () => {
  return data.reduce((acc, el) => {
    acc.push(...el.Classes);

    return acc;
  }, []);
};

const filteredGameData = (selector) => {
  return unifyData().filter((el) => el.ClassName?.startsWith(selector));
};

const generateRecipeData = () => {
  const result = filteredGameData("Recipe_").reduce((acc, el) => {
    const recipeItem = {};

    if (el.mDisplayName === "N/A") return acc;
    if (el.FullName.includes("Building")) return acc;
    if (el.FullName.includes("-Shared")) return acc;
    if (el.mProducedIn.includes("BP_WorkshopComponent_C")) return acc;
    if (el.mProducedIn.includes("BP_BuildGun_C")) return acc;

    recipeItem.name = el.mDisplayName;
    recipeItem.id = el.ClassName;
    recipeItem.duration = el.mManufactoringDuration;

    recipeItem.producedIn = el.mProducedIn
      .split(",")[0]
      .split(".")[1]
      .replace(/[^a-zA-Z0-9_]/g, "");

    recipeItem.produce = el.mProduct.split("),(").map((inner) => {
      const clearData = inner
        .replace(
          "ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/",
          ""
        )
        .split(",");

      const id = clearData[0].split(".")[1]?.replace(/[^a-zA-Z0-9_]/g, "");
      const amount = clearData[1]?.split("=")[1]?.replace(/[^a-zA-Z0-9]/g, "");

      const amountDec = parseInt(amount) / 1000;

      const amountPerMin = (60 / recipeItem.duration) * amount;
      const amountDecPerMin = parseInt(amountPerMin) / 1000;

      const liquid = isLiquid(id);

      return {
        id,
        name: resolveNames(id),
        amountRaw: amount,
        amount: liquid ? amountDec : amount,
        perMinute: {
          amountRaw: amountPerMin,
          amount: liquid ? amountDecPerMin : amountPerMin,
        },
      };
    });

    recipeItem.ingredients = el.mIngredients.split("),(").map((inner) => {
      const clearData = inner
        .replace(
          "ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/",
          ""
        )
        .split(",");

      const id = clearData[0].split(".")[1]?.replace(/[^a-zA-Z0-9_]/g, "");
      const amount = clearData[1]?.split("=")[1]?.replace(/[^a-zA-Z0-9]/g, "");

      const amountDec = parseInt(amount) / 1000;

      const ingredientPerMin = (60 / recipeItem.duration) * amount;
      const ingredientDecPerMin = parseInt(ingredientPerMin) / 1000;

      const liquid = isLiquid(id);
      const raw = isRaw(id);

      return {
        id,
        raw,
        name: resolveNames(id),
        amountRaw: amount,
        amount: liquid ? amountDec : amount,
        perMinute: {
          amountRaw: ingredientPerMin,
          amount: liquid ? ingredientDecPerMin : ingredientPerMin,
        },
      };
    });

    acc.push(recipeItem);

    return acc;
  }, []);
  fs.writeFileSync("./data/active/newRecipes.json", JSON.stringify(result));
};

const resolveNames = (id) => {
  return unifyData().find((el) => el.ClassName === id).mDisplayName;
};

generateRecipeData();
