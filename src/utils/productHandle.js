export const handleProduct = (data) => {

  const fields = [
    'id',
    'collection',
    'document',
    'brand',
    'name',
    'color',
    'priceForSale',
    'priceDefault',
    'salePercent',
    'isBestSeller',
    'condition',
    'images',
    'description',
    'features',
    'tableInfo',
    'youtubeUrl',
    'post',
    'category',
  ];

  const product = {};

  fields.forEach((key, index) => {
    product[key] = data[index] !== undefined ? data[index] : '';
  });

  switch (product.collection) {
    case "01-nhet-tai-cu":
      product.category = "Tai nghe nhét tai cũ"
      break;
    case "02-chup-tai-cu":
      product.category = "Tai nghe chụp tai cũ"
      break;
    case "03-di-dong-cu":
      product.category = "Loa di động cũ"
      break;
    case "04-de-ban-cu":
      product.category = "Loa để bàn cũ"
      break;
    case "05-loa-karaoke":
      product.category = "Loa karaoke cũ"
      break;
    case "06-hang-newseal":
      product.category = "Hàng newseal"
      break;
    default:
      product.category = ""
      break;
  }
  return product;
};