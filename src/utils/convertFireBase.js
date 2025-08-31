import {getCategoryByCollection} from '../utils/getKeyFirebase.js'

// Convert product object to pipe string (reuse from ProductForm)
  function productToPipeString(product, code, page) {
    const brand = product.brand || 'null';
    const name = product.name || 'null';
    const color = Array.isArray(product.colors) ? product.colors[0] : (product.colors || 'null');
    const priceBanLe = product.priceForSale || 'null';
    const priceBanBuon = product.priceDefault || 'null';
    const salePercent = product.salePercent || 'null';
    const condition = Array.isArray(product.condition) ? product.condition[0] : (product.condition || 'null');
    const isbestSeller = product.isbestSeller ? '1' : '0';
    const tableInfo = product.tableInfo || 'null';
    const decription = product.description || 'null';
    const highlights = product.highlights || 'null';
    const videoUrl = product.videoUrl || 'null';
    const images = Array.isArray(product.images) ? getGoogleDriveThumbnail(product.images).join(';;') : (getGoogleDriveThumbnail(product.images) || 'null');
    const post = product.post || 'null'
    return [
      code,
      page,
      brand,
      name,
      color,
      priceBanLe,
      priceBanBuon,
      salePercent,
      isbestSeller,
      condition,
      images,
      decription,
      highlights,
      tableInfo,
      videoUrl,
      post
    ].join('|');
  }

  function pipeStringToProductObject(fields, code) {
    const product ={
      brand: fields[0] || "",
      name: fields[1] || "",
      colors: fields[2] ? [fields[2]] : [],
      priceForSale: Number(fields[3]) || 0,
      priceDefault: Number(fields[4]) || 0,
      salePercent: Number(fields[5]) || 0,
      isbestSeller: fields[6] == "1", // 0: true, 1: false
      condition: fields[7] ? [fields[7]] : [],
      images: fields[8].split(";;") ? fields[8].split(";;") : [],
      description: fields[9] || "",
      highlights: fields[10] || "",
      tableInfo: fields[11] || "",
      videoUrl: fields[12] || "", // Thêm trường videoUrl
      post: fields[13] || "", // Thêm trường videoUrl
      category: getCategoryByCollection(code), // lấy category từ code
      // Bổ sung các trường khác nếu cần
    };
 
    return product
  }

    function getGoogleDriveThumbnail(urlOrArray) {
      const extractId = (url) => {
        if (!url || typeof url !== 'string' || !url.includes('drive.google.com')) return url;
        const match = url.match(/(?:\/d\/|id=|\/file\/d\/|open\?id=)([a-zA-Z0-9_-]{10,})/);
        const id = match ? match[1] : null;
        return id ? `https://lh3.googleusercontent.com/d/${id}` : url;

      };

      if (Array.isArray(urlOrArray)) {
        return urlOrArray.map(extractId);
      } else if (typeof urlOrArray === 'string') {
        return extractId(urlOrArray);
      } else {
        return urlOrArray;
      }
    }

  




  export {productToPipeString, pipeStringToProductObject, getGoogleDriveThumbnail}