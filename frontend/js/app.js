console.log("Mirabos chargé");

// ======================================================
// 1. VARIABLES & LOCALSTORAGE
// ======================================================

let clients = [];
let products = [];
let invoices = [];

let companyLogo = localStorage.getItem("mirabos_logo") || "";
let savedTheme = localStorage.getItem("mirabos_theme") || "clair";

function loadData() {
    clients = JSON.parse(localStorage.getItem("mirabos_clients") || "[]");
    products = JSON.parse(localStorage.getItem("mirabos_products") || "[]");
    invoices = JSON.parse(localStorage.getItem("mirabos_invoices") || "[]");
}

function saveData() {
    localStorage.setItem("mirabos_clients", JSON.stringify(clients));
    localStorage.setItem("mirabos_products", JSON.stringify(products));
    localStorage.setItem("mirabos_invoices", JSON.stringify(invoices));
}

// ======================================================
// 2. NAVIGATION
// ======================================================

const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("page-title");

function showSection(id) {
    sections.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    navLinks.forEach(l => l.classList.remove("active"));
    const link = document.querySelector(`nav a[data-section="${id}"]`);
    if (link) link.classList.add("active");

    pageTitle.textContent = link ? link.textContent : "";
}

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        showSection(link.dataset.section);
    });
});

// ======================================================
// 3. DASHBOARD
// ======================================================

function updateDashboard() {
    document.getElementById("dashboard-clients").textContent = clients.length;
    document.getElementById("dashboard-invoices").textContent = invoices.length;

    let total = 0;
    invoices.forEach(inv => {
        if (inv.currency === "FCFA") total += inv.amount;
    });

    document.getElementById("dashboard-revenue").textContent = total;
}

// ======================================================
// 4. PANNEAU LATÉRAL (MODIFICATION)
// ======================================================

const editPanel = document.getElementById("edit-panel");
const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("edit-title");
const editCancel = document.getElementById("edit-cancel");
const editSave = document.getElementById("edit-save");

let currentEditType = null;
let currentEditIndex = null;

function openEditPanel(type, index) {
    currentEditType = type;
    currentEditIndex = index;

    editForm.innerHTML = "";
    editPanel.classList.add("open");

    if (type === "client") {
        editTitle.textContent = "Modifier un client";
        const c = clients[index];

        editForm.innerHTML = `
            <label>Nom</label>
            <input id="edit-client-name" value="${c.name}">
            <label>Email</label>
            <input id="edit-client-email" value="${c.email}">
            <label>Téléphone</label>
            <input id="edit-client-phone" value="${c.phone}">
        `;
    }

    if (type === "product") {
        editTitle.textContent = "Modifier un produit";
        const p = products[index];

        editForm.innerHTML = `
            <label>Nom</label>
            <input id="edit-product-name" value="${p.name}">
            <label>Prix</label>
            <input id="edit-product-price" type="number" value="${p.price}">
            <label>Monnaie</label>
            <input id="edit-product-currency" value="${p.currency}">
            <label>Stock</label>
            <input id="edit-product-stock" type="number" value="${p.stock}">
            <label>Catégorie</label>
            <input id="edit-product-category" value="${p.category}">
        `;
    }

    if (type === "invoice") {
        editTitle.textContent = "Modifier une facture";
        const f = invoices[index];

        editForm.innerHTML = `
            <label>Client</label>
            <input id="edit-invoice-client" value="${f.client}">
            <label>Description</label>
            <input id="edit-invoice-description" value="${f.description}">
            <label>Montant</label>
            <input id="edit-invoice-amount" type="number" value="${f.amount}">
            <label>Monnaie</label>
            <input id="edit-invoice-currency" value="${f.currency}">
        `;
    }
}

function closeEditPanel() {
    editPanel.classList.remove("open");
}

editCancel.addEventListener("click", closeEditPanel);

// ======================================================
// 5. CLIENTS — CRUD COMPLET
// ======================================================

const clientForm = document.getElementById("client-form");
const clientTableBody = document.getElementById("client-table-body");

