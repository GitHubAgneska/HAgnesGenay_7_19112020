/* ================================================== */
/* RECIPE TEMPLATE  */
/* ================================================== */
export class CardTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = 
            `
            <div class="card" style="width: 18rem;">
                <img src="" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            `;
    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('card-component', CardTemplate);


