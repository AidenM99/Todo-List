export default function initialiseUI() {
  initSidebar();
  initModal();
}

function initSidebar() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const subHeading = document.querySelector(".sub-heading");

      subHeading.textContent = item.textContent;
    });
  });
}

function initModal() {
  const newTodo = document.querySelector(".newTodo");
  const closeButton = document.querySelector(".close-button");

  newTodo.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".modal-content") &&
      !event.target.classList.contains("newTodo")
    ) {
      closeModal();
    }
  });
}

function openModal() {
  const modal = document.querySelector(".modal-bg");

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.querySelector(".modal-bg");

  modal.style.display = "none";
}
