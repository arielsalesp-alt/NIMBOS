const form = document.querySelector("#orderForm");
const toast = document.querySelector("#toast");
const storageKey = "nimbus-hot-order-form";

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
};

const getFormData = () => {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  return data;
};

const loadDraft = () => {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
    showToast("טיוטה קודמת נטענה");
  } catch {
    localStorage.removeItem(storageKey);
  }
};

const saveDraft = (silent = false) => {
  localStorage.setItem(storageKey, JSON.stringify(getFormData()));
  if (!silent) showToast("הטיוטה נשמרה בדפדפן");
};

const clearForm = () => {
  const approved = window.confirm("לנקות את כל השדות בטופס?");
  if (!approved) return;

  form.reset();
  localStorage.removeItem(storageKey);
  showToast("הטופס נוקה");
};

const preparePdf = () => {
  saveDraft(true);
  document.title = buildDocumentTitle();
  window.print();
};

const buildDocumentTitle = () => {
  const data = getFormData();
  const business = data.businessName ? data.businessName.trim() : "לקוח";
  const date = data.orderDate || new Date().toISOString().slice(0, 10);
  return `טופס הזמנה נימבוס - ${business} - ${date}`;
};

document.querySelector("#saveDraft").addEventListener("click", () => saveDraft());
document.querySelector("#clearForm").addEventListener("click", clearForm);
document.querySelector("#printPdf").addEventListener("click", preparePdf);

form.addEventListener("input", () => saveDraft(true));
form.addEventListener("change", () => saveDraft(true));

loadDraft();
