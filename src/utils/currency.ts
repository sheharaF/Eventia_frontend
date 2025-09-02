export const formatLKR = (value: number | string | undefined | null) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return "LKR 0";
  return `LKR ${num.toLocaleString("en-LK")}`;
};

export default formatLKR;

