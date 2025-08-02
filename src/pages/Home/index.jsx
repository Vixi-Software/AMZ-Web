import React, { useEffect } from 'react'
import CountSale from './CountSale'
import ProductGrid from '../../components/features/ProductGrid'
import iconPopular from '../../assets/iconPopular.png'
import MainCarousel from './MainCarousel';
import BannerCustom from './BannerCustom';
import BannerCustom2 from './BannerCustom2';
import Feeback from './Feeback';
import fireIcon from '../../assets/fire.png'
import { useSelector, useDispatch } from 'react-redux'
import { useProductService } from '../../services/productService'
import { useHomeSettingService } from '../../services/homeSettingService'
import {
  setData as setAllDataRedux,
  setTaiNgheNhetTai,
  setLoaDeBan,
  setLoaKaraoke,
  setNewSealTaiNghe,
  setTaiNgheChupTai,
  setLoaDiDong
} from '../../store/features/allData/allDataSlice';
import { getAllTaiNgheNhetTai } from '../../utils/taiNgheNhetTaiHelper';
import { getAllLoaDeBan } from '../../utils/loaDeBan';
import { getAllLoaKaraoke } from '../../utils/loaKaraoke';
import { getAllNewSealTaiNghe } from '../../utils/newSeal';
import { getAllTaiNgheChupTai } from '../../utils/taiNgheChuptai';
import { getAllLoaDiDong } from '../../utils/diDong';

