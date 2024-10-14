import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`);

        const { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        };
    } catch (error) {
        console.error(`${error} 🛑`);
        throw error;
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
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

export const addBookmark = function (recipe) {
    // add bookmark
    state.bookmarks.push(recipe);

    // mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}