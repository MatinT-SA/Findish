import icons from 'url:../../img/icons.svg';
import View from "./View.js";

class AddRecipeView extends View {
    _editRecipeId = null;
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

    setEditRecipeId(recipeId) {
        this._editRecipeId = recipeId;
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

            // Use this._parentElement to create FormData
            const dataArr = [...new FormData(this._parentElement)];
            const data = Object.fromEntries(dataArr);

            if (this._editRecipeId) {
                handler(this._editRecipeId, data);
                this._editRecipeId = null;
            } else {
                handler(null, data);
            }
        }.bind(this)); // Bind the outer function to ensure 'this' refers to the class instance
    }

    populateForm(data) {
        this._parentElement.querySelector('input[name="title"]').value = data.title || '';
        this._parentElement.querySelector('input[name="ingredient-1"]').value = data.ingredients[0] ? `${data.ingredients[0].quantity ? data.ingredients[0].quantity : ''} ${data.ingredients[0].unit} ${data.ingredients[0].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-2"]').value = data.ingredients[1] ? `${data.ingredients[1].quantity ? data.ingredients[1].quantity : ''} ${data.ingredients[1].unit} ${data.ingredients[1].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-3"]').value = data.ingredients[2] ? `${data.ingredients[2].quantity ? data.ingredients[2].quantity : ''} ${data.ingredients[2].unit} ${data.ingredients[2].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-4"]').value = data.ingredients[3] ? `${data.ingredients[3].quantity ? data.ingredients[3].quantity : ''} ${data.ingredients[3].unit} ${data.ingredients[3].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-5"]').value = data.ingredients[4] ? `${data.ingredients[4].quantity ? data.ingredients[4].quantity : ''} ${data.ingredients[4].unit} ${data.ingredients[4].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-6"]').value = data.ingredients[5] ? `${data.ingredients[5].quantity ? data.ingredients[5].quantity : ''} ${data.ingredients[5].unit} ${data.ingredients[5].description}` : '';

        for (let i = 0; i < 6; i++) {
            const ingredientInput = this._parentElement.querySelector(`input[name="ingredient-${i + 1}"]`);
            if (ingredientInput) {
                const ingredient = data.ingredients[i];
                ingredientInput.value = ingredient
                    ? `${ingredient.quantity || ''}, ${ingredient.unit || ''}, ${ingredient.description || ''}`
                    : '';
            }
        }

        this._parentElement.querySelector('input[name="cookingTime"]').value = data.cookingTime || '';
        this._parentElement.querySelector('input[name="servings"]').value = data.servings || '';
        this._parentElement.querySelector('input[name="sourceUrl"]').value = data.sourceUrl || '';
        this._parentElement.querySelector('input[name="image"]').value = data.image || '';
        this._parentElement.querySelector('input[name="publisher"]').value = data.publisher || '';
    }


    _generateMarkup() { }
}

export default new AddRecipeView();
