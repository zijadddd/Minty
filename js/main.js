let counterForNewsMessage = 0;
let root = false;

document.querySelector('#header__news-feed').innerHTML = 
    `<i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i> 
    &nbspPomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.`;

setInterval(() => {
    let message = document.querySelector('#header__news-feed');

    const messages = [
        '&nbspPomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.',
        '&nbspPorcija u svakoj ruci.',
        '&nbspBudi inspiriran da napraviš razliku komad po komad pizze.',
        '&nbspNaša misija je stvoriti zdravije društvo povezujući ljude s pravom hranom.',
        '&nbspŽelite vidjeti source kod naše stranice ? Nema problema, pritisnite&nbsp<a href="https://github.com/zijadddd/Minty" class="links">ovdje</a> !'
    ];

    message.innerHTML = `<i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i> `
                        + messages[(counterForNewsMessage = (counterForNewsMessage+1) % messages.length)];
}, 5000);

fetch('https://ptf-web-dizajn-2022.azurewebsites.net/api/Food')
.then(res => {
    if(!res.ok) {
        throw Error('[GRESKA] Dogodila se greska.');
    } 
    return res.json();
})
.then(data => {
    const cardList = document.querySelector('#food__cards');
    let cards = '';

    data.forEach(element => {
        cards += `
            <div class="card" style="width: 18rem; height: auto; margin: 0 20px; margin-top: 20px;" id="${element.id}">
                <img src="${element.imageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 13rem;" id="card__image">
                <div class="card-body">
                    <h5 class="card-title text-dark" id="card-body__name">${element.name}</h5>
                    <div>Price: <p class="card-text text-dark" id="card-body__price">${element.price}</p> $</div>
                    <a type="button" class="btn cards__root-buttons text-light" data-bs-toggle="modal" data-bs-target="#edit-food-form" data-bs-whatever="${element.id}" id="cards__root-buttons-edit"><i class="fa-solid fa-pen"></i> Edit</a>
                    <button href="" class="btn cards__root-buttons" onclick="deleteFood(this)" id="cards__root-buttons-delete"> <span class="text-light"><i class="fa-solid fa-trash-can"></i> Delete</span></button>
                    <button href="" class="btn btn-main card-body__add-to-cart" onclick="putFoodInOrder(this)"><span class="text-light"><i class="fa-solid fa-cart-arrow-down"></i> Add to cart</span></button>
                </div>
            </div>                    
        `
    })

    cardList.innerHTML = cards; 
})

const loginCheck = () => {
    let loginUsername = document.querySelector('#username').value;
    let loginPassword = document.querySelector('#password').value;

    if (loginUsername === 'root') {
        if (loginPassword === 'root') {
            document.querySelector('#login-form-close-button').click();
            rootControls();
            popup('Uspješno ste prijavljeni !');
            document.querySelector('#modal-body__login-form').reset();
        } else {
            let warningMessage = document.querySelector('#warning-message');
            warningMessage.style.display = 'block';
            warningMessage.innerText = 'Nepravilna lozinka.';
        }
    } else {
        let warningMessage = document.querySelector('#warning-message');
        warningMessage.style.display = 'block';
        warningMessage.innerText = 'Nepravilan username';
    }
}

const hideWarningMessage = () => {
    let warningMessage = document.querySelector('#warning-message');
    warningMessage.style.display = 'none';
}

const rootControls = () => {
    let cards = document.querySelectorAll('.cards__root-buttons');
    let orderFoodButtons = document.querySelectorAll('.card-body__add-to-cart');
    document.querySelector('#food__root-button').style.display = 'block';
    document.querySelector('#navbar-collapse__login-button').style.display = 'none';
    document.querySelector('#navbar-collapse__logout-button').style.display = 'inline-block';
    document.querySelector('#food__order-button').style.display = 'none';

    for (let i = 0; i < orderFoodButtons.length; i++) {
        orderFoodButtons[i].style.display = 'none';
    }

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'inline-block';
    }

    root = true;
}

const logout = () => {
    let cards = document.querySelectorAll('.cards__root-buttons');
    let orderFoodButtons = document.querySelectorAll('.card-body__add-to-cart');
    document.querySelector('#food__root-button').style.display = 'none';;
    document.querySelector('#navbar-collapse__login-button').style.display = 'inline-block';
    document.querySelector('#navbar-collapse__logout-button').style.display = 'none';
    document.querySelector('#food__order-button').style.display = 'block';

    for (let i = 0; i < orderFoodButtons.length; i++) {
        orderFoodButtons[i].style.display = 'block';
    }

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'none';
    }

    popup('Uspješno ste odjavljeni !');
    root = false;
}