function renderClients() {
    clientTableBody.innerHTML = "";

    clients.forEach((c, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditPanel('client', ${index})">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteClient(${index})">Supprimer</button>
            </td>
        `;

        clientTableBody.appendChild(row);
    });

    updateClientDropdown();
    updateDashboard();
}

if (clientForm) {
    clientForm.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("client-name").value.trim();
        const email = document.getElementById("client-email").value.trim();
        const code = document.getElementById("client-country-code").value;
        const phone = document.getElementById("client-phone").value.trim();

        if (!name) return alert("Le nom est obligatoire.");

        clients.push({
            name,
            email,
            phone: `${code} ${phone}`
        });

        saveData();
        renderClients();
        clientForm.reset();
    });
}

function deleteClient(index) {
    if (!confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    clients.splice(index, 1);
    saveData();
    renderClients();
}

function saveClientEdit() {
    const c = clients[currentEditIndex];

    c.name = document.getElementById("edit-client-name").value.trim();
    c.email = document.getElementById("edit-client-email").value.trim();
    c.phone = document.getElementById("edit-client-phone").value.trim();

    saveData();
    renderClients();
    closeEditPanel();
}

editSave.addEventListener("click", () => {
    if (currentEditType === "client") saveClientEdit();
});

// ======================================================
// 6. PRODUITS — CRUD COMPLET
// ======================================================

const productForm = document.getElementById("product-form");
const productTableBody = document.getElementById("product-table-body");

function renderProducts() {
    productTableBody.innerHTML = "";

    products.forEach((p, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.price} ${p.currency}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditPanel('product', ${index})">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Supprimer</button>
            </td>
        `;

        productTableBody.appendChild(row);
    });

    updateDashboard();
}

if (productForm) {
    productForm.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("product-name").value.trim();
        const price = parseFloat(document.getElementById("product-price").value);
        const currency = document.getElementById("product-currency").value;
        const stock = parseInt(document.getElementById("product-stock").value);
        const category = document.getElementById("product-category").value.trim();

        if (!name) return alert("Le nom du produit est obligatoire.");

        products.push({
            name,
            price,
            currency,
            stock,
            category
        });

        saveData();
        renderProducts();
        productForm.reset();
    });
}

function deleteProduct(index) {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    products.splice(index, 1);
    saveData();
    renderProducts();
}

function saveProductEdit() {
    const p = products[currentEditIndex];

    p.name = document.getElementById("edit-product-name").value.trim();
    p.price = parseFloat(document.getElementById("edit-product-price").value);
    p.currency = document.getElementById("edit-product-currency").value.trim();
    p.stock = parseInt(document.getElementById("edit-product-stock").value);
    p.category = document.getElementById("edit-product-category").value.trim();

    saveData();
    renderProducts();
    closeEditPanel();
}

editSave.addEventListener("click", () => {
    if (currentEditType === "product") saveProductEdit();
});

// ======================================================
// 7. FACTURES — CRUD + PDF + LOGO
// ======================================================

const invoiceForm = document.getElementById("invoice-form");
const invoiceTableBody = document.getElementById("invoice-table-body");
const invoiceClientSelect = document.getElementById("invoice-client");
const invoiceLogo = document.getElementById("invoice-logo");

// 🔹 Mettre à jour la liste déroulante des clients
function updateClientDropdown() {
    if (!invoiceClientSelect) return;

    invoiceClientSelect.innerHTML = "";
    clients.forEach(c => {
        const option = document.createElement("option");
        option.value = c.name;
        option.textContent = c.name;
        invoiceClientSelect.appendChild(option);
    });
}

