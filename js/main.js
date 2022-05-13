let counterForNewsMessage = 0;
let root = false;

setInterval(() => {
    let message = document.querySelector('#content__header__messages__message');

    const messages = [
        'Pomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.',
        'Porcija u svakoj ruci.',
        'Budi inspiriran da napraviš razliku komad po komad pizze.',
        'Naša misija je stvoriti zdravije društvo povezujući ljude s pravom hranom.',
        'Želite vidjeti source kod naše stranice ? Nema problema, pritisnite <a href="https://github.com/zijadddd/Minty" class="text-light">ovdje</a> !'
    ];

    message.innerHTML = messages[(counterForNewsMessage = (counterForNewsMessage+1) % messages.length)];
}, 3000);

const deleteNewsMessage = () => {
    let div = document.querySelector("#content__header__messages__message");
    div.style.display = "none";
}

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
                <div class="card" style="width: 18rem; height: auto; margin: 0 20px; margin-top: 20px" id="${element.id}">
                    <img src="${element.imageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 60%;">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="card-text">Cijena: ${element.price} KM</p>
                        <button href="" class="btn content__food__cards__root-buttons" style="background-color: #0AA1DD; margin: 1% 0; display: none;" onclick="deleteFood(this)"><span class="text-light">Uredi</span></button>
                        <button href="" class="btn content__food__cards__root-buttons" style="background-color: #F32424; margin: 1% 0; display: none;"><span class="text-light">Izbriši</span></button>
                        <button href="" class="btn" style="background-color: #F66B0E; margin: 1% 0; width: 100%;" onclick="dodajUKorpu(this)"><span class="text-light">Naruči</span></button>
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
                <label class="form-label">Username</label>
                <input type="text" class="form-control" id="login__form__username" placeholder="Enter your username">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="login__form__password" placeholder="Enter your password">
            </div>
            <p id="login__form__error-message" class="text-danger"></p>
            <div>
                <input type="button" class="btn" style="background-color: #F66B0E; color: white;" onclick="loginForm()" value="Submit">
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

const loginForm = () => {
    let loginUsername = document.querySelector('#login__form__username').value;
    let loginPassword = document.querySelector('#login__form__password').value;

    if (loginUsername === 'root') {
        if (loginPassword === 'root') {
            let temp = document.querySelector('#login');
            temp.style.display = 'none';
            temp = document.querySelector('#content');
            temp.style.filter = 'blur(0px)';
            root = true;
            popup();
            rootControls();
        } else {
            document.querySelector('#login__form__error-message').innerText = 'Nepravilna lozinka.';
        }
    } else {
        document.querySelector('#login__form__error-message').innerText = 'Nepravilan username.';
    }
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
    root = false;
    popup();
}

const popup = () => {
    let popup = document.querySelector('#pop-up');
    popup.style.display = 'flex';

    if (root) popup.innerText = 'Uspješno ste prijavljeni.';
    else popup.innerText = 'Uspješno ste odjavljeni.'

    let temp = document.querySelector('#content');
    temp = document.querySelector('#content');
    temp.style.filter = 'blur(5px)';

    setTimeout(() => {
        popup.style.display = 'none';
        temp.style.filter = 'blur(0px)';
    }, 2000);
}