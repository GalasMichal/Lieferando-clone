loadBasket();

function renderAll() {
    renderCards();
    renderBasket();

}

function renderCards() {

    document.getElementById('cardContent').innerHTML = '';
    for (let i = 0; i < restaurants.length; i++) {
        const restaurant = restaurants[i];
        document.getElementById('cardContent').innerHTML += renderCardsHTML(restaurant, i);
        renderFoodcard(restaurant, i);

    }
}

function renderCardsHTML(restaurant, i) {

    return /*html*/ `
        <div id="card${i}" class="card">
            <div >
              <img class="foodImage" src="${restaurant['menuImage']}" alt="" />
            </div>
            <div class="menuName"><span>${restaurant['name']}</span></div>
            <div class="foodContainer" id="foodContainer${i}">

            </div>
              
            </div>
          </div>
    `
}

function renderFoodcard(restaurant, i) {

    let food = document.getElementById(`foodContainer${i}`);
    for (let c = 0; c < restaurant['menu'].length; c++) {
        const menu = restaurant['menu'][c];
        const description = restaurant['descryption'][c];
        const price = restaurant['prices'][c];
        const priceString = numberToString(restaurant['prices'][c]);
        food.innerHTML += generateFoodCardHTML(menu, description, price, i, priceString, c);

    }
}

function generateFoodCardHTML(menu, description, price, i, priceString, c) {

    return /*html*/ `
        <div onclick="addToBasket('${menu}', ${price})" id="foodcard${i}${c}" class="foodcard">
            <div id="foodName${i}${c}" class="foodName">
                ${menu}
                <img src="img/icons/plus-taste.png" alt="plus" />
            </div>
            <div id="foodDescryption${i}${c}" class="foodDescryption">${description}</div>
            <div id="foodPrice${i}${c}" class="foodPrice"> ${priceString} €</div>
        </div>
              	`
}

function numberToString(price) {

    return price.toLocaleString('de-DE', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function addToBasket(menu, price) {
    
    let j = getMenuIndex(menu);
    if (j == -1) {
        menus.push(menu);
        prices.push(price);
        amounts.push(1);
    }
    else {
        amounts[j]++;
    }
    renderBasket();
}

function getMenuIndex(full) {
    let index = menus.indexOf(full);
    return index;
}

function renderBasket() {
    
    let basket = document.getElementById('basket');
    basket.innerHTML = '';
    for (let k = 0; k < menus.length; k++) {
        const menu = menus[k];
        const price = prices[k];
        const amount = amounts[k];
        priceString = numberToString(amounts[k]);
        const result = calculateBasket(k);
        resultString = numberToString(result);

        basket.innerHTML += basketHTML(menu, resultString, amount, k), saveBasket();

    }
    sumPrices();
}



function basketHTML(menu, resultString, amount, k) {
    return /*html*/ `
        
        <tr id="basketTable${k}">
              <td id="tableAmount${k}"> ${amount} </td>
              <td id="tableMenu${k}"> ${menu}   </td>
              <td id="tablePrice${k}">${resultString} €</td>
              <td> 
                <img onclick="addFood(${k})" id="basketPlus${k}" class="basketImg" src="img/icons/plus.png" alt="plus">
                <img onclick="removeFood(${k})" id="basketMinus${k}" class="basketImg" src="img/icons/minus.png" alt="minus">
              </td>
              </tr>
                            
            `
}

function calculateBasket(k) {
    let num1 = amounts[k];
    let numb2 = prices[k];
    let numb3 = num1 * numb2;
    return numb3;
}

function sumPrices() {

    let sum = 0

    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];
        const amount = amounts[i];
        sum = (price * amount) + sum;
    }


    let sum1 = sum;
    sum1 = numberToString(sum);
    let sum2 = sum + 3.50;
    sum2 = numberToString(sum2);

    document.getElementById('mobileButton').innerHTML = `Warenkorb ${sum1} €`;
    document.getElementById('sum').innerHTML = `${sum2}`;




}

function addFood(k) {
    amounts[k]++;
    renderBasket();
}

function removeFood(k) {
    if (amounts[k] == 1) {
        menus.splice(k, 1);
        prices.splice(k, 1);
        amounts.splice(k, 1);
    }
    else {
        amounts[k]--;
    }
    saveBasket();
    renderBasket();
}

function saveBasket() {
    let menu = JSON.stringify(menus);
    let price = JSON.stringify(prices);
    let amount = JSON.stringify(amounts);

    localStorage.setItem('menus', menu);
    localStorage.setItem('prices', price);
    localStorage.setItem('amounts', amount);
}

function loadBasket() {
    if (localStorage.getItem('menus') !== null) {
        let menu = localStorage.getItem('menus');
        let price = localStorage.getItem('prices');
        let amount = localStorage.getItem('amounts');

        menus = JSON.parse(menu);
        prices = JSON.parse(price);
        amounts = JSON.parse(amount);
    }
}

function OrderComplete() {
    let orderCompl = document.getElementById('orderComplete');
    orderCompl.classList.remove('d-none');

    menus.length = 0;
    prices.length = 0;
    amounts.length = 0;
    saveBasket();
    renderBasket();
}

function closeOrder() {
    let closeOrder = document.getElementById('orderComplete');
    closeOrder.classList.add('d-none');
    toggleBasketView('add', 'remove');
  
    
}

function toggleBasketView(desktop, mobile) {
    document.getElementById('basketContainer').classList[desktop]('basketContainer');
    document.getElementById('basketContainer').classList[mobile]('basketAbsolute');
}