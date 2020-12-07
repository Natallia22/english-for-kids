
const categoriesConteiner = document.querySelector('.categories__cards');
const menuElements = document.querySelectorAll('.menu_element');
const conteinerStars = document.querySelector('.conteiner__stars');
const winImg = document.getElementById('win');
const failImg = document.getElementById('fail');
const blockErrors = document.querySelector('.errors');

const btnStart = document.querySelector('.button__play');
const btnRepeat = document.querySelector('.button__repeat');
let GAMEMODE = 'TRAIN'; // переменная для переключателя TRAIN/PLAY
let countErrors = 0;
let categorySound = []; //сюда пушим адрес звука для карточки

//////Карточки с категориями///
function cardsWithCategor() {
    for (let i = 0; i < categoryNames.length; i++) {

        const cardsWithCategory = document.createElement('div');
        cardsWithCategory.className = 'card';
        cardsWithCategory.id = categoryNames[i];



        const imgWithCard = document.createElement('img');
        imgWithCard.src = `img/mainPage/${categoryNames[i]}.jpg`;
        imgWithCard.className = 'card-img-top';
        cardsWithCategory.appendChild(imgWithCard);

        const contTextWithCard = document.createElement('div');
        contTextWithCard.className = 'card-body';
        cardsWithCategory.appendChild(contTextWithCard);

        const textWithCard = document.createElement('h5');
        textWithCard.innerText = categoryNames[i];
        textWithCard.className = 'card-text';
        contTextWithCard.appendChild(textWithCard);

        categoriesConteiner.appendChild(cardsWithCategory);
    }
    clickToCard();

};
cardsWithCategor();
//Обработчика по клику на карточку с категорией//

function clickToCard() {
    const categories = document.querySelectorAll('.card');

    Array.prototype.forEach.call(categories, function (el) {
        el.addEventListener('click', function (e) {
            const nameCat = el.id;
            const menuActiveElement = document.querySelector('.menu_element_active');
            menuActiveElement.classList.remove('menu_element_active');
            addActiveElement(nameCat);

            while (categoriesConteiner.firstChild) {
                categoriesConteiner.firstChild.remove();
            }

            createCardsToCategory(nameCat);
        })
    });
}

//Карточки внутри категории///
function createCardsToCategory(nameCat) {
    const numbCat = categoryNames.indexOf(nameCat);

    for (let i = 1; i <= cards[numbCat].length; i++) {
        const cardToCategory = document.createElement('div');
        cardToCategory.className = 'card_main';
        cardToCategory.dataset.audio = cards[numbCat][i - 1].audioSrc;

        cardToCategory.onclick = function () {
            const audSrc = new Audio(cards[numbCat][i - 1].audioSrc);
            audSrc.play();
        };
        const audSrc = new Audio(cards[numbCat][i - 1].audioSrc);
        categorySound.push(audSrc);

        const imgToCard = document.createElement('img');
        imgToCard.src = cards[numbCat][i - 1].image;
        cardToCategory.appendChild(imgToCard);
        imgToCard.className = 'card-img-top';

        const contTextToCard = document.createElement('div');
        contTextToCard.className = 'card-body';
        cardToCategory.appendChild(contTextToCard);

        const contTextToCardBack = document.createElement('div');
        contTextToCardBack.className = 'card-body-back display__none';
        cardToCategory.appendChild(contTextToCardBack);

        const textToCard = document.createElement('h5');
        textToCard.innerText = cards[numbCat][i - 1].word;
        textToCard.className = 'card-text';
        contTextToCard.appendChild(textToCard);

        const textToCardBack = document.createElement('h5');
        textToCardBack.innerText = cards[numbCat][i - 1].translation;
        textToCardBack.className = 'card-text-back';
        contTextToCardBack.appendChild(textToCardBack);

        const buttonCard = document.createElement('div');
        buttonCard.classList.add('buttonCard');
        buttonCard.style.backgroundImage = 'url(img/other/rotate.png)';
        contTextToCard.appendChild(buttonCard);

        categoriesConteiner.appendChild(cardToCategory);
        cardToCategory.className = 'card_main';
    }
    cardRotate();

    if (GAMEMODE === 'PLAY') playGame();
    addBtnStart();
};

