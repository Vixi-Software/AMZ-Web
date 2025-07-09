import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductService } from '../../../services/productService'
import routepath from '../../../constants/routePath'
import { message, Modal, Form, Input, InputNumber, Select, Row, Col, Button, Switch } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { pushAllProductsToFirestore } from '../../../services/dataService'
const columns = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
    render: (text, record) =>
      record.isbestSeller ? (
        <span style={{ color: '#faad14', fontWeight: 'bold' }}>{text} <span style={{ fontSize: 12 }}>🔥</span></span>
      ) : (
        <span>{text}</span>
      ),
  },
  {
    title: 'Giá',
    dataIndex: 'pricesBanLe',
    enableSort: true,
    enableFilter: true,
    filterType: 'numberRange',
    render: (value, record) => {
      if (value === undefined) return '';
      const salePercent =
        record.salePrice && record.salePrice > 0
          ? Math.round(record.salePrice)
          : null;
      let salePrice = value;
      if (salePercent) {
        salePrice = Math.round(value * (1 - salePercent / 100));
      }
      return (
        <div>
          <div>
            {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            {salePercent ? (
              <span style={{ color: '#fa541c', fontWeight: 'bold', marginLeft: 8 }}>
                -{salePercent}%
              </span>
            ) : null}
          </div>
          {salePercent ? (
            <div style={{ color: '#fa541c', fontWeight: 'bold', fontSize: 13 }}>
              Sale: {salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    enableFilter: true,
    filterType: 'select',
  },
  {
    title: 'Tình trạng',
    dataIndex: 'statusSell',
    enableSort: true,
    enableFilter: true,
    filterType: 'select',
  },
  {
    title: 'Màu sắc',
    dataIndex: 'colors',
    enableSort: true,
    enableFilter: true,
    filterType: 'select',
  },
]

const statusOptions = [
  { label: 'Hiển thị trên website', value: 'active' },
  { label: 'Ẩn trên website', value: 'inactive' }
]

const productTypeOptions = [
  { label: 'Loa di động cũ', value: 'Loa di động cũ' },
  { label: 'Loa karaoke cũ', value: 'Loa karaoke cũ' },
  { label: 'Loa để bàn cũ', value: 'Loa để bàn cũ' },
  { label: 'Tai nghe chụp tai cũ', value: 'Tai nghe chụp tai cũ' },
  { label: 'Tai nghe nhét tai cũ', value: 'Tai nghe nhét tai cũ' },
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

function ProductManagement() {
  const {
    getAllProducts,
    updateProduct,
    deleteProduct,
  } = useProductService();
  const [data, setData] = React.useState([]);
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [editProduct, setEditProduct] = React.useState(null)
  const [form] = Form.useForm(); // Thêm dòng này
  const [formFields, setFormFields] = useState([]); // Thêm state này
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getAllProducts();
      setData(result || []);
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm parse tableInfo HTML thành mảng [{ key, value }]
  function parseTableInfo(html) {
    if (!html) return [{ key: '', value: '' }]
    const rowRegex = /<tr.*?>(.*?)<\/tr>/g
    const cellRegex = /<td.*?>(.*?)<\/td>/g
    const rows = []
    let rowMatch
    while ((rowMatch = rowRegex.exec(html))) {
      const cells = []
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1]))) {
        // Loại bỏ tag HTML nếu có
        const text = cellMatch[1].replace(/<.*?>/g, '').trim()
        cells.push(text)
      }
      if (cells.length === 2) {
        rows.push({ key: cells[0], value: cells[1] })
      }
    }
    return rows.length ? rows : [{ key: '', value: '' }]
  }

  // Khi mở modal sửa, chuyển dữ liệu sang fields
  useEffect(() => {
    if (editModalOpen && editProduct) {
      const fields = [
        { name: ['name'], value: editProduct.name || '' },
        { name: ['status'], value: editProduct.status || '' },
        { name: ['colors'], value: editProduct.colors || [] },
        { name: ['statusSell'], value: editProduct.statusSell || [] },
        { name: ['pricesBanBuon'], value: editProduct.pricesBanBuon || 0 },
        { name: ['pricesBanLe'], value: editProduct.pricesBanLe || 0 },
        { name: ['salePrice'], value: editProduct.salePrice || 0 }, // salePrice là phần trăm giảm giá
        { name: ['inventories'], value: editProduct.inventories || 0 },
        { name: ['brand'], value: editProduct.brand || '' },
        { name: ['category'], value: editProduct.category || '' },
        { name: ['tags'], value: Array.isArray(editProduct.tags) ? editProduct.tags.join(',') : (editProduct.tags || '') },
        { name: ['description'], value: editProduct.description || '' },
        { name: ['images'], value: editProduct.images || [] },
        { name: ['isbestSeller'], value: !!editProduct.isbestSeller },
        { name: ['highlights'], value: Array.isArray(editProduct.highlights) ? editProduct.highlights.join('\n') : (editProduct.highlights || '') },
        // ...thêm các field khác nếu cần...
      ];
      setFormFields(fields);
      setTableRows(parseTableInfo(editProduct.tableInfo));
    }
  }, [editModalOpen, editProduct]);

  const [tableRows, setTableRows] = useState([{ key: '', value: '' }])

  const handleAddRow = () => {
    setTableRows([...tableRows, { key: '', value: '' }])
  }

  const handleRowChange = (index, field, val) => {
    const newRows = [...tableRows]
    newRows[index][field] = val
    setTableRows(newRows)
  }

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
      </Row>
    ))
  )

  const convertRowsToHtmlTable = () => {
    if (!tableRows.length) return ''
    let html = `<table style="width:100%; border-collapse:collapse; border:1px solid #ccc;">`
    tableRows.forEach((row, idx) => {
      if (row.key || row.value) {
        html += `<tr${idx % 2 === 1 ? ' style="background:#f9f9f9;"' : ''}>`
        html += `<td style="font-weight:bold; border:1px solid #ccc; padding:4px 8px;">${row.key}</td>`
        html += `<td style="border:1px solid #ccc; padding:4px 8px;">${row.value}</td>`
        html += '</tr>'
      }
    })
    html += '</table>'
    return html
  }

  const handleFinish = async (values) => {
    const result = {
      ...values,
      product_type: values.category,
      tags: typeof values.tags === 'string' ? values.tags : (Array.isArray(values.tags) ? values.tags.join(',') : ''),
      images: values.images || [],
      colors: values.colors || [],
      statusSell: values.statusSell || [],
      pricesBanBuon: values.pricesBanBuon || 0,
      pricesBanLe: values.pricesBanLe || 0,
      salePrice: values.salePrice || 0, // salePrice là phần trăm giảm giá
      inventories: values.inventories || 0,
      sku: values.sku || '',
      tableInfo: convertRowsToHtmlTable(),
      isbestSeller: !!values.isbestSeller,
    }
    try {
      await updateProduct(editProduct.id, result)
      message.success('Sửa sản phẩm thành công!')
      setEditModalOpen(false)
      form.resetFields()
      const updatedList = await getAllProducts();
      setData(updatedList || []);
      setSelectedRowKeys([]);
      setEditProduct(null);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error('Sửa sản phẩm thất bại!')
    }
  }

  return (
    <div>
      {/* Grid hiển thị sản phẩm */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24,
        marginBottom: 32,
      }}>
        {data.map((item, idx) => (
          <div key={item.id || idx} style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: 320,
          }}>
            {/* Ảnh sản phẩm */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <img
                src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/120'}
                alt={item.name}
                style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
              />
            </div>
            {/* Tên sản phẩm */}
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>{item.name}</div>
            {/* Giá bán lẻ và giảm giá */}
            <div style={{ fontSize: 16, color: '#1976d2', marginBottom: 4 }}>
              {item.pricesBanLe?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              {item.salePrice && item.salePrice > 0 && (
                <span style={{ color: '#fa541c', fontWeight: 'bold', marginLeft: 8 }}>
                  (Sale: {Math.round(item.pricesBanLe * (1 - item.salePrice / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} -{Math.round(item.salePrice)}%)
                </span>
              )}
            </div>
            {/* Thương hiệu, tồn kho, trạng thái */}
            <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              <b>Thương hiệu:</b> {item.brand || '-'}
            </div>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              <b>Tồn kho:</b> {item.inventories}
            </div>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              <b>Trạng thái:</b> {item.status}
            </div>
            {/* Màu sắc */}
            <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
              <b>Màu sắc:</b> {Array.isArray(item.colors) && item.colors.length > 0 ? item.colors.join(', ') : '-'}
            </div>
            {/* Bán chạy */}
            {item.isbestSeller && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: '#faad14', color: '#fff', padding: '2px 10px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
                Bán chạy
              </div>
            )}
            {/* Nút thao tác */}
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <Button size="small" type="primary" onClick={() => { setEditProduct(item); setEditModalOpen(true); }}>Sửa</Button>
              <Button size="small" danger onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận xóa',
                  content: `Bạn có chắc chắn muốn xóa sản phẩm này không?`,
                  okText: 'Xóa',
                  okType: 'danger',
                  cancelText: 'Hủy',
                  async onOk() {
                    try {
                      await deleteProduct(item.id || item);
                      message.success('Xóa sản phẩm thành công!');
                      const updatedList = await getAllProducts();
                      setData(updatedList || []);
                    } catch (err) {
                      message.error('Xóa sản phẩm thất bại!');
                    }
                  }
                });
              }}>Xóa</Button>
              <Button size="small" onClick={() => { setViewProduct(item); setViewModalOpen(true); }}>Xem</Button>
              <Button size="small" type={item.isbestSeller ? 'default' : 'dashed'} style={{ color: '#faad14', borderColor: '#faad14' }} onClick={async () => {
                if (!item.isbestSeller) {
                  try {
                    await updateProduct(item.id || item, { isbestSeller: true });
                    message.success('Đã đánh dấu sản phẩm bán chạy!');
                    const updatedList = await getAllProducts();
                    setData(updatedList || []);
                  } catch (err) {
                    message.error('Đánh dấu bán chạy thất bại!');
                  }
                }
              }}>Bán chạy</Button>
            </div>
          </div>
        ))}
      </div>
      {/* Nút thêm và đồng bộ đặt phía trên hoặc dưới grid */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Button type="primary" onClick={() => navigate(routepath.adminProductAdd)}>
          Thêm sản phẩm
        </Button>
        <Button style={{ background: '#8e24aa', color: '#fff' }} onClick={async () => {
          message.loading({ content: 'Đang đồng bộ sản phẩm...', key: 'sync' });
          const result = await pushAllProductsToFirestore();
          if (result) {
            message.success({ content: 'Đồng bộ thành công!', key: 'sync' });
            const updatedList = await getAllProducts();
            setData(updatedList || []);
          } else {
            message.error({ content: 'Đồng bộ thất bại!', key: 'sync' });
          }
        }}>
          Đồng bộ
        </Button>
      </div>
      {/* Modal sửa và xem chi tiết giữ nguyên */}
      <Modal
        open={editModalOpen}
        title="Chỉnh sửa sản phẩm"
        footer={null}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
          setFormFields([]); // reset fields
        }}
        destroyOnClose
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 800 }}
          onFinish={handleFinish}
          fields={formFields}
          onFieldsChange={(_, allFields) => setFormFields(allFields)}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                <Select options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>

          {/* Thêm trường chỉnh sửa isbestSeller */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bán chạy" name="isbestSeller" valuePropName="checked">
                <Switch checkedChildren="Có" unCheckedChildren="Không" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item label="Tình trạng bán" name="statusSell" rules={[{ required: true, message: 'Vui lòng nhập tình trạng bán' }]}>
                <Select
                  mode="multiple"
                  placeholder="Chọn tình trạng bán"
                  options={statusSellOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá bán buôn"
                name="pricesBanBuon"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá bán buôn' },
                  { type: 'number', min: 0, message: 'Chỉ nhập số lớn hơn hoặc bằng 0' }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/[^0-9]/g, '')}
                  parser={value => value.replace(/[^0-9]/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá bán lẻ"
                name="pricesBanLe"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá bán lẻ' },
                  { type: 'number', min: 0, message: 'Chỉ nhập số lớn hơn hoặc bằng 0' }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/[^0-9]/g, '')}
                  parser={value => value.replace(/[^0-9]/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Thêm trường giá sale */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giảm giá (%)"
                name="salePrice"
                rules={[
                  { type: 'number', min: 0, max: 100, message: 'Chỉ nhập số từ 0 đến 100' }
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/[^0-9]/g, '')}
                  parser={value => value.replace(/[^0-9]/g, '')}
                  placeholder="Nhập phần trăm giảm giá"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tồn kho" name="inventories" rules={[{ required: true, message: 'Vui lòng nhập tồn kho' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}>
                <Select options={brandOptions} showSearch placeholder="Chọn thương hiệu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}>
                <Select options={productTypeOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tags" name="tags">
                <Input placeholder="Nhập tags, cách nhau bởi dấu phẩy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tính năng nổi bật" name="highlights">
                <TextArea rows={3} placeholder="Mỗi dòng là một tính năng nổi bật" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Hình ảnh" name="images">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Nhập link hình ảnh, Enter để thêm"
              tokenSeparators={[',', ' ']}
            />
          </Form.Item>

          {/* Thông số kỹ thuật dạng bảng 2 cột */}
          <Form.Item label="Thông tin thêm">
            {renderTableRows()}
            <Button type="dashed" onClick={handleAddRow} style={{ marginTop: 8 }}>
              Thêm hàng
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={viewModalOpen}
        title="Chi tiết sản phẩm"
        footer={null}
        onCancel={() => setViewModalOpen(false)}
        width={900}
      >
        {viewProduct && (
          <div style={{ maxWidth: 800 }}>
            <Row gutter={16}>
              <Col span={12}><b>Tên sản phẩm:</b> {viewProduct.name}</Col>
              <Col span={12}><b>Trạng thái:</b> {viewProduct.status}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}>
                <b>Bán chạy:</b>{' '}
                {viewProduct.isbestSeller ? (
                  <span style={{ color: '#faad14', fontWeight: 'bold' }}>Có</span>
                ) : (
                  <span>Không</span>
                )}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}><b>Màu sắc:</b>{' '}
                {Array.isArray(viewProduct.colors) && viewProduct.colors.length > 0
                  ? viewProduct.colors.map((color, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      borderRadius: 8,
                      padding: '2px 10px',
                      marginRight: 6,
                      marginBottom: 4,
                      border: '1px solid #ddd',
                    }}>{color}</span>
                  ))
                  : '-'}
              </Col>
              <Col span={12}>
                <b>Tình trạng bán:</b>{' '}
                {Array.isArray(viewProduct.statusSell) && viewProduct.statusSell.length > 0
                  ? viewProduct.statusSell.map((status, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      background: '#e6f7ff',
                      borderRadius: 8,
                      padding: '2px 10px',
                      marginRight: 6,
                      marginBottom: 4,
                      border: '1px solid #91d5ff',
                    }}>{status}</span>
                  ))
                  : '-'}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}><b>Giá bán buôn:</b> {viewProduct.pricesBanBuon?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Col>
              <Col span={12}>
                <b>Giá bán lẻ:</b> {viewProduct.pricesBanLe?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                {viewProduct.salePrice && viewProduct.salePrice > 0 && (
                  <span style={{ color: '#fa541c', fontWeight: 'bold', marginLeft: 8 }}>
                    (Sale: {Math.round(viewProduct.pricesBanLe * (1 - viewProduct.salePrice / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} -{Math.round(viewProduct.salePrice)}%)
                  </span>
                )}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}><b>Tồn kho:</b> {viewProduct.inventories}</Col>
              <Col span={12}><b>Thương hiệu:</b> {viewProduct.brand}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}><b>Danh mục:</b> {viewProduct.category}</Col>
              <Col span={12}>
                <b>Tags:</b>{' '}
                {viewProduct.tags
                  ? viewProduct.tags.toString().split(',').map((tag, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      background: '#fffbe6',
                      borderRadius: 8,
                      padding: '2px 10px',
                      marginRight: 6,
                      marginBottom: 4,
                      border: '1px solid #ffe58f',
                    }}>{tag.trim()}</span>
                  ))
                  : '-'}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={24}><b>Mô tả:</b> {viewProduct.description}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={24}>
                <b>Tính năng nổi bật:</b>
                <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                  {(Array.isArray(viewProduct.highlights) ? viewProduct.highlights : (viewProduct.highlights || '').split('\n'))
                    .filter(Boolean)
                    .map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                </ul>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={24}>
                <b>Hình ảnh:</b>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 8 }}>
                  {viewProduct.images?.map((img, idx) => (
                    <div key={idx} style={{ marginRight: 8, marginBottom: 8 }}>
                      <img src={img} alt={`Hình ảnh sản phẩm ${idx + 1}`} style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={24}>
                <b>Thông tin thêm:</b>
                <div style={{ marginTop: 8 }}>
                  {(() => {
                    const rows = parseTableInfo(viewProduct.tableInfo);
                    if (!rows.length || (rows.length === 1 && !rows[0].key && !rows[0].value)) {
                      return <span>-</span>;
                    }
                    return (
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'separate',
                          borderSpacing: 0,
                          borderRadius: 12,
                          overflow: 'hidden',
                          background: '#fff',
                          boxShadow: '4px 4px 4px 0 rgba(0,0,0,0.25)'
                        }}
                      >
                        <tbody>
                          {rows.map((row, idx) => (
                            <tr
                              key={idx}
                              style={{
                                 background: idx % 2 === 0 ? '#ECECEC' : '#fff',
                              }}
                            >
                              <td
                                style={{
                                  fontWeight: 600,
                                  padding: '12px 16px',
                                  minWidth: 120,
                                  border: 'none',
                                  color: '#222',
                                  fontSize: 15,
                                }}
                              >
                                {row.key}
                              </td>
                              <td
                                style={{
                                  padding: '12px 16px',
                                  border: 'none',
                                  color: '#444',
                                  fontSize: 15,
                                }}
                              >
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ProductManagement