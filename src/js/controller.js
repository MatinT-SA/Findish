import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        recipeView.renderSpinner();

        // 1) loading recipe
        await model.loadRecipe(id);

        // 2) Rendering recipe
        recipeView.render(model.state.recipe);

    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
    try {
        await model.loadSearchResults('pizza');
    } catch (error) {
        console.log(error);
    }
};

controlSearchResults();

const init = function () {
    recipeView.addHandleRender(controlRecipes);
}

init();