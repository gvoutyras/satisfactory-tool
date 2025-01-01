const baseData = require("./data/active/newRecipesRelease.json");

// baseData[0].ingredients[0].perMinute
const AMOUNT = 4;
const TARGET_ITEM = "Adaptive Control Unit";

const target = baseData.find((el) => el.name === TARGET_ITEM);

let depth = 0;

depth++;
console.log(`${AMOUNT} x ${TARGET_ITEM}`);
target.ingredients?.forEach((el) => {
  const totalAmountForItem = el.perMinute.amount * AMOUNT;
  console.log(`${getDashes()}${totalAmountForItem} ${el.name}`);

  recur(el, totalAmountForItem);
});

function recur(item, wantedAmount) {
  const target = baseData.find((el) => el.name === item.name);
  if (!target || !target.produce) return;

  const perMinute = target.produce[0].perMinute.amount;
  let targetAmount;

  if (perMinute > wantedAmount) {
    // here downclock
    targetAmount = 1;
  } else {
    targetAmount = wantedAmount / perMinute;
  }

  depth++;
  target.ingredients?.forEach((ingredient) => {
    const finalTargetAmountForThisItem =
      ingredient.perMinute.amount * targetAmount;
    console.log(
      `${getDashes()}${finalTargetAmountForThisItem} ${ingredient.name}`
    );

    recur(ingredient, finalTargetAmountForThisItem);
  });
  depth--;
}

function getDashes() {
  let r = "";

  for (let i = 0; i < depth; i++) {
    r += "- ";
  }

  return r;
}
