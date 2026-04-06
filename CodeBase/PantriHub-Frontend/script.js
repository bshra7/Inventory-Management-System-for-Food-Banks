document.addEventListener("DOMContentLoaded", function () {

  const editableFields = document.querySelectorAll(".editable-field");

  const expiringToggle = document.getElementById("expiring-toggle");
  const surplusToggle = document.getElementById("surplus-toggle");

  const expiringCardBtn = document.getElementById("expiring-card-btn");
  const expiringListBtn = document.getElementById("expiring-list-btn");
  const expiringCardView = document.getElementById("expiring-card-view");
  const expiringListView = document.getElementById("expiring-list-view");

  const surplusCardBtn = document.getElementById("surplus-card-btn");
  const surplusListBtn = document.getElementById("surplus-list-btn");
  const surplusCardView = document.getElementById("surplus-card-view");
  const surplusListView = document.getElementById("surplus-list-view");

  expiringCardBtn.addEventListener("click", function () {
  expiringCardView.style.display = "block";
  expiringListView.style.display = "none";

  expiringCardBtn.classList.add("active-view");
  expiringListBtn.classList.remove("active-view");

  expiringToggle.classList.remove("list-active"); // 
});

expiringListBtn.addEventListener("click", function () {
  expiringCardView.style.display = "none";
  expiringListView.style.display = "block";

  expiringListBtn.classList.add("active-view");
  expiringCardBtn.classList.remove("active-view");

  expiringToggle.classList.add("list-active"); // 
});

surplusCardBtn.addEventListener("click", function () {
  surplusCardView.style.display = "block";
  surplusListView.style.display = "none";

  surplusCardBtn.classList.add("active-view");
  surplusListBtn.classList.remove("active-view");

  surplusToggle.classList.remove("list-active"); // 
});

surplusListBtn.addEventListener("click", function () {
  surplusCardView.style.display = "none";
  surplusListView.style.display = "block";

  surplusListBtn.classList.add("active-view");
  surplusCardBtn.classList.remove("active-view");

  surplusToggle.classList.add("list-active"); 
});

editableFields.forEach(function (field) {
    setupEditableField(field);
  });

  function setupEditableField(field) {
    const text = field.dataset.value || "";

    renderDisplay(field, text);
  }

  function renderDisplay(field, value) {
    field.dataset.value = value;

    field.innerHTML = `
      <span class="field-text">${value || "No information added"}</span>
      <button class="edit-icon-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z"/>
          <path d="M13.752 3.396l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
      </button>
    `;

    const editBtn = field.querySelector(".edit-icon-btn");

    editBtn.addEventListener("click", function () {
      renderEdit(field, value);
    });
  }

  function renderEdit(field, value) {
    field.innerHTML = `
      <input type="text" class="account-edit-input" value="${value}">
      <button class="save-icon-btn">✔</button>
    `;

    const input = field.querySelector(".account-edit-input");
    const saveBtn = field.querySelector(".save-icon-btn");

    input.focus();

    function saveValue() {
      const newValue = input.value.trim();
      renderDisplay(field, newValue);
    }

    saveBtn.addEventListener("click", saveValue);

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        saveValue();
      }
    });

    input.addEventListener("blur", saveValue);
  }
});

