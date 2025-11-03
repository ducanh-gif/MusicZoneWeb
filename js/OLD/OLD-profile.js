// Lấy phần tử
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
console.log("currentUser:", currentUser);
const usernameElement = document.querySelector('.username');
const editBtn = document.querySelector('.edit-name-btn');

// Lấy tên từ localStorage hoặc dùng mặc định
let username = currentUser.username || 'Tên Người Dùng';
usernameElement.innerText = username;

// Khi click vào nút edit
editBtn.addEventListener('click', () => {
  // Tạo input để đổi tên
  const input = document.createElement('input');
  input.type = 'text';
  input.value = username;
  input.classList.add('username-input');

  // Thay h2 bằng input
  usernameElement.replaceWith(input);
  input.focus();

  // Khi người dùng nhấn Enter hoặc rời input
  input.addEventListener('blur', saveName);
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') saveName();
  });

  function saveName() {
    const newName = input.value.trim() || 'Tên Người Dùng';
    username = newName;
    currentUser.username = username;
    // console.log(currentUser)
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index].username = username;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Tạo lại h2
    const h2 = document.createElement('h2');
    h2.classList.add('username');
    h2.innerText = username;
    input.replaceWith(h2);
  }
});
// Kiểm tra localStorage xem đã có ngày tham gia chưa
let joinDate = currentUser.joinDate;
console.log(joinDate)

if (!joinDate) {
  // Nếu chưa có, lưu ngày hôm nay
  const today = new Date();
  joinDate = today.toISOString().split('T')[0]; // Lấy YYYY-MM-DD
}

// Chuyển ngày sang định dạng đẹp hơn: "dd/mm/yyyy"
const dateParts = joinDate.split('-');
const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

// Hiển thị ngày tham gia
const memberSince = document.getElementById('member-since');
memberSince.textContent = `Thành viên từ ${formattedDate}`;
const avatar = document.getElementById('profile-avatar');
const avatarInput = document.getElementById('avatar-input');

// Load avatar từ localStorage
window.addEventListener('load', () => {
  const savedAvatar = localStorage.getItem('profileAvatar');
  if(savedAvatar){
    avatar.src = savedAvatar;
  }
});

// Click vào avatar → mở file chọn ảnh
avatar.addEventListener('click', () => {
  avatarInput.click();
});

// Khi chọn file
avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      avatar.src = reader.result;
      // Lưu vào localStorage
      localStorage.setItem('profileAvatar', reader.result);
    };
    reader.readAsDataURL(file);
  }
});
