import React, { useState } from 'react'
import CTable from '../../../components/ui/table'
import { Alert, Modal, Form, Input, DatePicker, Button, Popconfirm, message } from 'antd'
import moment from 'moment'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'

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

  const {
    getAllDocs,
    addDocData,
    updateDocData,
    deleteDocData,
  } = useFirestore(db, "eventAMZ")

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

  // Lấy danh sách sự kiện từ Firestore
  React.useEffect(() => {
    const fetchEvents = async () => {
      const events = await getAllDocs()
      setDataSource(events)
    }
    fetchEvents()
  }, [])

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then(async values => {
      const data = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      }
      if (modal.type === 'add') {
        const id = await addDocData(data)
        setDataSource([
          ...dataSource,
          { ...data, id },
        ])
        message.success('Đã thêm sự kiện!')
      } else if (modal.type === 'edit') {
        await updateDocData(modal.record.id, data)
        setDataSource(dataSource.map(item =>
          item.id === modal.record.id
            ? { ...item, ...data }
            : item
        ))
        message.success('Đã cập nhật sự kiện!')
      }
      closeModal()
    })
  }

  // Xử lý xóa
  const handleDelete = async (record) => {
    await deleteDocData(record.id)
    setDataSource(dataSource.filter(item => item.id !== record.id))
    message.success('Đã xóa sự kiện!')
  }

  // Thêm cột thao tác
  const tableColumns = [
    ...columns,
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal('edit', record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
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
