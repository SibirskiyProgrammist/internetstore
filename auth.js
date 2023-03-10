"use strict";

let loginButton = document.querySelector("#loginlink");
let authButton = document.querySelector("#authlink");
let loginPage = document.querySelector(".login");
let authPage = document.querySelector(".auth");
let goBackToMainPage = document.querySelector(".goback");
let buttons = document.querySelectorAll(".link");
let createAccount = document.querySelector(".createaccount");
let users = [];
let localstorage = {};

authButton.addEventListener("click", function(){
    for(let i = 0; i < buttons.length; i++){
        buttons[i].style.display = 'none';
    }
    authPage.style.display = 'block';
    document.querySelector('#content').style.display = 'none';
    document.querySelector('#searchfield').style.display = 'none';
    document.querySelector('#cart').style.display = 'none';
    goBackToMainPage.style.display = 'flex';

    createAccount.addEventListener('click', function(){
        let authField = document.querySelector("#authField");
        let passField = document.querySelector("#authPasswordField");
    
        users = {username: authField.value, password: passField.value,}


        fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
        })
        .then(res => res.json())
        .then(console.log);

        document.querySelector('#content').style.display = 'block';
        document.querySelector('#searchfield').style.display = 'block';
        document.querySelector('#cart').style.display = 'block';
        goBackToMainPage.style.display = 'none';
        authPage.style.display = 'none';
        for(let i = 0; i < buttons.length; i++){
            buttons[i].style.display = 'block';
        }
    });

    goBackToMainPage.addEventListener('click', function(){
        document.querySelector('#content').style.display = 'block';
        document.querySelector('#searchfield').style.display = 'block';
        document.querySelector('#cart').style.display = 'block';
        goBackToMainPage.style.display = 'none';
        authPage.style.display = 'none';
        for(let i = 0; i < buttons.length; i++){
            buttons[i].style.display = 'block';
        }
    })
})