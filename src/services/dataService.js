import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

// const urls = [
//   'https://gist.githubusercontent.com/trannhon2509/75b1875248c436856dd8de6bb6390272/raw/35cf8ebba1e238a447b502e3af38077e24cb5785/gistfile1.txt',
//   'https://gist.githubusercontent.com/trannhon2509/758d8f88d1ceeda4eaef4fb791ffbac8/raw/f4b877c7f59ee2918c6a1d9214a2825025c5563e/gistfile1.txt',
//   'https://gist.githubusercontent.com/trannhon2509/9b0b4df41217df0f53b2c8b9cd326623/raw/10f0a10f8fd9d181d1e00b38507dd929f8470d5d/gistfile1.txt',
//   'https://gist.githubusercontent.com/trannhon2509/42a372c7b50f98be924a22961b362674/raw/6358e4879a90f9b7896560974929c421a98a1cdb/gistfile1.txt'
// ];

const urls = [
  'https://raw.githubusercontent.com/vdev0812/downgrade-ear/refs/heads/main/products-1.json',
  'https://raw.githubusercontent.com/vdev0812/downgrade-ear/refs/heads/main/products-2.json',
  'https://raw.githubusercontent.com/vdev0812/downgrade-ear/refs/heads/main/products-3.json',
  'https://raw.githubusercontent.com/vdev0812/downgrade-ear/refs/heads/main/products-4.json'
]

export async function fetchProducts() {
  try {
    const responses = await Promise.all(urls.map(url => fetch(url)));
    const datas = await Promise.all(responses.map(res => res.json()));
    let allProducts = [];
    let allMetadata = [];
    datas.forEach(data => {
      allMetadata.push(data.metadata);
      allProducts = allProducts.concat(
        data.products.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          description: product.description,
          images: product.images || [],
          category: product.category,
          tags: product.tags,
          product_type: product.product_type,
          status: product.status,
          options: product.options?.map(opt => ({
            name: opt.name,
            values: opt.values
          })),
          variants: product.variants.map(variant => ({
            id: variant.id,
            name: variant.name,
            price: variant.variant_retail_price,
            sku: variant.sku,
            barcode: variant.barcode,
            status: variant.status,
            inventories: variant.inventories?.reduce((sum, inv) => sum + (inv.on_hand || 0), 0) || 0,
            prices: variant.variant_prices?.map(price => ({
              name: price.name,
              value: price.value
            }))
          }))
        }))
      );
    });
    return {
      metadata: allMetadata,
      products: allProducts
    };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function pushAllProductsToFirestore() {
  const colRef = collection(db, "productStore");
  const { products } = await fetchProducts();
  try {
    // Lọc chỉ lấy các sản phẩm có category phù hợp
    const filteredProducts = products.filter(product => {
      const cat = product.category || "";
      return (
        cat.includes("Tai nghe cắm dây") ||
        cat.includes("Tai nghe") ||
        cat.includes("Loa di động") ||
        cat.includes("Loa để bàn")
      );
    });

    for (const product of filteredProducts) {
      let newCategory = product.category;
      if (newCategory?.includes("Tai nghe cắm dây")) {
        newCategory = "Tai nghe chụp tai cũ";
      } else if (newCategory?.includes("Tai nghe")) {
        newCategory = "Tai nghe nhét tai cũ";
      } else if (newCategory?.includes("Loa di động")) {
        newCategory = "Loa di động cũ";
      } else if (newCategory?.includes("Loa để bàn")) {
        newCategory = "Loa để bàn cũ";
      } else if (newCategory?.toLowerCase().includes("karaoke")) {
        newCategory = "Loa karaoke cũ";
      }

      const colors = product.options?.[0]?.values || [];
      const inventories = product.variants?.reduce((sum, v) => sum + (v.inventories || 0), 0) || 0;
      const pricesBanLe = product.variants?.[0]?.prices?.[0]?.value
      const pricesBanBuon = product.variants?.[0]?.prices?.[1]?.value
      const sku = product.variants?.[0]?.sku || "";
      const nameParts = product.name.split('-').map(s => s.trim());
      const shortName = nameParts[2] || product.name;
      // Kiểm tra trùng lặp theo SKU
      const q = query(colRef, where("sku", "==", sku));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        continue; // Bỏ qua nếu đã tồn tại
      }

      // Sử dụng product.id làm id trên Firestore
      const docRef = doc(colRef, product.id+'');
      await setDoc(docRef, {
        brand: product.brand,
        category: newCategory,
        description: product.description,
        images: product.images,
        name: shortName,
        colors,
        statusSell: product.options?.[1]?.values || [],
        product_type: product.product_type,
        status: product.status,
        tags: product.tags,
        inventories,
        pricesBanLe,
        pricesBanBuon,
        sku
      });
    }
    return true;
  } catch (error) {
    console.error("Error pushing products to Firestore:", error);
    return false;
  }
}