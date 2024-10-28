// Classe pour représenter un cocktail
class Cocktail {
    constructor(nom, description, recette, image) {
        this.nom = nom;
        this.description = description;
        this.recette = recette; // Ceci doit être un tableau d'objets Ingredient
        this.image = image;
    }

    // Méthode pour obtenir le type d'alcool
    getAlcoholType() {
        const hasHardAlcohol = this.recette.some(ingredient => ingredient.type === 'hard');
        console.log(`Cocktail: ${this.nom}, Type alcool détecté: ${hasHardAlcohol ? 'hard' : 'soft'}`);
        return hasHardAlcohol ? 'hard' : 'soft';
    }
}

// Classe pour représenter un ingrédient
class Ingredient {
    constructor(produit, qtt, unite, type) {
        this.produit = produit;
        this.qtt = qtt;
        this.unite = unite;
        this.type = type; // 'hard', 'soft' ou 'other'
    }
}

// Variables globales pour stocker les cocktails
let cocktails = [];
let availableFiles = ["Resource/juju.json"]; // Fichiers JSON disponibles
let currentFileLoaded = null; // Variable pour suivre le fichier actuellement chargé

// Fonction pour charger dynamiquement les cocktails à partir du fichier sélectionné
async function chargerCocktails(fichier) {
    try {
        const response = await fetch(fichier);
        if (!response.ok) throw new Error('Erreur réseau : ' + response.status);

        const textData = await response.text();

        let data;
        try {
            data = JSON.parse(textData); // Essayer de parser le texte en JSON
        } catch (e) {
            console.error('Erreur de parsing JSON:', e);
            console.error('Données reçues:', textData);
            return []; // Retourne un tableau vide en cas d'erreur de parsing
        }

        // Création des objets cocktails à partir des données chargées
        return Object.values(data.cocktails).map(cocktail => new Cocktail(
            cocktail.nom,
            cocktail.description,
            cocktail.recette.map(item => new Ingredient(item.ingredient, item.qtt, item.unite, item.type)),
            cocktail.image,
        ));
    } catch (error) {
        console.error('Erreur lors du chargement des cocktails :', error);
        return []; // Retourne un tableau vide en cas d'erreur de chargement
    }
}

// Fonction d'affichage des cocktails
function afficherCocktails(cocktails) {
    const cocktailList = document.getElementById('cocktail-list');
    cocktailList.innerHTML = ''; // Réinitialise la liste

    const cocktailCards = document.getElementById('cocktail-cards');
    cocktailCards.innerHTML = ''; // Réinitialise les cartes

    if (!Array.isArray(cocktails)) {
        console.error("Les cocktails ne sont pas un tableau valide.");
        return; // Quitter la fonction si ce n'est pas un tableau
    }

    cocktails.forEach(cocktail => {
        const card = document.createElement('div');
    
        // Vérifier si le cocktail a une image et ajuster la classe en conséquence
        if (cocktail.image) {
            card.className = 'cocktail-card has-image'; // Ajout de la classe has-image si une image est présente
            card.style.backgroundImage = `url(${cocktail.image})`; // Définir l'image de fond avec l'URL de l'image
        } else {
            card.className = 'cocktail-card'; // Sinon, juste la classe cocktail-card
        }
    
        // Ajouter le texte à l'intérieur de la carte
        card.innerHTML = `
            <h3>${cocktail.nom}</h3>
            <p>${cocktail.description}</p>
        `;
    
        // Ajouter l'événement de clic pour afficher les détails
        card.onclick = () => afficherDetails(cocktail);
    
        // Ajouter la carte du cocktail dans la section correspondante
        cocktailCards.appendChild(card);
    });
    
    
    
}

// Fonction pour afficher les détails du cocktail dans la modal
function afficherDetails(cocktail) {
    document.getElementById('modal-title').innerText = cocktail.nom;
    document.getElementById('modal-description').innerText = cocktail.description;
    document.getElementById('cocktail-image').src = cocktail.image;
    document.getElementById('modal-commentaire').innerText = cocktail.commentaire; // Affiche le commentaire

    // Remplir la recette
    const modalRecipe = document.getElementById('modal-recipe');
    modalRecipe.innerHTML = ''; // Réinitialiser la liste de la recette
    cocktail.recette.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = `${ingredient.qtt} ${ingredient.unite} de ${ingredient.produit}`;
        modalRecipe.appendChild(li);
    });

    // Afficher la modal
    document.getElementById('cocktail-modal').style.display = 'block';
}

// Écouter l'événement de fermeture de la modal
document.querySelector('.close-button').onclick = () => {
    document.getElementById('cocktail-modal').style.display = 'none';
};

// Fonction pour récupérer le paramètre du fichier depuis l'URL
function getFileParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('file'); // Renvoie la valeur du paramètre 'file'
}

// Initialisation des événements et chargement initial
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le fichier spécifié dans l'URL
    const fileParam = "Resource/" + getFileParameter() + ".json";
    console.log(fileParam);
    // Vérifier si le fichier spécifié est dans la liste des fichiers disponibles
    if (availableFiles.includes(fileParam)) {
        chargerCocktails(fileParam).then(cocktailsList => {
            cocktails = cocktailsList; // Stocker les cocktails chargés
            afficherCocktails(cocktails); // Afficher les cocktails dans la liste
            currentFileLoaded = fileParam; // Mettez à jour le fichier actuellement chargé
        });
    } else {
        console.error('Fichier non valide ou non spécifié dans l\'URL.');
    }
});
