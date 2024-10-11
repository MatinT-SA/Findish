import icons from 'url:../../img/icons.svg';
import View from "./View.js";

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1 and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupNextButton(curPage);
        }

        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkupPrevButton(curPage);
        }

        // Other pages
        if (curPage < numPages) {
            return `
        ${this._generateMarkupPrevButton(curPage)}
        ${this._generateMarkupNextButton(curPage)}
      `;
        }

        // Page 1, and no other pages
        return '';
    }

    _generateMarkupPrevButton(curPage) {
        return `
            <button class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
    `;
    }

    _generateMarkupNextButton(curPage) {
        return `
            <button class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
    `;
    }
}

export default new PaginationView();