// 🔹 Affichage des factures
function renderInvoices() {
    invoiceTableBody.innerHTML = "";

    invoices.forEach((f, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${f.client}</td>
            <td>${f.description}</td>
            <td>${f.amount} ${f.currency}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditPanel('invoice', ${index})">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteInvoice(${index})">Supprimer</button>
            </td>
        `;

        invoiceTableBody.appendChild(row);
    });

    updateDashboard();
}

// 🔹 Ajouter une facture
if (invoiceForm) {
    invoiceForm.addEventListener("submit", e => {
        e.preventDefault();

        const client = document.getElementById("invoice-client").value;
        const description = document.getElementById("invoice-description").value.trim();
        const amount = parseFloat(document.getElementById("invoice-amount").value);
        const currency = document.getElementById("invoice-currency").value;

        if (!client || !description || !amount) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        invoices.push({
            client,
            description,
            amount,
            currency,
            date: new Date().toLocaleDateString()
        });

        saveData();
        renderInvoices();
        invoiceForm.reset();
    });
}

// 🔹 Supprimer une facture
function deleteInvoice(index) {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;

    invoices.splice(index, 1);
    saveData();
    renderInvoices();
}

// 🔹 Modifier une facture
function saveInvoiceEdit() {
    const f = invoices[currentEditIndex];

    f.client = document.getElementById("edit-invoice-client").value.trim();
    f.description = document.getElementById("edit-invoice-description").value.trim();
    f.amount = parseFloat(document.getElementById("edit-invoice-amount").value);
    f.currency = document.getElementById("edit-invoice-currency").value.trim();

    saveData();
    renderInvoices();
    closeEditPanel();
}

editSave.addEventListener("click", () => {
    if (currentEditType === "invoice") saveInvoiceEdit();
});

// ======================================================
// 8. LOGO ENTREPRISE SUR FACTURES
// ======================================================

function updateInvoiceLogo() {
    if (companyLogo && invoiceLogo) {
        invoiceLogo.src = companyLogo;
        invoiceLogo.style.display = "block";
    } else {
        invoiceLogo.style.display = "none";
    }
}

updateInvoiceLogo();

// ======================================================
// 9. EXPORT PDF / IMPRESSION
// ======================================================

const exportBtn = document.getElementById("export-pdf-btn");

if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        window.print();
    });
}

// ======================================================
// 10. PARAMÈTRES — LOGO + THÈME + SAUVEGARDE
// ======================================================

const settingCompanyName = document.getElementById("setting-company-name");
const settingCompanyEmail = document.getElementById("setting-company-email");
const settingDefaultCurrency = document.getElementById("setting-default-currency");
const themeSelect = document.getElementById("theme-select");
const settingLogoInput = document.getElementById("setting-logo");
const logoPreview = document.getElementById("logo-preview");
const deleteLogoBtn = document.getElementById("delete-logo-btn");
const settingsSaveBtn = document.getElementById("settings-save-btn");

// 🔹 Charger les paramètres sauvegardés
function loadSettings() {
    const savedName = localStorage.getItem("mirabos_company_name");
    const savedEmail = localStorage.getItem("mirabos_company_email");
    const savedCurrency = localStorage.getItem("mirabos_default_currency");

    if (savedName) settingCompanyName.value = savedName;
    if (savedEmail) settingCompanyEmail.value = savedEmail;
    if (savedCurrency) settingDefaultCurrency.value = savedCurrency;

    // Thème
    if (savedTheme === "sombre") {
        document.body.classList.add("dark-theme");
        themeSelect.value = "sombre";
    } else {
        themeSelect.value = "clair";
    }

    // Logo
    if (companyLogo) {
        logoPreview.src = companyLogo;
        logoPreview.style.display = "block";
    }
}

loadSettings();

// 🔹 Sauvegarder les paramètres
if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener("click", () => {
        localStorage.setItem("mirabos_company_name", settingCompanyName.value.trim());
        localStorage.setItem("mirabos_company_email", settingCompanyEmail.value.trim());
        localStorage.setItem("mirabos_default_currency", settingDefaultCurrency.value);

        alert("Paramètres enregistrés !");
    });
}

// 🔹 Changer le thème
if (themeSelect) {
    themeSelect.addEventListener("change", () => {
        const theme = themeSelect.value;

        if (theme === "sombre") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }

        localStorage.setItem("mirabos_theme", theme);
    });
}

// 🔹 Importer un logo
if (settingLogoInput) {
    settingLogoInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            companyLogo = reader.result;
            localStorage.setItem("mirabos_logo", companyLogo);

            logoPreview.src = companyLogo;
            logoPreview.style.display = "block";

            updateInvoiceLogo();
        };
        reader.readAsDataURL(file);
    });
}

// 🔹 Supprimer le logo
if (deleteLogoBtn) {
    deleteLogoBtn.addEventListener("click", () => {
        if (!confirm("Voulez-vous vraiment supprimer le logo ?")) return;

        companyLogo = "";
        localStorage.removeItem("mirabos_logo");

        logoPreview.style.display = "none";
        invoiceLogo.style.display = "none";

        alert("Logo supprimé !");
    });
}

// ======================================================
// 11. CONNEXION / DÉCONNEXION
// ======================================================

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");

let isLogged = localStorage.getItem("mirabos_logged") === "true";

// 🔹 Connexion
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email || !password) {
            alert("Veuillez entrer un email et un mot de passe.");
            return;
        }

        // Identifiants simples
        if (email === "admin@mirabos.com" && password === "admin") {
            localStorage.setItem("mirabos_logged", "true");
            isLogged = true;
            alert("Connexion réussie !");
            showSection("dashboard");
        } else {
            alert("Identifiants incorrects.");
        }
    });
}

// 🔹 Déconnexion
function logout() {
    localStorage.removeItem("mirabos_logged");
    isLogged = false;
    showSection("login");
}

// ======================================================
// 12. PROTECTION DES PAGES
// ======================================================

function protectPages() {
    if (!isLogged) {
        showSection("login");
    }
}

// ======================================================
// 13. INITIALISATION GLOBALE
// ======================================================

function init() {
    loadData();          // Charger clients, produits, factures
    loadSettings();      // Charger paramètres
    updateInvoiceLogo(); // Logo factures

    renderClients();
    renderProducts();
    renderInvoices();

    updateClientDropdown(); // ← IMPORTANT pour la liste des clients

    protectPages();
    updateDashboard();
}

init();

// ======================================================
// 14. RENDRE LES FONCTIONS ACCESSIBLES GLOBALLEMENT
// ======================================================

window.openEditPanel = openEditPanel;
window.deleteClient = deleteClient;
window.deleteProduct = deleteProduct;
window.deleteInvoice = deleteInvoice;
window.logout = logout;
