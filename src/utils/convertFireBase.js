import {getCategoryByCode} from '../utils/getKeyFirebase.js'

// Convert product object to pipe string (reuse from ProductForm)
  function productToPipeString(product, code, page) {
    const brand = product.brand || 'null';
    const name = product.name || 'null';
    const color = Array.isArray(product.colors) ? product.colors[0] : (product.colors || 'null');
    const priceBanLe = product.pricesBanLe || 'null';
    const priceBanBuon = product.pricesBanBuon || 'null';
    const salePrice = product.salePrice || 'null';
    const statusSell = Array.isArray(product.statusSell) ? product.statusSell[0] : (product.statusSell || 'null');
    const isbestSeller = product.isbestSeller ? '0' : '1';
    const tableInfo = product.tableInfo || 'null';
    const decription = product.description || 'null';
    const highlights = product.highlights || 'null';
    const videoUrl = product.videoUrl || 'null';
    const images = Array.isArray(product.images) ? getGoogleDriveThumbnail(product.images).join(';;') : (getGoogleDriveThumbnail(product.images) || 'null');
    return [
      code,
      page,
      brand,
      name,
      color,
      priceBanLe,
      priceBanBuon,
      salePrice,
      isbestSeller,
      statusSell,
      images,
      decription,
      highlights,
      tableInfo,
      videoUrl
    ].join('|');
  }

  function pipeStringToProductObject(fields, code) {
    return {
      brand: fields[0] || "",
      name: fields[1] || "",
      colors: fields[2] ? [fields[2]] : [],
      pricesBanLe: Number(fields[3]) || 0,
      pricesBanBuon: Number(fields[4]) || 0,
      salePrice: Number(fields[5]) || 0,
      statusSell: fields[7] ? [fields[7]] : [],
      images: fields[8].split(";;") ? fields[8].split(";;") : [],
      description: fields[9] || "",
      tableInfo: fields[11] || "",
      isbestSeller: fields[11] === "0", // 0: true, 1: false
      highlights: fields[10] || "",
      videoUrl: fields[12] || "", // Thêm trường videoUrl
      category: getCategoryByCode(code), // lấy category từ code
      // Bổ sung các trường khác nếu cần
    };
  }

  function getGoogleDriveThumbnail(urlOrArray) {
    const extractId = (url) => {
      if (!url || typeof url !== 'string' || !url.includes('drive.google.com')) return url;
      const match = url.match(/(?:\/d\/|id=|\/file\/d\/|open\?id=)([a-zA-Z0-9_-]{10,})/);
      const id = match ? match[1] : null;
      return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
    };

    if (Array.isArray(urlOrArray)) {
      return urlOrArray.map(extractId);
    } else if (typeof urlOrArray === 'string') {
      return extractId(urlOrArray);
    } else {
      return urlOrArray;
    }
  }




  export {productToPipeString, pipeStringToProductObject}