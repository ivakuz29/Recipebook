// Venter til alt innhold i DOM-en er ferdig lastet før koden kjøres
document.addEventListener("DOMContentLoaded", function () {
    
    // Henter knapper og seksjoner fra HTML-en
    let btn_about = document.querySelector("#about");
    let btn_create = document.querySelector("#create");
    let recipies_container = document.querySelector(".recipies-container");
    let create_form = document.querySelector(".create-form");
    let view_recipe_form = document.querySelector(".view-recipe");
    let btn_view_menu = document.querySelector("#view_menu");

    // Henter elementer relatert til skjema og oppskriftvisning
    const recipeForm = document.getElementById("Addrecipe");
    const recipeList = document.getElementById("recipeList");
    const recipeTitle = document.getElementById("recipeTitle");
    const recipeImage = document.getElementById("recipeImage");
    const recipeIngredients = document.getElementById("recipeIngredients");
    const recipeInstructions = document.getElementById("recipeInstructions");

    // Brukes for å vite om man redigerer en oppskrift eller lager en ny
    let editindex = null;

    // Viser 'about' og 'view recipe'-seksjonene, skjuler 'create'-seksjonen
    btn_about.addEventListener("click", function () {
        recipies_container.style.display = "flex";
        view_recipe_form.style.display = "flex";
        create_form.style.display = "none";
    });

    // Viser 'create'-seksjonen, skjuler de andre
    btn_create.addEventListener("click", function () {
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "none";
        create_form.style.display = "flex";
    });

    // Viser kun oppskriftslisten (meny), skjuler resten
    btn_view_menu.addEventListener('click', function () {
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "flex";
        create_form.style.display = "none";
    });

    // Sletter en oppskrift fra localStorage og oppdaterer visningen
    function deleteRecipe(index) {
        let recipes = getRecipes();
        recipes.splice(index, 1);
        saveRecipes(recipes);
        displayrecipes();
    }

    // Viser valgt oppskrift i "view recipe"-seksjonen
    function viewRecipe(index) {
        const recipes = getRecipes();
        const recipe = recipes[index];
        recipeTitle.textContent = recipe.title;
        recipeImage.src = recipe.recipeImage;
        recipeIngredients.textContent = recipe.ingredients;
        recipeInstructions.textContent = recipe.recipe;
    }

    // Fyller skjemaet med en eksisterende oppskrift for redigering
    function editRecipe(index) {
        let recipes = getRecipes();
        let recipe = recipes[index];
        document.getElementById("title").value = recipe.title;
        document.getElementById("ingredients").value = recipe.ingredients;
        document.getElementById("recipe").value = recipe.recipe;
        editindex = index;

        // Gjør bildevalget valgfritt ved redigering
        document.getElementById("image").removeAttribute("required");

        // Viser redigeringsskjema, skjuler andre seksjoner
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "none";
        create_form.style.display = "flex";
    }

    // Henter oppskrifter fra localStorage
    function getRecipes() {
        return JSON.parse(localStorage.getItem("recipes")) || [];
    }

    // Lagrer oppskrifter til localStorage
    function saveRecipes(recipes) {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    // Viser alle lagrede oppskrifter i menyen
    function displayrecipes() {
        recipeList.innerHTML = "";
        const recipes = getRecipes();

        recipes.forEach((recipe, index) => {
            const recipecard = document.createElement('section');
            recipecard.className = "recipe-card";

            // HTML-innhold for en enkelt oppskrift
            recipecard.innerHTML = `
                <img src="${recipe.recipeImage}" class="recipe-image">
                <h3 class="recipe-title">${recipe.title}</h3>
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="edit-btn" data-index="${index}">Edit</button>
            `;

            // Klikk på kortet viser oppskriften
            recipecard.addEventListener("click", () => viewRecipe(index));

            recipeList.appendChild(recipecard);
        });

        // Legger til slettefunksjonalitet på hver "Delete"-knapp
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Hindrer at "viewRecipe" også trigges
                if (confirm("are you sure?")) {
                    const index = event.target.dataset.index;
                    deleteRecipe(index);
                }
            });
        });

        // Legger til redigeringsfunksjon på hver "Edit"-knapp
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const index = event.target.dataset.index;
                editRecipe(index);
            });
        });
    }

    // Håndterer innsending av skjema (både ny og redigert oppskrift)
    recipeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Henter data fra skjema
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const recipe = document.getElementById('recipe').value;
        const recipeImage = document.getElementById('image').files[0];

        // Lagrer oppskrift etter bilde er lastet inn
        const handlesave = (imgsrc) => {
            const newrecipe = {
                title, ingredients, recipe, recipeImage: imgsrc
            };
            const recipes = getRecipes();

            // Hvis vi redigerer, erstatt eksisterende oppskrift
            if (editindex !== null) {
                recipes[editindex] = newrecipe;
            } else {
                recipes.push(newrecipe);
            }

            // Lagrer og oppdaterer visning
            saveRecipes(recipes);
            displayrecipes();
            recipeForm.reset();
            editindex = null;
        };

        // Leser inn nytt bilde hvis det er valgt
        if (recipeImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                handlesave(e.target.result);
            };
            reader.readAsDataURL(recipeImage);
        } else {
            // Bruk gammelt bilde hvis vi redigerer og ikke valgte nytt
            let oldimage = "";
            if (editindex !== null) {
                oldimage = getRecipes()[editindex].recipeImage;
            }
            handlesave(oldimage);
        }
    });

    // Viser oppskrifter når siden lastes inn
    displayrecipes();
});
