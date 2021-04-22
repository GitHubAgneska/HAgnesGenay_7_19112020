/* ================================================== */
/* TEMPLATE FOR MAIN SEARCHBAR */
/* ================================================== */

export class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = 
            `<div class="input-group">
                <div class="form-outline">
                    <input type="search" id="form1" class="form-control" />
                    <label class="form-label" for="form1">Search</label>
                </div>
                <button type="button" class="btn btn-primary">
                    <i class="fas fa-search"></i>
                </button>
            </div>`;
    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('searchbar-component', SearchBar);