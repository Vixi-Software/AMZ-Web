import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands, setPriceRanges, resetFilter } from '../../store/features/filterProduct/filterProductSlice';
import { Grid } from 'antd';
import { useUrlParams } from '../../hooks/useUrlParams';
function SideBarProduct({
  brands = [],
  priceRanges = [],
  forceShow = false,
  onFilterChange, // Thêm prop này
}) {
  const screens = Grid.useBreakpoint()
  const dispatch = useDispatch();
  const { urlParams, updateUrlParams } = useUrlParams();
  const { brands: selectedBrands, priceRanges: selectedPrices } = useSelector(
    (state) => state.filterProduct
  );

  // const allProductsState = useSelector((state) => state.allProducts);
  // const allProductsArray = Object.values(allProductsState).flat();
  // const category = useSelector(selectCategory);
  // const filteredProduct = allProductsArray.filter(
  //   (product) => product.collection === category
  // );
  // const brands = [
  //   ...new Set(filteredProduct.map((product) => product.brand).filter(Boolean))
  // ];
 

  const memoBrands = useMemo(() => brands, [brands]);

  const handleBrandClick = (brand) => {
    let newBrands;
    if (selectedBrands.includes(brand)) {
      newBrands = selectedBrands.filter((b) => b !== brand);
    } else {
      newBrands = [...selectedBrands, brand];
    }
    
    dispatch(setBrands(newBrands));
    updateUrlParams({ brands: newBrands });
  };

  const handleReset = () => {
    dispatch(resetFilter());
    updateUrlParams({ 
      brands: [], 
      priceRanges: [],
      sort: 'bestseller'
    });
  };

  const handlePriceChange = (value) => {
    let newPriceRanges;
    // Kiểm tra nếu đã chọn thì bỏ chọn, chưa chọn thì thêm vào
    const isAlreadySelected = selectedPrices.some((v) => {
      const currentMin = Number(v[0]);
      const currentMax = v[1] === null || v[1] === Infinity ? Infinity : Number(v[1]);
      const newMin = Number(value[0]);
      const newMax = value[1] === null || value[1] === Infinity ? Infinity : Number(value[1]);
      return currentMin === newMin && currentMax === newMax;
    });
    
    if (isAlreadySelected) {
      newPriceRanges = selectedPrices.filter((v) => {
        const currentMin = Number(v[0]);
        const currentMax = v[1] === null || v[1] === Infinity ? Infinity : Number(v[1]);
        const newMin = Number(value[0]);
        const newMax = value[1] === null || value[1] === Infinity ? Infinity : Number(value[1]);
        return !(currentMin === newMin && currentMax === newMax);
      });
    } else {
      newPriceRanges = [...selectedPrices, value];
    }
    
    dispatch(setPriceRanges(newPriceRanges));
    updateUrlParams({ priceRanges: newPriceRanges });
  };

  // const handleNeedChange = (value) => {
  //   if (selectedNeeds.includes(value)) {
  //     dispatch(setNeeds(selectedNeeds.filter((v) => v !== value)));
  //   } else {
  //     dispatch(setNeeds([...selectedNeeds, value]));
  //   }
  // };

  // Đồng bộ URL params với Redux store khi component mount
  useEffect(() => {
    if (urlParams.brands && urlParams.brands.length > 0 && selectedBrands.length === 0) {
      dispatch(setBrands(urlParams.brands));
    }
    if (urlParams.priceRanges && urlParams.priceRanges.length > 0 && selectedPrices.length === 0) {
      dispatch(setPriceRanges(urlParams.priceRanges));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy khi component mount

  useEffect(() => {
    // Cleanup khi component unmount
    return () => {
      dispatch(resetFilter());
    };
  }, [dispatch]);

  const getCombinedPriceRange = (ranges) => {
    if (!ranges.length) return [];
    const all = ranges.flat();
    const min = Math.min(...all);
    const max = Math.max(...all);
    return [min, max];
  };

  useEffect(() => {
    getCombinedPriceRange(selectedPrices);
    // Dispatch lên store hoặc xử lý tiếp ở đây
    // dispatch(setCombinedPriceRange(combined)); // Nếu có action này
  }, [selectedPrices]);

  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange({
        brands: selectedBrands,
        priceRanges: selectedPrices,
      });
    }
  }, [selectedBrands, selectedPrices, onFilterChange]);

  if (!screens.sm && !forceShow) return null;

  return (
    <div>
      <div>
        <div className="font-semibold mb-2 text-orange-600 tracking-wide">Thương hiệu</div>
        <div className="grid grid-cols-2 gap-2">
          {memoBrands.map((brand) => (
            <div
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`w-full h-8 rounded-md flex items-center justify-center cursor-pointer font-medium transition-all duration-200
                ${selectedBrands.includes(brand)
                  ? 'border-2 border-orange-500 font-semibold bg-orange-50 scale-105 shadow-md'
                  : 'border border-gray-200 font-normal bg-white hover:bg-orange-100 hover:scale-105'}
              `}
            >
              <span
                className={`
                  transition-colors duration-200
                  font-bold
                  text-black
                  ${screens.md ? 'text-[10px]' : ''}
                  ${screens.lg ? '!text-[14px]' : ''}
                `}
              >
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="font-semibold mb-2 text-orange-600 tracking-wide">Khoảng giá</div>
        {priceRanges.map((range) => (
          <div key={range.label} className="mb-1">
            <label className="cursor-pointer flex items-center group transition-all duration-200">
              <input
                type="checkbox"
                checked={selectedPrices.some((v) => {
                  const currentMin = Number(v[0]);
                  const currentMax = v[1] === null || v[1] === Infinity ? Infinity : Number(v[1]);
                  const rangeMin = Number(range.value[0]);
                  const rangeMax = range.value[1] === null || range.value[1] === Infinity ? Infinity : Number(range.value[1]);
                  return currentMin === rangeMin && currentMax === rangeMax;
                })}
                onChange={() => handlePriceChange(range.value)}
                className="accent-orange-500 !mr-1.5 scale-110 transition-transform duration-200 group-hover:scale-125"
              />
              <span className={`transition-colors duration-200 ${
                selectedPrices.some((v) => {
                  const currentMin = Number(v[0]);
                  const currentMax = v[1] === null || v[1] === Infinity ? Infinity : Number(v[1]);
                  const rangeMin = Number(range.value[0]);
                  const rangeMax = range.value[1] === null || range.value[1] === Infinity ? Infinity : Number(range.value[1]);
                  return currentMin === rangeMin && currentMax === rangeMax;
                })
                  ? 'text-orange-500 font-semibold'
                  : 'group-hover:text-orange-400'
              }`}>
                {range.label}
              </span>
            </label>
          </div>
        ))}
        {/* Hiển thị khoảng giá tổng hợp nếu có chọn */}
        {/* {selectedPrices.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Đã chọn: {(() => {
              const all = selectedPrices.flat();
              const min = Math.min(...all);
              const max = Math.max(...all);
              return `${min.toLocaleString()}₫ - ${max.toLocaleString()}₫`;
            })()}
          </div>
        )} */}
      </div>

      {/* <div className="mt-6">
        <div className="font-semibold mb-2 text-orange-600 tracking-wide">Nhu cầu sử dụng</div>
        {needs.map((need) => (
          <div key={need.value} className="mb-1">
            <label className="cursor-pointer flex items-center group transition-all duration-200">
              <input
                type="checkbox"
                checked={selectedNeeds.includes(need.value)}
                onChange={() => handleNeedChange(need.value)}
                className="accent-orange-500 !mr-1.5 scale-110 transition-transform duration-200 group-hover:scale-125"
              />
              <span className={`transition-colors duration-200 ${selectedNeeds.includes(need.value) ? 'text-orange-500 font-semibold' : 'group-hover:text-orange-400'}`}>
                {need.label}
              </span>
            </label>
          </div>
        ))}
      </div> */}

       <button
          className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition"
          onClick={handleReset}
        >
          Đặt lại bộ lọc
        </button>
    </div>
  );
}

export default SideBarProduct;
