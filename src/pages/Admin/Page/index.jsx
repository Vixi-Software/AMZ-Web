import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, Space, List, Tag, DatePicker, Row, Col, Typography, message } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useFirestore } from '../../../hooks/useFirestore'
import { db } from '../../../utils/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import dayjs from 'dayjs'

const { Option } = Select
const { Title } = Typography

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { span: 18 },
}

const PageManagement = () => {
  const [form] = Form.useForm()
  const [eventContent, setEventContent] = useState('')
  const { getAllDocs, updateDocData, addDocData } = useFirestore(db, 'homeSettingService')
  const [docId, setDocId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const docs = await getAllDocs()
      if (docs.length > 0) {
        setDocId(docs[0].id)
        form.setFieldsValue({
          ...docs[0],
          eventDate: docs[0].eventDate ? dayjs(docs[0].eventDate) : null,
          keywords: docs[0].keywords || [],
        })
        setEventContent(docs[0].eventContent || '')
      } else {
        setDocId(null)
        form.resetFields()
        setEventContent('')
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [])

  const onFinish = async (values) => {
    const data = {
      ...values,
      eventContent,
      eventDate: values.eventDate ? values.eventDate.format('YYYY-MM-DD') : undefined,
      keywords: values.keywords || [],
    }
    try {
      if (docId) {
        await updateDocData(docId, data)
        message.success('Lưu thành công!')
      } else {
        // Xóa hết các doc cũ trước khi thêm mới
        const querySnapshot = await getDocs(collection(db, 'homeSettingService'))
        const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, 'homeSettingService', d.id)))
        await Promise.all(deletePromises)
        await addDocData(data)
        message.success('Tạo mới thành công!')
      }
    } catch (error) {
      message.error('Có lỗi khi lưu: ' + error.message)
    }
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Form
        {...layout}
        form={form}
        name="page-management"
        onFinish={onFinish}
        style={{ marginTop: 16 }}
      >
        {/* Thêm trường nhập nhiều từ khóa */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Từ khóa</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="keywords"
              label="Từ khóa"
              rules={[{ required: false }]}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Nhập từ khóa và nhấn Enter"
                tokenSeparators={[',']}
              >
                {(form.getFieldValue('keywords') || []).map(keyword => (
                  <Option key={keyword} value={keyword}>
                    <Tag color="green">{keyword}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Banner chạy banner nhiều link */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Banner nhiều link</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="imageLinks"
              label="Link ảnh"
              rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 link ảnh!' }]}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Nhập link ảnh và nhấn Enter"
                tokenSeparators={[',']}
              >
                {(form.getFieldValue('imageLinks') || []).map(link => (
                  <Option key={link} value={link}>
                    <Tag color="blue">{link}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Banner Xem tất cả */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Banner xem tất cả</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="bannerAllLink"
              label="Link banner"
              rules={[{ required: true, message: 'Vui lòng nhập link banner!' }]}
            >
              <Input placeholder="Nhập link banner xem tất cả" />
            </Form.Item>
          </Col>
        </Row>

        {/* Banner Đổi mới ngay */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5}>Banner đổi mới ngay</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="bannerNowLink"
              label="Link banner"
              rules={[{ required: true, message: 'Vui lòng nhập link banner!' }]}
            >
              <Input placeholder="Nhập link banner đổi mới ngay" />
            </Form.Item>
          </Col>
        </Row>

        {/* Banner Top bán chạy */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Top bán chạy</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="topSellingImage1"
              label="Link ảnh 1"
              rules={[{ required: true, message: 'Vui lòng nhập link ảnh 1!' }]}
            >
              <Input placeholder="Nhập link ảnh 1 cho Top bán chạy" />
            </Form.Item>
            <Form.Item
              name="topSellingImage2"
              label="Link ảnh 2"
              rules={[{ required: true, message: 'Vui lòng nhập link ảnh 2!' }]}
            >
              <Input placeholder="Nhập link ảnh 2 cho Top bán chạy" />
            </Form.Item>
          </Col>
        </Row>

        {/* Banner Deal cực cháy - Mua ngay kẻo lỡ */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Deal cực cháy - Mua ngay kẻo lỡ</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="hotDealImage1"
              label="Link ảnh 1"
              rules={[{ required: true, message: 'Vui lòng nhập link ảnh 1!' }]}
            >
              <Input placeholder="Nhập link ảnh 1 cho Deal cực cháy" />
            </Form.Item>
            <Form.Item
              name="hotDealImage2"
              label="Link ảnh 2"
              rules={[{ required: true, message: 'Vui lòng nhập link ảnh 2!' }]}
            >
              <Input placeholder="Nhập link ảnh 2 cho Deal cực cháy" />
            </Form.Item>
          </Col>
        </Row>

        {/* Event Form */}
        <Row style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Col span={24}>
            <Title level={5} style={{ fontWeight: 600 }}>Sự kiện</Title>
          </Col>
          <Col span={24}>
            <Form.Item
              name="eventDate"
              label="Ngày sự kiện"
              rules={[{ required: false }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="Nội dung sự kiện"
              required={false}
            >
              <ReactQuill
                value={eventContent}
                onChange={setEventContent}
                placeholder="Nhập nội dung sự kiện"
                style={{ height: 150, marginBottom: 24 }}
              />
            </Form.Item>

          </Col>
        </Row>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Lưu tất cả
            </Button>
            {/* Ẩn nút xóa hoặc đổi thành reset */}
            {/* <Button htmlType="button" onClick={onReset}>
              Xóa tất cả
            </Button> */}
            <Button htmlType="button" onClick={onReset}>
              Reset về dữ liệu gốc
            </Button>
          </Space>
        </Form.Item>
      </Form>

    </div>
  )
}

export default PageManagement