console.log('Mirabos est chargé');
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
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', () => {
    const value = searchBar.value.toLowerCase();

    const rows = document.querySelectorAll('#client-table-body tr');

    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(value)
            ? ''
            : 'none';
    });
});
document.getElementById('login-btn').addEventListener('click', () => {
    alert("Connexion réussie !");


   
// ---------------------------
// GESTION DES FACTURES
// ---------------------------

// Remplir la liste des clients dans le formulaire de facture
function updateClientDropdown() {
    const dropdown = document.getElementById('invoice-client');
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

// Appeler la fonction à chaque ajout de client
if (clientForm) {
    clientForm.addEventListener('submit', () => {
        updateClientDropdown();
    });
}

// Gestion du formulaire de facture
const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.getElementById('invoice-table-body');

if (invoiceForm) {
    invoiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const client = document.getElementById('invoice-client').value;
        const description = document.getElementById('invoice-description').value.trim();
        const amount = document.getElementById('invoice-amount').value.trim();

        if (!client || !description || !amount) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client}</td>
            <td>${description}</td>
            <td>${amount} €</td>
        `;

        invoiceTableBody.appendChild(row);

        invoiceForm.reset();
    });
}



});

