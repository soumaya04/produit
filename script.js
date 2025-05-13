// Fonction pour ajouter un produit au panier
function ajouterAuPanier(nom, prix) {
  if (!nom || isNaN(prix) || prix <= 0) {
    alert("Erreur: Le nom ou le prix du produit est invalide.");
    return;
  }

  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  let produitExist = panier.find(item => item.nom === nom);

  if (produitExist) {
    produitExist.quantite += 1;
  } else {
    panier.push({ nom, prix: parseFloat(prix), quantite: 1 });
  }

  localStorage.setItem('panier', JSON.stringify(panier));
  console.log("Panier après ajout:", panier);
  alert("✅ " + nom + " a été ajouté au panier !");
  mettreAJourCompteurPanier();
}

// Fonction pour afficher le compteur 
function mettreAJourCompteurPanier() {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];

  let compteur = panier.reduce((acc, item) => {
    if (isNaN(item.quantite) || item.quantite <= 0) {
      console.error("Quantité invalide pour le produit:", item);
      return acc;
    }
    return acc + item.quantite;
  }, 0);

  console.log("Compteur du panier:", compteur);

  let boutonPanier = document.querySelector('.panier-button');
  if (boutonPanier) {
    boutonPanier.textContent = `🛒 Voir le panier (${compteur})`;
  } // Sinon ne rien faire (normal si on est sur une autre page)
}

// Fonction pour afficher le panier avec quantités et total correct
function afficherPanier() {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  let tbody = document.getElementById('ligne-panier');
  let totalGeneral = 0;

  if (!tbody) return; 

  tbody.innerHTML = '';

  panier.forEach(item => {
    if (!item.nom || isNaN(item.prix) || item.prix <= 0 || isNaN(item.quantite) || item.quantite <= 0) {
      console.error("Produit invalide dans le panier:", item);
      return;
    }

    let totalProduit = item.prix * item.quantite;
    totalGeneral += totalProduit;

    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nom}</td>
      <td>${item.quantite}</td>
      <td>${item.prix.toFixed(3)}</td>
      <td>${totalProduit.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  });

  let totalElement = document.querySelector('.total strong');
  if (totalElement) {
    totalElement.textContent = `Total Général : ${totalGeneral.toFixed(3)} DT`;
  }
}

//  Fonction pour confirmer la commande et l'envoyer via AJAX
function confirmerCommande(event) {
  event.preventDefault();

  let email = document.getElementById('email').value;
  let conf = document.getElementById('conf').value;
  let adresse = document.getElementById('ad').value;
  let panier = JSON.parse(localStorage.getItem('panier')) || [];

  if (email !== conf) {
    alert("❌ Les adresses mail ne correspondent pas.");
    return;
  }

  if (panier.length === 0) {
    alert("❌ Votre panier est vide !");
    return;
  }

  // Construction de l'objet commande
  let commande = {
    email: email,
    adresse: adresse,
    panier: panier
  };

  // Envoi AJAX avec fetch()
  fetch('commande.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commande)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur HTTP: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Réponse du serveur:", data);

    if (data.status === "success") {
      localStorage.removeItem('panier');
      mettreAJourCompteurPanier();
      afficherPanier();

      alert("✅ Commande confirmée et envoyée !");
      document.getElementById('form-commande').reset();
    } else {
      alert("❌ Erreur serveur : commande non envoyée.");
    }
  })
  .catch(error => {
    console.error("Erreur AJAX:", error);
    alert("❌ Erreur lors de l’envoi de la commande : " + error.message);
  });
}

// Au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  mettreAJourCompteurPanier();
  afficherPanier();

  let form = document.getElementById('form-commande');
  if (form) {
    form.addEventListener('submit', confirmerCommande);
  }
});
