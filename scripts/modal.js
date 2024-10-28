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
        card.className = 'cocktail-card';

        // Vérification de l'image du cocktail
        console.log(`Cocktail: ${cocktail.nom}, Image: ${cocktail.image}`);

        // Définir l'image de fond avec l'URL de l'image
        // Utiliser l'image par défaut si elle est vide ou nulle
        card.style.backgroundImage = cocktail.image ? `url(${cocktail.image})` : `url('Resource/Picture/vide.png')`;

        // Ajouter le texte à l'intérieur de la carte
        card.innerHTML = `
            <div class="cocktail-card-content">
                <h3>${cocktail.nom}</h3>
                <p>${cocktail.description}</p>
            </div>
        `;

        // Ajouter l'événement de clic pour afficher les détails
        card.onclick = () => afficherDetails(cocktail);

        // Ajouter la carte du cocktail dans la section correspondante
        cocktailCards.appendChild(card);
    });
}


// Fermer la modal
document.querySelector('.close-button').onclick = () => {
    document.getElementById('cocktail-modal').style.display = 'none';
};
