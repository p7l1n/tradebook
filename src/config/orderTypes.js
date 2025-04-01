export const ORDER_TYPES = {
  order: "СДЕЛКА",
  profit: "ПРИБЫЛЬ",
  move: "ПЕРЕСТН.",
  trade: "ВЫРУЧКА",
};

export const getOrderTypeFromIndex = (index) => {
  if (index === 0) return ORDER_TYPES.order;
  if (index === 1) return ORDER_TYPES.move;
  if (index === 2) return ORDER_TYPES.trade;
};
