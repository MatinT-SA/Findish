import icons from 'url:../../img/icons.svg';
import View from "./View.js";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _successMessage = 'Recipe was successfully uploaded';
    _overlay = document.querySelector('.overlay');
    _window = document.querySelector('.add-recipe-window');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    _toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
        this._overlay.addEventListener('click', this._toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();

            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);

            // Check if the form has a recipe ID (for editing)
            const recipeId = this.dataset.recipeId; // Assuming you added this data attribute
            if (recipeId) {
                data.id = recipeId; // Set the ID in the data object if editing
            }

            // Call the handler function with the data object
            handler(data);
        });
    }


    renderForm(recipe = {}) {
        const form = this._parentElement;
        // Populate the form fields with recipe data
        form.title.value = recipe.title || '';
        form.sourceUrl.value = recipe.sourceUrl || '';
        form.image.value = recipe.image || '';
        form.publisher.value = recipe.publisher || '';
        form.cookingTime.value = recipe.cookingTime || '';
        form.servings.value = recipe.servings || '';

        // Populate ingredients
        for (let i = 1; i <= 6; i++) {
            form[`ingredient-${i}`].value = recipe[`ingredient-${i}`] || '';
        }

        this._toggleWindow(); // Show the window
    }

    // Generate HTML for ingredient inputs
    _generateIngredientInputs(ingredients = {}) {
        let ingredientInputs = '';
        for (let i = 1; i <= 6; i++) {
            ingredientInputs += `
                <label>Ingredient ${i}</label>
                <input value="${ingredients[`ingredient-${i}`] || ''}" type="text" name="ingredient-${i}"
                    placeholder="Format: 'Quantity,Unit,Description'" ${i === 1 ? 'required' : ''} />
            `;
        }
        return ingredientInputs;
    }

    _generateMarkup() { }
}

export default new AddRecipeView();
