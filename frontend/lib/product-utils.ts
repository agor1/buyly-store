export const formatPrice = (price: string) => {
  if (/[a-z]/i.test(price)) {
    return price;
  }

  const value = Number(price);

  if (Number.isNaN(value)) {
    return price;
  }

  return new Intl.NumberFormat("pl-PL", {
    currency: "PLN",
    style: "currency",
  }).format(value);
};

export const getStockLabel = (stock: number) => {
  if (stock <= 0) {
    return "Brak w magazynie";
  }

  return `${stock} szt.`;
};