///Обратная сторона карточек///

function cardRotate() {
    const cardsEvent = document.querySelectorAll('.buttonCard');
    Array.prototype.forEach.call(cardsEvent, function (el) {
        el.addEventListener('click', function (e) {
            el.parentNode.parentNode.style.transform = 'rotateY(180deg)';
            el.parentNode.classList.add('display__none');
            el.parentNode.parentNode.lastChild.classList.remove('display__none');
            el.classList.add('display__none');
        })
    });

    const cardsEventOnFocus = document.querySelectorAll('.card_main');
    const CardButtons = document.querySelectorAll('.buttonCard');
    cardsEventOnFocus.forEach((el) => {
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'none';
            el.lastChild.classList.add('display__none');
            el.lastChild.previousSibling.classList.remove('display__none');
            CardButtons.forEach((elem) => {
                elem.classList.remove('display__none');
            });
        });
    });
}

//burger menuuu///
document.body.addEventListener('click', (event) => {
    if (document.querySelector('.header__menu').style.display != 'none' && event.target != burgerMenu) {
        document.querySelector('.header__menu').style.display = 'none';
        burgerMenu.classList.remove('header__burgerMenu_active');
    }
}, true);
const burgerMenu = document.querySelector('.header__burgerMenu');
burgerMenu.addEventListener('click', (event) => {
    if (burgerMenu.classList.contains('header__burgerMenu_active')) {
        document.querySelector('.header__menu').style.display = 'none';
        burgerMenu.classList.remove('header__burgerMenu_active');
    } else {
        burgerMenu.classList.add('header__burgerMenu_active');
        document.querySelector('.header__menu').style.display = 'block';
    }

});


//Обработчик по клику для ссылок в бургер меню/////////
const menuElement = document.querySelectorAll('.menu_element');

Array.prototype.forEach.call(menuElement, function (el) {
    el.addEventListener('click', function (e) {
        startNewGame(); ////////обнуляем все параметры игрыыы
        categorySound = [];
        const nameCat = el.id;
        removeActiveElement();
        el.classList.add('menu_element_active');
        while (categoriesConteiner.firstChild) {
            categoriesConteiner.firstChild.remove();
        }
        if (el.id === 'Main Page') {
            cardsWithCategor();
            addBtnStart();
            removeTableStatistics();
            if (GAMEMODE === 'PLAY') playGame();
        } else if (el.id === 'statistics') {
            if (document.querySelector('.statstable')) removeTableStatistics();
            createTableStatistics();
        } else {
            createCardsToCategory(nameCat);
            removeTableStatistics();
        }
    })
});


function removeActiveElement() {
    const menuElementActive = document.querySelector('.menu_element_active');
    menuElementActive.classList.remove('menu_element_active');
};

function addActiveElement(nameCat) {
    Array.prototype.forEach.call(menuElements, function (el) {
        if (el.id === nameCat)
            el.classList.add('menu_element_active');
    })
};



////Switch/////
const header__switch = document.querySelector('.header__switch');
header__switch.addEventListener('click', (event) => {
    if (header__switch.firstElementChild.classList.contains('switch__circle_active')) {
        header__switch.firstElementChild.classList.remove('switch__circle_active');
        document.querySelector('.header__mod').innerHTML = 'TRAIN';
        GAMEMODE = 'TRAIN';
        trainGame();
    } else {
        header__switch.firstElementChild.classList.add('switch__circle_active');
        document.querySelector('.header__mod').innerHTML = 'PLAY';
        GAMEMODE = 'PLAY';
        playGame();
    }
});


