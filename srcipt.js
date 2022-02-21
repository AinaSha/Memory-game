const cards = document.querySelectorAll('.memory-card');
const modal = document.querySelector('#popup');
const closeIcon= document.querySelector('.close-icon');
const counter =document.querySelector('.counter');
const btn = document.querySelector('.btn');
const moves = document.querySelector('.moves');


let hasFlippedCard =false;
let boardLocked = false;
let firstCard, secondCard;
let cardsWon = 0;


const openSound = new Audio();
const closeSound = new Audio();
const matchSound = new Audio();
const winSound = new Audio();


openSound.src ="audio/click.mp3";
closeSound.src ="audio/card_box.mp3";
matchSound.src ="audio/win_positive.mp3";
winSound.src ="audio/success.mp3";

const flipCard = e => {
   if(boardLocked) return;

   const target = e.target.parentElement;

   if (target === firstCard) return;  //fixed that when clicking the same card there were no comparisons

   target.classList.add('flip');
   openSound.play();
  

   if(!hasFlippedCard){
      // First click
      hasFlippedCard = true;
      firstCard = target;
   } else {
      //Second click

      hasFlippedCard = false;
      secondCard = target;

      //Check for match
      checkForMatch();
      countClick();
      closeModal();
   }
};

const checkForMatch = () => {
   
   if(firstCard.dataset.framework === secondCard.dataset.framework){
      disableCards();
      cardsWon += 1;
      matchSound.play();

   } else {
      unflipCards();
   }

   congratulations();
  
};


const disableCards = () => {
   firstCard.removeEventListener('click', flipCard);
   secondCard.removeEventListener('click', flipCard);
};

const unflipCards = () => {
   boardLocked = true;  // убираем преждевременный клик и открытие карты если карты не равны , пока не перевернутся обратно клик невозможен

   setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      closeSound.play();
      resetBoard();
   }, 1000);
};

const resetBoard = () => {
  [hasFlippedCard, boardLocked] = [false, false];
  [firstCard,secondCard] = [null, null];

};



const countClick = () => {
   const counterClick = counter.textContent;
   counter.textContent =parseInt(counterClick)+1;
   moves.innerText =  `${counter.textContent}`;
}


cards.forEach(card => {
   //Add Event Listener to every card
   card.addEventListener('click', flipCard);
    
   // shuffle
   const randomIndex = Math.floor(Math.random()* cards.length);    
   console.log('RANDOME INDEX',randomIndex);
   card.style.order = randomIndex;

  
});


const isStorage = 'undefined' !== typeof localStorage;
let statlist = [];
if (isStorage && localStorage.getItem('')) {
   statlist = localStorage.getItem('fap-moves').split(',');
}
     
//Popup with results
const congratulations = () => {
   if(cardsWon  == cards.length /2){
      modal.classList.toggle('hidden');
      winSound.play();
      isStorage && localStorage.setItem('fap-moves', statlist);
   }

  

   closeModal();
    playAgain();
};



const closeModal = () => {
   closeIcon.addEventListener('click', function(e) {
      modal.classList.add("hidden");
   });
}



const playAgain = () => {
   btn.addEventListener('click', function(e) {
      modal.classList.add("hidden");
      cards.forEach(card => card.classList.remove('flip'));
      restartGame();
    
      // let lastScore = [];
      // lastScore.push(counter.textContent);
    
      // localStorage.setItem('movesItem', JSON.stringify(lastScore));

   });
};



const restartGame = () => {


   cards.forEach(card => {
      //Add Event Listener to every card
      card.addEventListener('click', flipCard);
       
      // shuffle
      const randomIndex = Math.floor(Math.random()* cards.length);    
      console.log('RANDOME INDEX',randomIndex);
      card.style.order = randomIndex;  
   });
   
   counter.textContent = 0;
   moves.innerText =  `${counter.textContent}`;
   cardsWon = 0;
   modal.classList.add('hidden');
   winSound.pause();

   congratulations();
   resetBoard();
};


// const statList  = document.querySelector('.stat-list');
// function listMoves() {
//    if(typeof(Storage)!=="undefined"){
//        var moves = false;
//        if(localStorage["total-moves"]) {
//          statList.style.display = "block"; 
//          statList.innerHTML = '';  
//          moves = JSON.parse(localStorage["total-moves"]);         
//        }
//    } else {
//       statList.style.display = "none";
//    }
// }