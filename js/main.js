let counterForNewsMessage = 0;

setInterval(() => {
    let message = document.querySelector('#newsMessage');

    const messages = [
        'Pomoći građanima Zenice da žive bolje omogućavajući da zdrava hrana bude jeftina i pristupačna.',
        'Porcija u svakoj ruci.',
        'Budi inspiriran da napraviš razliku komad po komad pizze.',
        'Naša misija je stvoriti zdravije društvo povezujući ljude s pravom hranom.'
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
        const cardList = document.getElementById('food');
        let cards = '';

        data.forEach(element => {
            cards += `
                <div class="card" style="width: 18rem; height: 22rem; margin: 0 20px; margin-top: 20px">
                    <img src="${element.imageUrl}" class="card-img-top" alt="..." style="width: 100%; height: 60%;">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="card-text">Cijena: ${element.price} KM</p>
                        <a href="#" class="btn" style="background-color: #F66B0E"><span class="text-light">Naruči</span></a>
                    </div>
                </div>                    
            `
        })

        cardList.innerHTML = cards; 
    })