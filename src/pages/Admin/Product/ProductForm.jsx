import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, Button, Row, Col, message, Switch } from 'antd'
import { db } from '@/utils/firebase'
import { collection, doc, getDocs, query, setDoc} from 'firebase/firestore'
import { productToPipeString } from '@/utils/convertFireBase.js'
import { parseStringToTableInfo, parseTableInfoToString } from '@/utils/tableInfoParse.js'


const productTypeOptions = [
  { label: 'Loa di động cũ', value: 'Loa di động cũ' },
  { label: 'Loa karaoke cũ', value: 'Loa karaoke cũ' },
  { label: 'Loa để bàn cũ', value: 'Loa để bàn cũ' },
  { label: 'Tai nghe chụp tai cũ', value: 'Tai nghe chụp tai cũ' },
  { label: 'Tai nghe nhét tai cũ', value: 'Tai nghe nhét tai cũ' },
  { label: 'Hàng new seal', value: 'Hàng new seal' },
]

const brandOptions = [
  { label: 'Acnos', value: 'Acnos' },
  { label: 'Alpha Works', value: 'Alpha Works' },
  { label: 'Anker', value: 'Anker' },
  { label: 'Bang&Olufsen', value: 'Bang&Olufsen' },
  { label: 'Baseus', value: 'Baseus' },
  { label: 'Beats', value: 'Beats' },
  { label: 'Bose', value: 'Bose' },
  { label: 'Harman Kardon', value: 'Harman Kardon' },
  { label: 'JBL', value: 'JBL' },
  { label: 'Klipsch', value: 'Klipsch' },
  { label: 'Marshall', value: 'Marshall' },
  { label: 'Others', value: 'Others' },
  { label: 'Sennheiser', value: 'Sennheiser' },
  { label: 'Skullcandy', value: 'Skullcandy' },
  { label: 'Sony', value: 'Sony' },
  { label: 'Ultimate Ears', value: 'Ultimate Ears' },
]

const conditionOptions = [
  { label: '99-98% Nobox', value: '99-98% Nobox' },
  { label: '99-98% Fullbox', value: '99-98% Fullbox' },
  { label: 'New Seal', value: 'New Seal' },
]

// Thêm mảng màu sắc phổ biến
const colorOptions = [
  { label: 'Đen', value: 'Đen', color: '#000000' },
  { label: 'Trắng', value: 'Trắng', color: '#FFFFFF' },
  { label: 'Đỏ', value: 'Đỏ', color: '#FF0000' },
  { label: 'Đỏ đô', value: 'Đỏ đô', color: '#8B0000' },
  { label: 'Xanh dương', value: 'Xanh dương', color: '#0074D9' },
  { label: 'Xanh navy', value: 'Xanh navy', color: '#001F3F' },
  { label: 'Xanh lá', value: 'Xanh lá', color: '#2ECC40' },
  { label: 'Xanh rêu', value: 'Xanh rêu', color: '#556B2F' },
  { label: 'Vàng', value: 'Vàng', color: '#FFDC00' },
  { label: 'Vàng gold', value: 'Vàng gold', color: '#FFD700' },
  { label: 'Cam', value: 'Cam', color: '#FF851B' },
  { label: 'Tím', value: 'Tím', color: '#B10DC9' },
  { label: 'Tím pastel', value: 'Tím pastel', color: '#D1B3FF' },
  { label: 'Hồng', value: 'Hồng', color: '#FF69B4' },
  { label: 'Hồng pastel', value: 'Hồng pastel', color: '#FFD1DC' },
  { label: 'Xám', value: 'Xám', color: '#AAAAAA' },
  { label: 'Xám đậm', value: 'Xám đậm', color: '#555555' },
  { label: 'Bạc', value: 'Bạc', color: '#C0C0C0' },
  { label: 'Nâu', value: 'Nâu', color: '#8B4513' },
  { label: 'Be', value: 'Be', color: '#F5F5DC' },
  { label: 'Xanh ngọc', value: 'Xanh ngọc', color: '#40E0D0' },
  { label: 'Xanh mint', value: 'Xanh mint', color: '#AAF0D1' },
  { label: 'Xanh lam', value: 'Xanh lam', color: '#4682B4' },
  { label: 'Xanh pastel', value: 'Xanh pastel', color: '#B2F9FC' },
  { label: 'Khác', value: 'Khác', color: '#888888' },
]



