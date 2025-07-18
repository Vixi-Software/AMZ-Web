import React, { useEffect, useState } from 'react'
import MainCarousel from '../Home/MainCarousel'
import { Row, Col, Card, Carousel, ConfigProvider } from 'antd'
import { useNavigate } from 'react-router-dom';
import routePath from '../../constants/routePath';
import { db } from '../../utils/firebase'
import { useFirestore } from '../../hooks/useFirestore'
import { Flame, Clock } from 'lucide-react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import fireGif from '@/assets/fire.gif';
import clockGif from '@/assets/clock.gif';

const CustomArrow = ({ className, style, onClick, direction }) => (
    <div
        className={`${className} custom-arrow`}
        style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            zIndex: 2,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
        onClick={onClick}
    >
        {direction === 'prev' ? <LeftOutlined style={{ color: '#333' }} /> : <RightOutlined style={{ color: '#333' }} />}
    </div>
);

function Sale() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const { getAllDocs } = useFirestore(db, "eventAMZ");

    useEffect(() => {
        getAllDocs().then(setEvents);
    }, []);


    return (
        <div>
            <div className="mb-4">
                <nav className="flex items-center gap-2 text-sm">
                    {/* Home icon */}
                    <span className="flex items-center gap-1 text-black border-2 p-2 rounded-full border-black hover:bg-gray-100 transition-all duration-300 cursor-pointer" onClick={() => navigate(routePath.home)}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path d="M3 10.75L12 4l9 6.75" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.5 10.75V19a1 1 0 001 1h3.5v-4.25a1 1 0 011-1h2a1 1 0 011 1V20H18.5a1 1 0 001-1v-8.25" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Trang chủ</span>
                    </span>
                    <span className="mx-1 text-black">{'>'}</span>
                    <span className="flex items-center cursor-pointer gap-1 bg-orange-500 text-white font-semibold p-2 rounded-full border-2 border-orange-500">
                        {'Khuyến mãi hot'}
                    </span>
                </nav>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Carousel: {
                            arrowSize: 0,
                            arrowOffset: 24,
                        },
                    },
                }}
            >
                <div className="carousel-container group">
                    <Carousel
                        dots={true}
                        autoplay
                        arrows={true}
                        prevArrow={<CustomArrow direction="prev" />}
                        nextArrow={<CustomArrow direction="next" />}
                        className="main-carousel"
                    >
                        {events.map(event => (
                            <div key={event.id} className="carousel-image-container">
                                <img
                                    alt={event.name}
                                    src={event.linkBanner}
                                    className="
                                        w-full object-cover
                                        h-[180px]
                                        md:h-[400px]
                                        lg:h-[560px]
                                        rounded-lg
                                        mt-2 md:mt-0
                                        carousel-image
                                    "
                                />
                            </div>
                        ))}
                    </Carousel>
                    <style jsx>{`
                        .carousel-container {
                            position: relative;
                        }
                        
                        .carousel-container .custom-arrow {
                            opacity: 0;
                            transform: scale(0.8);
                            transition: all 0.3s ease;
                        }
                        
                        .carousel-container:hover .custom-arrow {
                            opacity: 1 !important;
                            transform: scale(1);
                        }

                        .carousel-image-container {
                            overflow: hidden;
                            border-radius: 8px;
                        }

                        .carousel-image {
                            transition: transform 0.5s ease-in-out;
                            cursor: pointer;
                        }

                        .carousel-image:hover {
                            transform: scale(1.05);
                        }
                    `}</style>
                </div>
            </ConfigProvider>

            <div className="mt-8">
                <h2 className="!text-base font-bold mb-[20px] mt-[34px] flex items-center gap-2">
                    Khuyến mãi HOT <img src={fireGif} width={36} alt="" />
                </h2>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                        {events[0] && (
                            <div className="cursor-pointer" style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1/0.6551724137931034', width: '100%' }}>
                                <img
                                    src={events[0].linkBanner}
                                    alt={events[0].name}
                                    className="transition-transform duration-500 ease-in-out hover:scale-110"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                {events[1] && (
                                    <div className="cursor-pointer" style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1/0.6551724137931034', width: '100%' }}>
                                        <img
                                            src={events[1].linkBanner}
                                            alt={events[1].name}
                                            className="transition-transform duration-500 ease-in-out hover:scale-110"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </Col>
                            <Col span={24}>
                                {events[2] && (
                                    <div className="cursor-pointer" style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1/0.6551724137931034', width: '100%' }}>
                                        <img
                                            src={events[2].linkBanner}
                                            alt={events[2].name}
                                            className="transition-transform duration-500 ease-in-out hover:scale-110"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <div className="mt-8">
                <h2 className="!text-base font-bold mb-[20px] mt-[34px] flex items-center gap-2">
                    Sắp diễn ra <img src={clockGif} width={36} alt="" />
                </h2>
                <Row gutter={[16, 16]}>
                    {events
                        .filter(event => {
                            // Lọc sự kiện có ngày bắt đầu >= hôm nay
                            const today = new Date();
                            const eventDate = new Date(event.date);
                            return eventDate >= today;
                        })
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 4)
                        .map(event => (
                            <Col xs={24} md={12} key={event.id}>
                                <div className="cursor-pointer" style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1/0.6551724137931034', width: '100%' }}>
                                    <img
                                        alt={event.name}
                                        src={event.linkBanner}
                                        className="transition-transform duration-500 ease-in-out hover:scale-110"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </Col>
                        ))}
                </Row>
            </div>

            {/* Hiển thị tất cả sự kiện bằng Carousel */}

        </div>
    )
}

export default Sale
