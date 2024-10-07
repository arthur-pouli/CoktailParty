class Ingredient {
    constructor(produit, qtt, unite, type) {
        this.produit = produit;
        this.qtt = qtt;
        this.unite = unite;
        this.type = type; // 'hard', 'soft' ou 'other'
    }
}

class Cocktail {
    constructor(nom, description, verre, recette, image, visible) {
        this.nom = nom;
        this.description = description;
        this.verre = verre;
        this.recette = recette; // Un tableau d'objets Ingredient
        this.image = image; // URL de l'image
        this.visible = visible;
    }

    getAlcoholType() {
        return this.recette.some(ing => ing.type === 'hard') ? 'hard' : 'soft';
    }
}

// Fonction pour charger les données depuis le fichier JSON
async function chargerCocktails() {
    try {
        const response = await fetch('cocktails.json');
        if (!response.ok) {
            throw new Error('Erreur réseau : ' + response.status);
        }
        const data = await response.json();

        return Object.values(data.cocktails).map(cocktail => new Cocktail(
            cocktail.nom,
            cocktail.description,
            cocktail.verreId,
            cocktail.recette.map(item => {
                const ingredientData = data.ingredients[item.ingredientId];
                return new Ingredient(ingredientData.nom, item.qtt, item.unite, ingredientData.type);
            }),
            cocktail.image,
            cocktail.visible
        ));
    } catch (error) {
        console.error('Erreur lors du chargement des cocktails :', error);
    }
}

// Fonction pour afficher les cocktails
function afficherCocktails(cocktails) {
    const cocktailList = document.getElementById('cocktail-list');
    cocktailList.innerHTML = ''; // Réinitialise la liste

    cocktails.forEach(cocktail => {
        if (cocktail.visible) {
            const card = document.createElement('div');
            card.className = 'cocktail-card';
            card.innerHTML = `<h3>${cocktail.nom}</h3><p>${cocktail.description}</p>`;
            card.onclick = () => afficherDetails(cocktail);
            cocktailList.appendChild(card);
        }
    });
}

// Afficher les détails du cocktail dans la modal
function afficherDetails(cocktail) {
    document.getElementById('modal-title').innerText = cocktail.nom;
    document.getElementById('modal-description').innerText = cocktail.description;
    document.getElementById('cocktail-image').src = cocktail.image;

    const recipeList = document.getElementById('modal-recipe');
    recipeList.innerHTML = ''; // Réinitialise la liste de la recette
    cocktail.recette.forEach(ing => {
        const listItem = document.createElement('li');
        listItem.innerText = `${ing.qtt} ${ing.unite} de ${ing.produit}`;
        recipeList.appendChild(listItem);
    });

    document.getElementById('cocktail-modal').style.display = 'block';
}

// Fermer la modal
document.querySelector('.close-button').onclick = () => {
    document.getElementById('cocktail-modal').style.display = 'none';
};

// Fonction de recherche et de filtre
function filterCocktails(cocktails) {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filterValue = document.getElementById('filter').value;

    const filteredCocktails = cocktails.filter(cocktail => {
        const matchesSearch = cocktail.nom.toLowerCase().includes(searchQuery);
        const matchesFilter = filterValue === "" || cocktail.getAlcoholType() === filterValue;

        return matchesSearch && matchesFilter;
    });

    afficherCocktails(filteredCocktails);
}

// Écouteurs d'événements
document.getElementById('search').addEventListener('input', () => filterCocktails(cocktails));
document.getElementById('filter').addEventListener('change', () => filterCocktails(cocktails));

// Chargement des cocktails et affichage initial
let cocktails = [];
chargerCocktails().then(loadedCocktails => {
    cocktails = loadedCocktails;
    afficherCocktails(cocktails);
});
