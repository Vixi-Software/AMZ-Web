import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, message, Modal, Input, Select } from 'antd'
import { db } from '@/utils/firebase'

import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'

const formatDateTime = (date) => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const reactQuillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link', 'image', 'video'
]

const postTypeOptions = [
  { label: 'Bài viết chung', value: 'postService' },
  { label: 'Sản phẩm', value: 'productPosts' },
]

function PostForm({ initialValues = {}, collectionOrigin = "postService", type = "Add", onFinish }) {
  console.log("type", type, collectionOrigin)
  const [content, setContent] = useState('')
  const [collectionName, setCollectionName] = useState(collectionOrigin)
  const [titlePost, setTitlePost] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('')
  const quillRef = useRef(null)
  const [savedRange, setSavedRange] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    formatDateTime(new Date())
  );

  const handleImageClick = () => {
    const editor = quillRef.current?.getEditor()
    const range = editor?.getSelection()
    if (range) setSavedRange(range)
    setIsModalOpen(true)
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
    setIsModalOpen(false)
    setImageUrl("")
    setSavedRange(null)
  };

  // Register custom handler on mount
  useEffect(() => {
    const quill = quillRef.current.getEditor();
    quill.getModule('toolbar').addHandler('image', handleImageClick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatDateTime(new Date()));
    }, 1000); // update every second

    return () => clearInterval(interval); // cleanup when unmounted
  }, []);

  useEffect(() => {
    if (initialValues) {
      setTitlePost(initialValues.title ? initialValues.title : '')
      setContent(initialValues.content ? initialValues.content : '')
      setCollectionName(collectionOrigin)
    }
  }, []);

  const reactQuillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  const handleChange = (val) => {
    setContent(val)
  }

  const handleSave = async () => {
    if (type == "Add") {
      try {
        const date = new Date().toLocaleString('vi-VN')
        const postData = {
          title: titlePost,
          date,
          content
        }
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, postData);
        message.success('Đã lưu bài viết')
        setContent('')
        onFinish()
      }
      catch (error) {
        console.error('❌ Lỗi khi thêm bài viết mới:', error);
        message.error('Thêm bài viết thất bại');
      }
    }

    if (type == "Update") {
      const updatedData = {
        title: titlePost,
        date: currentTime,
        content: content,
      };
      const id =  initialValues.id

      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updatedData);
        message.success('📝 Đã cập nhật bài viết');
        onFinish()
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật:', error);
        message.error('Cập nhật bài viết thất bại');
      }
    }

    // try {
    // const date = new Date().toLocaleString('vi-VN')
    // const postData = {
    //   title: titlePost,
    //   date,
    //   content
    // }
    // const colRef = collection(db, collectionName);
    // const docRef = await addDoc(colRef, postData);
    // console.log('📄 New doc ID:', docRef.id);
    // message.success('Đã thêm bài viết mới!')
    // form.resetFields()
    // setContent('')
    // navigate(routePath.adminPost)
    // } catch (err) {
    //   console.log('error', err)
    //   message.error('Vui lòng nhập tiêu đề bài viết!')
    // }
  }

  const handleClear = () => {
    setContent('')
    message.info('Đã xóa hết nội dung!')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, gap: 16 }}>

      {/* Top Actions */}

      <label style={{ fontWeight: 500 }}>Tên bài viết:</label>
      <Input value={titlePost} onChange={(e) => setTitlePost(e.target.value)} />
      <div style={{ marginTop: 16 }}>
        <b style={{ marginRight: 16 }}>Ngày viết:</b>
        {currentTime}
      </div>
      {/* Post Type Selector */}
      <div>
        <label style={{ fontWeight: 500, marginRight: 10 }}>Chọn loại bài viết:</label>
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
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={reactQuillModules}
          formats={reactQuillFormats}
          style={{ height: '100%', minHeight: 300 }}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button danger onClick={handleClear}>Xóa hết</Button>
        <Button style={{ marginLeft: 10 }} type="primary" onClick={handleSave}>Lưu</Button>
      </div>
      <Modal
        title="Thêm URL Hình ảnh"
        open={isModalOpen}
        onOk={insertImage}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
        cancelText="Thoát"
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

export default PostForm