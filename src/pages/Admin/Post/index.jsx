/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CTable from '../../../components/ui/table'
import { db } from '../../../utils/firebase'
import { useFirestore } from '../../../hooks/useFirestore'
import { message, Modal, Form, Input, Select } from 'antd' // Thêm dòng này
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PostForm from './PostForm'
import { collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore'


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

const postTypeOptions = [
  { label: 'Bài viết chung', value: 'postService' },
  { label: 'Sản phẩm', value: 'productPosts' },
]

function PostManagement() {
  // const { getAllDocs, updateDocData, deleteDocData } = useFirestore(db, 'postService')
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
  const [collectionName, setCollectionName] = useState('postService')
  const [formType, setFormType] = useState('Add')

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
      align: 'center',
      enableSort: true,
      enableFilter: true,
      filterType: 'dateRange',
    },
    {
      title: 'Sửa/Xoá',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
          <button
            style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}
            onClick={() => {
              setFormType('Update')
              handleEdit(record, 'Update')
            }}
          >Sửa</button>
          <button
            style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}
            onClick={() => {
              handleDelete(record)
            }}
          >Xóa</button>
        </div>
      ),
    },
  ]

  const fetchData = async () => {
    setLoading(true)
    const colRef = collection(db, collectionName);
    const q = query(colRef);
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDataSource(result);
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [collectionName])


  // Xử lý xóa bài viết với xác nhận của Ant Design
  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa bài viết này?',
      content: `Tiêu đề: ${record.title}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const docRef = doc(db, collectionName, record.id);
          await deleteDoc(docRef);
          message.success('🗑️ Đã xoá bài viết');
          fetchData()
        } catch (error) {
          console.error('❌ Lỗi khi xoá:', error);
          message.error('Xoá thất bại');
        }
      },
    })
  }

  // Khi mở modal sửa, set giá trị cho form
  const handleEdit = (record = {}, type = "Add") => {
    setEditRecord(record || '')
    setEditTitle(record.title || '')
    setEditContent(record.content || '') // Thêm dòng này
    setEditModalOpen(true)
    setFormType(type)
    editForm.setFieldsValue({ title: record.title, content: record.content || '' })
    fetchData()
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
  const handleFinishPostForm = () => {
    setEditModalOpen(false)
    fetchData()
  }

  // Đóng modal
  const handleCloseModal = () => {
    setModalOpen(false)
    setModalContent('')
  }

  return (
    <div>
      {/* Post Type Selector */}
      <div className='mb-4'>
        <label style={{ fontWeight: 500, marginRight: 10, }}>Chọn loại bài viết:</label>
        <Select
          options={postTypeOptions}
          value={collectionName}
          onChange={val => setCollectionName(val)}
          style={{ width: 300, marginTop: 8 }}
        />
      </div>
      <CTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        action={
          {
            key: 'add',
            label: 'Thêm bài viết',
            type: 'primary',
            onClick: () => handleEdit('', 'Add'),
          }
        }
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
        title=""
        open={editModalOpen}
        // onOk={handleSaveEdit}
        onCancel={handleCloseEditModal}
        // okText="Lưu"
        // cancelText="Hủy"
        footer={null}
        destroyOnHidden
        width={800} // Cho rộng hơn để dễ sửa nội dung
      >
        <PostForm initialValues={editRecord} type={formType} collection={collectionName} onFinish={handleFinishPostForm}>

        </PostForm>
        {/* <Form form={editForm} layout="vertical">
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
        </Form> */}
      </Modal>
    </div>
  )
}

export default PostManagement