// Références aux éléments du DOM
const form = document.getElementById('forme-zone-remplissage');
const desc = document.getElementById('description');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('Categories');
const list = document.getElementById('Liste-de-transactions');
const balance = document.getElementById('balance');
const btn = document.getElementById('submit-btn');

// Données
let data = JSON.parse(localStorage.getItem('transactions')) || [];
let editing = null;

// Sauvegarde
const save = () => localStorage.setItem('transactions', JSON.stringify(data));

// Format montant
const format = n => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} $`;

// Affichage
function render() {
  
  // Calculer le solde total
  let total = 0;
  for (let t of data) {
    if (t.type === 'Revenu') {
      total += t.amount;
    } else {
      total -= t.amount;
    }
  }
  balance.textContent = "Solde : " + format(total);

  // Afficher les transactions
  let html = "";
  for (let i = 0; i < data.length; i++) {
    let t = data[i];
    let signe = t.type === 'Dépense' ? '-' : '+';
    let classe = t.type === 'Dépense' ? 'expense' : '';
    html += `
      <div class="transaction ${classe}">
        <span>${t.description} <small>(${t.category})</small></span>
        <div class="zoneMontant">
          <span>${signe}${format(t.amount)}</span>
          <button class="edit-btn" data-i="${i}">Modifier</button>
          <button class="delete-btn" data-i="${i}">Supprimer</button>
        </div>
      </div>
    `;
  }
  list.innerHTML = html;

  // Sauvegarder
  save();
}

// Ajouter ou modifier
form.addEventListener('submit', e => {
  e.preventDefault();

  const item = {
    description: desc.value.trim(),
    amount: parseFloat(amount.value),
    type: type.value,
    category: category.value
  };

  if (!item.description || isNaN(item.amount) || item.amount <= 0 || item.category === 'Categories') {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  if (editing !== null) {
    data[editing] = item;
    editing = null;
    btn.textContent = 'Ajouter la transaction';
  } else {
    data.unshift(item);
  }

  form.reset();
  render();
});

// Modifier / Supprimer
list.addEventListener('click', e => {
  const i = parseInt(e.target.dataset.i, 10);

  if (e.target.classList.contains('delete-btn')) {
    data.splice(i, 1);
    render();
  }

  if (e.target.classList.contains('edit-btn')) {
    const t = data[i];
    desc.value = t.description;
    amount.value = t.amount;
    type.value = t.type;
    category.value = t.category;
    editing = i;
    btn.textContent = 'Modifier la transaction';
  }
});

render();
