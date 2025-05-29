const replaceAll = (templateString, wordToReplace, replaceWith) => {
  const regex = new RegExp(wordToReplace, "g");
  return templateString.replace(regex, replaceWith);
};

export const replaceCommasWithDots = (value) => {
  return String(value).replace(/,/g, ".");
};

export const toCurrency = (n, separator = " ") => {
  const num = +(n + "");
  return replaceAll(num.toLocaleString("en"), ",", separator);
};

export const getNumFormat = (n, digit) => {
  const val = `${n}`;
  if (!val.includes(".")) return val;

  const floatValue = val.split(".");
  return `${floatValue[0]}.${floatValue[1].slice(0, digit)}`;
};

export const isTodayBetweenDates = (date1, date2) => {
  const isSameDay = (d) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  return isSameDay(new Date(date1)) && isSameDay(new Date(date2));
};

export const checkVinny = (name = "") => {
  if (name === "Прибыль") return "Винни";
  return name;
};

export const parseLongName = (name = "") => {
  if (name === "Прибыль") return "Винни";
  const str = name.split("@")[0];
  return str.length >= 12 ? `${str.slice(0, 10)}...` : str;
};

export const sortByKey = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aValue = a[key].toLowerCase();
    const bValue = b[key].toLowerCase();
    return direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
};
