let items = [
];

class ShoppingList {
    constructor(items = items) {
        this.items = items;
        this.$form = document.getElementById("shop-form");
        this.$input = document.getElementById("item-input");
        this.$itemsList = document.getElementById("items-list");
        this.$form.addEventListener("submit", (e) => this.onSubmit(e));
    }

    getItems() {
        console.log(this.items)
    }

    createElement(item) {
        if (item !== undefined) {
            const itemName = item.name,
                itemIndex = item.index,
                element = `<li data-index=${itemIndex}>${itemName}</li>`;

            this.$itemsList.insertAdjacentHTML("beforeend", element);
        }
    }

    addItem(x) {
        if (x !== '') {
            this.items.push({index: this.items.length++, name: x, description: 'losowy opis'});
        }
    }

    destroyList() {
        while(this.$itemsList.firstChild) {
            this.$itemsList.firstChild.remove();
        }
    }

    createList() {
        for (let i = 0; i < this.items.length; i++) {
            console.log(this.items[i]);
            this.createElement(this.items[i])
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.addItem(e.target[0].value);
        this.destroyList();
        this.createList(items);
    }
}

let shoppingList = new ShoppingList(items);

const $shopping = document.getElementById("shopping-wrapper"),
    $form = document.getElementById("shop-form"),
    $input = document.getElementById("item-input"),
    $itemsList = document.getElementById("items-list");

function createElement(targetElement, item) {
    if (item) {
        let itemName = item.name,
            itemIndex = item.index,
            para = document.createElement("li"),
            node = document.createTextNode(itemName);

        para.dataset.index = itemIndex;

        para.appendChild(node);

        targetElement.appendChild(para);
    }
}

function createShoppingList(items) {
    for (let i = 0; i <= items.length; i++) {
        console.log(items[i]);

        createElement($itemsList, items[i])
    }
}

// createElement($items, 'Nowy element');

function addItem(e) {
    e.preventDefault();
    console.log(e);

    if (e.target[0].value) {
        items.push({index: items.length++, name: e.target[0].value, description: 'losowy opis'});
    }
    $itemsList.remove();


    let para2 = document.createElement("ul");
    para2.id = "items-list";

    $shopping.appendChild(para2);




    createShoppingList(items);
}

// $form.addEventListener("submit", (e) => addItem(e));
