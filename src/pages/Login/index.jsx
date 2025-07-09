import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { useDispatch } from 'react-redux'
import { login } from '../../store/features/auth/authSlice'
import { useNavigate } from 'react-router-dom' // Thêm dòng này

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate() // Thêm dòng này

  const onFinish = async (values) => {
    try {
      await dispatch(login(values.email, values.password))
      navigate('/admin') // Chuyển hướng sau khi login thành công
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error('Đăng nhập không thành công!') // Hiển thị thông báo lỗi
      // Xử lý lỗi nếu cần
    }
  }

  const onFinishFailed = (errorInfo) => {
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 0' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng nhập</h2>
      <Form
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Tài khoản"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'string', message: 'Tài khoản không hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login