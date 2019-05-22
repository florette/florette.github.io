const imgScreen1 = document.querySelector('.screen1');
const btnScreen1 = document.querySelector('.btn__screen1');
const imgScreen2 = document.querySelector('.screen2');
const btnScreen2 = document.querySelector('.btn__screen2');
const video = document.querySelector('.video__wrapper');
const btnScreen3 = document.querySelector('.btn__screen3');
const imgScreen3 = document.querySelector('.screen3');
const imgScreen4 = document.querySelector('.screen4');
const btnScreen5 = document.querySelector('.btn__screen5');
const imgScreen5 = document.querySelector('.screen5');
const btnScreen6 = document.querySelector('.btn__screen6');
const imgScreen6 = document.querySelector('.screen6');



function placeText(theSelector, theRecipient) {
    theRecipient.innerHTML =  theSelector.value
}

btnScreen1.addEventListener('click', () => {
    imgScreen1.classList.toggle('active');
    btnScreen1.classList.toggle('active');
    imgScreen2.classList.toggle('active');
    btnScreen2.classList.toggle('active');
})

btnScreen2.addEventListener('click', () => {
    video.classList.toggle('show');
    btnScreen2.classList.toggle('active');
    btnScreen3.classList.toggle('active');
})

btnScreen3.addEventListener('click', () => {
    btnScreen3.classList.toggle('active');
    imgScreen3.classList.toggle('active-bottom');
    imgScreen4.classList.toggle('show');
    btnScreen5.classList.toggle('active');
})

btnScreen5.addEventListener('click', () => {
    btnScreen3.classList.toggle('active');
    imgScreen5.classList.toggle('active-bottom');
    btnScreen6.classList.toggle('active');
})

btnScreen6.addEventListener('click', () => {
    btnScreen5.classList.toggle('active');

    imgScreen5.classList.toggle('active-bottom');
    btnScreen3.classList.toggle('active');
    imgScreen3.classList.toggle('active-bottom');
    imgScreen4.classList.toggle('show');
})