export const setDate = (originDate: Date) => {
  let date = new Date(originDate).toISOString();
  date = date.split("T")[0];
  return date;
};
