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

let allIngredients = []; // Déclaration pour stocker tous les ingrédients
let cocktails = []; // Déclaration pour stocker tous les cocktails

// Fonction pour charger les données depuis le fichier JSON
async function chargerCocktails() {
    try {
        const response = await fetch('cocktails.json');
        if (!response.ok) throw new Error('Erreur réseau : ' + response.status);
        
        const data = await response.json();
        allIngredients = [...new Set(
            Object.values(data.ingredients).map(ingredient => ingredient.nom) // Récupération des noms d'ingrédients
        )]; // Utilisation d'un Set pour ne garder que les noms uniques

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

// Fonction d'affichage des cocktails
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

// Fonction d'autocomplétion pour les ingrédients
function autocomplete(input, ingredients, autocompleteListId) {
    let currentFocus;

    input.addEventListener("input", function () {
        const value = this.value;
        closeAllLists();
        if (!value) return false;

        currentFocus = -1;
        const listDiv = document.getElementById(autocompleteListId);
        listDiv.innerHTML = ''; // Réinitialise la liste

        ingredients.forEach(ingredient => {
            if (ingredient.toLowerCase().startsWith(value.toLowerCase())) {
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = `<strong>${ingredient.substr(0, value.length)}</strong>${ingredient.substr(value.length)}<input type='hidden' value='${ingredient}'>`;
                itemDiv.addEventListener("click", function () {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    filterCocktails(cocktails); // Met à jour les cocktails après sélection
                });
                listDiv.appendChild(itemDiv);
            }
        });
    });

    function closeAllLists(element) {
        const items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (element !== items[i] && element !== input) {
                items[i].innerHTML = ''; // Vide la liste
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Fonction de recherche et de filtre
function filterCocktails(cocktails) {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filterValue = document.getElementById('filter').value;
    const desiredIngredient = document.getElementById('desired-ingredient').value.toLowerCase();
    const excludedIngredient = document.getElementById('excluded-ingredient').value.toLowerCase();

    const filteredCocktails = cocktails.filter(cocktail => {
        const matchesSearch = cocktail.nom.toLowerCase().includes(searchQuery);
        const matchesFilter = !filterValue || cocktail.getAlcoholType() === filterValue;
        const containsDesired = !desiredIngredient || cocktail.recette.some(ing => ing.produit.toLowerCase().includes(desiredIngredient));
        const containsExcluded = excludedIngredient.length < 2 || !cocktail.recette.some(ing => ing.produit.toLowerCase().includes(excludedIngredient));

        return matchesSearch && matchesFilter && containsDesired && containsExcluded;
    });

    afficherCocktails(filteredCocktails);
}

// Écouteurs d'événements
document.getElementById('search').addEventListener('input', () => filterCocktails(cocktails));
document.getElementById('filter').addEventListener('change', () => filterCocktails(cocktails));
document.getElementById('desired-ingredient').addEventListener('input', () => filterCocktails(cocktails));
document.getElementById('excluded-ingredient').addEventListener('input', () => filterCocktails(cocktails));

// Ajout des écouteurs d'événements pour les boutons de suppression
document.getElementById('clear-desired').addEventListener('click', () => {
    document.getElementById('desired-ingredient').value = ''; // Réinitialise le champ
    filterCocktails(cocktails); // Met à jour les cocktails après suppression
});

document.getElementById('clear-excluded').addEventListener('click', () => {
    document.getElementById('excluded-ingredient').value = ''; // Réinitialise le champ
    filterCocktails(cocktails); // Met à jour les cocktails après suppression
});

// Gestion de l'affichage des filtres
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcon = document.getElementById('toggle-filters');
    const filtersDiv = document.getElementById('filters');
    filtersDiv.style.display = 'none'; // Cacher les filtres par défaut

    toggleIcon.addEventListener('click', () => {
        if (filtersDiv.style.display === 'none' || filtersDiv.style.display === '') {
            filtersDiv.style.display = 'flex'; // Afficher les filtres
            toggleIcon.classList.replace('fa-eye', 'fa-eye-slash'); // Changer l'icône
        } else {
            filtersDiv.style.display = 'none'; // Cacher les filtres
            toggleIcon.classList.replace('fa-eye-slash', 'fa-eye'); // Changer l'icône
        }
    });
});

// Chargement des cocktails et affichage initial
chargerCocktails().then(loadedCocktails => {
    cocktails = loadedCocktails;
    afficherCocktails(cocktails);
    autocomplete(document.getElementById("desired-ingredient"), allIngredients, "desired-autocomplete-list");
    autocomplete(document.getElementById("excluded-ingredient"), allIngredients, "excluded-autocomplete-list");
});
