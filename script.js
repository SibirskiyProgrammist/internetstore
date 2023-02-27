'use strict';

let content = document.getElementById('content');
let pageOfDescription = document.querySelector('#longdescription');


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

function searchProducts(json){
    let categories = [];
    for(let product of json.products){
        if(categories.indexOf(product['category']) == -1){
            categories.push( product['category']);
        }
    }
    // console.log(categories);

    for(let category of categories){
        content.innerHTML += `<h1>${category.toUpperCase()}</h1>`;
        for(let product of json.products){
            if(category != product.category) {continue;}
            content.innerHTML += `
                <div class="card">
                    <h3>Название: ${product.title}</h3>
                    <img class="image" src="${product.thumbnail}">
                    <span>${product.description}</span><br>
                    <span class="price">${product.price}$</span>
                    <span>Рейтинг: ${product.rating}</span>
                    <button class="buy">Купить</button>
                </div>
                <br><br><br>
            `;
        }
        content.innerHTML += '<br><br><br>';
    }
}

function descriptionOfProducts(json){
    let card = document.querySelectorAll('.card');
    for(let i = 0; i < card.length; i++){
        card[i].addEventListener("click", function(){
            for (const product of json.products) {
                if(product.id == i + 1){
                    content.innerHTML = `<div class="desc">
                    <button class="goback">Назад</button>
                    <img class="imagedesc" src=${product.thumbnail}>
                    <h3>Название товара: ${product.title}</h3>
                    <span>Бренд: ${product.brand}</span><br>
                    <span>Описание: ${product.description}</span><br>
                    <span>Скидка: ${product.discountPercentage}%</span><br>
                    <span>Оценка: ${product.price}</span><br>
                    <span class="stock">В запасе ${product.stock} штук</span>
                    <button class="buyproduct">Купить</button>
                    </div>`;
                    let goBackButton = document.querySelector('.goback');
                    goBackButton.addEventListener("click", function(){
                        content.innerHTML = "";
                        jsonSearch();
                    })
                }
            }
        })
    }
}