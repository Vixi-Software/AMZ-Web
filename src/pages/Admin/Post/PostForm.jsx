import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Space, message, Modal, Form, Input, Select } from 'antd'
import routePath from '../../../constants/routePath'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'

const reactQuillModules = {
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

const reactQuillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link', 'image', 'video'
]

const postTypeOptions = [
  { label: 'Sản phẩm', value: 'productPosts' },
  { label: 'Bài viết chung', value: 'postService' },
]

function PostForm() {
  const [content, setContent] = useState('')
  const [collectionName, setCollectionName] = useState('postService')
  const [titlePost, setTitlePost] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  // const { addDocData } = useFirestore(db, collectionName)

  const handleChange = (val) => {
    setContent(val)
  }

  const handleSave = async () => {
    try {
      const date = new Date().toLocaleString('vi-VN')
      const postData = {
        title: titlePost,
        date,
        content
      }
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, postData);
      console.log('📄 New doc ID:', docRef.id);
      message.success('Đã thêm bài viết mới!')
      setModalOpen(false)
      form.resetFields()
      setContent('')
      navigate(routePath.adminPost)
    } catch (err) {
      message.error('Vui lòng nhập tiêu đề bài viết!')
    }
  }

  const handleClear = () => {
    setContent('')
    message.info('Đã xóa hết nội dung!')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, gap: 16 }}>

      {/* Top Actions */}
      <Space>
        <Button type="primary" onClick={handleSave}>Lưu</Button>
        <Button danger onClick={handleClear}>Xóa hết</Button>
      </Space>
      <label style={{ fontWeight: 500 }}>Tên bài viết:</label>
      <Input value={titlePost} onChange={(e) => setTitlePost(e.target.value)} />
      <div style={{ marginTop: 16 }}>
        <b style={{ marginRight: 16 }}>Ngày viết:</b>
        {new Date().toLocaleString('vi-VN')}
      </div>
      {/* Post Type Selector */}
      <div>
        <label style={{ fontWeight: 500 }}>Chọn loại bài viết:</label>
        <Select
          options={postTypeOptions}
          value={collectionName}
          onChange={val => setCollectionName(val)}
          style={{ width: 300, marginTop: 8 }}
        />
      </div>

      {/* Rich Text Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Nội dung bài viết:</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={reactQuillModules}
          formats={reactQuillFormats}
          style={{ height: '100%', minHeight: 300 }}
        />
      </div>

      {/* Modal for Title Input */}
      {/* <Modal
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
          
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16 }}>
        <b>Ngày viết:</b> {new Date().toLocaleString('vi-VN')}
      </div>
    </Modal> */}

    </div>

  )
}

export default PostForm