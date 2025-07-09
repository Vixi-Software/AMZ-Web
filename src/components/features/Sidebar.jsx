import { Divider } from "antd";
import images from '../../utils/images';
import { useDispatch } from "react-redux";
import { setCategory } from "../../store/features/filterProduct/filterProductSlice";
import { useNavigate } from "react-router-dom";
import routePath from "../../constants/routePath";

const mainItems = [
  {
    icon: <img src={images['item11.png']} alt="" width={30} height={30} />,
    label: "Tai nghe nhét tai cũ",
    value: "Tai nghe nhét tai cũ",
  },
  {
    icon: <img src={images['item10.png']} alt="" width={30} height={30} />,
    label: "Tai nghe chụp tai cũ",
    value: "Tai nghe chụp tai cũ",
  },
  {
    icon: <img src={images['item9.png']} alt="" width={30} height={30} />,
    label: "Loa di động cũ",
    value: "Loa di động cũ",
  },
  {
    icon: <img src={images['item8.png']} alt="" width={30} height={30} />,
    label: "Loa để bàn cũ",
    value: "Loa để bàn cũ",
  },
  {
    icon: <img src={images['item7.png']} alt="" width={30} height={30} />,
    label: "Loa karaoke cũ",
    value: "Loa karaoke cũ",
  },
  {
    icon: <img src={images['item6.png']} alt="" width={30} height={30} />,
    label: "Thu cũ đổi mới",
    value: "thu-cu-doi-moi",
  },
];

const exploreItems = [
  {
    icon: <img src={images['item5.png']} alt="" width={30} height={30} />,
    label: "Hàng newseal",
  },
  {
    icon: <img src={images['item4.png']} alt="" width={30} height={30} />,
    label: "Khuyến mãi hot",
  },
  {
    icon: <img src={images['item3.png']} alt="" width={30} height={30} />,
    label: "Bảo hành - sửa chữa",
  },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-lg shadow p-3 mb-4">
        <div className="font-semibold text-[13px] text-gray-700 mb-2 tracking-wide hidden md:block lg:hidden">
          Hàng cũ giá tốt
        </div>
        <div className="font-semibold text-[16px] text-gray-700 mb-2 tracking-wide hidden lg:block">
          Hàng cũ giá tốt - Sản phẩm chính
        </div>
        <div className="flex flex-col pb-4">
          <div className="flex flex-col gap-3">
            {mainItems.map((item, idx) => (
              <div
                key={idx}
                className="w-full flex items-center gap-3 text-[15px] text-gray-800 rounded py-1 cursor-pointer transition-all duration-200 group hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:scale-[1.03] hover:shadow-md"
                onClick={() => {
                  if (item.value === "thu-cu-doi-moi") {
                    navigate(routePath.exchange);
                  } else {
                    dispatch(setCategory(item.value));
                    navigate(routePath.product);
                  }
                }}
              >
                <span className="transition-transform duration-200 group-hover:scale-110 lg:pl-6 md:pl-0">
                  {item.icon}
                </span>
                <span className="transition-colors duration-200 group-hover:text-blue-700 font-semibold lg:text-[16px] md:text-[11px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <div className="font-semibold text-[13px] text-gray-700 mb-2 tracking-wide hidden md:block lg:hidden">
          Khám phá thêm
        </div>
        <div className="font-semibold text-[16px] text-gray-700 mb-2 tracking-wide hidden lg:block">
          Khám phá thêm
        </div>
        <div className="flex flex-col pb-4">
          <div className="flex flex-col gap-3">
            {exploreItems.map((item, idx) => (
              <div
                key={idx}
                className="w-full flex items-center gap-3 text-[15px] text-gray-800 rounded py-1 cursor-pointer transition-all duration-200 group hover:bg-gradient-to-r hover:from-pink-100 hover:to-yellow-100 hover:scale-[1.03] hover:shadow-md"
                onClick={() => {
                  if (item.label === "Khuyến mãi hot") {
                    navigate(routePath.sale);
                  } else if (item.label === "Hàng newseal") {
                    navigate(routePath.newSeal);
                  } else if (item.label === "Bảo hành - sửa chữa") {
                    navigate(routePath.fix);
                  }
                }}
              >
                <span className="transition-transform duration-200 group-hover:scale-110 lg:pl-6 md:pl-0">
                  {item.icon}
                </span>
                <span className="transition-colors duration-200 group-hover:text-pink-700 font-semibold lg:text-[16px] md:text-[11px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}