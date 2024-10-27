import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup strings instead of rendering to the DOM 
     * @returns {undefined | string} if render=false, a markup string is returned
     * @this {Object} View instance
     * @author Matin Taherzadeh
     */

    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Update changed text
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Update changed attributes
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
            `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

        this.spinnerElement = this._parentElement.querySelector('.spinner');
    }

    clearSpinner() {
        if (this.spinnerElement) {
            this.spinnerElement.remove();
            this.spinnerElement = null;
        }
    }

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="alert alert-error">
                <div class="alert-icon">
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <div class="alert-content alert-error">
                    <p>${message}</p>
                </div>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._successMessage) {
        const markup = `
            <div class="alert alert-success">
                <div class="alert-icon">
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <div class="alert-content alert-success">
                    <p>${message}</p>
                </div>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    showPopupError(message = this._errorMessage) {
        const popup = document.createElement('div');
        popup.classList.add('popup', 'popup-error');
        popup.innerHTML = `
            <div class="popup-icon">
                <svg>
                <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <div class="popup-message">${message}</div>
            `;
        document.body.appendChild(popup);
        this._autoRemovePopup(popup);
    }

    showPopupMessage(message = this._successMessage) {
        const popup = document.createElement('div');
        popup.classList.add('popup', 'popup-success');
        popup.innerHTML = `
            <div class="popup-icon">
                <svg>
                    <use href="${icons}#icon-check"></use>
                </svg>
            </div>
            <div class="popup-message">${message}</div>
            `;
        document.body.appendChild(popup);
        this._autoRemovePopup(popup);
    }

    _autoRemovePopup(popup) {
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }
}
