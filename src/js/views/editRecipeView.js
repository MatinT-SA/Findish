import icons from 'url:../../img/icons.svg';
import View from "./View.js";

class editRecipeView extends View {
    _parentElement = document.querySelector('.upload--edit');
    _successMessage = 'Recipe was successfully edited';
    _overlay = document.querySelector('.edit-overlay');
    _window = document.querySelector('.edit-recipe-window');
    // _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-edit-modal');

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
        document.querySelector('.recipe').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--edit');
            if (!btn) return;

            this._toggleWindow();
        });
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
        this._overlay.addEventListener('click', this._toggleWindow.bind(this));
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

    addHandlerEditView(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);

            // Set the recipe ID in the data object
            const recipeId = this.dataset.recipeId;
            if (recipeId) {
                data.id = recipeId;
            }

            // Call the handler function with the data object
            handler(data);
        });
    }

    _generateMarkup() { }
}

export default new editRecipeView();
