import React, { useState } from 'react'
import { Form, Input, InputNumber, Select, Button, Row, Col, message, Switch } from 'antd'
import { db } from '../../../utils/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { productToPipeString } from '../../../utils/convertFireBase.js'

const { TextArea } = Input

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

const statusSellOptions = [
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

function parseHtmlTableToRows(html) {
  // Tạo một DOM ảo để parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  const rows = [];
  const trList = div.querySelectorAll('tr');
  trList.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length >= 2) {
      rows.push({
        key: tds[0].textContent.trim(),
        value: tds[1].textContent.trim(),
      });
    }
  });
  return rows.length ? rows : [{ key: '', value: '' }];
}

function ProductForm({ initialValues = {}, onFinish }) {
  // Nếu có initialValues.tableInfo thì parse ra tableRows, nếu không thì 1 dòng rỗng
  const [tableRows, setTableRows] = useState(
    initialValues.tableInfo ? parseHtmlTableToRows(initialValues.tableInfo) : [{ key: '', value: '' }]
  );
  const [category, setCategory] = useState(initialValues.category || '');
  const [colectionName, setColectionName] = useState(getCollectionNameByCategory(initialValues.category || ''));

  // Cập nhật colectionName khi category thay đổi
  React.useEffect(() => {
    setColectionName(getCollectionNameByCategory(category));
  }, [category]);

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

  const convertRowsToHtmlTable = () => {
    if (!tableRows.length) return ''
    let html = '<table className="w-full border border-gray-200 rounded">'
    tableRows.forEach((row, idx) => {
      if (row.key || row.value) {
        html += `<tr${idx % 2 === 1 ? ' className="bg-gray-100"' : ''}>`
        html += `<td className="font-bold border px-2 py-1">${row.key}</td>`
        html += `<td className="border px-2 py-1">${row.value}</td>`
        html += '</tr>'
      }
    })
    html += '</table>'
    return html
  }

  const upsertField = async (fieldKey, fieldValue, docId) => {
    console.log(fieldKey +" aa "+fieldValue + " aa" +docId);
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

  const handleFinish = async (values) => {
    const result = {
      ...values,
      product_type: values.category, // Gán product_type giống category
      tags: typeof values.tags === 'string' ? values.tags : (Array.isArray(values.tags) ? values.tags.join(',') : ''),
      images: Array.isArray(values.images) ? values.images.join(';;') : (values.images || ''),
      colors: values.colors || [],
      statusSell: values.statusSell || [],
      pricesBanBuon: values.pricesBanBuon || 0,
      pricesBanLe: values.pricesBanLe || 0,
      salePrice: values.salePrice || 0, // Thêm dòng này
      inventories: values.inventories || 0,
      sku: values.sku || '',
      tableInfo: convertRowsToHtmlTable(),
      isbestSeller: !!values.isbestSeller, // Thêm dòng này
      videoUrl: values.videoUrl || '', // Thêm dòng này
    }
    try {
      const page = await getNextAvailablePage();
      const pipeString = productToPipeString(result,colectionName, page)
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
    // Đảm bảo tableInfo luôn được cập nhật từ tableRows khi submit
    values.tableInfo = convertRowsToHtmlTable();
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
    const { pricesBanBuon, pricesBanLe, salePrice } = allValues;
    const changedField = Object.keys(changedValues)[0];

    // Nếu có giá gốc + phần trăm => tính lại giá bán
    if (
      pricesBanBuon &&
      salePrice &&
      changedField === 'pricesBanBuon'
    ) {
      const newBanLe = Math.round(pricesBanBuon * (1 - salePrice / 100));
      form.setFieldsValue({ pricesBanLe: newBanLe });
    }

    // Nếu có giá gốc + giá bán => tính lại phần trăm
    if (
      pricesBanBuon &&
      pricesBanLe &&
      changedField === 'pricesBanBuon'
    ) {
      const newPercent = Math.round((1 - pricesBanLe / pricesBanBuon) * 100);
      form.setFieldsValue({ salePrice: newPercent });
    }

    // Nếu đủ cả 3 trường mà sửa giá bán => tính lại phần trăm
    if (
      pricesBanBuon &&
      pricesBanLe &&
      salePrice &&
      changedField === 'pricesBanLe'
    ) {
      const newPercent = Math.round((1 - pricesBanLe / pricesBanBuon) * 100);
      form.setFieldsValue({ salePrice: newPercent });
    }

    // Nếu đủ 3 trường mà sửa phần trăm => tính lại giá bán
    if (
      pricesBanBuon &&
      pricesBanLe &&
      salePrice &&
      changedField === 'salePrice'
    ) {
      const newBanLe = Math.round(pricesBanBuon * (1 - salePrice / 100));
      form.setFieldsValue({ pricesBanLe: newBanLe });
    }

    // Nếu có giá gốc + giá bán (sale chưa có) => tính sale
    if (
      pricesBanBuon &&
      pricesBanLe &&
      !salePrice &&
      changedField === 'pricesBanLe'
    ) {
      const percent = Math.round((1 - pricesBanLe / pricesBanBuon) * 100);
      form.setFieldsValue({ salePrice: percent });
    }

    // Nếu có giá gốc + phần trăm (giá bán chưa có) => tính giá bán
    if (
      pricesBanBuon &&
      salePrice &&
      !pricesBanLe &&
      changedField === 'salePrice'
    ) {
      const price = Math.round(pricesBanBuon * (1 - salePrice / 100));
      form.setFieldsValue({ pricesBanLe: price });
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
              mode="multiple"
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
          <Form.Item label="Tình trạng bán" name="statusSell" rules={[{ required: true, message: 'Vui lòng nhập tình trạng bán' }]}>
            <Select
              mode="multiple"
              placeholder="Chọn tình trạng bán"
              options={statusSellOptions}
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
            name="pricesBanBuon"
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
            name="pricesBanLe"
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
            name="salePrice"
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
              dropdownStyle={{ display: 'none' }} // Cách ẩn cứng nếu cần
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
          <Form.Item label="Mô tả ngắn" name="description">
            <TextArea autoSize={{ minRows: 5, maxRows: 20 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tính năng nổi bật" name="highlights">
            <TextArea autoSize={{ minRows: 5, maxRows: 20 }} placeholder="Mỗi dòng là một tính năng nổi bật" />
          </Form.Item>
        </Col>
      </Row>

      {/* Thông số kỹ thuật dạng bảng 2 cột */}
      <Form.Item label="Thông số kỹ thuật">
        {renderTableRows()}
        <Button type="primary" onClick={handleAddRow} style={{ marginTop: 8, color: '#1890ff', border: '1px solid #1890ff', backgroundColor: 'white', borderRadius: '8px', fontWeight: '500'}}>
          Thêm hàng
        </Button>
      </Form.Item>

      <Form.Item>
        <div style={{ textAlign: 'right', marginRight: 20}}>
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