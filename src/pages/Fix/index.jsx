import React, { useEffect, useState } from "react";
import routePath from "../../constants/routePath";
import { useNavigate } from "react-router-dom";
import { db } from '@/utils/firebase'
import { Carousel, Grid } from "antd";
import { useFirestore } from "@/hooks/useFirestore";

const FixPage = () => {
  const navigate = useNavigate();

  const { getAllDocs } = useFirestore(db, '07-warranty')
  const screens = Grid.useBreakpoint();
  const [warrantyInfo, setWarrantyInfo] = useState({})

  useEffect(() => {
    const fetchWaranty = async () => {
      const docs = await getAllDocs()
      if (docs.length > 0) {
        setWarrantyInfo(docs[0])
      }
    }
    fetchWaranty()
  }, []);



  return (
    <div>
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 text-black border-2 p-2 rounded-full border-black" onClick={() => navigate(routePath.home)}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M3 10.75L12 4l9 6.75" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 10.75V19a1 1 0 001 1h3.5v-4.25a1 1 0 011-1h2a1 1 0 011 1V20H18.5a1 1 0 001-1v-8.25" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Trang chủ</span>
          </span>
          <span className="mx-1 text-black">{'>'}</span>
          <span className="flex items-center gap-1 bg-orange-500 text-white font-semibold p-2 rounded-full border-2 border-orange-500">
            {'Bảo hành - sửa chữa'}
          </span>
        </nav>
      </div>
      <div className='mt-[30px]'>
        {warrantyInfo ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg">
              <h1 className="text-[21px] be-vietnam-pro-medium  font-semibold">{warrantyInfo.title}</h1>
              <div
                className="text-gray-600 be-vietnam-pro"
                dangerouslySetInnerHTML={{ __html: warrantyInfo.content }}
              />
            </div>
          </div>
        ) : (
          <div>Không có bài viết nào</div>
        )}
      </div>
    </div>
  );
};

export default FixPage;