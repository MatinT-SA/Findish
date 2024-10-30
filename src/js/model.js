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

const extractIngredients = (recipeData) => {
    return Object.entries(recipeData)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if (ingArr.length !== 3) {
                throw new Error('Wrong ingredient format! Please use the correct format');
            };

            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });
};

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = extractIngredients(newRecipe); // Use the utility function

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl, // Check if sourceUrl is set correctly
            image_url: newRecipe.image, // Check if image is set correctly
            publisher: newRecipe.publisher, // Check if publisher is set correctly
            cooking_time: +newRecipe.cookingTime, // Ensure this is being converted to a number
            servings: +newRecipe.servings, // Ensure this is being converted to a number
            ingredients,
        };

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

// Assuming your model looks something like this
export const updateRecipe = async function (recipeId, updatedRecipe) {
    try {
        console.log('Updating recipe with data:', updatedRecipe);
        const ingredients = extractIngredients(updatedRecipe); // Use the utility function

        const recipe = {
            title: updatedRecipe.title,
            source_url: updatedRecipe.sourceUrl, // Check if sourceUrl is set correctly
            image_url: updatedRecipe.image, // Check if image is set correctly
            publisher: updatedRecipe.publisher, // Check if publisher is set correctly
            cooking_time: +updatedRecipe.cookingTime, // Ensure this is being converted to a number
            servings: +updatedRecipe.servings, // Ensure this is being converted to a number
            ingredients,
        };

        const data = await AJAX(`${API_URL}/${recipeId}?key=${API_KEY}`, recipe, 'PUT');
        // Update the state with the new data
        state.recipe = data;
    } catch (error) {
        throw error; // Handle the error accordingly
    }
};
