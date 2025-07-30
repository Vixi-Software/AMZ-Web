import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, message, Modal, Input, Select } from 'antd'
import { db } from '@/utils/firebase'

import { doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from '@/hooks/useFirestore'
import { useSelector } from 'react-redux'
import { selectCategory } from '@/store/features/filterProduct/filterProductSlice'


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


const reactQuillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block',
  'link', 'image', 'video'
]

const collectionName = "07-policy"

function Policy() {
  const [content, setContent] = useState('')
  const category = useSelector(selectCategory);
  const [id, setId] = useState("warranty")
  const { getAllDocs } = useFirestore(db, '07-policy')
  const [titlePost, setTitlePost] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('')
  const quillRef = useRef(null)
  const [savedRange, setSavedRange] = useState(null);
  console.log("cate", category)
  const [policyInfo, setPolicyInfo] = useState({})




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
    switch (category) {
      case "Chính sách mua hàng":
        setId("purchase");
        break;

      case "Chính sách bảo hành":
        setId("warranty");
        break;

      case "Chính sách bảo mật":
        setId("privacy");
        break;
    }
  }, [category]);

  useEffect(() => {
    const fetchPolicy = async () => {
      const docs = await getAllDocs()
      if (docs.length > 0) {
        const policy = docs.find(item => item.id === id)
        console.log("Poli:",id)
        setPolicyInfo(policy)
      }
    }
    fetchPolicy()
  }, [id]);
  

  useEffect(() => {
    if (policyInfo) {
      setTitlePost(policyInfo.title ?? '');   
      setContent(policyInfo.content ?? '');
    }
  }, [policyInfo]);


  const handleChange = (val) => {
    setContent(val)
  }

  const handleSave = async () => {
    const updatedData = {
      title: titlePost,
      content: content,
    };
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedData);
      message.success('📝 Đã cập nhật bài viết');
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật:', error);
      message.error('Cập nhật bài viết thất bại');
    }
  }

  const handleClear = () => {
    setContent('')
    message.info('Đã xóa hết nội dung!')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, gap: 16 }}>

      {/* Top Actions */}

      <label style={{ fontWeight: 700, fontSize: 25 }}>{"Chỉnh sửa " + category}</label>
      <label style={{ fontWeight: 500 }}>Tên bài viết:</label>
      <Input value={titlePost} onChange={(e) => setTitlePost(e.target.value)} />
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

export default Policy