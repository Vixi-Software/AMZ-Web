import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getAllTaiNgheNhetTai } from "../../utils/taiNgheNhetTaiHelper";
import { getAllNewSealTaiNghe } from "../../utils/newSeal";
import { getAllLoaKaraoke } from "../../utils/loaKaraoke";
import { getAllLoaDeBan } from "../../utils/loaDeBan";
import { getAllTaiNgheChupTai } from "../../utils/taiNgheChuptai";
import { getAllLoaDiDong } from "../../utils/diDong";
import ProductForm from './Product/ProductForm';
import { Modal, message } from 'antd';
import { db } from '../../utils/firebase';
import { doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { productToPipeString, pipeStringToProductObject } from '../../utils/convertFireBase.js'

function Admin() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("01-nhet-tai-cu");
  const [searchText, setSearchText] = useState("");
  const [editModal, setEditModal] = useState({ 
    visible: false, 
    key: '', 
    value: '', 
    page: '', 
    code: '' 
  });
  const [addModal, setAddModal] = useState({ 
    visible: false, 
    code: '', 
    page: '' 
  });
  const [imageModal, setImageModal] = useState({
    visible: false,
    images: [],
    currentIndex: 0
  });

  const categoryOptions = useMemo(() => [
    { value: "01-nhet-tai-cu", label: "Tai nghe nhét tai cũ" },
    { value: "02-chup-tai-cu", label: "Tai nghe chụp tai cũ" },
    { value: "03-di-dong-cu", label: "Loa di động cũ" },
    { value: "04-de-ban-cu", label: "Loa để bàn cũ" },
    { value: "05-loa-karaoke", label: "Loa karaoke cũ" },
    { value: "06-hang-newseal", label: "Hàng new seal" }
  ], []);

  const columns = useMemo(() => [
    "Brand", "Tên", "Màu", "Bán", "Gốc", "Giảm", 
    "SL", "TT", "Ảnh", "Mô tả", "Sửa/Xóa"
  ], []);

  const categoryHandlers = useMemo(() => ({
    "06-hang-newseal": getAllNewSealTaiNghe,
    "01-nhet-tai-cu": getAllTaiNgheNhetTai,
    "02-chup-tai-cu": getAllTaiNgheChupTai,
    "03-di-dong-cu": getAllLoaDiDong,
    "04-de-ban-cu": getAllLoaDeBan,
    "05-loa-karaoke": getAllLoaKaraoke,
  }), []);

  useEffect(() => {
    let unsubscribe;
    const handler = categoryHandlers[category] || getAllTaiNgheNhetTai;
    unsubscribe = handler(setItems);
    
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [category, categoryHandlers]);

  const parsePipeString = useCallback((pipeString) => {
    const arr = String(pipeString).split("|");
    return {
      ...pipeStringToProductObject(arr.slice(2), arr[0]),
      _code: arr[0],
      _page: arr[1],
    };
  }, []);

  const filterItems = useCallback((itemsPage, searchTerm) => {
    if (!itemsPage) return [];
    
    return Object.entries(itemsPage).filter(([key, value]) => {
      if (key === 'id') return false;
      
      if (searchTerm.trim() !== "") {
        const arr = String(value).split("|");
        const searchTarget = arr.slice(2, 2 + columns.length - 1).join(" ").toLowerCase();
        if (!searchTarget.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    });
  }, [columns]);

  const filteredItems = useMemo(() => 
    filterItems(items[page], searchText), 
    [items, page, searchText, filterItems]
  );

  const itemCount = useMemo(() => filteredItems.length, [filteredItems]);

  const handleUpdateProduct = useCallback(async (updated, key, code, page) => {
    try {
      const collectionName = code;
      const docRef = doc(db, collectionName, page);
      const pipeString = productToPipeString(updated, code, page);
      await setDoc(docRef, { [key]: pipeString }, { merge: true });
      message.success('Cập nhật sản phẩm thành công!');
      setEditModal({ visible: false, key: '', value: '', page: '', code: '' });
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Cập nhật sản phẩm thất bại!');
    }
  }, []);

  const handleAddProduct = useCallback(async (productData) => {
    try {
      const collectionName = addModal.code;
      const docRef = doc(db, collectionName, addModal.page);
      
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const newKey = `${timestamp}_${randomId}`;
      
      const pipeString = productToPipeString(productData, addModal.code, addModal.page);
      await setDoc(docRef, { [newKey]: pipeString }, { merge: true });
      message.success('Thêm sản phẩm thành công!');
      setAddModal({ visible: false, code: '', page: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Thêm sản phẩm thất bại!');
    }
  }, [addModal.code, addModal.page]);

  const handleDeleteProduct = useCallback(async (key, code, page) => {
    try {
      const collectionName = code;
      const docRef = doc(db, collectionName, page);
      await updateDoc(docRef, { [key]: deleteField() });
      message.success('Xóa sản phẩm thành công!');
      
      setItems((prevItems) => {
        const newItems = [...prevItems];
        if (newItems[page]) {
          delete newItems[page][key];
        }
        return newItems;
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Xóa sản phẩm thất bại!');
    }
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
    setPage(0);
  }, []);

  const handleEditClick = useCallback((value, key, pageName, code) => {
    const obj = parsePipeString(value);
    setEditModal({ visible: true, key, value: obj, page: pageName, code });
  }, [parsePipeString]);

  const handleDeleteClick = useCallback((key, code, pageName) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      handleDeleteProduct(key, code, pageName);
    }
  }, [handleDeleteProduct]);

  const closeEditModal = useCallback(() => {
    setEditModal({ visible: false, key: '', value: '', page: '', code: '' });
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModal({ visible: false, code: '', page: '' });
  }, []);

  const openAddModal = useCallback(() => {
    setAddModal({ 
      visible: true, 
      code: category, 
      page: `page${page + 1}` 
    });
  }, [category, page]);

  const openImageModal = useCallback((imageString) => {
    if (!imageString || imageString === "null" || imageString === "") return;
    
    const images = imageString.split(";;").filter(Boolean);
    if (images.length > 0) {
      setImageModal({
        visible: true,
        images: images,
        currentIndex: 0
      });
    }
  }, []);

  const closeImageModal = useCallback(() => {
    setImageModal({
      visible: false,
      images: [],
      currentIndex: 0
    });
  }, []);

  const nextImage = useCallback(() => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  }, []);

  const prevImage = useCallback(() => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  }, []);

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!imageModal.visible) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeImageModal();
      }
    };

    if (imageModal.visible) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [imageModal.visible, prevImage, nextImage, closeImageModal]);

  const renderImageCell = (field) => {
    if (!field || field === "null" || field === "") {
      return <span className="text-sm lg:text-base">Chưa cập nhật</span>;
    }

    const images = field.split(";;").filter(Boolean);
    return (
      <div 
        className="flex flex-wrap gap-0.5 max-w-[60px] lg:max-w-[90px] justify-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => openImageModal(field)}
        title="Nhấn để xem tất cả ảnh"
      >
        {images.slice(0, 2).map((img, i) => {
          const totalImages = images.length;
          const isLastVisible = i === 1 && totalImages > 2;

          return (
            <div key={i} className="relative w-6 h-6 lg:w-10 lg:h-10 m-0.5 rounded border border-gray-200 overflow-hidden">
              <img
                src={img}
                alt="Ảnh sản phẩm"
                className="w-full h-full object-cover"
                onError={e => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/40x40?text=No+Image'; 
                }}
              />
              {isLastVisible && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white flex items-center justify-center text-xs lg:text-base font-bold">
                  +{totalImages - 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderActionButtons = (value, key, pageName, code) => (
    <div className="flex gap-2 lg:gap-3 items-center justify-center">
      <button
        className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none rounded-md px-2 lg:px-4 py-1.5 lg:py-2.5 cursor-pointer text-sm lg:text-base font-bold transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-1 lg:gap-2 min-w-[50px] lg:min-w-[65px]"
        onClick={() => handleEditClick(value, key, pageName, code)}
        title="Chỉnh sửa sản phẩm"
      >
        <span className="text-sm lg:text-lg">✏️</span>
        <span className="hidden lg:inline">Sửa</span>
      </button>
      <button
        className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none rounded-md px-2 lg:px-4 py-1.5 lg:py-2.5 cursor-pointer text-sm lg:text-base font-bold transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-1 lg:gap-2 min-w-[50px] lg:min-w-[65px]"
        onClick={() => handleDeleteClick(key, code, pageName)}
        title="Xóa sản phẩm"
      >
        <span className="text-sm lg:text-lg">🗑️</span>
        <span className="hidden lg:inline">Xóa</span>
      </button>
    </div>
  );

  return (
    <div className="p-3 md:p-6">
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 border-none rounded-lg cursor-pointer text-base font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg hover:shadow-xl w-full"
          >
            <span className="text-lg">+</span>
            Thêm sản phẩm mới
          </button>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-3 rounded-lg border-2 border-blue-500 cursor-pointer text-base bg-white shadow-md w-full"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChange={handleSearchChange}
          className="px-4 py-3 rounded-lg border-2 border-blue-500 w-full text-base outline-none transition-colors duration-300 focus:border-blue-700 shadow-md"
        />

        <div className="flex flex-wrap gap-2 items-center justify-center">
          <span className="text-base font-bold text-gray-700 w-full text-center sm:w-auto">
            Trang:
          </span>
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-2 rounded-md cursor-pointer text-base font-bold transition-all duration-300 min-w-[40px] ${
                page === idx 
                  ? 'bg-blue-700 text-white border-none shadow-lg' 
                  : 'bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-100 shadow-md'
              }`}
              onClick={() => handlePageChange(idx)}
            >
              {idx + 1}
            </button>
          ))}
          <span className="text-sm text-gray-500 w-full text-center sm:w-auto mt-2 sm:mt-0">
            Hiển thị: {itemCount} sản phẩm
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-3">
        <div className="mb-6">
          <button
            onClick={openAddModal}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 border-none rounded-lg cursor-pointer text-lg font-bold flex items-center gap-3 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">+</span>
            Thêm sản phẩm mới
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChange={handleSearchChange}
            className="px-5 py-3 rounded-lg border-2 border-blue-500 min-w-[350px] text-lg outline-none transition-colors duration-300 focus:border-blue-700 shadow-md"
          />
        </div>
          
        <div className="mb-6">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-5 py-3 rounded-lg border-2 border-blue-500 cursor-pointer text-lg min-w-[300px] bg-white shadow-md"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap items-center">
          <span className="text-lg font-bold text-gray-700 mr-3">
            Trang:
          </span>
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`px-5 py-3 rounded-md cursor-pointer text-lg font-bold transition-all duration-300 min-w-[50px] ${
                page === idx 
                  ? 'bg-blue-700 text-white border-none shadow-lg' 
                  : 'bg-blue-50 text-blue-700 border-2 border-blue-500 hover:bg-blue-100 shadow-md'
              }`}
              onClick={() => handlePageChange(idx)}
            >
              {idx + 1}
            </button>
          ))}
          <span className="text-base text-gray-500 ml-3">
            Hiển thị: {itemCount} sản phẩm
          </span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-4 lg:mt-0">
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredItems.map(([key, value]) => {
              const arr = String(value).split("|");
              const code = arr[0];
              const pageName = arr[1];
              const fields = arr.slice(2, 2 + columns.length - 1);
              const isbestSeller = fields[6] === "0";
              
              return (
                <div key={key} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openImageModal(fields[8])}
                    title="Nhấn để xem tất cả ảnh"
                  >
                    {renderImageCell(fields[8])}
                  </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base truncate ${isbestSeller ? 'text-red-600' : 'text-gray-800'}`}>
                        {isbestSeller && <span className="mr-1">🔥</span>}
                        {fields[1] || "Chưa cập nhật"}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{fields[0] || "Chưa cập nhật"}</p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {fields[3] || "Chưa cập nhật"}đ
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div><span className="text-gray-500">Màu:</span> {fields[2] || "Chưa cập nhật"}</div>
                    <div><span className="text-gray-500">SL:</span> {fields[6] || "Chưa cập nhật"}</div>
                    <div><span className="text-gray-500">Giá gốc:</span> {fields[4] || "Chưa cập nhật"}đ</div>
                    <div><span className="text-gray-500">Giảm:</span> {fields[5] || "Chưa cập nhật"}%</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none rounded-md px-3 py-2 cursor-pointer text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1"
                      onClick={() => handleEditClick(value, key, pageName, code)}
                    >
                      <span>✏️</span>
                      <span>Sửa</span>
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none rounded-md px-3 py-2 cursor-pointer text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1"
                      onClick={() => handleDeleteClick(key, code, pageName)}
                    >
                      <span>🗑️</span>
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto max-h-[70vh] border border-gray-300 rounded-lg">
            <table className="border-collapse w-full bg-white shadow-lg min-w-[1000px]">
              <thead className="sticky top-0 z-10">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-3 lg:p-4 text-base lg:text-lg font-bold text-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(([key, value]) => {
                  const arr = String(value).split("|");
                  const code = arr[0];
                  const pageName = arr[1];
                  const fields = arr.slice(2, 2 + columns.length - 1);
                  
                  // Check if product is bestseller (index 6 in fields array corresponds to isbestSeller)
                  const isbestSeller = fields[6] === "0"; // "0" means bestseller
                  
                  return (
                    <tr key={key}>
                      {fields.map((field, idx) => (
                        columns[idx] === "Ảnh" ? (
                          <td
                            key={idx}
                            className="border border-gray-300 p-2 lg:p-4 bg-white max-w-[80px] lg:max-w-[120px] whitespace-normal text-center text-sm lg:text-base"
                            title={field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                          >
                            {renderImageCell(field)}
                          </td>
                        ) : columns[idx] === "Tên" ? (
                          <td
                            key={idx}
                            className={`border border-gray-300 p-2 lg:p-4 bg-white max-w-[100px] lg:max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis text-sm lg:text-base ${isbestSeller ? 'text-red-600 font-bold' : ''}`}
                            title={field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                          >
                            {isbestSeller && <span className="mr-1">🔥</span>}
                            {field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                          </td>
                        ) : (
                          <td
                            key={idx}
                            className="border border-gray-300 p-2 lg:p-4 bg-white max-w-[80px] lg:max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis text-sm lg:text-base"
                            title={field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                          >
                            {field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                          </td>
                        )
                      ))}
                      
                      <td className="border border-gray-300 p-2 lg:p-4 bg-white text-center min-w-[140px] lg:min-w-[160px]">
                        {renderActionButtons(value, key, pageName, code)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Modal
            open={editModal.visible}
            title="Cập nhật sản phẩm"
            width="90vw"
            style={{ maxWidth: '800px' }}
            footer={null}
            onCancel={closeEditModal}
            destroyOnHidden
          >
            <ProductForm
              initialValues={editModal.value}
              onFinish={values => handleUpdateProduct(values, editModal.key, editModal.code, editModal.page)}
            />
          </Modal>

          <Modal
            open={addModal.visible}
            title="Thêm sản phẩm mới"
            width="90vw"
            style={{ maxWidth: '800px' }}
            footer={null}
            onCancel={closeAddModal}
            destroyOnHidden
          >
            <ProductForm
              onFinish={handleAddProduct}
            />
          </Modal>

          <Modal
            open={imageModal.visible}
            title={`Xem ảnh sản phẩm (${imageModal.currentIndex + 1}/${imageModal.images.length})`}
            width="90vw"
            style={{ maxWidth: '900px' }}
            footer={null}
            onCancel={closeImageModal}
            destroyOnHidden
          >
            <div className="text-center">
              {imageModal.images.length > 0 && (
                <div className="relative">
                  <img
                    src={imageModal.images[imageModal.currentIndex]}
                    alt={`Ảnh sản phẩm ${imageModal.currentIndex + 1}`}
                    className="w-full max-h-[70vh] object-contain mx-auto"
                    onError={e => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; 
                    }}
                  />
                  
                  {imageModal.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full text-xl font-bold transition-all duration-200"
                        title="Ảnh trước"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full text-xl font-bold transition-all duration-200"
                        title="Ảnh tiếp theo"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {imageModal.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {imageModal.images.map((img, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 cursor-pointer border-2 rounded overflow-hidden transition-all duration-200 ${
                        index === imageModal.currentIndex 
                          ? 'border-blue-500 opacity-100' 
                          : 'border-gray-300 opacity-60 hover:opacity-80'
                      }`}
                      onClick={() => setImageModal(prev => ({ ...prev, currentIndex: index }))}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={e => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; 
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-5">📦</div>
          <h3 className="text-gray-500 mb-3 text-xl font-bold">Chưa có dữ liệu</h3>
          <p className="text-gray-400 m-0 text-lg">
            Vui lòng chọn danh mục để xem sản phẩm hoặc thêm sản phẩm mới
          </p>
        </div>
      )}
    </div>
  );
}

export default React.memo(Admin);