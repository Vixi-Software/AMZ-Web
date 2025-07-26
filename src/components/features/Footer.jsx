import { FacebookFilled, InstagramFilled, TikTokFilled, WhatsAppOutlined, YoutubeFilled } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { db } from '../../utils/firebase'
import facebook from '../../assets/facebook.svg'
import instagram from '../../assets/instaram.svg'
import tiktok from '../../assets/tiktok.svg'
import whatsapp from '../../assets/whatup.svg'
import youtube from '../../assets/youtube.svg'
import { LINK_CONSTANT } from '../../constants/linkConstant'

function Footer() {
    const { getAllDocs } = useFirestore(db, 'events')
    const [links, setLinks] = useState({})

    useEffect(() => {
        const fetchLinks = async () => {
            const docs = await getAllDocs()
            if (docs.length > 0) {
                setLinks(docs[0])
            }
        }
        fetchLinks()
    }, [])

    return (
        <div className="bg-white py-8 mt-4 rounded-4 rounded-t-xl">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <h6 className="font-normal text-lg mb-2">Thông tin và chính sách</h6>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Mua hàng và thanh toán</li>
                            <li>Mua hàng trả góp</li>
                            <li>Chính sách giao hàng</li>
                            <li>Chính sách vận chuyển</li>
                            <li>Chính sách kiểm hàng</li>
                            <li>Chính sách đổi trả</li>
                            <li>Chính sách bảo hành</li>
                            <li>Chính sách bảo mật</li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-normal text-lg mb-2">Loa</h6>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Loa mini</li>
                            <li>Loa bluetooth cầm tay</li>
                            <li>Loa cắm điện</li>
                            <li>Loa để bàn</li>
                            <li>Loa decor</li>
                            <li>Loa cao cấp</li>
                            <li>Loa đi cắm trại</li>
                            <li>Loa hát karaoke</li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-normal text-lg mb-2">Tai nghe</h6>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Tai nghe true wireless</li>
                            <li>Tai nghe nhét tai</li>
                            <li>Tai nghe chụp tai</li>
                            <li>Tai nghe tập gym</li>
                            <li>Tai nghe chống ồn</li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt5">
                    <div className='mt-8'>
                        <h6 className="font-normal text-lg mb-2">Kết nối với AMZ TECH</h6>
                        <p className="text-sm">
                            Đà Nẵng: <span className="font-bold">0935.241.243</span><br />
                            Địa chỉ: 14 Nguyễn Thông - An Hải Tây - Sơn Trà - Đà Nẵng
                        </p>
                        <p className="text-sm mt-4">
                            Hà Nội: <span className="font-bold">0333.571.236</span><br />
                            Địa chỉ: Số 2, Ngõ 92 Láng Hạ - Đống Đa - Hà Nội
                        </p>
                        <div className='mt-4'>
                            <h6 className="font-normal text-lg">Liên kiết mạng xã hội</h6>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <a
                                    href={links.facebook || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { if (!links.facebook) e.preventDefault(); }}
                                    style={{
                                        color: '#1877F3',
                                        fontSize: '2rem'
                                    }}
                                >
                                    <img src={facebook} alt="Facebook" style={{ width: '36px', height: '36px' }} />
                                </a>
                                <a
                                    href={links.instagram || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { if (!links.instagram) e.preventDefault(); }}
                                    style={{
                                        color: '#E4405F',
                                        fontSize: '2rem'
                                    }}
                                >
                                    <img src={instagram} alt="Instagram" style={{ width: '36px', height: '36px' }} />
                                </a>
                                <a
                                    href={links.tiktok || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { if (!links.tiktok) e.preventDefault(); }}
                                    style={{
                                        color: '#000000',
                                        fontSize: '2rem'
                                    }}
                                >
                                    <img src={tiktok} alt="TikTok" style={{ width: '36px', height: '36px' }} />
                                </a>
                                <a
                                    href={links.whatsapp || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { if (!links.whatsapp) e.preventDefault(); }}
                                    style={{
                                        color: '#25D366',
                                        fontSize: '2rem'
                                    }}
                                >
                                    <img src={whatsapp} alt="Whatsapp" style={{ width: '36px', height: '36px' }} />
                                </a>
                                <a
                                    href={links.youtube || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { if (!links.youtube) e.preventDefault(); }}
                                    style={{
                                        color: '#FF0000',
                                        fontSize: '2rem'
                                    }}
                                >
                                    <img src={youtube} alt="Youtube" style={{ width: '36px', height: '36px' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div >
                        <h6 className="font-normal text-lg mt-8">Google maps</h6>
                        <div className="grid grid-cols-2 gap-2 mt-[10px]">
                            <iframe
                                title="Đà Nẵng"
                                src={LINK_CONSTANT.GOOGLE_MAP_DA_NANG}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <iframe
                                title="Hà Nội"
                                src={LINK_CONSTANT.GOOGLE_MAP_HA_NOI}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Footer




