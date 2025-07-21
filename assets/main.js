// Khai báo cấu trúc dữ liệu cây thư mục và file
const trees = [
  {
    type: "folder",
    name: "src",
    children: [
      {
        type: "folder",
        name: "components",
        children: [
          { type: "file", name: "Header.js" },
          { type: "file", name: "Footer.js" },
          { type: "file", name: "Sidebar.js" },
        ],
      },
      {
        type: "folder",
        name: "utils",
        children: [
          { type: "file", name: "helpers.js" },
          { type: "file", name: "constants.js" },
        ],
      },
      { type: "file", name: "index.js" },
      { type: "file", name: "App.js" },
    ],
  },
  {
    type: "folder",
    name: "public",
    children: [
      { type: "file", name: "index.html" },
      { type: "file", name: "favicon.ico" },
      { type: "file", name: "manifest.json" },
    ],
  },
  {
    type: "folder",
    name: "assets",
    children: [
      {
        type: "folder",
        name: "images",
        children: [
          { type: "file", name: "logo.png" },
          { type: "file", name: "banner.jpg" },
        ],
      },
      {
        type: "folder",
        name: "styles",
        children: [
          { type: "file", name: "main.css" },
          { type: "file", name: "theme.css" },
        ],
      },
      { type: "file", name: "app.css" },
    ],
  },
  {
    type: "folder",
    name: "config",
    children: [
      { type: "file", name: "webpack.config.js" },
      { type: "file", name: "babel.config.js" },
    ],
  },
  {
    type: "folder",
    name: "tests",
    children: [
      {
        type: "folder",
        name: "unit",
        children: [
          { type: "file", name: "App.test.js" },
          { type: "file", name: "Header.test.js" },
        ],
      },
      {
        type: "folder",
        name: "integration",
        children: [
          { type: "file", name: "Login.test.js" },
          { type: "file", name: "Register.test.js" },
        ],
      },
      { type: "file", name: "setupTests.js" },
    ],
  },
  {
    type: "folder",
    name: "docs",
    children: [
      { type: "file", name: "guide.md" },
      { type: "file", name: "api.md" },
    ],
  },
  {
    type: "folder",
    name: "scripts",
    children: [
      { type: "file", name: "deploy.sh" },
      { type: "file", name: "build.sh" },
    ],
  },
  {
    type: "folder",
    name: "empty-folder",
    children: [], // Thư mục trống
  },
  {
    type: "folder",
    name: "data",
    children: [
      { type: "file", name: "users.json" },
      { type: "file", name: "products.json" },
    ],
  },
  {
    type: "folder",
    name: "logs",
    children: [
      { type: "file", name: "app.log" },
      { type: "file", name: "error.log" },
    ],
  },
  // Các file ở root
  { type: "file", name: "README.md" },
  { type: "file", name: "LICENSE" },
  { type: "file", name: "package.json" },
  { type: "file", name: ".gitignore" },
  { type: "file", name: "index.html" },
];

// Lấy phần tử sidebar và content từ DOM
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");

// Hàm hiển thị context menu (menu chuột phải) tại vị trí (x, y) cho phần tử targetEl
function contextMenu(x, y, targetEl) {
  // Xóa sạch tất cả các phần tử con trong content (menu)
  content.innerHTML = "";

  // Tạo nút Rename
  const renameConfigs = document.createElement("div");
  renameConfigs.className = "rename";
  renameConfigs.textContent = "Rename";
  // Khi click Rename, thay tên thư mục bằng input để sửa
  renameConfigs.onclick = function () {
    content.classList.add("hide"); // Ẩn menu
    const input = document.createElement("input");
    input.type = "text";
    input.value = targetEl.textContent;
    targetEl.textContent = "";
    targetEl.appendChild(input);
    input.focus();
    input.onkeydown = function (e) {
      if (e.key === "Enter") {
        targetEl.textContent = input.value; // Đổi tên thư mục
      }
    };
  };

  // Tạo nút Delete
  const deleteConfigs = document.createElement("div");
  deleteConfigs.className = "delete";
  deleteConfigs.textContent = "Delete";
  // Thêm 2 nút vào content (menu)
  content.append(renameConfigs, deleteConfigs);
  // Đặt vị trí menu
  content.style.overflow = "hidden";
  content.style.top = `${y}px`;
  content.style.left = `${x}px`;
  content.classList.remove("hide");
  // Khi click Delete, xóa thư mục cha của targetEl
  deleteConfigs.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    content.classList.add("hide");
    if (targetEl.parentElement) {
      targetEl.parentElement.remove();
    }
  };
}

// Hàm đệ quy để render cây thư mục ra DOM
function renderTree(tree, parent) {
  tree.forEach((item) => {
    // Tạo 1 div cho mỗi item (folder/file)
    let el = document.createElement("div");

    if (item.type === "folder") {
      // Nếu là folder
      el.className = "folder";
      el.innerHTML = `<div class="folder-name">${item.name}</div>`;
      // Tạo container cho các con
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children hide";
      // Nếu có children thì render tiếp
      if (item.children && item.children.length) {
        renderTree(item.children, childrenContainer);
      }
      el.appendChild(childrenContainer);

      // Lấy phần tử tên folder
      const folderNameEl = el.querySelector(".folder-name");

      // Sự kiện click: hiện/ẩn con, highlight
      folderNameEl.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn sự kiện nổi lên cha
        childrenContainer.classList.toggle("hide"); // Ẩn/hiện con
        folderNameEl.classList.toggle("active"); // Highlight tên folder
      });

      // Sự kiện chuột phải: mở context menu
      folderNameEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        contextMenu(e.pageX, e.pageY, folderNameEl);
      });
    } else {
      // Nếu là file
      el = document.createElement("div");
      el.className = "file";
      el.textContent = item.name;
    }
    // Thêm node vừa tạo vào parent
    parent.appendChild(el);
  });
}

// Khi click ra ngoài menu thì ẩn menu
document.addEventListener("mousedown", (e) => {
  if (!content.contains(e.target)) {
    content.classList.add("hide");
  }
});

// Render cây thư mục ra sidebar khi load trang
renderTree(trees, sidebar);
