'use strict';

let content = document.getElementById('content');
let pageOfDescription = document.querySelector('#longdescription');
let cart = document.getElementById('cartitems');
let cartButton = document.getElementById('cart');
let searchField = document.getElementById('searchfield');
let searchContent = document.getElementById('searchcontent');
let cost = document.querySelector(".cost");
let items = [];


searchField.addEventListener('input', function(){
    if(searchField.value != ""){
    fetch("https://dummyjson.com/products/search?q=" + searchField.value).then(res => res.json())
    .then(json => {
        
        for(let product of json.products){
            
                content.style.display = 'none';
                searchContent.style.display = 'block';
                searchContent.innerHTML = `
                    <br>
                    <div class="card">
                        <h3>Название: ${product.title}</h3>
                        <img class="image" src="${product.thumbnail}">
                        <span>${product.description}</span><br>
                        <span class="price">${product.price}$</span>
                        <span>Рейтинг: ${product.rating}</span>
                        <button class="buy" data-id="${product.id}">Купить</button>
                    </div>
                    <br><br><br>
                `;
            }
        });
    }
    else{
        content.style.display = 'block';
        searchContent.style.display = 'none';
    }
})

function jsonSearch(){
    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(json => {
        // console.log(json);
        searchProducts(json);
        descriptionOfProducts(json);
    });
}

jsonSearch();

function searchProducts(data){
    let categories = [];
    for(let product of data.products){
        if(categories.indexOf(product['category']) == -1){
            categories.push( product['category']);
        }
    }
    content.innerHTML = "";
    // console.log(categories);
    for(let category of categories){
        content.innerHTML += `<h1>${category.toUpperCase()}</h1>`;
        for(let product of data.products){
            if(category != product.category) {continue;}
            content.innerHTML += `
                <div class="card">
                    <h3>Название: ${product.title}</h3>
                    <img class="image" src="${product.thumbnail}">
                    <span>${product.description}</span><br>
                    <span class="price">${product.price}$</span>
                    <span>Рейтинг: ${product.rating}</span>
                    <button class="buy" data-id="${product.id}">Купить</button>
                </div>
                <br><br><br>
            `;
        }
        content.innerHTML += '<br><br><br>';
    }

    let buttons = document.querySelectorAll(".buy");
    buttons.forEach(el =>
        el.addEventListener("click", function(){
            for(let product of data.products){
                if(product.id == el.dataset.id){
                    let baskObj = {id: product.id, quantity: 1,};
                    items.push(baskObj);
                }
            }
            console.log(items);
        })
    )

    document.querySelector("#cart").addEventListener("click", function(){
        content.style.display = 'none';
        cart.style.display = 'block';
        cost.style.display = 'block';
        if(items.length != 0){
            fetch('https://dummyjson.com/carts/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: 1,
                    products: items,
                })
            }).then(res => res.json())
            .then(json => cartInfo(json))
            .catch(err => console.log(err));
        }
        else{
            alert("Корзина пустая!");
        }
        fetch('https://dummyjson.com/carts/1', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                products: items,
                userId: 1,
            })
        }).then(res => res.json())
        .then(json => cartInfo(json))
        .catch(err => console.log(err));
    })
}

function cartInfo(json){
    console.log(json);
    let price = 0;
    let goBackButton = document.querySelector(".gofromcart");
    goBackButton.style.display = "flex";

    cart.innerHTML = "";

    goBackButton.addEventListener("click", function(){
        cart.style.display = 'none';
        content.style.display = 'block';
        cost.style.display = 'none';
    })

    let i = 1;
    for(let product of json.products){
        cart.innerHTML += `
            <div class="merchandise">
                <h3>Название: ${product.title}</h3>
                <span>Цена: ${product.price}</span>
                <br>
                <span>Цена со скидкой: ${product.discountedPrice}</span>
                <br>
                <button class="remove" data-id="${i}">-</button>
            </div>
            <br><br><br>
        `
        price += Number(product.discountedPrice);
        i++;
    }
    let removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach(el =>
        el.addEventListener("click", function(){
            for(let i = 0; i < items.length; i++){
                if(el.dataset.id == (items.length - i)){
                    items.splice(items[i], 1);
                }
            }
        })
    )

    cost.innerHTML = `Итоговая цена == ${price}$`;
}

function descriptionOfProducts(json){
    let card = document.querySelectorAll('.card');
    let images = document.querySelectorAll('.image');

    for(let i = 0; i < card.length; i++){
        images[i].addEventListener("click", function(){
            for (const product of json.products) {
                if(product.id == i + 1){
                    document.querySelector('#cart').style.display = 'none';
                    searchField.style.display = 'none';

                    content.innerHTML = `<div class="desc">
                    <button class="goback">Назад</button>
                    <img class="imagedesc" src=${product.thumbnail}>
                    <h3>Название товара: ${product.title}</h3>
                    <span>Бренд: ${product.brand}</span><br>
                    <span>Описание: ${product.description}</span><br>
                    <span>Скидка: ${product.discountPercentage}%</span><br>
                    <span>Оценка: ${product.price}</span><br>
                    <span class="stock">В запасе ${product.stock} штук</span>
                    <button class="buyproduct" dataset="${product.id}">Купить</button>
                    </div>`;
                    
                    document.querySelector(".buyproduct").addEventListener("click", function(){
                        let baskObj = {id: product.id, quantity: 1,}
                        items.push(baskObj);
                        console.log(items);
                    })

                    let goBackButton = document.querySelector('.goback');
                    goBackButton.addEventListener("click", function(){
                        document.querySelector('#cart').style.display = 'flex';
                        document.querySelector('.carttitle').style.display = 'none';
                        document.querySelector('.gofromcart').style.display = 'none';
                        searchField.style.display = "block";
                        content.innerHTML = "";
                        jsonSearch();
                    })
                }
            }
        })
    }
}