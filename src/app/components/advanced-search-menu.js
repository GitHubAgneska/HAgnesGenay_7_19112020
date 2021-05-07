/* ================================================== */
/* TEMPLATE FOR A SEARCH MENU : button + collapsible menu body  */
/* ================================================== */
import {MenuListItem} from '../components/menu-listItem';
import {RecipeModule} from '../modules/recipes';

export class CollapsingMenu extends HTMLElement{
    constructor(categoryName, categoryElements){
        super();
        this.innerHTML = `
            
            <div class="menu-header" id="menu-header-${categoryName}" isActive="false">
                <button class="btn"
                        id="btn-${categoryName}" 
                        type="button" 
                        aria-expanded="false"
                        aria-controls="${categoryName}">${categoryName}
                </button>
                <i id="caret-down" class="fas fa-angle-down"></i>
            </div>
            <div class="collapse multi-collapse category-menu" id="menu-${categoryName}" isOpen="false">
                <div class="card card-body">
                    <ul id="${categoryName}-list" class="list flex-column">
                    </ul>
                </div>
            </div>
        `;

        this.setAttribute('isActive', 'false');
        let currentSibling = this;
        // parent wrapper ('section .adv-search-wrapper') containing all 3 collapsing menus must be 
        // of width col-6 when menus are closed (50% parent) => each menu : col
        // of width col-12 if a menu is open (100% parent) => open menu: col-6 / others: col-2 ( + empty col-2)
        const parentAdvancedSearchWrapper = document.querySelector('.adv-search-wrapper');
        this.setAttribute('class', 'col'); // each menu : col

        // get UL container for category items 
        const categoryUl = this.querySelector('#' + categoryName + '-list');
        
        // populate each menu container with category list items - DEFAULT VIEW : all recipes categories
        categoryElements.forEach(el => {
            // generate li item element for each item of each category
            let listELement = new MenuListItem(el);
            // add select event on each item
            listELement.addEventListener('click', function(event){selectItemInList(event); }, false);
            categoryUl.appendChild(listELement);
        });

        let menuHeader = this.querySelector('#menu-header-' + categoryName);
        let menuToOpen = this.querySelector('#menu-'+ categoryName);
        let allMenus = [];

        let btn = this.querySelector('button');
        let btnCategoryName = btn.textContent; // retrieve current text btn
        let btnCategoryNameLength = btnCategoryName.length;
        let btnCategoryNameSingular = btnCategoryName.slice(0, btnCategoryNameLength-1);   // ------------------ TO REVIEW
        let btnCategoryNameActive = 'rechercher un ' + btnCategoryNameSingular; // modify btn text


        let caretDown = this.querySelector('#caret-down');
        let caretUp = document.createElement('i');
        caretUp.setAttribute('class', 'fas fa-angle-up');
        caretUp.setAttribute('id', 'caret-up');

        // set up input field that replaces category name inside btn when menu = open
        let searchInputField = document.createElement('input');
        searchInputField.setAttribute('id', 'searchInto-'+ categoryName);
        searchInputField.setAttribute('class', 'searchInput');
        searchInputField.setAttribute('placeholder', 'rechercher un ' + categoryName );
        
        let currentTags = [];

        let activeSibling = [];

        // COLLAPSING MENUS METHODS ================================================================
        // By default, click event = on whole menu Header to OPEN ONLY
        // ( cannot use a TOGGLE method here, for open/close events are passed through different elements
        menuHeader.addEventListener('click', function(event){ menuOpen(event); }, false);
        
        function menuOpen(event) {
            menuHeader = event.currentTarget; // element that handles event
            event.stopPropagation();
            checkWhosOpen();
                    
            // console.log('event.currentTarget when OPENING - 1 ======',event.currentTarget);
            let isMenuActive = menuHeader.getAttribute('isActive');
            if (isMenuActive === 'false' ) {

                    // remove  OPEN event on whole menu header
                    menuHeader.removeEventListener('click',function(event){ menuOpen(event); }, false);
                    menuHeader.removeAttribute('isActive', 'false');
                    menuHeader.setAttribute('isActive', 'true');

                    // activeSibling.push(currentSibling);
                    currentSibling.setAttribute('isActive', 'true');
                    
                    menuToOpen.style.display = 'flex'; // show list
                    // replace btn > caret right away (open > close) + add CLOSE event
                    caretDown.replaceWith(caretUp);
                    caretUp.addEventListener('click',function(event){ menuClose(event); }, false);                                

                    // add click on btn to ACTIVATE INPUT FIELD + change its name ( + remove 's' )
                    btn.textContent = btn.textContent.replace(btn.textContent, btnCategoryNameActive);
                    btn.style.opacity = 0.7;
                    btn.addEventListener('click', function(event){ activateInputField(event), false; }); 

                    parentAdvancedSearchWrapper.classList.replace('col-6', 'col-12'); // parent expands to give space to menu
                    let collapsingMenu = menuHeader.parentNode; // = this whole component
                    collapsingMenu.classList.replace('col', 'col-6'); // menu width expands

                    // return activeSibling;
            }
            else { return; }
        }

        // this event occurs when a menu is open, and its category name btn is clicked : btn is then replaced by an input field
        function activateInputField(event){
            let isMenuActive = menuHeader.getAttribute('isActive');
            if (isMenuActive === 'true' ) {
                menuHeader.removeEventListener('click', function(event){ menuOpen(event); }, false);
                btn = event.currentTarget;
                event.stopPropagation();

                btn.style.display = 'none';
                menuHeader.prepend(searchInputField); // add input field in place of btn
                menuHeader.appendChild(caretUp); // + add caret ( for the other one went away with btn)
                caretUp.addEventListener('click',function(event){ menuClose(event); }, false);

            } else { return; }
        }


        function menuClose(event) {

            event.stopPropagation();
            caretUp = event.currentTarget; // element that handles event
            caretUp.replaceWith(caretDown);
            // console.log('event.currentTarget when CLOSING - 2======',event.currentTarget);

            let isMenuActive = menuHeader.getAttribute('isActive');

            if ( isMenuActive === 'true' ) {

                // remove click on btn that ACTIVATES INPUT FIELD  
                btn.removeEventListener('click', function(){ activateInputField(), false; });

                menuToOpen.style.display = 'none'; // hide list
                menuHeader.removeAttribute('isActive', 'true');
                menuHeader.setAttribute('isActive', 'false');
                
                
                // remove input field  + eventually remaining elements
                if (menuHeader.contains(searchInputField)) {menuHeader.removeChild(searchInputField);}
                if (btn.contains(searchInputField)) {btn.removeChild(searchInputField);}
                // put back btn with category name
                btn.style.display = 'flex';
                btn.textContent = btn.textContent.replace(btnCategoryNameActive, btnCategoryName);
                btn.style.opacity = 1;
                
                // put back event on menu header
                menuHeader.addEventListener('click',function(event){ menuOpen(event); }, false);

                parentAdvancedSearchWrapper.classList.replace('col-12', 'col-6'); // parent shrinks back
                let collapsingMenu = menuHeader.parentNode; // = this whole component
                collapsingMenu.classList.replace('col-6', 'col'); // menu width shrinks back
                
            } else { return; }
        }

        function checkWhosOpen(){
            const parentSection = document.querySelector('.adv-search-wrapper');
            let siblings = parentSection.childNodes;
            siblings.forEach(sibling => {

                if(sibling.getAttribute('isActive')){
                    activeSibling.push(sibling);
                }
                return activeSibling;
            });
            console.log('activeSibling', activeSibling);
        }


        // HANDLE SEARCH OF ADVANCED SEARCH ==================================================
        let searchTerm = '';

        // handle select item in list : send it into input field
        function selectItemInList(event) {
            let word = event.target.innerText; // text inside <p> element where event occurs
            // activate field input 'artificially' via btn
            btn.click(event); 
            let inputField = document.querySelector('#searchInto-'+ categoryName);
            inputField.value = word; // make selected word the current search word of input field
        }

        // let advancedSearchResults = [];
        // when user has selected an item in category or typed it in in INPUT FIELD 
        searchInputField.addEventListener('keydown', function(event){
            searchTerm = event.target.value;
            searchInputField = event.target;

            // retrieve current category from input id  ( ex '#searchInto-ingredients')
            let currentCategoryName = searchInputField.getAttribute('id');
            currentCategoryName = currentCategoryName.slice(11, currentCategoryName.length);
            console.log('currentCategoryName', currentCategoryName);

            // init suggestions from list ( = search in existing items of CURRENT CATEGORY)
            if ( searchTerm.length >= 3 ) { // launch search from 3 chars to make suggestions
                console.log('searchTerm is 3 chars long');
            }

            // and then CONFIRM CHOICE by pressing ENTER:
            if ( event.key === 'Enter') {
                // a new tag for search word is generated above menus
                // ( check first if exists already )
                let currentTags = getTagsList();
                if ( !currentTags.includes(searchTerm) ) {
                    let searchItemTag = createTag(searchTerm);
                    initTagsWrapper();
                    let tagsWrapper = document.querySelector('#tagsWrapper');
                    tagsWrapper.appendChild(searchItemTag);
                    setTagsList(searchTerm);
                }
                // launch search for term in current results
                RecipeModule.processAdvancedSearch(searchTerm, currentCategoryName);

            }
        });

        // keep track of tags to prevent displaying the same one more than once
        // AND is used by search method that needs an up-to-date array of
        let setTagsList = function(tag) { currentTags.push(tag); };
        let getTagsList = function() { return currentTags; };

        // handle suggestions for manual typing


        // create WRAPPER FOR TAGS to come : happens ONCE with 1st list item selection or typed word
        function initTagsWrapper() {
            if (!parentAdvancedSearchWrapper.contains(document.querySelector('#tagsWrapper'))) {
                let tagsWrapper = document.createElement('div');
                tagsWrapper.setAttribute('id', 'tagsWrapper');
                tagsWrapper.setAttribute('class', 'tagsWrapper');
                parentAdvancedSearchWrapper.prepend(tagsWrapper); // insert in 1st position
            }
            else { return; }
        }

        // create new tag
        function createTag(searchTerm) { 
            let searchItemTag = document.createElement('div');
            searchItemTag.setAttribute('class', 'searchTag');
            searchItemTag.setAttribute('id', 'searchTag-' + searchTerm );
            let tagCloseIcon = document.createElement('i');
            tagCloseIcon.setAttribute('class', 'fa fa-times-circle-o');
            tagCloseIcon.setAttribute('id', 'close-'+ searchTerm);
            let tagText = document.createTextNode(searchTerm);
            searchItemTag.appendChild(tagText);
            searchItemTag.appendChild(tagCloseIcon);
            tagCloseIcon.addEventListener('click', function(event) { removeTag(event);}, false);
            return searchItemTag;
        }

        // delete tag (via icon)
        function removeTag(event) {
            event.stopPropagation();
            let closeIcon = document.querySelector('#close-'+ searchTerm);
            closeIcon = event.currentTarget;
            let tagToRemove = closeIcon.parentNode;
            let tagsWrapper = document.querySelector('#tagsWrapper');
            tagsWrapper.removeChild(tagToRemove);
        }
    }
}

// register custom element in the built-in CustomElementRegistry object
customElements.define('collapsing-menu-component', CollapsingMenu);

