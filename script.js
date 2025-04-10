document.addEventListener("DOMContentLoaded", function () {
    let btn_about = document.querySelector("#about");
    let btn_create = document.querySelector("#create");
    let recipies_container = document.querySelector(".recipies-container");
    let create_form = document.querySelector(".create-form");
    let view_recipe_form = document.querySelector(".view-recipe");
    let btn_view_menu = document.querySelector("#view_menu");

    const recipeForm = document.getElementById("Addrecipe");
    const recipeList = document.getElementById("recipeList");
    const recipeTitle = document.getElementById("recipeTitle");
    const recipeImage = document.getElementById("recipeImage");
    const recipeIngredients = document.getElementById("recipeIngredients");
    const recipeInstructions = document.getElementById("recipeInstructions");
    let editindex = null

    btn_about.addEventListener("click", function () {
        recipies_container.style.display = "flex";
        view_recipe_form.style.display = "flex";
        create_form.style.display = "none";
    });

    btn_create.addEventListener("click", function () {
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "none";
        create_form.style.display = "flex";
    });

    btn_view_menu.addEventListener('click', function () {
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "flex";
        create_form.style.display = "none";
    })

    function deleteRecipe(index) {
        let recipes = getRecipes();
        recipes.splice(index, 1);
        saveRecipes(recipes);
        displayrecipes();
    }

    function viewRecipe(index) {
        const recipes = getRecipes();
        const recipe = recipes[index];
        recipeTitle.textContent = recipe.title;
        recipeImage.src = recipe.recipeImage;
        recipeIngredients.textContent = recipe.ingredients;
        recipeInstructions.textContent = recipe.recipe;
        // showSection("viewRecipes");
    }

    function editRecipe(index) {
        let recipes = getRecipes();
        let recipe =recipes[index]
        recipeTitle.value = recipe.title
        recipeIngredients.value = recipe.ingredients
        recipeInstructions.value = recipe.recipe
        editindex = index
        document.getElementById("image").removeAttribute("required")
        recipies_container.style.display = "none";
        view_recipe_form.style.display = "none";
        create_form.style.display = "flex";
    }



    function getRecipes() {
        return JSON.parse(localStorage.getItem("recipes")) || [];
    }

    function saveRecipes(recipes) {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    function displayrecipes() {
        recipeList.innerHTML = ""
        const recipes = getRecipes()
        recipes.forEach((recipe, index) => {
            const recipecard = document.createElement('section')
            recipecard.className = "recipe-card"
            recipecard.innerHTML = `
                <img src ="${recipe.recipeImage}" class = "recipe-image">
                <h3 class = "recipe-title"> ${recipe.title}</h3>
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="edit-btn" data-index="${index}">Edit</button>

                `
            recipecard.addEventListener("click", () => viewRecipe(index));

            recipeList.appendChild(recipecard);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                if (confirm("are you sure?")) {
                    const index = event.target.dataset.index;
                    deleteRecipe(index);
                }

            });
        });
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                    const index = event.target.dataset.index;
                    editRecipe(index);
                

            });
        });

    }

    recipeForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const title = document.getElementById('title').value
        const ingredients = document.getElementById('ingredients').value
        const recipe = document.getElementById('recipe').value
        const recipeImage = document.getElementById('image').files[0]
        const handlesave = (imgsrc)=>{
            const newrecipe = {
                title, ingredients, recipe, recipeImage: imgsrc
            }
            const recipes = getRecipes()
            if (editindex !== null){
                recipes[editindex]=newrecipe
            }
            else recipes.push(newrecipe)
            saveRecipes(recipes)
            displayrecipes()
            recipeForm.reset()
            editindex = null 
        }

        if (recipeImage) {
            const reader = new FileReader()
            reader.onload = function (e) {
           
                handlesave(e.target.result)

            }
            reader.readAsDataURL(recipeImage);
        }
        else {
            let oldimage
            if (editindex !== null)
                oldimage = getRecipes()[editindex].recipeImage
            else oldimage = ""
            handlesave(oldimage)
        } 
    })

    displayrecipes();
}
);