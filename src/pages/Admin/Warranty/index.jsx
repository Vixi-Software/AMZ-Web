import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { db } from '../../../utils/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'

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

function WarrantyManagement() {
  const [warranties, setWarranties] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingWarranty, setEditingWarranty] = useState(null)
  const [form] = Form.useForm()

  // Fetch warranties from Firestore
  useEffect(() => {
    const warrantyRef = collection(db, 'warranties')
    const q = query(warrantyRef, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const warrantyData = snapshot.docs.map(doc => ({
        id: doc.id,
        key: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }))
      setWarranties(warrantyData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const columns = [
    {
      title: 'Mã bảo hành',
      dataIndex: 'warrantyCode',
      key: 'warrantyCode',
      width: 150,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = statusOptions.find(s => s.value === status)
        return <Tag color={statusConfig?.color}>{statusConfig?.label}</Tag>
      }
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority) => {
        const priorityConfig = priorityOptions.find(p => p.value === priority)
        return <Tag color={priorityConfig?.color}>{priorityConfig?.label}</Tag>
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => date ? date.toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingWarranty(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (warranty) => {
    setEditingWarranty(warranty)
    form.setFieldsValue({
      ...warranty,
      createdAt: warranty.createdAt,
    })
    setModalVisible(true)
  }

  const handleView = (warranty) => {
    Modal.info({
      title: `Chi tiết bảo hành - ${warranty.warrantyCode}`,
      width: 600,
      content: (
        <div>
          <p><strong>Khách hàng:</strong> {warranty.customerName}</p>
          <p><strong>Số điện thoại:</strong> {warranty.customerPhone}</p>
          <p><strong>Email:</strong> {warranty.customerEmail}</p>
          <p><strong>Sản phẩm:</strong> {warranty.productName}</p>
          <p><strong>Mô tả vấn đề:</strong> {warranty.issueDescription}</p>
          <p><strong>Ghi chú:</strong> {warranty.notes || 'Không có'}</p>
          <p><strong>Trạng thái:</strong> {statusOptions.find(s => s.value === warranty.status)?.label}</p>
          <p><strong>Độ ưu tiên:</strong> {priorityOptions.find(p => p.value === warranty.priority)?.label}</p>
        </div>
      ),
    })
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'warranties', id))
      message.success('Xóa bảo hành thành công!')
    } catch (error) {
      console.error('Error deleting warranty:', error)
      message.error('Có lỗi xảy ra khi xóa!')
    }
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      const warrantyData = {
        ...values,
        warrantyCode: values.warrantyCode || `WR${Date.now()}`,
        updatedAt: new Date(),
      }

      if (editingWarranty) {
        await updateDoc(doc(db, 'warranties', editingWarranty.id), warrantyData)
        message.success('Cập nhật bảo hành thành công!')
      } else {
        await addDoc(collection(db, 'warranties'), {
          ...warrantyData,
          createdAt: new Date(),
        })
        message.success('Thêm bảo hành thành công!')
      }

      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Error saving warranty:', error)
      message.error('Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý bảo hành</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm bảo hành
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={warranties}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
        }}
      />

      <Modal
        title={editingWarranty ? 'Chỉnh sửa bảo hành' : 'Thêm bảo hành mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'pending',
            priority: 'normal',
          }}
        >
          <Form.Item
            name="warrantyCode"
            label="Mã bảo hành"
            rules={[{ required: true, message: 'Vui lòng nhập mã bảo hành!' }]}
          >
            <Input placeholder="Nhập mã bảo hành" />
          </Form.Item>

          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="customerEmail"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="issueDescription"
            label="Mô tả vấn đề"
            rules={[{ required: true, message: 'Vui lòng mô tả vấn đề!' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề của sản phẩm" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
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
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
          >
            <Select placeholder="Chọn độ ưu tiên">
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={3} placeholder="Ghi chú thêm (không bắt buộc)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingWarranty ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default WarrantyManagement
