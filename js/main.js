let counterForNewsMessage = 0;

setInterval(() => {
    let message = document.querySelector('#newsMessage');

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
    let div = document.querySelector("#headerMessage");
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
        const cardList = document.querySelector('#food');
        let cards = '';

        data.forEach(element => {
            cards += `
                <div class="card" style="width: 18rem; height: 22rem; margin: 0 20px; margin-top: 20px">
                    <img src="${element.imageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 60%;">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="card-text">Cijena: ${element.price} KM</p>
                        <a href="#" class="btn" style="background-color: #F66B0E"><span class="text-light">Naruči</span></a>
                        <a href="#" class="btn rootButtons" style="background-color: #0AA1DD; display: none;"><span class="text-light">Uredi</span></a>
                        <a href="#" class="btn rootButtons" style="background-color: #F32424; display: none;"><span class="text-light">Izbriši</span></a>
                    </div>
                </div>                    
            `
        })

        cardList.innerHTML = cards; 
    })

const login = () => {
    let temp = document.querySelector('#loginForm');
    temp.style.display = 'block';
    temp.style.position = 'fixed';
    temp.style.width = '50%';
    temp.style.height = '15rem';
    temp.style.padding = '1%';
    temp.innerHTML = `
        <form>
            <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" id="loginUsername" placeholder="Enter your username">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="loginPassword" placeholder="Enter your password">
            </div>
            <p id="errorMessage" class="text-danger"></p>
            <button type="submit" class="btn" style="background-color: #F66B0E; color: white;" onclick="loginForm()">Submit</button>
        </form>
    `;

    temp = document.querySelector('#content');
    temp.style.filter = 'blur(5px)';

    document.addEventListener('mouseup', (e) => {
        temp = document.querySelector('#loginForm');
        if (!temp.contains(e.target)) {
            temp.style.display = 'none';
            temp = document.querySelector('#content');
            temp.style.filter = 'blur(0px)';
        }
    });
}

const loginForm = () => {
    let loginUsername = document.querySelector('#loginUsername').value;
    let loginPassword = document.querySelector('#loginPassword').value;

    if (loginUsername == 'root') {
        if (loginPassword == 'root') {
            let temp = document.querySelector('#loginForm');
            temp.style.display = 'none';
            temp = document.querySelector('#content');
            temp.style.filter = 'blur(0px)';
            rootControls();
        } else {
            document.querySelector('#errorMessage').innerText = 'Nepravilna lozinka.';
        }
    } else {
        document.querySelector('#errorMessage').innerText = 'Nepravilan username.';
    }
}

const rootControls = () => {
    let cards = document.querySelectorAll('.rootButtons');
    let loginButton = document.querySelector('#loginButton');
    let logoutButton = document.querySelector('#logoutButton'); 

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'inline-block';
    }

    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
}

const logout = () => {
    let cards = document.querySelectorAll('.rootButtons');
    let loginButton = document.querySelector('#loginButton');
    let logoutButton = document.querySelector('#logoutButton'); 

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'none';
    }

    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
}