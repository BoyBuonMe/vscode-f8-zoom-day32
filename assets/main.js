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

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");

function contextMenu(x, y, targetEl) {

  // Rename
  const renameConfigs = document.createElement("div");
  renameConfigs.className = "rename";
  renameConfigs.textContent = "Rename";
  renameConfigs.onclick = function () {
    content.classList.add("hide");
    const input = document.createElement("input");
    input.type = "text";
    input.value = targetEl.textContent;
    targetEl.textContent = "";
    targetEl.appendChild(input);
    input.focus();
    input.onkeydown = function (e) {
      if (e.key === "Enter") {
        targetEl.textContent = input.value;
      }
    };
  };

  //Delete
  const deleteConfigs = document.createElement("div");
  deleteConfigs.className = "delete";
  deleteConfigs.textContent = "Delete";
  content.append(renameConfigs, deleteConfigs);
  content.style.overflow = "hidden";
  content.style.top = `${y}px`;
  content.style.left = `${x}px`;
  content.classList.remove("hide");
  deleteConfigs.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    content.classList.add("hide");
    // const folderEl = targetEl.closest(".folder");
    // if (folderEl && folderEl.parentNode) {
    //   sidebar.removeChild(folderEl);
    //   console.log(targetEl);
    // }
    
    // if (targetEl.parentElement) {
    //   targetEl.parentElement.remove();
    // }
    console.log(targetEl.parentElement);
    
  };
}

function renderTree(tree, parent) {
  tree.forEach((item) => {
    // console.log(item.type);
    let el = document.createElement("div");

    if (item.type === "folder") {
      // console.log(el);
      el.className = "folder";
      el.innerHTML = `<div class="folder-name">${item.name}</div>`;
      // el.innerHTML = `<div class="folder">${item.name}</div>`;
      // Children container
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children hide";
      if (item.children && item.children.length) {
        renderTree(item.children, childrenContainer);
      }
      el.appendChild(childrenContainer);

      // Toggle & highlight chỉ .folder-name
      const folderNameEl = el.querySelector(".folder-name");
      // console.log(folderNameEl);

      folderNameEl.addEventListener("click", (e) => {
        e.stopPropagation();
        childrenContainer.classList.toggle("hide");

        // Highlight chỉ .folder-name
        folderNameEl.classList.toggle("active");
        // folderNameEl.classList.add("active");
      });

      folderNameEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        contextMenu(e.pageX, e.pageY, folderNameEl);
      });
    } else {
      el = document.createElement("div");
      el.className = "file";
      el.textContent = item.name;
    }
    parent.appendChild(el);
  });
}

document.addEventListener("mousedown", (e) => {
  if (!content.contains(e.target)) {
    content.classList.add("hide");
  }
});

renderTree(trees, sidebar);
