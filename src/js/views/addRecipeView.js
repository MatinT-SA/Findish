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
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    populateForm(data) {
        this._parentElement.querySelector('input[name="title"]').value = data.title || '';
        this._parentElement.querySelector('input[name="ingredient-1"]').value = data.ingredients[0] ? `${data.ingredients[0].quantity ? data.ingredients[0].quantity : ''} ${data.ingredients[0].unit} ${data.ingredients[0].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-2"]').value = data.ingredients[1] ? `${data.ingredients[1].quantity ? data.ingredients[1].quantity : ''} ${data.ingredients[1].unit} ${data.ingredients[1].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-3"]').value = data.ingredients[2] ? `${data.ingredients[2].quantity ? data.ingredients[2].quantity : ''} ${data.ingredients[2].unit} ${data.ingredients[2].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-4"]').value = data.ingredients[3] ? `${data.ingredients[3].quantity ? data.ingredients[3].quantity : ''} ${data.ingredients[3].unit} ${data.ingredients[3].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-5"]').value = data.ingredients[4] ? `${data.ingredients[4].quantity ? data.ingredients[4].quantity : ''} ${data.ingredients[4].unit} ${data.ingredients[4].description}` : '';
        this._parentElement.querySelector('input[name="ingredient-6"]').value = data.ingredients[5] ? `${data.ingredients[5].quantity ? data.ingredients[5].quantity : ''} ${data.ingredients[5].unit} ${data.ingredients[5].description}` : '';
        this._parentElement.querySelector('input[name="cookingTime"]').value = data.cookingTime || '';
        this._parentElement.querySelector('input[name="servings"]').value = data.servings || '';
    }


    _generateMarkup() { }
}

export default new AddRecipeView();