function playGame() {
    const cards_main = document.querySelectorAll('.card_main');
    const cards = document.querySelectorAll('.card');
    cards_main.forEach((element) => {
        element.style.boxShadow = '0 0 10px green';
        element.querySelector('.card-img-top').classList.add('card-img-top-scale');
        element.querySelector('.card-body').style.display = 'none';
    });
    cards.forEach((element) => {
        element.style.boxShadow = '0 0 10px green';
        element.querySelector('.card-body').style.background = 'radial-gradient(at top, #FEFFFF, rgb(82, 247, 156))';

    });
    addBtnStart();
}

function trainGame() {
    const cards_main = document.querySelectorAll('.card_main');
    const cards = document.querySelectorAll('.card');
    cards_main.forEach((element) => {
        element.style.boxShadow = '0 0 10px black';
        element.querySelector('.card-img-top').classList.remove('card-img-top-scale');
        element.querySelector('.card-body').style.removeProperty('display');
    });
    cards.forEach((element) => {
        element.style.boxShadow = '0 0 10px black';
        element.querySelector('.card-body').style.background = 'radial-gradient(at top, #FEFFFF, rgb(243, 192, 171))';
    });
    addBtnStart();
    startNewGame();
    addEventCardsTrain();
}

function addBtnStart() {
    const menuElementActive = document.querySelector('.menu_element_active');
    if (menuElementActive.id !== 'Main Page' && GAMEMODE === 'PLAY') {
        btnStart.style.display = 'block';
    } else btnStart.style.display = 'none';
}

btnStart.addEventListener('click', () => {
    soundsSort();
    delEventCards();
    categorySound[0].play();
    addEventCards();
    addBtnRepeat();
    btnStart.style.display = 'none';
    conteinerStars.style.display = 'flex';
});

function addBtnRepeat() {
    btnRepeat.style.display = 'block';
    btnRepeat.onclick = function () {
        categorySound[0].play();
    }
}

function soundsSort() {
    categorySound.sort(function () {
        return Math.random() - 0.5;
    });
}

function delEventCards() {
    const delEvent = document.querySelectorAll('.card_main');
    delEvent.forEach((element) => {
        element.onclick = '';
    });
}
function addEventCards() {
    const addEvent = document.querySelectorAll('.card_main');
    addEvent.forEach((element) => {
        element.onclick = function () {
            if (categorySound[0].src.includes(element.dataset.audio)) {
                checkCorrectAnswer();
                element.style.opacity = 0.5;
                element.style.cursor = 'no-drop';
                element.onclick = '';
            }
            else checkErrorAnswer();
        };
    });
}

let error_mp3 = new Audio('audio/error.mp3');
let correctly_mp3 = new Audio('audio/correct.mp3');
let win_mp3 = new Audio('audio/success.mp3');
let lose_mp3 = new Audio('audio/failure.mp3');

function checkCorrectAnswer() {
    const imgStar = document.createElement('img');
    imgStar.src = "img/other/star-win.svg";
    imgStar.width = '40';
    conteinerStars.appendChild(imgStar);

    correctly_mp3.play();
    categorySound.shift();
    setTimeout(() => {
        categorySound[0].play();
    }, 1000);
    if (categorySound[0] === undefined) winOrNot();
}

function checkErrorAnswer() {
    const imgStar = document.createElement('img');
    imgStar.src = "img/other/star.svg";
    imgStar.width = '40';
    conteinerStars.appendChild(imgStar);

    error_mp3.play();
    countErrors++;

}

