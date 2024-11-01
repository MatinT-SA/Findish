import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import editRecipeView from './views/editRecipeView.js';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime';

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
        // 1) adjust results per page based on screen width
        model.adjustResultsPerPage();

        // 2) get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 3) rendering spinner
        resultsView.renderSpinner();

        // 4) load search results
        await model.loadSearchResults(query);

        // 5) render results for the current page
        resultsView.render(model.getSearchResultsPage());

        // 4) render initial pagination buttons based on the dynamic resultsPerPage
        paginationView.render(model.state.search);
    } catch (error) {
        resultsView.showPopupError(error);
    }
};

const controlResize = function () {
    model.adjustResultsPerPage();

    if (model.state.search.results.length) {
        resultsView.render(model.getSearchResultsPage());
        paginationView.render(model.state.search);
    }
}

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

        // Create a new recipe
        await model.uploadRecipe(newRecipe);
        addRecipeView.showPopupMessage();

        // Render the new recipe
        recipeView.render(model.state.recipe);
        bookmarksView.render(model.state.bookmarks);
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Close the modal after a short delay
        setTimeout(() => {
            addRecipeView._toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
        addRecipeView.renderError(err.message);
    } finally {
        recipeView.clearSpinner();
    }
};

const controlRemoveRecipe = async function (recipeId) {
    try {
        // render spinner
        recipeView.renderSpinner();

        // storing success remove operation in a variable
        const success = await model.removeRecipe(recipeId);

        // displaying relevant messages plus rendering resultsView
        if (success) {
            recipeView.showPopupMessage('Recipe successfully removed');
            resultsView.render(model.getSearchResultsPage());
        } else {
            recipeView.showPopupError('Recipe not found or could not be removed.');
        }
    } catch (error) {
        recipeView.showPopupError('An error occurred while trying to remove the recipe.');
    } finally {
        // clearing spinner in any way
        recipeView.clearSpinner();
        resultsView.clearSpinner();
    }
};

const controlEditRecipe = function (recipeId) {
    try {
        recipeView.renderSpinner();

        // Retrieve the recipe data
        const recipeData = model.getRecipeById(recipeId);
        if (!recipeData) throw new Error('Recipe not found');

        // Populate form with current recipe data for editing
        editRecipeView.renderForm(recipeData);

    } catch (err) {
        console.error('Error editing recipe:', err);
        recipeView.renderError(err.message);
    } finally {
        recipeView.clearSpinner();
    }
};

const controlEditRecipeSubmission = async function (updatedRecipe) {
    try {
        await model.updateRecipe(updatedRecipe.id, updatedRecipe); // Update the recipe in the model

        recipeView.render(model.state.recipe); // Re-render the updated recipe
        bookmarksView.render(model.state.bookmarks); // Update bookmarks view
        recipeView.showPopupMessage('Recipe was successfully updated!');

        setTimeout(() => {
            editRecipeView._toggleWindow(); // Close the modal after a delay
        }, MODAL_CLOSE_SEC * 1000);

    } catch (err) {
        console.error('Error updating recipe:', err);
        recipeView.renderError(err.message);
    }
};


const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServing(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHanlderClick(controlPagination);
    bookmarksView.addHandlerBookmarks(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
    recipeView.addHandlerRemoveRecipe(controlRemoveRecipe);
    recipeView.addHandlerEdit(controlEditRecipe);
    editRecipeView.addHandlerEditView(controlEditRecipeSubmission);

    window.addEventListener('resize', controlResize);
}

init();