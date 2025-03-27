export const NOTE_TYPES = {
  debit: "ДЕБЕТ",
  credit: "КРЕДИТ",
};

export const NOTE_COMMENT_TYPES = {
  cashOut: "Снятие прибыли",
};

export const CONTRAGENTS = {
  profit: "Прибыль",
  client: "Клиент",
  operator: "Оператор",
};

export const getContragentFromIndex = (index) => {
  if (index === 0) return CONTRAGENTS.client;
  if (index === 1) return CONTRAGENTS.operator;
  if (index === 2) return CONTRAGENTS.profit;
};