function Home() {
  const { getHomeSettingsWithStore } = useHomeSettingService();
  const dispatch = useDispatch();
  const [productsBestSeller, setProductsBestSeller] = React.useState([]);
  const [productsOnSale, setProductsOnSale] = React.useState([]);
  const [activeBestSeller, setActiveBestSeller] = React.useState("");
  const [activeOnSale, setActiveOnSale] = React.useState("");
  const [allBestSellerProducts, setAllBestSellerProducts] = React.useState([]);
  const [allSaleProducts, setAllSaleProducts] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const home = useSelector(state => state.homeSetting.homeSettings);
  const hasLoaded = React.useRef(false);
  const allProductsState = useSelector((state) => state.allProducts);
  const allProductsArray = Object.values(allProductsState).flat();

  React.useEffect(() => {
    const fetchProducts = async () => {

      // Lọc sản phẩm bán chạy
      const bestSellerProducts = allProductsArray.filter(
        (product) => product.isBestSeller === "1"
      );
      
      setAllBestSellerProducts(bestSellerProducts);
      setProductsBestSeller(bestSellerProducts);
      // Lọc sản phẩm đang sale
      const priceSaleProducts = allProductsArray.filter((product) => {
        const percent = parseFloat(product.salePercent);
        return !isNaN(percent) && percent > 0
      });
      setAllSaleProducts(priceSaleProducts)
      setProductsOnSale(priceSaleProducts)
    };

    fetchProducts();
  }, []);


  const combinedCategory = (category) => {
    switch (category) {
      case "Tai nghe nhét tai cũ":
      case "Tai nghe chụp tai cũ":
        return "Tai nghe"
      case "Loa di động cũ":
      case "Loa dể bàn cũ":
      case "Loa karaoke cũ":
        return "Loa"
      default:
        return ""
    }
  }
 
  // Hàm lọc cho từng ProductGrid
  const handleFilterBestSeller = async (category) => {
    if (activeBestSeller === category) {
      setActiveBestSeller(""); // Bỏ chọn
      setProductsBestSeller(allBestSellerProducts); // Hiện tất cả
    } else {
      setActiveBestSeller(category); // Đánh dấu nút đang active
      const filtered = allBestSellerProducts.filter(
        (product) => combinedCategory(product.category) && combinedCategory(product.category).toLowerCase().includes(category.toLowerCase())
      );
      setProductsBestSeller(filtered);
    }
  };

  const handleFilterOnSale = async (category) => {
    if (activeOnSale === category) {
      setActiveOnSale(""); // Bỏ chọn
      setProductsOnSale(allSaleProducts); // Hiện tất cả
    } else {
      setActiveOnSale(category); // Đánh dấu nút đang active
      const filtered = allSaleProducts.filter(
        (product) => combinedCategory(product.category) && combinedCategory(product.category).toLowerCase().includes(category.toLowerCase())
      );
      setProductsOnSale(filtered);
    }
  };
  React.useEffect(() => {
    if (hasLoaded.current) return; // chỉ chạy 1 lần duy nhất
    hasLoaded.current = true;

    let unsub1, unsub2, unsub3, unsub4, unsub5, unsub6;
    let loaded = 0;
    const temp = [];

    function handleLoaded() {
      loaded++;
      if (loaded === 6) {
        const all = [
          ...temp[0], // Tai nghe nhét tai
          ...temp[1], // Loa để bàn
          ...temp[2], // Loa karaoke
          ...temp[3], // New seal tai nghe
          ...temp[4], // Tai nghe chụp tai
          ...temp[5], // Loa di động
        ];

        // Convert all items to product objects
        const allProducts = [];
        all.forEach(item => {
          Object.entries(item).forEach(([id, value]) => {
            if (id === "id") return;
            const [
              code,
              page,
              brand,
              name,
              color,
              priceForSale,
              priceDefault,
              discount,
              inventories,
              condition,
              img1,
              description,
              tableInfo,
              isbestSeller,
              highlights,
              videoUrl
            ] = value.split("|");

            // Xác định category dựa vào code
            let category = "";
            switch (code) {
              case "01-nhet-tai-cu":
                category = "Tai nghe nhét tai cũ";
                break;
              case "05-loa-karaoke":
                category = "Loa karaoke cũ";
                break;
              case "04-de-ban-cu":
                category = "Loa để bàn cũ";
                break;
              case "06-hang-newseal":
                category = "Hàng newseal";
                break;
              case "02-chup-tai-cu":
                category = "Tai nghe chụp tai cũ";
                break;
              case "03-di-dong-cu":
                category = "Loa di động cũ";
                break;
              default:
                category = "Loa di động cũ";
            }

            allProducts.push({
              name: name || "",
              status: "active",
              isbestSeller: inventories == 0 ? true : false,
              colors: color ? color.split(",") : [],
              condition: condition ? [condition] : [],
              priceDefault: Number(priceDefault) || 0,
              priceForSale: Number(priceForSale) || 0,
              salePercent: Number(discount) || 0,
              inventories: Number(inventories) || 0,
              brand: brand || "",
              category: category, // <-- dùng category vừa xác định
              tags: "",
              description: description || "",
              highlights: highlights || "",
              images: img1 ? img1.split(";;").filter(Boolean) : [],
              tableInfo: tableInfo,
              sku: `${brand?.replace(/\s/g, "-") || ""}-${name?.replace(/\s/g, "-") || ""}-${color?.replace(/\s/g, "-") || ""}`,
              product_type: category, // <-- dùng category luôn cho product_type nếu muốn
              videoUrl: videoUrl || "",
            });
          });
        });

        setAllData(allProducts);
        dispatch(setAllDataRedux(allProducts));
        dispatch(setTaiNgheNhetTai(temp[0] || []));
        dispatch(setLoaDeBan(temp[1] || []));
        dispatch(setLoaKaraoke(temp[2] || []));
        dispatch(setNewSealTaiNghe(temp[3] || []));
        dispatch(setTaiNgheChupTai(temp[4] || []));
        dispatch(setLoaDiDong(temp[5] || []));
      }
    }

    unsub1 = getAllTaiNgheNhetTai((data) => {
      temp[0] = data || [];
      handleLoaded();
    });
    unsub2 = getAllLoaDeBan((data) => {
      temp[1] = data || [];
      handleLoaded();
    });
    unsub3 = getAllLoaKaraoke((data) => {
      temp[2] = data || [];
      handleLoaded();
    });
    unsub4 = getAllNewSealTaiNghe((data) => {
      temp[3] = data || [];
      handleLoaded();
    });
    unsub5 = getAllTaiNgheChupTai((data) => {
      temp[4] = data || [];
      handleLoaded();
    });
    unsub6 = getAllLoaDiDong((data) => {
      temp[5] = data || [];
      handleLoaded();
    });

    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
      unsub3 && unsub3();
      unsub4 && unsub4();
      unsub5 && unsub5();
      unsub6 && unsub6();
    };
  }, [dispatch]);

  useEffect(() => {
    getHomeSettingsWithStore();
  }, []);

  return (
    <div className='flex flex-col gap-6'>
      <MainCarousel />
      <CountSale endDate={home?.endDate} content={home?.content} />
      <BannerCustom />
      <ProductGrid
        title={<span className='flex gap-2'><b>Top bán chạy</b><img width={34} height={24} src={iconPopular} alt="" /></span>}
        buttons={[
          { label: "Top tai nghe", type: "primary", className: "!font-semibold !bg-[#D65312]", onClick: () => handleFilterBestSeller("Tai nghe"), category: "Tai nghe" },
          { label: "Top loa", className: "!font-semibold", onClick: () => handleFilterBestSeller("Loa"), category: "Loa" }
        ]}
        products={productsBestSeller}
        banners={[
          { index: 0, image: home?.[0]?.topSellingImage1 || "" },
          { index: 6, image: home?.[0]?.topSellingImage2 || "" }
        ]}
        activeCategory={activeBestSeller}
      />
      <BannerCustom2 />
      <ProductGrid
        title={<span className='flex gap-2'><b>Deal cực cháy - Mua ngay kẻo lỡ</b><img width={34} height={24} src={fireIcon} alt="" /></span>}
        buttons={[
          { label: "Tai nghe đang sale", type: "primary", className: "!font-semibold !bg-[#D65312]", onClick: () => handleFilterOnSale("Tai nghe"), category: "Tai nghe" },
          { label: "Loa đang sale", className: "!font-semibold", onClick: () => handleFilterOnSale("Loa"), category: "Loa" }
        ]}
        products={productsOnSale}
        banners={[
          { index: 0, image: home?.[0]?.hotDealImage1 || "" },
          { index: 6, image: home?.[0]?.hotDealImage1 || "" }
        ]}
        activeCategory={activeOnSale}
      />
      <Feeback />
    </div>
  )
}

export default Home