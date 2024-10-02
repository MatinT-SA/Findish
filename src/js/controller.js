import * as model from './model.js';
import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const renderSpinner = function (parentEl) {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
    `;
    parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;  // Exit if there is no id

        renderSpinner(recipeContainer);

        // Fetch the recipe
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        const recipe = data.data.recipe;
        const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img" />
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text">servings</span>
                </div>
            </div>
            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(ing => `
                        <li class="recipe__ingredient">
                            <svg class="recipe__icon">
                                <use href="${icons}#icon-check"></use>
                            </svg>
                            <div class="recipe__quantity">${ing.quantity}</div>
                            <div class="recipe__description">
                                <span class="recipe__unit">${ing.unit}</span>
                                ${ing.description}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
                    directions at their website.
                </p>
                <a class="btn--small recipe__btn" href="${recipe.source_url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>
        `;

        recipeContainer.innerHTML = '';
        recipeContainer.insertAdjacentHTML('afterbegin', markup);
    } catch (err) {
        alert(err.message);
    }
};

// Event Listeners
window.addEventListener('hashchange', showRecipe);
window.addEventListener('load', showRecipe);
