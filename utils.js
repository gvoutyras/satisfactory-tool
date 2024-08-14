const getLiquids = () => {
  const result = unifyData().reduce((acc, el) => {
    if (el.mForm === "RF_LIQUID") acc.push(el.ClassName);

    return acc;
  }, []);
  fs.writeFileSync("./liquids.json", JSON.stringify(result));
};

getLiquids();
