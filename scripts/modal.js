// Afficher les détails du cocktail dans la modal
function afficherDetails(cocktail) {
    document.getElementById('modal-title').innerText = cocktail.nom;
    document.getElementById('modal-description').innerText = cocktail.description;

    const cocktailImage = document.getElementById('cocktail-image');

    // Chemin d'image par défaut
    const defaultImage = 'Resource/Picture/vide.png'; // Chemin relatif
    cocktailImage.src = cocktail.image || defaultImage; // Utilise l'image par défaut si nécessaire

    // Gestion des erreurs de chargement d'image
    cocktailImage.onerror = function() {
        this.src = defaultImage; // Charge l'image par défaut si l'image principale échoue
    };

    // Afficher le commentaire s'il existe
    const modalCommentaire = document.getElementById('modal-commentaire');
    if (cocktail.commentaires) {
        modalCommentaire.innerText = cocktail.commentaires;
        modalCommentaire.style.display = 'block';
    } else {
        modalCommentaire.style.display = 'none';
    }

    const recipeList = document.getElementById('modal-recipe');
    recipeList.innerHTML = ''; // Réinitialise la liste de la recette
    cocktail.recette.forEach(ing => {
        const listItem = document.createElement('li');
        listItem.innerText = `${ing.qtt} ${ing.unite} ${ing.produit}`; // Assurez-vous que 'produit' est une propriété existante
        recipeList.appendChild(listItem);
    });

    document.getElementById('cocktail-modal').style.display = 'block';
}

// Fermer la modal
document.querySelector('.close-button').onclick = () => {
    document.getElementById('cocktail-modal').style.display = 'none';
};