function winOrNot() {
    if (countErrors === 0) {
        categoriesConteiner.style.display = 'none';
        winImg.style.display = 'block';
        btnRepeat.style.display = 'none';
        conteinerStars.style.display = 'none';
        setTimeout(() => {
            win_mp3.play();
        }, 500);
        setTimeout(() => {
            returnToMainPage();
        }, 3000);
    } else {
        categoriesConteiner.style.display = 'none';
        failImg.style.display = 'block';
        blockErrors.innerHTML = `<b>${countErrors}</b> Errors!`;
        blockErrors.style.display = 'block';
        btnRepeat.style.display = 'none';
        conteinerStars.style.display = 'none';
        setTimeout(() => {
            lose_mp3.play();
        }, 500);
        setTimeout(() => {
            returnToMainPage();
        }, 3000);
    }
}


function startNewGame() {
    winImg.style.display = 'none';
    failImg.style.display = 'none';
    categoriesConteiner.style.display = 'flex';
    conteinerStars.style.display = 'none';
    btnStart.style.display = 'none';
    btnRepeat.style.display = 'none';
    blockErrors.style.display = 'none';
    countErrors = 0;


    while (conteinerStars.firstChild) {
        conteinerStars.firstChild.remove();
    }
}


function addEventCardsTrain() {
    const addEvent = document.querySelectorAll('.card_main');
    addEvent.forEach((element) => {
        element.style.opacity = 1;
        element.style.cursor = 'pointer';
        element.onclick = function () {
            const audSrc = new Audio(element.dataset.audio);
            audSrc.play();
        };
    });
};

function returnToMainPage() {
    startNewGame(); ////////обнуляем все параметры игрыыы
    categorySound = [];
    removeActiveElement();
    document.getElementById('Main Page').classList.add('menu_element_active');
    while (categoriesConteiner.firstChild) {
        categoriesConteiner.firstChild.remove();
    }
    cardsWithCategor();
    addBtnStart();
    playGame();
}

/////////Создание таблицы//////////

let statistics_components = [
    ['Category', 'category'],
    ['Word', 'word'],
    ['Translation', 'translation'],
    ['Train click', 'train_click'],
    ['Correct answer', 'play_true'],
    ['Incorrect answer', 'play_false'],
    ['percentage of incorrect', 'percentage_incorrect']
];
let meintableelements = [];
let tableelements = [];


function createTableStatistics() {
    document.querySelectorAll('.button_stats').forEach((button) => {
        button.style.display = 'block';
    });
    categoriesConteiner.style.display = 'none';

    tableelements = [];
    meintableelements = [];

    const statstable = document.createElement('div');
    statstable.innerHTML = '';
    statstable.classList.add('statstable');
    document.querySelector('.main_container').appendChild(statstable);

    const menutable = document.createElement('div');
    menutable.classList.add('menutable');
    statstable.appendChild(menutable);

    statistics_components.forEach(element => {
        const menutable_element = document.createElement('div');
        menutable_element.classList.add('menutable_element');
        menutable_element.innerHTML = element[0];
        menutable.appendChild(menutable_element);
        //menutable.addEventListener('click', sorttable);
        meintableelements.push(menutable_element);
    });
    cardlist.forEach(card => {

        const stats_card = document.createElement('div');
        stats_card.classList.add('stats_card');
        statistics_components.forEach(element => {
            const stats_card_element = document.createElement('div');
            stats_card_element.classList.add('stats_card_element');
            stats_card_element.innerHTML = card[element[1]];
            stats_card.appendChild(stats_card_element);
        });
        statstable.appendChild(stats_card);
        tableelements.push(stats_card);
    });
    document.querySelector('.main_container').appendChild(statstable);

};

function sorttable() {
    statistics_components.forEach(el => {
        if (el[0] == event.target.innerHTML)
            cards.sort(el[1]);
    })
    let index = 0;
    cardlist.forEach((card) => {
        tableelements.forEach((node_element) => {
            if (card.name == node_element.children[1].innerHTML)
                node_element.style.order = index;
        });
        index++;
    });
}

function removeTableStatistics() {
    document.querySelectorAll('.button_stats').forEach((button) => {
        button.style.display = 'none';
    });
    document.querySelector('.statstable').remove();
}