function getCollectionNameByCategory(category) {
  switch (category) {
    case 'Loa di động cũ':
      return '03-di-dong-cu';
    case 'Loa karaoke cũ':
      return '05-loa-karaoke';
    case 'Loa để bàn cũ':
      return '04-de-ban-cu';
    case 'Tai nghe chụp tai cũ':
      return '02-chup-tai-cu';
    case 'Tai nghe nhét tai cũ':
      return '01-nhet-tai-cu';
    case 'Hàng new seal':
      return '06-hang-newseal';
    default:
      return 'test';
  }
}


function ProductForm({ initialValues = {}, onFinish }) {
  // Nếu có initialValues.tableInfo thì parse ra tableRows, nếu không thì 1 dòng rỗng
  const [tableRows, setTableRows] = useState(
    initialValues.tableInfo ? parseStringToTableInfo(initialValues.tableInfo) : [{ key: '', value: '' }]
  );
  const [category, setCategory] = useState(initialValues.category || '');
  const [colectionName, setColectionName] = useState(getCollectionNameByCategory(initialValues.category || ''));
  const [postOptions, setPostOptions] = useState({lable:"", value:""})
  
  // Cập nhật colectionName khi category thay đổi
  useEffect(() => {
    setColectionName(getCollectionNameByCategory(category));
  }, [category]);

  useEffect(() => {
    getAllPostTitles();
  }, []);

  const handleAddRow = () => {
    if (tableRows.length >= 10) {
      message.warning('Không thể thêm quá 10 dòng.');
      return;
    }
    setTableRows([...tableRows, { key: '', value: '' }])
  }

  const handleRowChange = (index, field, val) => {
    const newRows = [...tableRows]
    newRows[index][field] = val
    setTableRows(newRows)
  }

  const handleRemoveRow = (index) => {
    if (tableRows.length <= 1) {
      message.warning('Phải có ít nhất 1 dòng.');
      return;
    }
    const newRows = tableRows.filter((_, i) => i !== index);
    setTableRows(newRows);
  };

  const renderTableRows = () => (
    tableRows.map((row, idx) => (
      <Row gutter={8} key={idx} style={{ marginBottom: 8 }}>
        <Col span={11}>
          <Input
            placeholder="Tên thuộc tính"
            value={row.key}
            onChange={e => handleRowChange(idx, 'key', e.target.value)}
          />
        </Col>
        <Col span={11}>
          <Input
            placeholder="Giá trị"
            value={row.value}
            onChange={e => handleRowChange(idx, 'value', e.target.value)}
          />
        </Col>
        <Col span={2}>
          <Button danger onClick={() => handleRemoveRow(idx)}>Xóa</Button>
        </Col>
      </Row>
    ))
  )



  const upsertField = async (fieldKey, fieldValue, docId) => {
    const docRef = doc(db, colectionName, docId)
    await setDoc(docRef, { [fieldKey]: fieldValue }, { merge: true })
  }

  const getNextAvailablePage = async () => {
    let pageIndex = 1;
    while (true) {
      const pageName = `page${pageIndex}`;
      const docRef = doc(db, colectionName, pageName);
      const docSnap = await (await import('firebase/firestore')).getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() : {};
      const fieldCount = Object.keys(data).length;
      if (fieldCount < 250) {
        return pageName;
      }
      pageIndex++;
    }
  };

  const getAllPostTitles = async () => {
    const colRef = collection(db, "productPosts");
  
    const q = query(colRef);
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => ({
      value: doc.id,
      label: doc.data().title || '(Không có tiêu đề)',
    }));
  
    setPostOptions(result);
  };

  const handleFinish = async (values) => {
    const result = {
      ...values,
      product_type: values.category, // Gán product_type giống category
      tags: typeof values.tags === 'string' ? values.tags : (Array.isArray(values.tags) ? values.tags.join(',') : ''),
      images: Array.isArray(values.images) ? values.images.join(';;') : (values.images || ''),
      colors: values.colors || [],
      condition: values.condition || [],
      priceDefault: values.priceDefault || 0,
      priceForSale: values.priceForSale || 0,
      salePercent: values.salePercent || 0, // Thêm dòng này
      inventories: values.inventories || 0,
      sku: values.sku || '',
      tableInfo: parseTableInfoToString(tableRows),
      isbestSeller: values.isbestSeller, // Thêm dòng này
      videoUrl: values.videoUrl || '', // Thêm dòng này
      post: values.post || '',
    }
    try {
      const page = await getNextAvailablePage();
      const pipeString = productToPipeString(result, colectionName, page)
      // await addProduct(pipeString)
      // Lưu vào Firestore dạng map: page -> { timestamp: pipeString }
      const timestamp = Math.floor(Date.now() / 1000) // số giây hiện tại
      // Ghi vào đúng document pageN, thêm field mới với key là timestamp
      await upsertField(timestamp, pipeString, page)
      message.success('Thêm sản phẩm thành công!')
    } catch (err) {
      console.error('Thêm sản phẩm thất bại:', err)
      message.error('Thêm sản phẩm thất bại!')
    }
  }

  // Khi submit form
  const handleFormFinish = async (values) => {
    // // Đảm bảo tableInfo luôn được cập nhật từ tableRows khi submit
    values.tableInfo = parseTableInfoToString(tableRows);
    if (onFinish) {
      // Nếu là sửa, gọi prop onFinish (truyền lên từ Admin)
      await onFinish(values);
    } else {
      // Nếu là thêm mới, dùng logic cũ
      await handleFinish(values);
    }
  }
  //Vĩ: 11/07/2022 00:59 - Tự động correct giá bán & giá gốc & sale
  const [form] = Form.useForm();
  const handleAutoCalculate = (changedValues, allValues) => {
    const { priceDefault, priceForSale, salePercent } = allValues;
    const changedField = Object.keys(changedValues)[0];

    // Nếu có giá gốc + phần trăm => tính lại giá bán
    if (
      priceDefault &&
      salePercent &&
      changedField === 'priceDefault'
    ) {
      const newBanLe = Math.round(priceDefault * (1 - salePercent / 100));
      form.setFieldsValue({ priceForSale: newBanLe });
    }

    // Nếu có giá gốc + giá bán => tính lại phần trăm
    if (
      priceDefault &&
      priceForSale &&
      changedField === 'priceDefault'
    ) {
      const newPercent = Math.round((1 - priceForSale / priceDefault) * 100);
      form.setFieldsValue({ salePercent: newPercent });
    }

    // Nếu đủ cả 3 trường mà sửa giá bán => tính lại phần trăm
    if (
      priceDefault &&
      priceForSale &&
      salePercent &&
      changedField === 'priceForSale'
    ) {
      const newPercent = Math.round((1 - priceForSale / priceDefault) * 100);
      form.setFieldsValue({ salePercent: newPercent });
    }

    // Nếu đủ 3 trường mà sửa phần trăm => tính lại giá bán
    if (
      priceDefault &&
      priceForSale &&
      salePercent &&
      changedField === 'salePercent'
    ) {
      const newBanLe = Math.round(priceDefault * (1 - salePercent / 100));
      form.setFieldsValue({ priceForSale: newBanLe });
    }

    // Nếu có giá gốc + giá bán (sale chưa có) => tính sale
    if (
      priceDefault &&
      priceForSale &&
      !salePercent &&
      changedField === 'priceForSale'
    ) {
      const percent = Math.round((1 - priceForSale / priceDefault) * 100);
      form.setFieldsValue({ salePercent: percent });
    }

    // Nếu có giá gốc + phần trăm (giá bán chưa có) => tính giá bán
    if (
      priceDefault &&
      salePercent &&
      !priceForSale &&
      changedField === 'salePercent'
    ) {
      const price = Math.round(priceDefault * (1 - salePercent / 100));
      form.setFieldsValue({ priceForSale: price });
    }
  };


  return (
    //Vĩ: 11/07/2022 00:13 - Form được sử dụng khi chỉnh sửa sản phẩm
    <Form
      layout="vertical"
      initialValues={initialValues}
      style={{ maxWidth: '100%', width: '100%' }}
      onFinish={handleFormFinish}
      form={form}
      onValuesChange={handleAutoCalculate}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}>
            <Select options={productTypeOptions} value={category} onChange={val => setCategory(val)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}>
            <Select options={brandOptions} showSearch placeholder="Chọn thương hiệu" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Màu sắc" name="colors" rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}>
            <Select
              mode="single"
              placeholder="Chọn màu sắc"
              optionLabelProp="label"
              options={colorOptions.map(opt => ({
                ...opt,
                label: (
                  <span>
                    <span style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: opt.color,
                      border: '1px solid #ccc',
                      marginRight: 8,
                      verticalAlign: 'middle'
                    }} />
                    {opt.label}
                  </span>
                )
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tình trạng bán" name="condition" rules={[{ required: true, message: 'Vui lòng nhập tình trạng bán' }]}>
            <Select
              mode="single"
              placeholder="Chọn tình trạng bán"
              options={conditionOptions}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Bán chạy" name="isbestSeller" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Giá gốc (VNĐ)"
            name="priceDefault"
            rules={[
              { required: true, message: 'Vui lòng nhập giá bán buôn' },
              { type: 'number', min: 0, message: 'Chỉ nhập số lớn hơn hoặc bằng 0' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' vnđ' : ''}
              parser={value => value.replace(/[vnđ,]/g, '').trim()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Giá bán (VNĐ)"
            name="priceForSale"
            rules={[
              { required: true, message: 'Vui lòng nhập giá bán lẻ' },
              { type: 'number', min: 0, message: 'Chỉ nhập số lớn hơn hoặc bằng 0' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' vnđ' : ''}
              parser={value => value.replace(/[vnđ,]/g, '').trim()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Phần trăm giảm (%)"
            name="salePercent"
            rules={[
              { required: false, message: 'Vui lòng nhập phần trăm giảm giá (nếu có)' },
              { type: 'number', min: 0, message: 'Chỉ nhập số lớn hơn hoặc bằng 0' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' %' : ''}
              parser={value => value.replace(/[\s,%]/g, '')}
              placeholder="Nhập giá sale (nếu có)"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Video sản phẩm (YouTube)" name="videoUrl">
            <Input placeholder="Dán link video YouTube sản phẩm (nếu có)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Hình ảnh" name="images">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Nhập link hình ảnh, Enter để thêm"
              tokenSeparators={[',', ' ']}
              open={false} // ⛔ Tắt dropdown
              styles={{
                popup: {
                  root: {
                    display: 'none',
                  },
                },
              }} // Cách ẩn cứng nếu cần
              tagRender={({ label, closable, onClose }) => (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    background: '#e6f7ff',
                    borderRadius: '4px',
                    margin: '2px',
                    fontSize: 13,
                    maxWidth: '100%',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all',
                  }}
                >
                  <a
                    href={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#1890ff',
                      textDecoration: 'underline',
                      maxWidth: 'calc(100% - 20px)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all',
                    }}
                  >
                    {label}
                  </a>
                  {closable && (
                    <span
                      onClick={onClose}
                      style={{ marginLeft: 8, cursor: 'pointer', color: '#f5222d' }}
                    >
                      ×
                    </span>
                  )}
                </div>
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Đặc điểm nổi bật" name="description">
            <Input.TextArea
              rows={5}
              style={{ width: '100%', padding: '8px' }}
              placeholder="Nhập Đặc điểm nổi bật"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tính năng nổi bật" name="highlights">
            <Input.TextArea
              rows={5}
              style={{ width: '100%', padding: '8px' }}
              placeholder="Nhập Tính năng nổi bật"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
          <Form.Item
            label="Bài viết sản phẩm"
            name="post"
            style={{ width: '100%' }} // mở rộng form item ra toàn bộ
          >
            <Select
              mode="single"
              placeholder="Chọn bài viết đính kèm"
              options={postOptions}
            />
          </Form.Item>
      </Row>

      {/* Thông số kỹ thuật dạng bảng 2 cột */}
      <Form.Item label="Thông số kỹ thuật">
        {renderTableRows()}
        <Button type="primary" onClick={handleAddRow} style={{ marginTop: 8, color: '#1890ff', border: '1px solid #1890ff', backgroundColor: 'white', borderRadius: '8px', fontWeight: '500' }}>
          Thêm thuộc tính
        </Button>
      </Form.Item>

      <Form.Item>
        <div style={{ textAlign: 'right', marginRight: 20 }}>
          {/* <Button type="default" style={{ marginRight: 16 }} onClick={() => {setEditModal(prev => ({ ...prev, visible: false }))}}>
            Huỷ
          </Button> */}
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default ProductForm