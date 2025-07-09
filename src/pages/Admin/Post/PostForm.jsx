import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Space, message, Modal, Form, Input } from 'antd'
import routePath from '../../../constants/routePath'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'

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

function PostForm() {
  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { addDocData } = useFirestore(db, 'postService')

  const handleChange = (val) => {
    setContent(val)
  }

  const handleSave = () => {
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const date = new Date().toLocaleString('vi-VN')
      const postData = {
        title: values.title,
        date,
        content
      }
      await addDocData(postData)
      message.success('Đã lưu bài viết mới!')
      setModalOpen(false)
      form.resetFields()
      setContent('')
      navigate(routePath.adminPost)
    } catch (err) {
      message.error('Vui lòng nhập tiêu đề bài viết!')
    }
  }

  const handleModalCancel = () => {
    setModalOpen(false)
  }

  const handleClear = () => {
    setContent('')
    message.info('Đã xóa hết nội dung!')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleSave}>Lưu</Button>
        <Button danger onClick={handleClear}>Xóa hết</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          style={{ height: '100%', minHeight: 300 }}
        />
      </div>
      <Modal
        title="Nhập tiêu đề bài viết"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
        <div>
          <b>Ngày viết:</b> {new Date().toLocaleString('vi-VN')}
        </div>
      </Modal>
    </div>
  )
}

export default PostForm