import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'Couldn\'t find the recipe you\'re looking for';
    _successMessage = '';

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();