export const numberFormatter = (value) => {
  const cleaned = String(value).replace(/[^\d.]/g, "");
  const [intPart, decPart] = cleaned.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
};

export const numberParser = (value) => {
  let cleaned = value.replace(/[^\d.]/g, "");
  const firstDotIndex = cleaned.indexOf(".");
  if (firstDotIndex !== -1) {
    // оставляем только первую точку, остальные удаляем
    cleaned =
      cleaned.slice(0, firstDotIndex + 1) +
      cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
  }
  return cleaned;
};
