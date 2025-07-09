/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CTable from '../../../components/ui/table'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'
import { message, Modal, Form, Input } from 'antd' // Thêm dòng này
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const columns = [
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    enableSort: true,
    enableFilter: true,
    filterType: 'text',
  },
  {
    title: 'Ngày đăng',
    dataIndex: 'date',
    enableSort: true,
    enableFilter: true,
    filterType: 'dateRange',
  },
]

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ]
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link', 'image', 'video'
]


function PostManagement() {
  const { getAllDocs, updateDocData, deleteDocData } = useFirestore(db, 'postService')
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [selectedRows, setSelectedRows] = useState([]) // Thêm state lưu hàng được chọn
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('') // Thêm state này
  const [editForm] = Form.useForm() // Thêm dòng này

  const fetchData = async () => {
    setLoading(true)
    const data = await getAllDocs()
    setDataSource(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Xử lý xóa bài viết với xác nhận của Ant Design
  const handleDelete = () => {
    if (selectedRows.length !== 1) {
      message.warning('Vui lòng chọn một bài viết để xóa!')
      return
    }
    const target =  selectedRows[0]
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa bài viết này?',
      content: `Tiêu đề: ${target.title}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteDocData(target.id)
        fetchData()
        message.success('Đã xóa bài viết!')
      },
    })
  }

  // Khi mở modal sửa, set giá trị cho form
  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      message.warning('Vui lòng chọn một bài viết để sửa!')
      return
    }

    setEditRecord(selectedRows[0]) // Lấy bản ghi đầu tiên trong selectedRows
    setEditTitle(selectedRows[0].title)
    setEditContent(selectedRows[0].content || '') // Thêm dòng này
    setEditModalOpen(true)
    editForm.setFieldsValue({ title: selectedRows[0].title, content: selectedRows[0].content || '' })
  }

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields()
      await updateDocData(editRecord.id, { title: values.title.trim(), content: values.content })
      setEditModalOpen(false)
      setEditRecord(null)
      setEditTitle('')
      setEditContent('')
      fetchData()
    } catch (err) {
      message.warning('Tiêu đề không được để trống!')
    }
  }

  // Đóng modal sửa
  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditRecord(null)
    setEditTitle('')
    setEditContent('') // Thêm dòng này
    editForm.resetFields()
  }

  // Xử lý xem nội dung
  const handleViewContent = (record) => {
    let content = ''
    if (record && record.content) {
      content = record.content
    } else if (selectedRows.length === 1) {
      content = selectedRows[0].content || ''
    } else if (selectedRows.length === 0) {
      message.warning('Vui lòng chọn một bài viết để xem nội dung!')
      return
    } else {
      message.warning('Chỉ được chọn một bài viết để xem nội dung!')
      return
    }
    setModalContent(content)
    setModalOpen(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setModalOpen(false)
    setModalContent('')
  }

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <CTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onRowSelectionChange={setSelectedRows} // Xử lý chọn hàng
        actions={[
          {
            key: 'add',
            label: 'Thêm bài viết',
            type: 'primary',
            onClick: () => alert('Thêm bài viết'),
          },
          {
            key: 'view',
            label: 'Xem nội dung',
            type: 'default',
            onClick: handleViewContent, // truyền hàm xử lý xem nội dung
          },
          {
            key: 'edit',
            label: 'Sửa',
            type: 'default',
            onClick: handleEdit, // truyền hàm xử lý sửa
          },
          {
            key: 'delete',
            label: 'Xóa',
            type: 'default',
            danger: true,
            onClick: handleDelete, // truyền hàm xử lý xóa
          },
        ]}
      />

      {/* Modal xem nội dung dùng Ant Design */}
      <Modal
        title="Nội dung bài viết"
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <div style={{ minHeight: 200 }}>
          <div dangerouslySetInnerHTML={{ __html: modalContent }} />
        </div>
      </Modal>

      {/* Modal sửa bài viết dùng Ant Design */}
      <Modal
        title="Sửa bài viết"
        open={editModalOpen}
        onOk={handleSaveEdit}
        onCancel={handleCloseEditModal}
        okText="Lưu"
        cancelText="Hủy"
        width={800} // Cho rộng hơn để dễ sửa nội dung
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { max: 100, message: 'Tiêu đề tối đa 100 ký tự!' }
            ]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' }
            ]}
          >
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              style={{ height: '100%', minHeight: 300 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PostManagement