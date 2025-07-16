// Récupère les éléments principaux du formulaire et de l'affichage
const form = document.getElementById('forme-zone-remplissage');
const desc = document.getElementById('description');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('Categories');
const list = document.getElementById('Liste-de-transactions');
const balance = document.getElementById('balance');

let data = JSON.parse(localStorage.getItem('transactions')) || [];
let editingIndex; // Pour savoir si on modifie une transaction

// Affiche les transactions et le solde
function render() {
  let total = 0;
  list.innerHTML = '';
  data.forEach((t, i) => {
    total += t.type === 'Revenu' ? t.amount : -t.amount;
    const classe = t.type === 'Dépense' ? 'transaction expense' : 'transaction';
    const div = document.createElement('div');
    div.className = classe;
    div.innerHTML = `
      <span>${t.description} <small>(${t.category})</small></span>
      <div class="zoneMontant">
        <span>${t.type === 'Revenu' ? '+' : '-'}${t.amount} $</span>
        <button class="delete-btn" data-i="${i}">Supprimer</button>
        <button class="edit-btn" data-i="${i}">Modifier</button>
      </div>
    `;
    div.querySelector('.delete-btn').onclick = () => {
      data.splice(i, 1);
      save();
      render();
    };
    div.querySelector('.edit-btn').onclick = () => {
      desc.value = t.description;
      amount.value = t.amount;
      type.value = t.type;
      category.value = t.category;
      editingIndex = i;
    };
    list.appendChild(div);
  });
  balance.textContent = "Solde : " + total + " $";
  save();
}

// Sauvegarde les transactions dans le navigateur
function save() {
  localStorage.setItem('transactions', JSON.stringify(data));
}

// Gère l'ajout ou la modification d'une transaction
form.onsubmit = e => {
  e.preventDefault();
  // Vérifie que tous les champs sont remplis et qu'une vraie catégorie est choisie
  if (!desc.value || !amount.value || !category.value || isNaN(amount.value) || amount.value <= 0 || category.value === "Categories") return;
  if (typeof editingIndex === 'number') {
    data[editingIndex] = {
      description: desc.value,
      amount: parseFloat(amount.value),
      type: type.value,
      category: category.value
    };
    editingIndex = undefined;
  } else {
    data.unshift({
      description: desc.value,
      amount: parseFloat(amount.value),
      type: type.value,
      category: category.value
    });
  }
  form.reset();
  render();
};

render();
