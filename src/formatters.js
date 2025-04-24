export const numberFormatter = (value) => {
  const cleaned = String(value).replace(/[^\d.,]/g, "");
  const [intPart, decPart] = cleaned.split(/[,.]/);
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
};

export const numberParser = (value) => {
  let cleaned = value.replace(/[^\d.,]/g, "");
  const separatorIndex = cleaned.search(/[,.]/);
  if (separatorIndex !== -1) {
    // оставляем только первый разделитель (точку или запятую), остальные удаляем
    cleaned =
      cleaned.slice(0, separatorIndex + 1) +
      cleaned.slice(separatorIndex + 1).replace(/[,.]/g, "");
  }
  return cleaned;
};
