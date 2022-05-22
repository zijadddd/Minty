let counterForNewsMessage = 0;

document.querySelector('#header__news-feed').innerHTML = 
    `<i class="fa-solid fa-fire news-feed__i"></i><i class="fa-solid fa-fire news-feed__i"></i><i class="fa-solid fa-fire news-feed__i"></i> 
    &nbspThe food at your doorstep.`;

setInterval(() => {
    const message = document.querySelector('#header__news-feed');

    const messages = [
        '&nbspThe food at your doorstep.',
        '&nbspWhy starve when you have&nbsp<strong><span style="color: #38d9a9">M</span><span class="text-light">inty</span></strong>.',
        '&nbspDon’t starve, just order.',
        '&nbspWe will make your mood.',
        '&nbspHunger gives stress; we give food.',
        '&nbspDelivering happiness.'
    ];

    message.innerHTML = `<i class="fa-solid fa-fire news-feed__i"></i><i class="fa-solid fa-fire news-feed__i"></i><i class="fa-solid fa-fire news-feed__i"></i> `
                        + messages[(counterForNewsMessage = (counterForNewsMessage+1) % messages.length)];
}, 5000);

fetch('https://ptf-web-dizajn-2022.azurewebsites.net/api/Food')
.then(res => {
    if(!res.ok) {
        throw Error('[ERROR] It is not possible to load food from API.');
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
                    <div>Price: <p class="card-text text-dark" id="card-body__price">${element.price}</p>$</div>
                    <a type="button" class="btn cards__root-buttons text-light" data-bs-toggle="modal" data-bs-target="#edit-food-form" onclick="fillEditData(${element.id})" data-bs-whatever="${element.id}" id="cards__root-buttons-edit"><i class="fa-solid fa-pen"></i> Edit</a>
                    <button href="" class="btn cards__root-buttons" onclick="deleteFood(${element.id})" id="cards__root-buttons-delete"> <span class="text-light"><i class="fa-solid fa-trash-can"></i> Delete</span></button>
                    <button href="" class="btn btn-main card-body__add-to-cart" onclick="putFoodInOrder(this)"><span class="text-light"><i class="fa-solid fa-cart-arrow-down"></i> Add to cart</span></button>
                </div>
            </div>                    
        `
    })

    cardList.innerHTML = cards; 
})

const loginCheck = () => {
    const loginUsername = document.querySelector('#username').value;
    const loginPassword = document.querySelector('#password').value;

    if (loginUsername === 'root') {
        if (loginPassword === 'root') {
            document.querySelector('#login-form-close-button').click();
            rootControls();
            popup('You have successfully logged in !');
            document.querySelector('#modal-body__login-form').reset();
        } else {
            const warningMessage = document.querySelector('#warning-message');
            warningMessage.style.display = 'block';
            warningMessage.innerText = 'Invalid password.';
        }
    } else {
        const warningMessage = document.querySelector('#warning-message');
        warningMessage.style.display = 'block';
        warningMessage.innerText = 'Invalid username';
    }
}

const rootControls = () => {
    const cards = document.querySelectorAll('.cards__root-buttons');
    const orderFoodButtons = document.querySelectorAll('.card-body__add-to-cart');
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
}

const logout = () => {
    const cards = document.querySelectorAll('.cards__root-buttons');
    const orderFoodButtons = document.querySelectorAll('.card-body__add-to-cart');
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

    popup('You have successfully logged out !');
}

const popup = (message) => {
    const popup = document.querySelector('#info-pop-up');

    popup.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

const errorPopup = (message) => {
    const popup = document.querySelector('#error-pop-up');

    popup.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

const deleteFood = (foodId) => {
    fetch(`https://ptf-web-dizajn-2022.azurewebsites.net/api/Food/${foodId}`, {
        method: 'DELETE'
    })
    .then(res => {
        console.log(`Status code: ${res.status}`);

        if (res.ok) {
            let foodCard = document.querySelector(`[id = '${foodId}']`);
            foodCard.remove();
            popup(`Food with ID: ${foodId} is successfully deleted !`);
        } else {
            errorPopup(`Unable to delete food with ID: ${foodId}`);
        }
    })
}

const fillEditData = (foodId) => {
    const food = document.querySelector(`[id = '${foodId}']`);
    const foodFormId = document.querySelector('#food-edit-id');
    const foodFormName = document.querySelector('#food-edit-name');
    const foodFormImage = document.querySelector('#food-edit-imageUrl');
    const foodFormPrice = document.querySelector('#food-edit-price');

    foodFormId.value = food.id;
    foodFormName.value = food.children[1].children[0].innerText;
    foodFormImage.value = food.children[0].src;
    foodFormPrice.value = food.children[1].children[1].children[0].innerText;
}

