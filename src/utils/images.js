// import tất cả ảnh trong thư mục assets
const allImages = import.meta.glob('@/assets/**/*.{png,jpg,jpeg,svg,gif}', {
  eager: true, // eager = true sẽ import ngay, nhưng vẫn tree-shakable
  import: 'default', // chỉ lấy export default (src của ảnh)
});

// Chuyển object thành map cho dễ dùng
const images = Object.fromEntries(
  Object.entries(allImages).map(([key, value]) => {
    const fileName = key.split('/assets/')[1]; 
    return [fileName, value];
  })
);

export default images;
