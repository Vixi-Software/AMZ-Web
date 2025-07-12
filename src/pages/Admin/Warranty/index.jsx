import React, { useState } from 'react'
import CTable from '../../../components/ui/table'
import { Alert, Modal, Form, Input, Select, Button, Popconfirm, message, Tag } from 'antd'
import warrantyService from '../../../services/warrantyService'
import DataCacheExample from '../../../components/examples/DataCacheExample'

const { Option } = Select
const { TextArea } = Input

const statusOptions = [
  { label: 'Chờ xử lý', value: 'pending', color: 'orange' },
  { label: 'Đang sửa chữa', value: 'repairing', color: 'blue' },
  { label: 'Hoàn thành', value: 'completed', color: 'green' },
  { label: 'Từ chối', value: 'rejected', color: 'red' },
]

const priorityOptions = [
  { label: 'Thấp', value: 'low', color: 'default' },
  { label: 'Bình thường', value: 'normal', color: 'blue' },
  { label: 'Cao', value: 'high', color: 'orange' },
  { label: 'Khẩn cấp', value: 'urgent', color: 'red' },
]

const columns = [
  {
    title: 'Mã bảo hành',
    dataIndex: 'warrantyCode',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
    render: (text) => <strong>{text}</strong>
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customerName',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'productName',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusOptions.map(s => ({ text: s.label, value: s.value })),
    render: (status) => {
      const statusConfig = statusOptions.find(s => s.value === status)
      return <Tag color={statusConfig?.color}>{statusConfig?.label}</Tag>
    }
  },
  {
    title: 'Độ ưu tiên',
    dataIndex: 'priority',
    enableFilter: true,
    filterType: 'select',
    filterOptions: priorityOptions.map(p => ({ text: p.label, value: p.value })),
    render: (priority) => {
      const priorityConfig = priorityOptions.find(p => p.value === priority)
      return <Tag color={priorityConfig?.color}>{priorityConfig?.label}</Tag>
    }
  },
]

function WarrantyManagement() {
  const [dataSource, setDataSource] = useState([])
  const [modal, setModal] = useState({ visible: false, type: '', record: null })
  const [form] = Form.useForm()

  // Mở modal Thêm/Sửa
  const openModal = (type, record = null) => {
    setModal({ visible: true, type, record })
    if (type === 'edit' && record) {
      form.setFieldsValue(record)
    } else {
      form.resetFields()
    }
  }

  // Đóng modal
  const closeModal = () => setModal({ visible: false, type: '', record: null })

  // Lấy danh sách bảo hành từ service
  React.useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const warranties = await warrantyService.getAllWarranties()
        setDataSource(warranties)
      } catch (error) {
        message.error('Lỗi khi tải danh sách bảo hành!')
        console.error(error)
      }
    }
    fetchWarranties()
  }, [])

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then(async values => {
      try {
        // Validate dữ liệu
        const validationErrors = warrantyService.validateWarrantyData(values)
        if (validationErrors.length > 0) {
          message.error(validationErrors[0])
          return
        }

        if (modal.type === 'add') {
          const newWarranty = await warrantyService.createWarranty(values)
          setDataSource([...dataSource, newWarranty])
          message.success('Đã thêm bảo hành!')
        } else if (modal.type === 'edit') {
          const updatedWarranty = await warrantyService.updateWarranty(modal.record.id, values)
          setDataSource(dataSource.map(item =>
            item.id === modal.record.id ? updatedWarranty : item
          ))
          message.success('Đã cập nhật bảo hành!')
        }
        closeModal()
      } catch (error) {
        message.error('Có lỗi xảy ra!')
        console.error(error)
      }
    })
  }

  // Xử lý xóa
  const handleDelete = async (record) => {
    try {
      await warrantyService.deleteWarranty(record.id)
      setDataSource(dataSource.filter(item => item.id !== record.id))
      message.success('Đã xóa bảo hành!')
    } catch (error) {
      message.error('Lỗi khi xóa bảo hành!')
      console.error(error)
    }
  }

  // Thêm cột thao tác
  const tableColumns = [
    ...columns,
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button key={`edit-${record.id}`} size="small" onClick={() => openModal('edit', record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            key={`delete-${record.id}`}
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal('add')}
      >
        Thêm bảo hành
      </Button>
      <CTable
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="id"
      />
      <Modal
        open={modal.visible}
        title={modal.type === 'add' ? 'Thêm bảo hành' : 'Sửa bảo hành'}
        onCancel={closeModal}
        onOk={handleOk}
        okText={modal.type === 'add' ? 'Thêm' : 'Lưu'}
        destroyOnHidden
        width={800}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'pending', priority: 'normal' }}>
          <Form.Item
            label="Mã bảo hành"
            name="warrantyCode"
            rules={[{ required: true, message: 'Nhập mã bảo hành' }]}
          >
            <Input 
              placeholder="Nhập mã bảo hành hoặc để trống để tự động tạo"
              addonAfter={
                <Button 
                  size="small" 
                  onClick={() => form.setFieldsValue({ warrantyCode: warrantyService.generateWarrantyCode() })}
                >
                  Tự động
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Nhập tên khách hàng' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="customerPhone"
            rules={[{ required: true, message: 'Nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="customerEmail"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Mô tả vấn đề"
            name="issueDescription"
            rules={[{ required: true, message: 'Mô tả vấn đề' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề của sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            rules={[{ required: true, message: 'Chọn độ ưu tiên' }]}
          >
            <Select placeholder="Chọn độ ưu tiên">
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <TextArea rows={3} placeholder="Ghi chú thêm (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* <DataCacheExample /> */}
    </div>
  )
}

export default WarrantyManagement
