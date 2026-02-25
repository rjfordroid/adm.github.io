const PAGE_SIZE = 20;

function loadProject(page=0, search="") {
  db.ref("RJFORDROID").once("value").then(snapshot => {
    const data = snapshot.val() || {}; 
    const container = document.getElementById("projectContainer");
    container.innerHTML = "";

    let allCategories = Object.keys(data);

    // Search filter
    if(search) {
      allCategories = allCategories.filter(cat => cat.toLowerCase().includes(search.toLowerCase()));
    }

    allCategories.forEach(categoryName => {
      const categoryData = data[categoryName] || {};
      const body = document.createElement("div");
      body.className = "category-body";
      body.style.display = "grid"; // ouvè pa default

      const objIds = Object.keys(categoryData);

      if(objIds.length === 0){
        // Input pou kreye nouvo objè
        const inputDiv = document.createElement("div");
        inputDiv.style.display = "flex";
        inputDiv.style.marginBottom = "10px";

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.placeholder = "Enter new object JSON here";
        newInput.style.flex = "1";
        newInput.style.padding = "5px";
        newInput.style.borderRadius = "5px";
        newInput.style.border = "1px solid #444";

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add";
        addBtn.style.marginLeft = "5px";
        addBtn.style.background = "lime";
        addBtn.style.color = "black";
        addBtn.style.border = "none";
        addBtn.style.borderRadius = "5px";
        addBtn.style.cursor = "pointer";

        addBtn.onclick = () => {
          try {
            const obj = JSON.parse(newInput.value);
            const newId = "o-" + Math.random().toString(36).substr(2,8);
            db.ref(`RJFORDROID/${categoryName}/${newId}`).set(obj).then(() => {
              newInput.value = "";
              loadProject(); // refresh UI
            });
          } catch(e) {
            alert("Invalid JSON format!");
          }
        };

        inputDiv.appendChild(newInput);
        inputDiv.appendChild(addBtn);
        body.appendChild(inputDiv);

        // Mesaj vid
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No objects in this category yet.";
        emptyMsg.style.fontStyle = "italic";
        emptyMsg.style.color = "#aaa";
        body.appendChild(emptyMsg);

      } else {
        // Pagination slice
        const pagedIds = objIds.slice(page*PAGE_SIZE, (page+1)*PAGE_SIZE);
        pagedIds.forEach(objId => {
          const obj = categoryData[objId];
          const card = document.createElement("div");
          card.className = "object-card";
          card.draggable = true;
          card.id = objId;

          card.innerHTML = `
            <pre>${JSON.stringify(obj,null,2)}</pre>
            <button class="delete-btn" onclick="deleteObject('${categoryName}','${objId}')">Delete</button>
            <button class="edit-btn" onclick="editObject('${categoryName}','${objId}', this)">Edit</button>
            <button class="copy-btn" onclick="copyObject('${categoryName}','${objId}')">Copy</button>
            <button class="export-btn" onclick="exportObject('${categoryName}','${objId}')">Export JSON</button>
          `;

          // Drag & Drop events
          card.addEventListener("dragstart", e => card.classList.add("dragging"));
          card.addEventListener("dragend", e => card.classList.remove("dragging"));
          body.appendChild(card);
        });
      }

      const categoryDiv = document.createElement("div");
      categoryDiv.className = "category";
      const header = document.createElement("div");
      header.className = "category-header";
      header.innerHTML = `<span>${categoryName}</span> <span>▼</span>`;

     header.onclick = () => {
  const isOpen = body.style.display === "grid";

  if (!isOpen) {
    // Louvri kategori sa: fèmen tout lòt body
    document.querySelectorAll(".category-body").forEach(b => {
      b.style.display = "none";
    });
    body.style.display = "grid"; // louvri kategori sa
  } else {
    // Fèmen kategori sa: tout body fèmen
    document.querySelectorAll(".category-body").forEach(b => {
      b.style.display = "none";
    });
  }
};
// Default: fèmen kategori pa default
body.style.display = "none";
      categoryDiv.appendChild(header);
      categoryDiv.appendChild(body);
      container.appendChild(categoryDiv);

      // Make body droppable
      body.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(body, e.clientY);
        if(afterElement == null) body.appendChild(dragging);
        else body.insertBefore(dragging, afterElement);
      });
    });
  });
}

// Edit / Save objè
function editObject(category, objId, btn) {
  const card = btn.parentElement; 
  const pre = card.querySelector("pre");

  if(btn.textContent === "Edit") {
    pre.contentEditable = true;
    pre.style.background = "#333";
    pre.style.padding = "5px";
    pre.style.borderRadius = "5px";
    pre.style.whiteSpace = "pre-wrap";
    pre.focus();

    btn.textContent = "Save";
    btn.style.background = "lime";
    btn.style.color = "black";

  } else {
    try {
      const newData = JSON.parse(pre.textContent);
      db.ref(`RJFORDROID/${category}/${objId}`).set(newData).then(() => {
        pre.contentEditable = false;
        btn.textContent = "Edit";
        btn.style.background = "orange";
        btn.style.color = "white";
        loadProject();
      });
    } catch(e) {
      alert("Invalid JSON! Make sure the format is correct.");
    }
  }
}

// Drag & Drop helper
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".object-card:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Search input
document.getElementById("searchInput").addEventListener("input", e => {
  loadProject(0, e.target.value);
});

loadProject();