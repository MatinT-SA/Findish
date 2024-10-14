import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        recipeView.renderSpinner();

        // updating results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

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
        // 1) get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) rendering spinner
        resultsView.renderSpinner();

        // 3) render results
        await model.loadSearchResults(query);
        resultsView.render(model.getSearchResultsPage());

        // 4) render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (error) {
        console.log(error);
    }
};

const controlPagination = function (goToPage) {
    // 1) render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
    // update the recipe servings
    model.updateServings(newServings);

    // update the recipe view
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
    model.state.recipe.bookmarked ? model.removeBookmark(model.state.recipe.id) : model.addBookmark(model.state.recipe);
    recipeView.update(model.state.recipe);
}

const init = function () {
    recipeView.addHandleRender(controlRecipes);
    recipeView.addHandlderUpdateServing(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHanlderClick(controlPagination);
}

init();