const popup = (message) => {
    let popup = document.querySelector('#info-pop-up');

    popup.innerText = message;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

const errorPopup = (message) => {
    let popup = document.querySelector('#error-pop-up');

    popup.innerText = message;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

const deleteFood = (food) => {
    let foodId = food.parentElement.parentElement.id;
    
    fetch(`https://ptf-web-dizajn-2022.azurewebsites.net/api/Food/${foodId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            console.log(`Status code: ${res.status}`);
            
            let foodCard = document.getElementById(foodId);
            foodCard.remove();
            popup(`Hrana sa ID-em ${foodId} je uspješno obrisana !`);
        } else {
            errorPopup(`Nije moguce obrisati hranu sa ID-em ${foodId}`);
        }
    })
}

let editFoodForm = document.querySelector('#edit-food-form');
let foodId = 0;
editFoodForm.addEventListener('show.bs.modal', (event) => {
    let editRootButton = event.relatedTarget;
    foodId = editRootButton.getAttribute('data-bs-whatever');
});

const editFood = () => {
    let foodName = document.querySelector('#food-edit-name').value;
    let foodPrice = document.querySelector('#food-edit-price').value;
    let foodImageUrl = document.querySelector('#food-edit-imageUrl').value;

    document.querySelector('#edit-food-close-button').click();
    document.querySelector('#modal-body__edit-food-form').reset();

    fetch('https://ptf-web-dizajn-2022.azurewebsites.net/api/Food', {
        method: 'PUT', 
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            id: foodId,
            name: foodName,
            price: foodPrice,
            imageUrl: foodImageUrl
        })
    })
    .then(res => {
        if (res.ok) {
            console.log(`Status code: ${res.status}`);

            let foodCard = document.getElementById(foodId);
            foodCard.children[1].firstElementChild.innerText = foodName;
            foodCard.children[1].children[1].innerText = `Price: ${foodPrice} KM`;
            foodCard.children[0].src = foodImageUrl;

            popup(`Hrana sa ID-em ${foodId} je uspješno uređena !`);
        } else {
            errorPopup('Nije moguće urediti hranu !');
        }
    })
}

const addFood = () => {
    let foodCards = document.querySelector('#food__cards');
    let lastFoodId = 0;

    for (let i = 0; i < foodCards.children.length; i++) {
        if (!document.getElementById(i)) {
            lastFoodId = i;
            break;
        } else {
            lastFoodId = foodCards.children.length;
        }           
    }

    let foodAddedName = document.querySelector('#food-add-name').value;
    let foodAddedPrice = document.querySelector('#food-add-price').value;
    let foodAddedImageUrl = document.querySelector('#food-add-imageUrl').value;

    document.querySelector('#add-food-close-button').click();
    document.querySelector('#modal-body__add-food-form').reset();

    fetch('https://ptf-web-dizajn-2022.azurewebsites.net/api/Food', {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            id: lastFoodId,
            name: foodAddedName,
            price: foodAddedPrice,
            imageUrl: foodAddedImageUrl
        })
    })
    .then(res => {
        if (res.ok) {
            console.log(`Status code: ${res.status}`);

            let card = `
                <div class="card" style="width: 18rem; height: auto; margin: 0 20px; margin-top: 20px;" id="${lastFoodId}">
                    <img src="${foodAddedImageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 13rem;" id="card__image">
                    <div class="card-body">
                        <h5 class="card-title text-dark" id="card-body__name">${foodAddedName}</h5>
                        <div>Price: <p class="card-text text-dark" id="card-body__price">${foodAddedPrice}</p> KM</div>
                        <a type="button" class="btn cards__root-buttons text-light" data-bs-toggle="modal" data-bs-target="#edit-food-form" data-bs-whatever="${lastFoodId}" id="cards__root-buttons-edit"><i class="fa-solid fa-pen"></i> Edit</a>
                        <button href="" class="btn cards__root-buttons" onclick="deleteFood(this)" id="cards__root-buttons-delete"> <span class="text-light"><i class="fa-solid fa-trash-can"></i> Delete</span></button>
                        <button href="" class="btn btn-main card-body__add-to-cart" onclick="putFoodInOrder(this)" style="display: none;"><span class="text-light"><i class="fa-solid fa-cart-arrow-down"></i> Add to cart</span></button>
                    </div>
                </div>                    
            `;

            foodCards.innerHTML += card;

            let cards = document.querySelectorAll('.cards__root-buttons');
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.display = 'inline-block';
            }

            popup(`Hrana sa ID-em ${lastFoodId + 1} je uspješno dodana !`);
        } else {
            errorPopup('Nije moguće dodati hranu !');
        }
    })
}

const putFoodInOrder = (food) => {
    let foodId = food.parentElement.parentElement.id;
    let foodCard = document.getElementById(foodId);
    let foodName = foodCard.children[1].firstElementChild.innerText;
    let foodPrice = foodCard.children[1].children[1].children[0].innerText;
    let foodOrder = document.querySelector('#modal-body__ordered-foods');
    let priceContainer = document.querySelector('#modal-body__ordered-food-price');
    let price = priceContainer.innerText;

    price = parseFloat(price);

    let order = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            Name: ${foodName} ${foodPrice}
        </li>        
    `;

    price += parseFloat(foodPrice);
    priceContainer.innerText = price;
    
    foodOrder.innerHTML += order;
}

const orderFood = () => {
    let priceContainer = document.querySelector('#modal-body__ordered-food-price').innerText;

    if(priceContainer == 0) {
        errorPopup('Ne možete naručiti jer niste ubacili ništa u korpu !');
        document.querySelector('#modal-body__customer-form').reset();
        document.querySelector('#order-food-close-button').click();
    } else {
        popup('Uspješno ste naručili hranu, biti će za par minuta kod VAS ! Ostanite uz Minty :)');
        document.querySelector('#modal-body__ordered-foods').innerHTML = '';
        document.querySelector('#modal-body__ordered-food-price').innerHTML = '0';
    }
}