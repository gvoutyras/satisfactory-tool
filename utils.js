const getLiquids = () => {
  const result = unifyData().reduce((acc, el) => {
    if (el.mForm === "RF_LIQUID") acc.push(el.ClassName);

    return acc;
  }, []);
  fs.writeFileSync("./liquids.json", JSON.stringify(result));
};

const getRawMaterials = () => {
  const rawMats = data[11].Classes;

  const result = rawMats.reduce((acc, el) => {
    acc.push(el.ClassName);

    return acc;
  }, []);

  fs.writeFileSync("./rawMaterials.json", JSON.stringify(result));
};
