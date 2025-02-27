export const getCategoryWiseProducts = (products, categories) => {
  if (!categories || !categories.length) {
    return products;
  }

  return products.filter((product) =>
    categories.some(
      (category) => product.category_name === category
    )
  );
};
