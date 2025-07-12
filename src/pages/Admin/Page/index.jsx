import React, { useState, useEffect } from 'react'
import { 
  Button, 
  Form, 
  Input, 
  Select, 
  Space, 
  Tag, 
  DatePicker, 
  Row, 
  Col, 
  Typography, 
  message, 
  Card,
  Divider
} from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useFirestore } from '../../../hooks/useFirestore'
import { db } from '../../../utils/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import dayjs from 'dayjs'

const { Option } = Select
const { Title } = Typography

// Constants
const FORM_LAYOUT = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const RESPONSIVE_LAYOUT = {
  xs: 24,
  sm: 24, 
  md: 12,
  lg: 8,
  xl: 8
}

// Styles
const styles = {
  container: {
    padding: '24px',
  },
  card: {
    marginBottom: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  buttonGroup: {
    marginTop: '32px',
  }
}

const PageManagement = () => {
  const [form] = Form.useForm()
  const [eventContent, setEventContent] = useState('')
  const { getAllDocs, updateDocData, addDocData } = useFirestore(db, 'homeSettingService')
  const [docId, setDocId] = useState(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const docs = await getAllDocs()
      if (docs.length > 0) {
        const docData = docs[0]
        setDocId(docData.id)
        form.setFieldsValue({
          ...docData,
          eventDate: docData.eventDate ? dayjs(docData.eventDate) : null,
          keywords: docData.keywords || [],
        })
        setEventContent(docData.eventContent || '')
      } else {
        setDocId(null)
        form.resetFields()
        setEventContent('')
      }
    }
    fetchData()
  }, [getAllDocs, form])

  // Form submission handler
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
        // Clear existing documents before adding new one
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
    setEventContent('')
  }

  // Render section with card wrapper
  const renderCard = (title, children, span = 24) => (
    <Col {...RESPONSIVE_LAYOUT} span={span}>
      <Card title={title} style={styles.card}>
        {children}
      </Card>
    </Col>
  )

  // Render tags select field
  const renderTagsSelect = (name, label, placeholder, color = 'green', rules = []) => (
    <Form.Item name={name} label={label} rules={rules}>
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder={placeholder}
        tokenSeparators={[',']}
      >
        {(form.getFieldValue(name) || []).map(item => (
          <Option key={item} value={item}>
            <Tag color={color}>{item}</Tag>
          </Option>
        ))}
      </Select>
    </Form.Item>
  )

  // Render input field
  const renderInputField = (name, label, placeholder, rules = []) => (
    <Form.Item name={name} label={label} rules={rules}>
      <Input placeholder={placeholder} />
    </Form.Item>
  )

  return (
    <div style={styles.container}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        Quản lý trang chủ
      </Title>
      
      <Form
        {...FORM_LAYOUT}
        form={form}
        name="page-management"
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={[24, 24]}>
          {/* Keywords Section */}
          {renderCard('Từ khóa',
            renderTagsSelect('keywords', 'Từ khóa', 'Nhập từ khóa và nhấn Enter', 'green'),
            24
          )}

          {/* Banner Sections */}
          {renderCard('Banner nhiều link',
            renderTagsSelect('imageLinks', 'Link ảnh', 'Nhập link ảnh và nhấn Enter', 'blue', [
              { required: true, message: 'Vui lòng nhập ít nhất 1 link ảnh!' }
            ])
          )}

          {renderCard('Banner xem tất cả',
            renderInputField('bannerAllLink', 'Link banner', 'Nhập link banner xem tất cả', [
              { required: true, message: 'Vui lòng nhập link banner!' }
            ])
          )}

          {renderCard('Banner đổi mới ngay',
            renderInputField('bannerNowLink', 'Link banner', 'Nhập link banner đổi mới ngay', [
              { required: true, message: 'Vui lòng nhập link banner!' }
            ])
          )}

          {/* Top Selling Section */}
          {renderCard('Top bán chạy', (
            <>
              {renderInputField('topSellingImage1', 'Link ảnh 1', 'Nhập link ảnh 1 cho Top bán chạy', [
                { required: true, message: 'Vui lòng nhập link ảnh 1!' }
              ])}
              {renderInputField('topSellingImage2', 'Link ảnh 2', 'Nhập link ảnh 2 cho Top bán chạy', [
                { required: true, message: 'Vui lòng nhập link ảnh 2!' }
              ])}
            </>
          ))}

          {/* Hot Deal Section */}
          {renderCard('Deal cực cháy - Mua ngay kẻo lỡ', (
            <>
              {renderInputField('hotDealImage1', 'Link ảnh 1', 'Nhập link ảnh 1 cho Deal cực cháy', [
                { required: true, message: 'Vui lòng nhập link ảnh 1!' }
              ])}
              {renderInputField('hotDealImage2', 'Link ảnh 2', 'Nhập link ảnh 2 cho Deal cực cháy', [
                { required: true, message: 'Vui lòng nhập link ảnh 2!' }
              ])}
            </>
          ))}

          {/* Event Section */}
          {renderCard('Sự kiện', (
            <>
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
                  style={{ height: 150 }}
                />
              </Form.Item>
              <div style={{ marginTop: '48px' }} />
            </>
          ), 24)}
        </Row>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <Space size="large">
            <Button type="primary" htmlType="submit" size="large">
              Lưu tất cả
            </Button>
            <Button htmlType="button" onClick={onReset} size="large">
              Reset về dữ liệu gốc
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default PageManagement