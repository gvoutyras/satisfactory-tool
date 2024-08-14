/**
 * {
    "ClassName": "Recipe_ComputerSuper_C",
    "FullName": "BlueprintGeneratedClass /Game/FactoryGame/Recipes/Manufacturer/Recipe_ComputerSuper.Recipe_ComputerSuper_C",
    "mDisplayName": "Supercomputer",
    "mIngredients": "((ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/Computer/Desc_Computer.Desc_Computer_C\"',Amount=2),(ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/CircuitBoardHighSpeed/Desc_CircuitBoardHighSpeed.Desc_CircuitBoardHighSpeed_C\"',Amount=2),(ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/HighSpeedConnector/Desc_HighSpeedConnector.Desc_HighSpeedConnector_C\"',Amount=3),(ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/Plastic/Desc_Plastic.Desc_Plastic_C\"',Amount=28))",
    "mProduct": "((ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/ComputerSuper/Desc_ComputerSuper.Desc_ComputerSuper_C\"',Amount=1))",
    "mManufacturingMenuPriority": "2.000000",
    "mManufactoringDuration": "32.000000",
    "mManualManufacturingMultiplier": "1.500000",
    "mProducedIn": "(\"/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C\",\"/Game/FactoryGame/Buildable/-Shared/WorkBench/BP_WorkBenchComponent.BP_WorkBenchComponent_C\",\"/Script/FactoryGame.FGBuildableAutomatedWorkBench\")",
    "mRelevantEvents": "",
    "mVariablePowerConsumptionConstant": "0.000000",
    "mVariablePowerConsumptionFactor": "1.000000"
    }
    {
    "ClassName": "Recipe_Wall_Orange_8x8_Corner_02_C",
    "FullName": "BlueprintGeneratedClass /Game/FactoryGame/Recipes/Buildings/Walls/Recipe_Wall_Orange_8x8_Corner_02.Recipe_Wall_Orange_8x8_Corner_02_C",
    "mDisplayName": "Tilted Concave Wall 8m",
    "mIngredients": "((ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/Cement/Desc_Cement.Desc_Cement_C\"',Amount=2))",
    "mProduct": "((ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Desc_Wall_Orange_8x8_Corner_02.Desc_Wall_Orange_8x8_Corner_02_C\"',Amount=1))",
    "mManufacturingMenuPriority": "0.000000",
    "mManufactoringDuration": "1.000000",
    "mManualManufacturingMultiplier": "1.000000",
    "mProducedIn": "(\"/Game/FactoryGame/Equipment/BuildGun/BP_BuildGun.BP_BuildGun_C\")",
    "mRelevantEvents": "",
    "mVariablePowerConsumptionConstant": "0.000000",
    "mVariablePowerConsumptionFactor": "1.000000"
    }
    {
    "ClassName": "Desc_ManufacturerMk1_C",
    "mDisplayName": "",
    "mDescription": "",
    "mAbbreviatedDisplayName": "",
    "mStackSize": "SS_MEDIUM",
    "mCanBeDiscarded": "True",
    "mRememberPickUp": "False",
    "mEnergyValue": "0.000000",
    "mRadioactiveDecay": "0.000000",
    "mForm": "RF_INVALID",
    "mSmallIcon": "Texture2D /Game/FactoryGame/Buildable/Factory/ManufacturerMk1/UI/IconDesc_Manufacturer_512.IconDesc_Manufacturer_512",
    "mPersistentBigIcon": "Texture2D /Game/FactoryGame/Buildable/Factory/ManufacturerMk1/UI/IconDesc_Manufacturer_512.IconDesc_Manufacturer_512",
    "mCrosshairMaterial": "None",
    "mDescriptorStatBars": "",
    "mSubCategories": "(/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Interface/UI/InGame/BuildMenu/BuildCategories/Sub_Production/SC_Manufacturers.SC_Manufacturers_C\"')",
    "mMenuPriority": "3.000000",
    "mFluidColor": "(B=0,G=0,R=0,A=0)",
    "mGasColor": "(B=0,G=0,R=0,A=0)",
    "mCompatibleItemDescriptors": "",
    "mClassToScanFor": "None",
    "mScannableType": "RTWOT_Default",
    "mShouldOverrideScannerDisplayText": "False",
    "mScannerDisplayText": "",
    "mScannerLightColor": "(B=0,G=0,R=0,A=0)"
    }
 */

const data = require("./GameData.json");
const fs = require("fs");

const unifyData = () => {
  return data.reduce((acc, el) => {
    acc.push(...el.Classes);

    return acc;
  }, []);
};

const filteredGameData = (selector) => {
  return unifyData().filter((el) => el.ClassName?.startsWith(selector));
};

const magic = () => {
  const result = filteredGameData("Recipe_").reduce((acc, el) => {
    const recipeItem = {};

    if (el.mDisplayName === "N/A") return acc;
    if (el.FullName.includes("Building")) return acc;
    if (el.FullName.includes("-Shared")) return acc;

    recipeItem.name = el.mDisplayName;
    recipeItem.id = el.ClassName;
    recipeItem.duration = el.mManufactoringDuration;

    recipeItem.producedIn = el.mProducedIn
      .split(",")[0]
      .split(".")[1]
      .replace(/[^a-zA-Z0-9_]/g, ""); // map this with game data

    recipeItem.amount = el.mProduct
      .split(",Amount=")[1]
      ?.replace(/[^a-zA-Z0-9]/g, "");

    recipeItem.ingredients = el.mIngredients.split("),(").map((inner) => {
      const clearData = inner
        .replace(
          "ItemClass=/Script/Engine.BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/",
          ""
        )
        .split(",");

      const amount = clearData[1]?.split("=")[1]?.replace(/[^a-zA-Z0-9]/g, "");

      const ingredientPerMin = (60 / recipeItem.duration) * amount;

      return {
        id: clearData[0].split(".")[1]?.replace(/[^a-zA-Z0-9_]/g, ""),
        amount: amount,
        perMinute: { amount: ingredientPerMin },
      };
    });

    const amountPerMin = (60 / recipeItem.duration) * recipeItem.amount;
    recipeItem.perMinute = { amount: amountPerMin };

    acc.push(recipeItem);

    return acc;
  }, []);
  fs.writeFileSync("./newRecipes.json", JSON.stringify(result));
};

distinctBuildings = () => {
  filteredGameData("Desc_").reduce((acc, el) => {}, []);
};

magic();

// liquids must have /1000
