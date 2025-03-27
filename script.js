let btn_about = document.querySelector("#about") 
let btn_create = document.querySelector("#create")
let recipies_container = document.querySelector(".recipies-container")
let create_form = document.querySelector(".create-form")

btn_about.addEventListener("click", function(){
    if(recipies_container.style.display=="none")
        { recipies_container.style.display = "flex"
         create_form.style.display = "none"   
        }
    else recipies_container.style.display = "flex"
})