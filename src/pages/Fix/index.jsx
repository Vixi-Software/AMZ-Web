import React, { useEffect } from "react";
import routePath from "../../constants/routePath";
import { useNavigate } from "react-router-dom";
import { usePostService } from "../../services/postService";
import { Carousel, Grid } from "antd";

const FixPage = () => {
  const navigate = useNavigate();
  const { getPostsWithStore } = usePostService();
  const screens = Grid.useBreakpoint();
  const [posts, setPosts] = React.useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        getPostsWithStore().then((posts) => {
          if (posts) {
            setPosts(posts);
          }
        });
      } catch (error) {
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <Carousel autoplay arrows={true} dots={true} className="mb-4">
        {[
          {
            src: "https://chauaudio.com/cdn/images/tin-tuc/loa-marshall-la-thuong-hieu-nuoc-nao-phu-hop-voi-nhung-ai-5.jpg",
            alt: "carousel-1"
          },
          {
            src: "https://th.bing.com/th/id/R.b1c51812c16cb5d4d84dabec2e75265d?rik=1t0PlY8a%2b649rA&pid=ImgRaw&r=0",
            alt: "carousel-2"
          },
          {
            src: "https://th.bing.com/th/id/OIP.skBzSDoI0713daeCX87n4QHaEK?rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3",
            alt: "carousel-3"
          }
        ].map((img, idx) => {
          let height = '180px';
          if (screens.lg) height = '350px';
          else if (screens.md) height = '250px';
          return (
            <div key={idx}>
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '100%', height, objectFit: 'cover', borderRadius: '0.5rem' }}
              />
            </div>
          );
        })}
      </Carousel>
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
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <div key={post.id} className="rounded-lg">
                <h1 className="text-[21px] be-vietnam-pro-medium  font-semibold">{post.title}</h1>
                <div
                  className="text-gray-600 be-vietnam-pro"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div>Không có bài viết nào</div>
        )}
      </div>
    </div>
  );
};

export default FixPage;