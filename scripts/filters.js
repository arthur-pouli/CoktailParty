// Fonction de filtrage et recherche
function filterCocktails(cocktails) {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filterValue = document.getElementById('filter').value;
    const desiredIngredient = document.getElementById('desired-ingredient').value.toLowerCase();
    const excludedIngredient = document.getElementById('excluded-ingredient').value.toLowerCase();

    const filteredCocktails = cocktails.filter(cocktail => {
        const matchesSearch = cocktail.nom.toLowerCase().includes(searchQuery) || cocktail.description.toLowerCase().includes(searchQuery);
        const matchesFilter = filterValue ? cocktail.getAlcoholType() === filterValue : true;
        const matchesDesiredIngredient = desiredIngredient ? cocktail.recette.some(ing => ing.produit.toLowerCase().includes(desiredIngredient)) : true;
        const matchesExcludedIngredient = excludedIngredient ? !cocktail.recette.some(ing => ing.produit.toLowerCase().includes(excludedIngredient)) : true;

        return matchesSearch && matchesFilter && matchesDesiredIngredient && matchesExcludedIngredient;
    });

    afficherCocktails(filteredCocktails);
}

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

// Initialisation des événements pour les filtres
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcon = document.getElementById('toggle-filters');
    const filtersDiv = document.getElementById('filters');
    filtersDiv.style.display = 'none'; // Cacher les filtres par défaut

    // Écouter le clic sur l'icône pour afficher/masquer les filtres
    toggleIcon.addEventListener('click', () => {
        if (filtersDiv.style.display === 'none' || filtersDiv.style.display === '') {
            filtersDiv.style.display = 'flex'; // Afficher les filtres
            toggleIcon.classList.replace('fa-eye', 'fa-eye-slash'); // Changer l'icône
        } else {
            filtersDiv.style.display = 'none'; // Cacher les filtres
            toggleIcon.classList.replace('fa-eye-slash', 'fa-eye'); // Changer l'icône
        }
    });

    // Événements pour les croix de réinitialisation des filtres
    document.getElementById('clear-desired').addEventListener('click', () => {
        document.getElementById('desired-ingredient').value = ''; // Réinitialise le champ
        filterCocktails(cocktails); // Met à jour les cocktails après réinitialisation
    });

    document.getElementById('clear-excluded').addEventListener('click', () => {
        document.getElementById('excluded-ingredient').value = ''; // Réinitialise le champ
        filterCocktails(cocktails); // Met à jour les cocktails après réinitialisation
    });

    // Autocomplétion pour les ingrédients
    autocomplete(document.getElementById('desired-ingredient'), allIngredients, 'desired-autocomplete-list'); // Autocomplétion pour les ingrédients souhaités
    autocomplete(document.getElementById('excluded-ingredient'), allIngredients, 'excluded-autocomplete-list'); // Autocomplétion pour les ingrédients exclus
});
