const domText1 = document.querySelector('.text-1');
const domImgText1 = document.querySelector('.img-text-1');
const domText2 = document.querySelector('.text-2');
const domImgText2 = document.querySelector('.img-text-2');

// domText1.oninput = function() {
//     placeText(domText1, domImgText1)
// }

domText2.oninput = function() {
    placeText(domText2, domImgText2)
}

function placeText(theSelector, theRecipient) {
    theRecipient.innerHTML =  theSelector.value
}