const editFoodForm = document.querySelector('#edit-food-form');
let foodId = 0;
editFoodForm.addEventListener('show.bs.modal', (event) => {
    let editRootButton = event.relatedTarget;
    foodId = editRootButton.getAttribute('data-bs-whatever');
});

const editFood = () => {
    const foodName = document.querySelector('#food-edit-name').value;
    const foodPrice = document.querySelector('#food-edit-price').value;
    const foodImageUrl = document.querySelector('#food-edit-imageUrl').value;

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
        console.log(`Status code: ${res.status}`);

        if (res.ok) {
            let foodCard = document.querySelector(`[id = '${foodId}']`);
            foodCard.children[1].firstElementChild.innerText = foodName;
            foodCard.children[1].children[1].children[0].innerText = foodPrice;
            foodCard.children[0].src = foodImageUrl;

            popup(`Food with ID: ${foodId} is successfully edited !`);
        } else {
            errorPopup(`Unable to edit food with ID: ${foodId} !`);
        }
    })
}

const addFood = () => {
    const foodCards = document.querySelector('#food__cards');
    let lastFoodId = 0;

    for (let i = 0; i < foodCards.children.length; i++) {
        if (!document.querySelector(`[id = '${i}']`)) {
            lastFoodId = i;
            break;
        } else {
            lastFoodId = foodCards.children.length;
        }           
    }

    const foodAddedName = document.querySelector('#food-add-name').value;
    const foodAddedPrice = document.querySelector('#food-add-price').value;
    const foodAddedImageUrl = document.querySelector('#food-add-imageUrl').value;

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
        console.log(`Status code: ${res.status}`);

        if (res.ok) {
            let card = `
                <div class="card" style="width: 18rem; height: auto; margin: 0 20px; margin-top: 20px;" id="${lastFoodId}">
                    <img src="${foodAddedImageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 13rem;" id="card__image">
                    <div class="card-body">
                        <h5 class="card-title text-dark" id="card-body__name">${foodAddedName}</h5>
                        <div>Price: <p class="card-text text-dark" id="card-body__price">${foodAddedPrice}</p>$</div>
                        <a type="button" class="btn cards__root-buttons text-light" data-bs-toggle="modal" data-bs-target="#edit-food-form" onclick="fillEditData(${lastFoodId})" data-bs-whatever="${lastFoodId}" id="cards__root-buttons-edit"><i class="fa-solid fa-pen"></i> Edit</a>
                        <button href="" class="btn cards__root-buttons" onclick="deleteFood(${lastFoodId})" id="cards__root-buttons-delete"> <span class="text-light"><i class="fa-solid fa-trash-can"></i> Delete</span></button>
                        <button href="" class="btn btn-main card-body__add-to-cart" onclick="putFoodInOrder(this)" style="display: none;"><span class="text-light"><i class="fa-solid fa-cart-arrow-down"></i> Add to cart</span></button>
                    </div>
                </div>                    
            `;

            foodCards.innerHTML += card;

            const cards = document.querySelectorAll('.cards__root-buttons');
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.display = 'inline-block';
            }

            popup(`Food with ID: ${foodId} is successfully added !`);
        } else {
            errorPopup('Unable to add food !');
        }
    })
}

const putFoodInOrder = (food) => {
    const foodId = food.parentElement.parentElement.id;
    const foodCard = document.querySelector(`[id = '${foodId}']`);
    const foodName = foodCard.children[1].firstElementChild.innerText;
    const foodPrice = foodCard.children[1].children[1].children[0].innerText;
    const foodOrder = document.querySelector('#modal-body__ordered-foods');
    const priceContainer = document.querySelector('#modal-body__ordered-food-price');
    let price = priceContainer.innerText;

    price = parseFloat(price);

    popup(`Food ${foodName} is successfully added to cart !`);

    let order = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            Name: ${foodName} Price: ${foodPrice}
        </li>        
    `;

    price += parseFloat(foodPrice);
    priceContainer.innerText = price;
    
    foodOrder.innerHTML += order;
}

const orderFood = () => {
    const priceContainer = document.querySelector('#modal-body__ordered-food-price').innerText;

    if(priceContainer == 0) {
        errorPopup('Unable to order food because cart is empty !');
        document.querySelector('#modal-body__customer-form').reset();
        document.querySelector('#order-food-close-button').click();
    } else {
        popup('You have successfully ordered food. It will be with you in a few minutes ! Stay with Minty :)');
        document.querySelector('#modal-body__ordered-foods').innerHTML = '';
        document.querySelector('#modal-body__ordered-food-price').innerHTML = '0';
        document.querySelector('#modal-body__customer-form').reset();
        document.querySelector('#order-food-close-button').click();
    }
}