
function changeParamLocation(songId) {
    console.log("Changing links with songId:", songId);
      document.querySelectorAll('a').forEach(link => {
      const url = new URL(link.href);
      const currentParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(currentParams);

      if (songId) {
        url.searchParams.set('song', songId);
        link.href = url.toString();
        console.log("Original link href:", link.href);

      }
});
}

export { changeParamLocation };

export async function uploadImage(file) {
  if (!file) return alert("Vui lòng chọn file");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "demo-web"); // Thay đổi nếu bạn có preset khác
  const response = await fetch("https://api.cloudinary.com/v1_1/dkxgal1xt/image/upload", {
    method: "POST",
    body: formData
  });
  let data = await response.json();
  const url = data.secure_url; // Lấy URL ảnh từ phản hồi
  return url;
}

