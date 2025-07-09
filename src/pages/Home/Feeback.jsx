import React from 'react'
import { Card, Rate, Button, Avatar } from 'antd'
import feebackIcon from '../../assets/feedbackIcon.png'
const feedbacks = [
  {
    name: 'Ngọc Anh',
    date: '12/03/2024',
    location: 'AMZ TECH Đà Nẵng',
    rating: 5,
    content:
      'Dịch vụ tuyệt vời, nhân viên tư vấn nhiệt tình. Sản phẩm chất lượng đúng như quảng cáo. Sẽ quay lại mua lần sau!',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    name: 'Quang Huy',
    date: '05/11/2023',
    location: 'AMZ TECH Hồ Chí Minh',
    rating: 4,
    content:
      'Giao hàng nhanh, đóng gói cẩn thận. Giá cả hợp lý, nhiều chương trình khuyến mãi hấp dẫn.',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    name: 'Minh Châu',
    date: '28/07/2022',
    location: 'AMZ TECH Hà Nội',
    rating: 5,
    content:
      'Mình rất hài lòng với trải nghiệm mua sắm tại đây. Nhân viên hỗ trợ rất chu đáo và thân thiện.',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
]

function Feeback() {

  return (
    <div className=" py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 flex gap-2 items-center">
          <span>Khách hàng nói gì về Amz Tech</span> <img height={24} width={24} src={feebackIcon} alt="" />
        </h2>
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 justify-center mb-6">
          {feedbacks.map((fb, idx) => (
            <Card
              key={idx}
              className="flex-1 rounded-xl shadow-md transition transform hover:-translate-y-2 hover:shadow-xl"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={fb.avatar} size={48} />
                <div>
                  <div className="font-semibold">{fb.name}</div>
                  <Rate disabled defaultValue={fb.rating} className="text-yellow-400 text-sm" />
                </div>
              </div>
              <div className="text-gray-500 text-sm mb-2">
                {fb.date} - Mua hàng tại {fb.location}
              </div>
              <div className="text-gray-700 text-sm">
                {fb.content}
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <a
            href="https://www.google.com/maps/place/C%E1%BB%ADa+h%C3%A0ng+Loa,+Tai+nghe,+Ph%E1%BB%A5+ki%E1%BB%87n+c%C3%B4ng+ngh%E1%BB%87+ch%C3%ADnh+h%C3%A3ng+t%E1%BA%A1i+%C4%90%C3%A0+N%E1%BA%B5ng+-+AMZ+TECH/@16.065962,108.230697,15z/data=!4m17!1m8!3m7!1s0x3142182c89f479c7:0xbf9ef38f4f450644!2zMTQgTmd1eeG7hW4gVGjDtG5nLCBBbiBI4bqjaSBUcnVuZywgU8ahbiBUcsOgLCDEkMOgIE7hurVuZyA1NTAwMDAsIFZpZXRuYW0!3b1!8m2!3d16.065962!4d108.2306971!16s%2Fg%2F11mw5y0y85!3m7!1s0x3142192ac74d5237:0x84d4e7e69dfa4254!8m2!3d16.0659379!4d108.2307203!9m1!1b1!16s%2Fg%2F11s66cyymc?hl=en-US&entry=ttu&g_ep=EgoyMDI1MDYwOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="rounded-full px-8 !font-semibold !border-1 !border-[#999999] hover:!text-orange-500"
              type="default"
              size="large"
            >
              Xem tất cả
            </Button>
          </a>
          <a
            href="https://www.google.com/maps/place/C%E1%BB%ADa+h%C3%A0ng+Loa,+Tai+nghe,+Ph%E1%BB%A5+ki%E1%BB%87n+c%C3%B4ng+ngh%E1%BB%87+ch%C3%ADnh+h%C3%A3ng+t%E1%BA%A1i+%C4%90%C3%A0+N%E1%BA%B5ng+-+AMZ+TECH/@16.065962,108.230697,15z/data=!4m17!1m8!3m7!1s0x3142182c89f479c7:0xbf9ef38f4f450644!2zMTQgTmd1eeG7hW4gVGjDtG5nLCBBbiBI4bqjaSBUcnVuZywgU8ahbiBUcsOgLCDEkMOgIE7hurVuZyA1NTAwMDAsIFZpZXRuYW0!3b1!8m2!3d16.065962!4d108.2306971!16s%2Fg%2F11mw5y0y85!3m7!1s0x3142192ac74d5237:0x84d4e7e69dfa4254!8m2!3d16.0659379!4d108.2307203!9m1!1b1!16s%2Fg%2F11s66cyymc?hl=en-US&entry=ttu&g_ep=EgoyMDI1MDYwOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="rounded-full px-8 !font-semibold !border-1 !border-[#999999] hover:!text-orange-500"
              type="default"
              size="large"
            >
              Đánh giá Amz Tech
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Feeback