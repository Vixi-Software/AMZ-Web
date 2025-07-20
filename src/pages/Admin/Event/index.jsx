import React, { useEffect, useRef, useState } from 'react'
import CTable from '@/components/ui/table'
import { Alert, Modal, Form, Input, DatePicker, Button, Popconfirm, message } from 'antd'
import moment from 'moment'
import { db } from '@/utils/firebase'
import { useFirestore } from '@/hooks/useFirestore'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const columns = [
  {
    title: 'Tên sự kiện',
    dataIndex: 'name',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
    showSorterTooltip: false,
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
    dataIndex: 'startDate',
    enableSort: true,
    enableFilter: true,
    filterType: 'dateRange',
    showSorterTooltip: false,
  },
  {
    title: 'Thời gian kết thúc',
    dataIndex: 'endDate',
    enableSort: true,
    enableFilter: true,
    filterType: 'dateRange',
    showSorterTooltip: false,
  },
]

const reactQuillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote'],
    ['link', 'image'],
    ['clean'],
  ],
}


const reactQuillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link', 'image'
]

function EventManagement() {
  const [dataSource, setDataSource] = useState([])
  const [modal, setModal] = useState({ visible: false, type: '', record: null })
  const [imageUrl, setImageUrl] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [form] = Form.useForm()
  const quillRef = useRef(null)
  const [savedRange, setSavedRange] = useState(null);
  const [content, setContent] = useState('')
  const {
    getAllDocs,
    addDocData,
    updateDocData,
    deleteDocData,
  } = useFirestore(db, "eventAMZ")

  const handleImageClick = () => {
    const editor = quillRef.current?.getEditor()
    const range = editor?.getSelection()
    if (range) setSavedRange(range)
    setIsImageModalOpen(true)
  };
  // Insert image when user clicks "Insert"
  const insertImage = () => {
    const editor = quillRef.current?.getEditor()

    if (!savedRange) {
      message.warning('Vui lòng chọn vị trí trong nội dung để chèn ảnh.')
      return;
    }

    if (!imageUrl.trim()) {
      message.warning('Vui lòng nhập đường dẫn hình ảnh hợp lệ.')
      return;
    }

    editor.insertEmbed(savedRange.index, 'image', imageUrl.trim(), 'user')
    setIsImageModalOpen(false)
    setImageUrl("")
    setSavedRange(null)
  };


  const handleChange = (val) => {
    setContent(val)
  }

  // Mở modal Thêm/Sửa
  const openModal = (type, record = null) => {
    setModal({ visible: true, type, record });
    if (type === 'edit' && record) {
      setContent(record.content || '');
      form.setFieldsValue({
        ...record,
        startDate: moment(record.startDate, 'YYYY-MM-DD'),
        endDate: record.endDate ? moment(record.endDate, 'YYYY-MM-DD') : null,
      });
    } else {
      form.resetFields();
      setContent('');
      form.setFieldsValue({
        name: "",
        linkBanner: "",
        startDate: null,
        endDate: null
      });
    }
  };


  // Đóng modal
  const closeModal = () => {
    form.resetFields();
    setContent('');
    form.setFieldsValue({
      name: "",
      linkBanner: "",
      startDate: null,
      endDate: null
    });
    setModal({ visible: false, type: '', record: null })
  }

  // Lấy danh sách sự kiện từ Firestore
  React.useEffect(() => {
    const fetchEvents = async () => {
      const events = await getAllDocs()
      setDataSource(events)
      console.log("Event", events)
    }
    fetchEvents()
  }, [])

  

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then(async values => {
      const data = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      }
      if (modal.type == 'add') {
        const id = await addDocData(data)
        setDataSource([
          ...dataSource,
          { ...data, id },
        ])
        message.success('Đã thêm sự kiện!')
              } else if (modal.type == 'edit') {
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
          <Button style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer', marginRight: 8 }} onClick={() => openModal('edit', record)} >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <CTable
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="id"
        action={
          {
            key: 'add',
            label: 'Thêm sự kiện',
            type: 'primary',
            onClick: () => openModal('add'),
          }
        }
      />
      <Modal
        open={modal.visible}
        title={modal.type === 'add' ? 'Thêm sự kiện' : 'Sửa sự kiện'}
        onCancel={closeModal}
        onOk={handleOk}
        okText={modal.type === 'add' ? 'Thêm' : 'Lưu'}
        afterOpenChange={(open) => {
          if (open) {
            setTimeout(() => {
              if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                quill.getModule('toolbar').addHandler('image', handleImageClick);
              }
            }, 0);
          }
        }}
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
            name="startDate"

            rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="" />
          </Form.Item>
          <Form.Item
            label="Thời gian kết thúc"
            name="endDate"
            rules={[
              { required: true, message: 'Chọn ngày kết thúc' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('startDate');
                  const isMoment = (d) => moment.isMoment(d) && d.isValid();
                  if (!isMoment(value) || !isMoment(startDate)) {
                    return Promise.resolve(); 
                  }
              
                  if (value.isAfter(startDate, 'day')) {
                    return Promise.resolve();
                  }
              
                  return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                },
              })
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="" />
          </Form.Item>
          <Form.Item
            label="Bài viết"
            name="content"
            rules={[{ required: true, message: 'Viết nội dung cho Sự kiện' }]}
          >
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={handleChange}
                modules={reactQuillModules}
                formats={reactQuillFormats}
                style={{ height: '100%', minHeight: 200 }} 
              />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm URL Hình ảnh"
        open={isImageModalOpen}
        onOk={insertImage}
        onCancel={() => setIsImageModalOpen(false)}
        okText="Thêm"
        cancelText="Thoát"
        zIndex={2000}
      >
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Nhập link hình ảnh"
        />
      </Modal>
    </div>
  )
}

export default EventManagement
