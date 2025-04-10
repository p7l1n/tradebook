import { CONTRAGENTS } from "./config/noteTypes";

export const filterWithOutSystem = (item) => {
  return (
    item.name !== CONTRAGENTS.billing &&
    item.name !== CONTRAGENTS.note &&
    item.name != CONTRAGENTS.profit
  );
};
