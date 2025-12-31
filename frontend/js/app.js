console.log('Mirabos est chargé');

// ---------------------------
// NAVIGATION ENTRE LES SECTIONS
// ---------------------------

const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = link.getAttribute('data-section');

        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(target).classList.add('active');

        document.getElementById('page-title').textContent = link.textContent;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});


// ---------------------------
// BARRE DE RECHERCHE CLIENTS
// ---------------------------

const searchBar = document.getElementById('search-bar');

if (searchBar) {
    searchBar.addEventListener('input', () => {
        const value = searchBar.value.toLowerCase();
        const rows = document.querySelectorAll('#client-table-body tr');

        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(value)
                ? ''
                : 'none';
        });
    });
}


// ---------------------------
// CONNEXION (SIMPLIFIÉE)
// ---------------------------

const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        alert("Connexion réussie !");
    });
}


// ---------------------------
// GESTION DES CLIENTS
// ---------------------------

const clientForm = document.getElementById('client-form');
const clientTableBody = document.getElementById('client-table-body');

if (clientForm) {
    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('client-name').value.trim();
        const email = document.getElementById('client-email').value.trim();
        const countryCode = document.getElementById('client-country-code').value;
        const phone = document.getElementById('client-phone').value.trim();

        if (!name) {
            alert("Le nom du client est obligatoire.");
            return;
        }

        const fullPhone = `${countryCode} ${phone}`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${fullPhone}</td>
        `;

        clientTableBody.appendChild(row);

        clientForm.reset();
        updateClientDropdown();
    });
}


// ---------------------------
// GESTION DES FACTURES
// ---------------------------

function updateClientDropdown() {
    const dropdown = document.getElementById('invoice-client');
    if (!dropdown) return;

    dropdown.innerHTML = "";

    const rows = document.querySelectorAll('#client-table-body tr');

    rows.forEach(row => {
        const name = row.children[0].textContent;
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
}

const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.getElementById('invoice-table-body');

if (invoiceForm) {
    invoiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const client = document.getElementById('invoice-client').value;
        const description = document.getElementById('invoice-description').value.trim();
        const amount = document.getElementById('invoice-amount').value.trim();
        const currency = document.getElementById('invoice-currency').value;

        if (!client || !description || !amount) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client}</td>
            <td>${description}</td>
            <td>${amount} ${currency}</td>
        `;

        invoiceTableBody.appendChild(row);

        invoiceForm.reset();
    });
}
