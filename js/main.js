let counterForNewsMessage = 0;

document.querySelector('#content__header__news-feed').innerHTML = 
    `<i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i><i class="fa-solid fa-fire"></i> 
    Pomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.`;

setInterval(() => {
    let message = document.querySelector('#content__header__news-feed');

    const messages = [
        'Pomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.',
        'Porcija u svakoj ruci.',
        'Budi inspiriran da napraviš razliku komad po komad pizze.',
        'Naša misija je stvoriti zdravije društvo povezujući ljude s pravom hranom.',
        'Želite vidjeti source kod naše stranice ? Nema problema, pritisnite <a href="https://github.com/zijadddd/Minty" class="links">ovdje</a> !'
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
    const cardList = document.querySelector('#content__food__cards');
    let cards = '';

    data.forEach(element => {
        cards += `
            <div class="card" style="width: 18rem; height: auto; margin: 0 20px; margin-top: 20px;" id="${element.id}">
                <img src="${element.imageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 60%;">
                <div class="card-body">
                    <h5 class="card-title text-dark">${element.name}</h5>
                    <p class="card-text text-dark">Cijena: ${element.price} KM</p>
                    <button href="" class="btn content__food__cards__root-buttons" onclick="editFood(this)" id="content__food__cards__root-buttons-edit"><span class="text-light">Uredi</span></button>
                    <button href="" class="btn content__food__cards__root-buttons" onclick="deleteFood(this)" id="content__food__cards__root-buttons-delete"> <span class="text-light">Izbriši</span></button>
                    <button href="" class="btn btn-primary" onclick="dodajUKorpu(this)"><span class="text-light">Naruči</span></button>
                </div>
            </div>                    
        `
    })

    cardList.innerHTML = cards; 
})

const login = () => {
    let temp = document.querySelector('#login');
    temp.style.display = 'block';
    temp.innerHTML = `
        <form id="login__form">
            <div class="mb-3">
                <label class="form-label text-light">Username</label>
                <input type="text" class="form-control" id="login__form__username" placeholder="Enter your username">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label text-light">Password</label>
                <input type="password" class="form-control" id="login__form__password" placeholder="Enter your password">
            </div>
            <p id="login__form__error-message" class="text-danger"></p>
            <div>
                <input type="button" class="btn" style="background-color: #38d9a9; color: white;" onclick="loginForm()" value="Submit">
            </div>
        </form>
    `;

    temp = document.querySelector('#content');
    temp.style.filter = 'blur(5px)';

    document.addEventListener('mouseup', (e) => {
        temp = document.querySelector('#login');
        if (!temp.contains(e.target)) {
            temp.style.display = 'none';
            temp = document.querySelector('#content');
            temp.style.filter = 'blur(0px)';
        }
    });
}

const loginCheck = () => {
    let loginUsername = document.querySelector('#username').value;
    let loginPassword = document.querySelector('#password').value;

    if (loginUsername === 'root') {
        if (loginPassword === 'root') {
            document.querySelector('.btn-close').click();
            rootControls();
            popup('Uspješno ste prijavljeni !');
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
    let cards = document.querySelectorAll('.content__food__cards__root-buttons');
    let loginButton = document.querySelector('#content__navbar__navbar-collapse__login-button');
    let logoutButton = document.querySelector('#content__navbar__navbar-collapse__logout-button'); 

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'inline-block';
    }

    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
}

const logout = () => {
    let cards = document.querySelectorAll('.content__food__cards__root-buttons');
    let loginButton = document.querySelector('#content__navbar__navbar-collapse__login-button');
    let logoutButton = document.querySelector('#content__navbar__navbar-collapse__logout-button'); 

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'none';
    }

    loginButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
    popup('Uspješno ste odjavljeni !');
}

const popup = (message) => {
    let popup = document.querySelector('#info-pop-up');

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
            let foodCard = document.getElementById(foodId);
            foodCard.remove();
            popup(`Hrana sa ID-em ${foodId} je uspješno obrisana !`);
        } else {
            let popup = document.querySelector('#error-pop-up');
            popup.innerText = `Nije moguce obrisati hranu sa ID-em ${foodId}`;
            popup.style.display = 'block';
        }
    })
}