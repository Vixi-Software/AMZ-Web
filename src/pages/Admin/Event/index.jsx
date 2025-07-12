import React, { useState } from 'react'
import CTable from '../../../components/ui/table'
import { Alert, Modal, Form, Input, DatePicker, Button, Popconfirm, message } from 'antd'
import moment from 'moment'
import eventService from '../../../services/eventService'

const columns = [
  {
    title: 'Tên sự kiện',
    dataIndex: 'name',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
  },
  {
    title: 'Banner',
    dataIndex: 'linkBanner',
    render: (text) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        Xem banner
      </a>
    ),
    enableFilter: false,
  },
  {
    title: 'Thời gian bắt đầu',
    dataIndex: 'date',
    enableSort: true,
    enableFilter: true,
    filterType: 'dateRange',
  },
  {
    title: 'Thời gian kết thúc',
    dataIndex: 'endDate',
    enableSort: true,
    enableFilter: true,
    filterType: 'dateRange',
  },
]

function EventManagement() {
  const [dataSource, setDataSource] = useState([])
  const [modal, setModal] = useState({ visible: false, type: '', record: null })
  const [form] = Form.useForm()

  // Mở modal Thêm/Sửa
  const openModal = (type, record = null) => {
    setModal({ visible: true, type, record })
    if (type === 'edit' && record) {
      form.setFieldsValue({ 
        ...record, 
        date: moment(record.date, 'YYYY-MM-DD'),
        endDate: record.endDate ? moment(record.endDate, 'YYYY-MM-DD') : null,
      })
    } else {
      form.resetFields()
    }
  }

  // Đóng modal
  const closeModal = () => setModal({ visible: false, type: '', record: null })

  // Lấy danh sách sự kiện từ service
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventService.getAllEvents()
        setDataSource(events)
      } catch (error) {
        message.error('Lỗi khi tải danh sách sự kiện!')
        console.error(error)
      }
    }
    fetchEvents()
  }, [])

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then(async values => {
      try {
        if (modal.type === 'add') {
          const newEvent = await eventService.createEvent(values)
          setDataSource([...dataSource, newEvent])
          message.success('Đã thêm sự kiện!')
        } else if (modal.type === 'edit') {
          const updatedEvent = await eventService.updateEvent(modal.record.id, values)
          setDataSource(dataSource.map(item =>
            item.id === modal.record.id ? updatedEvent : item
          ))
          message.success('Đã cập nhật sự kiện!')
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
      await eventService.deleteEvent(record.id)
      setDataSource(dataSource.filter(item => item.id !== record.id))
      message.success('Đã xóa sự kiện!')
    } catch (error) {
      message.error('Lỗi khi xóa sự kiện!')
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
      {/* <Alert
        message="Đang trong quá trình phát triển"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      /> */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal('add')}
      >
        Thêm sự kiện
      </Button>
      <CTable
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="id"
      />
      <Modal
        open={modal.visible}
        title={modal.type === 'add' ? 'Thêm sự kiện' : 'Sửa sự kiện'}
        onCancel={closeModal}
        onOk={handleOk}
        okText={modal.type === 'add' ? 'Thêm' : 'Lưu'}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" initialValues={modal.record || {}}>
          <Form.Item
            label="Tên sự kiện"
            name="name"
            rules={[{ required: true, message: 'Nhập tên sự kiện' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Link banner"
            name="linkBanner"
            rules={[{ required: true, message: 'Nhập link banner' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thời gian bắt đầu"
            name="date"
            rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Thời gian kết thúc"
            name="endDate"
            rules={[
              { required: true, message: 'Chọn ngày kết thúc' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('date');
                  if (!value || !startDate) {
                    return Promise.resolve();
                  }
                  if (value.isAfter(startDate)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                },
              }),
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default EventManagement
