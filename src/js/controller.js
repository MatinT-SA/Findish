import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        // Render spinner
        recipeView.renderSpinner();

        // updating results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 3) updating bookmarks
        bookmarksView.update(model.state.bookmarks);

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
        resultsView.showPopupError(error);
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
    // Add/remove bookmark
    model.state.recipe.bookmarked ? model.removeBookmark(model.state.recipe.id) : model.addBookmark(model.state.recipe);

    // update recipe view
    recipeView.update(model.state.recipe);

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    try {
        recipeView.renderSpinner();

        // Upload new recipe data
        await model.uploadRecipe(newRecipe);

        // Render recipe
        recipeView.render(model.state.recipe);

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change ID in the URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Success message
        addRecipeView.showPopupMessage();

        // Close form window
        setTimeout(() => {
            addRecipeView._toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);

        return;
    } catch (err) {
        addRecipeView.renderError(err.message);
    }
}

const init = function () {
    recipeView.addHandleRender(controlRecipes);
    recipeView.addHandlderUpdateServing(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHanlderClick(controlPagination);
    bookmarksView.addHandlerBookmarks(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();