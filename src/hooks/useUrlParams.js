import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlParams = useMemo(() => {
    // Helper function to safely parse price ranges
    const parsePriceRanges = (priceRangesStr) => {
      if (!priceRangesStr) return [];
      
      try {
        // Try new simple format first: "min1-max1,min2-max2"
        if (priceRangesStr.includes('-') && !priceRangesStr.includes('[')) {
          const ranges = priceRangesStr.split(',').map(range => {
            const [min, max] = range.split('-');
            return [
              Number(min) || 0,
              max === 'inf' ? Infinity : Number(max) || Infinity
            ];
          }).filter(([min, max]) => !isNaN(min) && (max === Infinity || !isNaN(max)));
          
          // Remove duplicates
          const unique = ranges.filter((range, index, arr) => {
            return index === arr.findIndex(([min, max]) => 
              range[0] === min && range[1] === max
            );
          });
          
          return unique;
        }
        
        // Fallback to JSON format for backward compatibility
        const parsed = JSON.parse(priceRangesStr);
        
        // Convert null values back to Infinity and ensure valid ranges
        const converted = parsed.map(([min, max]) => [
          Number(min) || 0,
          max === null ? Infinity : Number(max) || Infinity
        ]).filter(([min, max]) => !isNaN(min) && (max === Infinity || !isNaN(max)));
        
        // Remove duplicates
        const unique = converted.filter((range, index, arr) => {
          return index === arr.findIndex(([min, max]) => 
            range[0] === min && range[1] === max
          );
        });
        
        return unique;
      } catch {
        // Fallback: try with decoding for backward compatibility
        try {
          const decodedStr = decodeURIComponent(priceRangesStr);
          const parsed = JSON.parse(decodedStr);
          
          const converted = parsed.map(([min, max]) => [
            Number(min) || 0,
            max === null ? Infinity : Number(max) || Infinity
          ]).filter(([min, max]) => !isNaN(min) && (max === Infinity || !isNaN(max)));
          
          const unique = converted.filter((range, index, arr) => {
            return index === arr.findIndex(([min, max]) => 
              range[0] === min && range[1] === max
            );
          });
          
          return unique;
        } catch (fallbackError) {
          console.warn('Failed to parse priceRanges from URL:', fallbackError);
          return [];
        }
      }
    };

    return {
      category: searchParams.get('category') || 'Tất cả sản phẩm',
      brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
      priceRanges: parsePriceRanges(searchParams.get('priceRanges')),
      sort: searchParams.get('sort') || 'bestseller',
      id: searchParams.get('id'),
      collection: searchParams.get('collection'),
    };
  }, [searchParams]);

  const updateUrlParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        updatedParams.delete(key);
      } else if (Array.isArray(value)) {
        if (key === 'brands') {
          updatedParams.set(key, value.join(','));
        } else if (key === 'priceRanges') {
          // Convert to a simpler format: "min1-max1,min2-max2"
          const simpleFormat = value.map(([min, max]) => 
            `${min}-${max === Infinity ? 'inf' : max}`
          ).join(',');
          updatedParams.set(key, simpleFormat);
        }
      } else {
        // For category and other string values, use the value directly
        // URLSearchParams will handle basic encoding appropriately
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
  };

  return {
    urlParams,
    updateUrlParams,
    searchParams
  };
};
