import { API_URL, RES_PER_PAGE_DEFAULT, RES_PER_PAGE_MEDIUM, RES_PER_PAGE_SMALL, API_KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE_DEFAULT,
        page: 1,
    },
    bookmarks: [],
};

export const adjustResultsPerPage = function () {
    const width = window.innerWidth;
    if (width < 600) {
        state.search.resultsPerPage = RES_PER_PAGE_SMALL;
        return;
    }
    if (width < 780) {
        state.search.resultsPerPage = RES_PER_PAGE_MEDIUM;
        return;
    }
    state.search.resultsPerPage = RES_PER_PAGE_DEFAULT;
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch (error) {
        throw error;
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });

        state.search.page = 1;
    } catch (error) {
        console.error(`${error} 🛑`);
        throw error;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

const presistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
    // add bookmark
    state.bookmarks.push(recipe);

    // mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    presistBookmarks();
}

export const removeBookmark = function (id) {
    // remove bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // unmark current recipe as bookmark
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    presistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}
clearBookmarks();

const createRecipeData = function (recipeInput) {
    const ingredients = Object.entries(recipeInput)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if (ingArr.length !== 3) {
                throw new Error('Wrong ingredient format! Please use the correct format');
            }
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });

    return {
        title: recipeInput.title,
        source_url: recipeInput.sourceUrl,
        image_url: recipeInput.image,
        publisher: recipeInput.publisher,
        cooking_time: +recipeInput.cookingTime,
        servings: +recipeInput.servings,
        ingredients,
    };
};

export const uploadRecipe = async function (newRecipe) {
    try {
        const recipe = createRecipeData(newRecipe);
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe, 'POST');
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}

export const removeRecipe = async function (recipeId) {
    try {
        // Send DELETE request to the server to remove the recipe
        await AJAX(`${API_URL}/${recipeId}?key=${API_KEY}`, undefined, 'DELETE');

        // Remove the recipe from local state
        if (state.recipe && state.recipe.id === recipeId) {
            state.recipe = null;
        }

        // Also remove from bookmarks if it exists there
        state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== recipeId);

        // Update bookmarks in local storage if necessary
        presistBookmarks();

        // Return a success indicator
        return true;
    } catch (error) {
        // Handle error gracefully without throwing
        if (error.message.includes('404')) {
            return false;
        }
        return false;
    }
};

export const editRecipe = async function (recipeId, updatedRecipe) {
    try {
        const recipe = createRecipeData(updatedRecipe);
        // Send PUT/PATCH request to update the recipe on the server
        const data = await AJAX(`${API_URL}/${recipeId}?key=${API_KEY}`, recipe, 'PUT');

        // Update the state with the new recipe data
        state.recipe = createRecipeObject(data);

        // If the recipe is bookmarked, update it in the bookmarks as well
        const bookmarkIndex = state.bookmarks.findIndex(bookmark => bookmark.id === recipeId);
        if (bookmarkIndex !== -1) state.bookmarks[bookmarkIndex] = state.recipe;

        // Persist updated bookmarks to local storage if needed
        presistBookmarks();

        return true; // Return success indicator
    } catch (err) {
        console.error('Failed to edit recipe:', err);
        throw err; // Throw error to handle it in the UI if necessary
    }
};
