console.log('Mirabos est chargé');

// ======================================================
// LOCALSTORAGE (sauvegarde)
// ======================================================

let clients = [];
let invoices = [];
let products = [];
let companyLogo = localStorage.getItem("mirabos_logo") || "";
let savedTheme = localStorage.getItem("mirabos_theme") || "clair";

function loadData() {
    clients = JSON.parse(localStorage.getItem("mirabos_clients") || "[]");
    invoices = JSON.parse(localStorage.getItem("mirabos_invoices") || "[]");
    products = JSON.parse(localStorage.getItem("mirabos_products") || "[]");
}

function saveData() {
    localStorage.setItem("mirabos_clients", JSON.stringify(clients));
    localStorage.setItem("mirabos_invoices", JSON.stringify(invoices));
    localStorage.setItem("mirabos_products", JSON.stringify(products));
}

// ======================================================
// NAVIGATION ENTRE SECTIONS
// ======================================================

const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('page-title');

function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    const link = document.querySelector(`nav a[data-section="${id}"]`);
    if (link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        pageTitle.textContent = link.textContent;
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showSection(link.dataset.section);
    });
});

// ======================================================
// BARRE DE RECHERCHE CLIENTS
// ======================================================

const searchBar = document.getElementById('search-bar');

if (searchBar) {
    searchBar.addEventListener('input', () => {
        const value = searchBar.value.toLowerCase();
        document.querySelectorAll('#client-table-body tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

// ======================================================
// DASHBOARD
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
// CLIENTS
// ======================================================

const clientForm = document.getElementById('client-form');
const clientTableBody = document.getElementById('client-table-body');

function renderClients() {
    clientTableBody.innerHTML = "";
    clients.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
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

// ======================================================
// PRODUITS
// ======================================================

const productForm = document.getElementById("product-form");
const productTableBody = document.getElementById("product-table-body");

function renderProducts() {
    productTableBody.innerHTML = "";
    products.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.price} ${p.currency}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
        `;
        productTableBody.appendChild(row);
    });
    updateDashboard();
}

if (productForm) {
    productForm.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("product-name").value.trim();
        const price = Number(document.getElementById("product-price").value);
        const currency = document.getElementById("product-currency").value;
        const stock = Number(document.getElementById("product-stock").value);
        const category = document.getElementById("product-category").value.trim();

        if (!name || !price || !stock) return alert("Champs obligatoires manquants.");

        products.push({ name, price, currency, stock, category });

        saveData();
        renderProducts();
        productForm.reset();
    });
}

// ======================================================
// FACTURES
// ======================================================

function updateClientDropdown() {
    const dropdown = document.getElementById("invoice-client");
    dropdown.innerHTML = "";
    clients.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        dropdown.appendChild(opt);
    });
}

const invoiceForm = document.getElementById("invoice-form");
const invoiceTableBody = document.getElementById("invoice-table-body");

function renderInvoices() {
    invoiceTableBody.innerHTML = "";
    invoices.forEach(inv => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inv.client}</td>
            <td>${inv.description}</td>
            <td>${inv.amount} ${inv.currency}</td>
        `;
        invoiceTableBody.appendChild(row);
    });

    // Afficher le logo sur la facture
    const invoiceLogo = document.getElementById("invoice-logo");
    if (invoiceLogo && companyLogo) {
        invoiceLogo.src = companyLogo;
    }

    updateDashboard();
}

if (invoiceForm) {
    invoiceForm.addEventListener("submit", e => {
        e.preventDefault();

        const client = document.getElementById("invoice-client").value;
        const description = document.getElementById("invoice-description").value.trim();
        const amount = Number(document.getElementById("invoice-amount").value);
        const currency = document.getElementById("invoice-currency").value;

        if (!client || !description || !amount) return alert("Champs obligatoires manquants.");

        invoices.push({ client, description, amount, currency });

        saveData();
        renderInvoices();
        invoiceForm.reset();
    });
}

// ======================================================
// EXPORT PDF
// ======================================================

const exportPdfBtn = document.getElementById("export-pdf-btn");
if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", () => window.print());
}

// ======================================================
// MODE SOMBRE
// ======================================================

const themeSelect = document.getElementById("theme-select");

function applyTheme(theme) {
    if (theme === "sombre") document.body.classList.add("dark-theme");
    else document.body.classList.remove("dark-theme");
}

if (themeSelect) {
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener("change", () => {
        localStorage.setItem("mirabos_theme", themeSelect.value);
        applyTheme(themeSelect.value);
    });
}

// ======================================================
// PARAMÈTRES — IMPORT LOGO
// ======================================================

const settingsSaveBtn = document.getElementById("settings-save-btn");

if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener("click", () => {
        const logoInput = document.getElementById("setting-logo");

        if (logoInput && logoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                companyLogo = e.target.result;
                localStorage.setItem("mirabos_logo", companyLogo);
                alert("Logo enregistré !");
            };
            reader.readAsDataURL(logoInput.files[0]);
        } else {
            alert("Paramètres enregistrés !");
        }
    });
}

// ======================================================
// CONNEXION
// ======================================================

const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (email === "admin@mirabos.com" && password === "123456") {
            alert("Connexion réussie !");
            showSection("dashboard");
        } else {
            alert("Identifiants incorrects.");
        }
    });
}

// ======================================================
// INITIALISATION
// ======================================================

function init() {
    loadData();
    renderClients();
    renderProducts();
    renderInvoices();
    updateDashboard();
    showSection("dashboard");
}

init();
