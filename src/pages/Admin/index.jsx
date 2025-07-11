import React, { useEffect, useState } from "react";
import { getAllTaiNgheNhetTai } from "../../utils/taiNgheNhetTaiHelper";
import { getAllNewSealTaiNghe } from "../../utils/newSeal";
import { getAllLoaKaraoke } from "../../utils/loaKaraoke";
import { getAllLoaDeBan } from "../../utils/loaDeBan"; // Thêm import
import { getAllTaiNgheChupTai } from "../../utils/taiNgheChuptai";
import { getAllLoaDiDong } from "../../utils/diDong";
import ProductForm from './Product/ProductForm';
import { Modal, message } from 'antd';
import { db } from '../../utils/firebase';
import { doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { productToPipeString, pipeStringToProductObject } from '../../utils/convertFireBase.js'
import {getCollectionNameByCode} from '../../utils/getKeyFirebase.js'




function Admin() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("01-nhet-tai-cu");
  const [editModal, setEditModal] = useState({ visible: false, key: '', value: '', page: '', code: '' });
  const [searchText, setSearchText] = useState(""); // Thêm state tìm kiếm

  useEffect(() => {
    let unsubscribe;
    switch (category) {
      case "06-hang-newseal":
        unsubscribe = getAllNewSealTaiNghe(setItems);
        break;
      case "01-nhet-tai-cu":
        unsubscribe = getAllTaiNgheNhetTai(setItems);
        break;
      case "02-chup-tai-cu":
        unsubscribe = getAllTaiNgheChupTai(setItems);
        break;
      case "03-di-dong-cu":
        unsubscribe = getAllLoaDiDong(setItems);
        break;
      case "04-de-ban-cu":
        unsubscribe = getAllLoaDeBan(setItems);
        break;
      case "05-loa-karaoke":
        unsubscribe = getAllLoaKaraoke(setItems);
        break;
      default:
        unsubscribe = getAllTaiNgheNhetTai(setItems);
        break;
    }
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [category]); // Theo dõi category


  // Đặt tên cột cho bảng (rút gọn)
  const columns = [
    "Brand",
    "Tên",
    "Màu",
    "Bán",
    "Gốc",
    "Giảm",
    "SL",
    "TT",
    "Ảnh",
    "Mô tả",
    "Sửa/Xóa",
  ];

  // fields là mảng sau khi split từ value (bỏ code, page)
  

  // Parse pipe string (full) to product object (dựa vào ProductForm)
  function parsePipeString(pipeString) {
    const arr = String(pipeString).split("|");
    // arr[0]: code, arr[1]: page, arr[2...]: fields
    return {...pipeStringToProductObject(arr.slice(2), arr[0]),
      _code: arr[0],
      _page: arr[1],
    };
  }

  

  // Update product in Firestore
  async function handleUpdateProduct(updated, key, code, page) {
    try {
      const collectionName = getCollectionNameByCode(code);
      const docRef = doc(db, collectionName, page);
      const pipeString = productToPipeString(updated, code, page);
      await setDoc(docRef, { [key]: pipeString }, { merge: true });
      message.success('Cập nhật sản phẩm thành công!');
      setEditModal({ visible: false, key: '', value: '', page: '', code: '' });
    } catch (err) {
      message.error('Cập nhật sản phẩm thất bại!');
    }
  }

  // Xóa sản phẩm trong Firestore (chỉ xóa 1 key-value trong document)
  async function handleDeleteProduct(key, code, page) {
    try {
      const collectionName = getCollectionNameByCode(code);
      const docRef = doc(db, collectionName, page);
      await updateDoc(docRef, { [key]: deleteField() });
      message.success('Xóa sản phẩm thành công!');
      // Sau khi xóa, cập nhật lại danh sách sản phẩm
      setItems((prevItems) => {
        const newItems = [...prevItems];
        if (newItems[page]) {
          delete newItems[page][key];
        }
        return newItems;
      });
    } catch {
      message.error('Xóa sản phẩm thất bại!');
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {/* Thanh tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #2196f3", minWidth: 200 }}
        />
        {items.map((_, idx) => (
          <button
            key={idx}
            style={{
              backgroundColor: page === idx ? "#1976d2" : "#2196f3",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setPage(idx)}
          >
            {idx + 1}
          </button>
        ))}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "1px solid #2196f3",
            cursor: "pointer",
          }}
        >
          <option value={"01-nhet-tai-cu"}>Tai nghe nhét tai cũ</option>
          <option value={"02-chup-tai-cu"}>Tai nghe chụp tai cũ</option>
          <option value={"03-di-dong-cu"}>Loa di động cũ</option>
          <option value={"04-de-ban-cu"}>Loa để bàn cũ</option>
          <option value={"05-loa-karaoke"}>Loa karaoke cũ</option>
          <option value={"06-hang-newseal"}>Hàng new seal</option>
        </select>
      </div>
      {items.length > 0 ? (
        <div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    style={{
                      border: "1px solid #2196f3",
                      background: "#2196f3",
                      color: "#fff",
                      padding: "8px",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items[page] &&
                Object.entries(items[page])
                  .filter(([key, value]) => {
                    // Bỏ các hàng có key === 'id' và value === 'page1'
                    if (key === 'id') return false;
                    
                    // Lọc theo searchText
                    if (searchText.trim() !== "") {
                      const arr = String(value).split("|");
                      // Gộp tất cả các trường hiển thị để tìm kiếm
                      const searchTarget = arr.slice(2, 2 + columns.length - 1).join(" ").toLowerCase();
                      if (!searchTarget.includes(searchText.toLowerCase())) return false;
                    }
                    return true;
                  })
                  .map(([key, value]) => {
                    const arr = String(value).split("|");
                    const code = arr[0];
                    const pageName = arr[1];
                    const fields = arr.slice(2, 2 + columns.length - 1);
                    return (
                      <tr key={key}>
                        {fields.map((field, idx) => (
                          columns[idx] === "Ảnh" ? (
                            <td
                              key={idx}
                              style={{
                                border: "1px solid #2196f3",
                                padding: "8px",
                                background: "#fff",
                                maxWidth: "120px",
                                whiteSpace: "normal",
                                textAlign: "center"
                              }}
                              title={field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                            >
                              {field && field !== "null" && field !== "" ? (
                                <div style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 2,
                                  maxWidth: 90,
                                  justifyContent: 'center',
                                }}>
                                  {/* {field.split(";;").map((img, i) =>
                                    img ? (
                                      <img
                                        key={i}
                                        src={img}
                                        alt="Ảnh sản phẩm"
                                        style={{ width: 40, height: 40, objectFit: 'cover', margin: 1, borderRadius: 4, border: '1px solid #eee' }}
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x40?text=No+Image'; }}
                                      />
                                    ) : null
                                  )} */}
                                  {field.split(";;").filter(Boolean).slice(0, 2).map((img, i, arr) => {
                                    const totalImages = field.split(";;").filter(Boolean).length;
                                    const isLastVisible = i === 1 && totalImages > 2;

                                    return (
                                      <div
                                        key={i}
                                        style={{
                                          position: 'relative',
                                          width: 40,
                                          height: 40,
                                          margin: 1,
                                          borderRadius: 4,
                                          overflow: 'hidden',
                                          border: '1px solid #eee'
                                        }}
                                      >
                                        <img
                                          src={img}
                                          alt="Ảnh sản phẩm"
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x40?text=No+Image'; }}
                                        />
                                        {isLastVisible && (
                                          <div
                                            style={{
                                              position: 'absolute',
                                              top: 0,
                                              left: 0,
                                              width: '100%',
                                              height: '100%',
                                              backgroundColor: 'rgba(0,0,0,0.5)',
                                              color: 'white',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: 12,
                                              fontWeight: 'bold'
                                            }}
                                          >
                                            +{totalImages - 1}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}


                                </div>
                              ) : (
                                <span>Chưa cập nhật</span>
                              )}
                            </td>
                          ) : (
                            <td
                              key={idx}
                              style={{
                                border: "1px solid #2196f3",
                                padding: "8px",
                                background: "#fff",
                                maxWidth: "120px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              title={field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                            >
                              {field === null || field === "null" || field === "" ? "Chưa cập nhật" : field}
                            </td>
                          )
                        ))}
                        <td
                          style={{
                            border: "1px solid #2196f3",
                            padding: "8px",
                            background: "#fff"
                          }}
                        >
                          <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                            <button
                              style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}
                              onClick={() => {
                                const obj = parsePipeString(value);
                                setEditModal({ visible: true, key, value: obj, page: pageName, code });
                              }}
                            >Sửa</button>
                            <button
                              style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}
                              onClick={() => {
                                const obj = parsePipeString(value);
                                handleDeleteProduct(key, code, pageName);
                              }}
                            >Xóa</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {/* Phân trang và select category chuyển xuống dưới */}

          <Modal
            open={editModal.visible}
            title="Cập nhật sản phẩm"
            width="60vw"
            footer={null}
            onCancel={() => setEditModal({ visible: false, key: '', value: '', page: '', code: '' })}
            destroyOnClose
          >
            <ProductForm
              initialValues={editModal.value}
              onFinish={values => handleUpdateProduct(values, editModal.key, editModal.code, editModal.page)}
            />
          </Modal>
        </div>
      ) : null}
    </div>
  );
}

export default Admin;