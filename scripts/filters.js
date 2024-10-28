// Fonction de filtrage et recherche
function filterCocktails(cocktails) {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filterValue = document.getElementById('filter').value;
    const desiredIngredient = document.getElementById('desired-ingredient').value.toLowerCase();
    const excludedIngredient = document.getElementById('excluded-ingredient').value.toLowerCase();

    console.log('Recherche:', searchQuery);
    console.log('Filtre alcool/sans alcool:', filterValue);
    console.log('Ingrédient désiré:', desiredIngredient);
    console.log('Ingrédient exclu:', excludedIngredient);

    const filteredCocktails = cocktails.filter(cocktail => {
        const matchesSearch = cocktail.nom.toLowerCase().includes(searchQuery) || cocktail.description.toLowerCase().includes(searchQuery);
        const matchesFilter = filterValue ? cocktail.getAlcoholType() === filterValue : true;
        const matchesDesiredIngredient = desiredIngredient ? cocktail.recette.some(ing => ing.produit.toLowerCase().includes(desiredIngredient)) : true;
        const matchesExcludedIngredient = excludedIngredient ? !cocktail.recette.some(ing => ing.produit.toLowerCase().includes(excludedIngredient)) : true;
    
        return matchesSearch && matchesFilter && matchesDesiredIngredient && matchesExcludedIngredient;
    });

    console.log('Cocktails filtrés:', filteredCocktails);
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
                itemDiv.innerHTML = `<strong>${ingredient.substr(0, value.length)}</strong>${ingredient.substr(value.length)}<input type="hidden" value="${ingredient}">`;
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


// Initialisation des événements et chargement initial
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le fichier spécifié dans l'URL
    const fileParam = "Resource/" + getFileParameter() + ".json";
    console.log(fileParam);
    // Vérifier si le fichier spécifié est dans la liste des fichiers disponibles
    if (availableFiles.includes(fileParam)) {
        chargerCocktails(fileParam).then(cocktailsList => {
            cocktails = cocktailsList; // Stocker les cocktails chargés
        
            // Extraire les ingrédients uniques à partir des recettes des cocktails
            allIngredients = [...new Set(
                cocktails.flatMap(cocktail => cocktail.recette.map(ing => ing.produit))
            )];
        
            afficherCocktails(cocktails); // Afficher les cocktails dans la liste
            currentFileLoaded = fileParam; // Met à jour le fichier actuellement chargé
        
            // Autocomplétion pour les ingrédients après chargement des cocktails
            autocomplete(document.getElementById('desired-ingredient'), allIngredients, 'desired-autocomplete-list');
            autocomplete(document.getElementById('excluded-ingredient'), allIngredients, 'excluded-autocomplete-list');
        });
    } else {
        console.error('Fichier non valide ou non spécifié dans l\'URL.');
    }

    // Écouteur pour le filtre alcool/sans alcool
    document.getElementById('filter').addEventListener('change', () => {
        const filterValue = document.getElementById('filter').value;
        console.log('Filtre alcool/sans alcool changé:', filterValue);  // Log pour vérifier la valeur
        filterCocktails(cocktails);  // Appliquer le filtrage après sélection du filtre
    });

    // Écouter les événements d'entrée pour la recherche en temps réel
    document.getElementById('search').addEventListener('input', () => {
        filterCocktails(cocktails); // Recherche instantanée
    });

    // Événements pour les filtres d'ingrédients
    document.getElementById('clear-desired').addEventListener('click', () => {
        document.getElementById('desired-ingredient').value = ''; // Réinitialise le champ
        filterCocktails(cocktails); // Met à jour les cocktails après réinitialisation
    });

    document.getElementById('clear-excluded').addEventListener('click', () => {
        document.getElementById('excluded-ingredient').value = ''; // Réinitialise le champ
        filterCocktails(cocktails); // Met à jour les cocktails après réinitialisation
    });

    // Affichage/masquage des filtres
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
