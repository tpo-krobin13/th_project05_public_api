/* Main script for delivering the api project
 * @author: krobinson
*/

// Global variables
const LOAD_REMOTE_USER_URL = 'https://randomuser.me/api/?results=12&nat=us';
const userMasterList = [];
const totalincrement = 360;
let currentRotation = 0;


// Application functions

// use an arrow function to secure rgb values for altering the backgrounds
const getRGBValue = (floor, ceiling) => Math.floor((Math.random() * (ceiling - floor)) + floor) + 1;

// lets ensure we maintain contrast between the background color and the fonts
// darker colors should be lower on the 255 scale and lighter numbers higher
// our backgrounds should always be darker than our fonts
function changeColors () {
  document.body.style.color = `rgb(${getRGBValue(0,100)}, ${getRGBValue(0,100)} ,${getRGBValue(0,100)})`;
  document.body.style.backgroundColor = `rgb(${getRGBValue(130,255)}, ${getRGBValue(130,255)} ,${getRGBValue(130,255)})`;  
}

/*
* initPage initializes the page and invokes all primary page functions
*/
function initPage () {
  createSearchForm();
  loadUsers();
  loadModalContainer();
  changeColors();
}

/* This function orocesses returned from the call to random
 * @param {string} data a list of JSON objects from the random user site
*/
function processReturnedData (data) {
  let idGenerator = 0;
  data.results.forEach(user => {
    addUser(new User(idGenerator++, user.picture.medium, user.name.first, user.name.last, user.email, user.location.state, user.cell, user.location, user.dob.date));
  });
  function addUser (user) {
    userMasterList.push(user);
  }
  userMasterList.forEach(user => createUserCard(user));
}

/* createUserCard takes a User object and creates a display card and appends it to the page
 * @param {object} userObj a populated User objects
*/
function createUserCard (userObj) {
  const outerDivElem = createElement('div', 'class|card', `data-index-number|${userObj.getId()}`);
  const innerDiv1 = createElement('div', 'class|card-img-container', `data-index-number|${userObj.getId()}`);
  const userImg = createElement('img', 'class|card-img', `src|${userObj.getImage()}`, 'alt|profile picture');
  const innerDiv2 = createElement('div', 'class|card-info-container', `data-index-number|${userObj.getId()}`);
  const h3 = createElement('h3', 'id|name', 'class|card-name cap');
  const p = createElement('p', 'class|card-text'); //
  const p2 = createElement('p', 'class|cart-text cap');
  outerDivElem.appendChild(innerDiv1);
  innerDiv1.appendChild(userImg);
  outerDivElem.appendChild(innerDiv2);
  h3.innerText = `${userObj.getFullName()}`;
  innerDiv2.appendChild(h3);
  p.insertAdjacentHTML('beforeend', userObj.getEmail());
  innerDiv2.appendChild(p);
  p2.insertAdjacentHTML('beforeend', `${userObj.fullAddress.city}, ${userObj.fullAddress.state}`);
  innerDiv2.appendChild(p2);
  document.getElementById('gallery').appendChild(outerDivElem);
  addListenersForEachCard(outerDivElem);
}

/* createSearchForm creates the serch form element and appends a listener to the dom
*
*/
function createSearchForm () {
  const formElement = createElement('form', 'action|#', 'method|get');
  const searchElement = createElement('input', 'type|search', 'class|search-input', 'placehoder|Search...');
  const submitElement = createElement('input', 'type|submit', 'value|Search', 'id|search-submit', 'class|search-submit');
  formElement.appendChild(searchElement);
  formElement.appendChild(submitElement);
  document.querySelector('.search-container').appendChild(formElement);

  document.querySelector('.search-input').addEventListener('keyup', e => {
    searchUsers();
  });
  document.forms[0].addEventListener('submit', e => {
    e.preventDefault();
    searchUsers();
  });
}

/* searchUsers searches the userMasterList for user objects that match the search criteria
*
*/
function searchUsers () {
  for (let i = 0; i < userMasterList.length; i++) {
    if (userMasterList[i].containsText(document.querySelector('.search-input').value.toLowerCase())) {
      document.querySelector(`.card[data-index-number="${userMasterList[i].getId()}"]`).style.display = '';
    } else {
      document.querySelector(`.card[data-index-number="${userMasterList[i].getId()}"]`).style.display = 'none';
    }
  }
}

/* createScheckStatus check's the status of the fetch return
*
*/
function checkStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/* This function will create an html element and set properties as needed, can handle a variable number of arguments
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
* @argument
*/
function createElement (elementType, variableArgumentList) {
  const elem = document.createElement(elementType);
  for (const i in arguments) {
    if (i > 0) {
      const args = arguments[i].split('|');
      elem.setAttribute(args[0], args[1]);
    }
  }
  return elem;
}

/* loadModalContainer creates the page container. This allows for teh listeners to be long standing as we change the inner oontainer data
*
*/
function loadModalContainer () {
  const modalWin =
  `<div class="modal-container" style="display:none">
  <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
      </div>
  </div>
  <div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>
</div>`;
  document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', modalWin);
  document.getElementById('modal-close-btn').addEventListener('click', e => {
    document.querySelector('.modal-container').style.display = 'none';
  });

  document.querySelector('.modal-btn-container').addEventListener('click', e => {
    if (e.target.type === 'button') {
      const userId = +document.querySelector('.modal-info-container').getAttribute('data-id');
      if (e.target.id === 'modal-next') {
        loadModalData(getNextId(userId));
      }
      if (e.target.id === 'modal-prev') {
        loadModalData(getPreviousId(userId));
      }
    }
  });
}

/* loadModalData takes a User object and writes the internal modal information to the modal
*
 * @param {number} userId the id of the User object as listed in userMasterList
*/
function loadModalData (userId) {
  const curUser = userMasterList[userId];
  const modalData = `
  <div class="modal-info-container" data-id="${curUser.getId()}">
    <img class="modal-img" src="${curUser.getImage()}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${curUser.getFullName()}</h3>
    <p class="modal-text">${curUser.getEmail()}</p>
    <p class="modal-text cap">${curUser.getFullAddress().city}</p>
    <hr>
    <p class="modal-text">${curUser.getCellphone()}</p>
    <p class="modal-text">${curUser.getStreetAddress()}</p>
    <p class="modal-text">Birthday: ${curUser.getBirthday()}</p>
  </div>`;
  document.querySelector('.modal-info-container').remove();
  document.querySelector('.modal').insertAdjacentHTML('beforeend', modalData);
  document.querySelector('.modal-container').style.display = '';

  if (getPreviousId(userId) === -1) {
    document.getElementById('modal-prev').style.display = 'none';
  } else {
    document.getElementById('modal-prev').style.display = '';
  }
  if (getNextId(userId) === -1) {
    document.getElementById('modal-next').style.display = 'none';
  } else {
    document.getElementById('modal-next').style.display = '';
  }
  timeImageRotation(0);
}

/*  Looks in the DOM for displayed cards and locates the previous userId
* @param {string} data a list of JSON objects from the random user site
* @return number returns the number of the previous userId within the userMsterList or -1 there is no previous user
*/
function getPreviousId (userId) {
  const cards = document.querySelectorAll('.card');
  const listArr = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].style.display === '') {
      listArr.push(i);
    }
  }
  const findElem = (element) => element === +userId;
  const arrPosition = listArr.findIndex(findElem);

  if (arrPosition > 0) {
    return listArr[arrPosition - 1];
  } else {
    return -1;
  }
}

/*  Looks in the DOM for displayed cards and locates the next userId
* @param {number} userId of a user as identified inthe userMasterList
* @return number returns the number of the next userId within the userMsterList or -1 if there is no next user
*/
function getNextId (userId) {
  const cards = document.querySelectorAll('.card');
  const listArr = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].style.display === '') {
      listArr.push(i);
    }
  }

  const findElem = (element) => element === +userId;
  const arrPosition = listArr.findIndex(findElem);
  if (arrPosition < listArr.length - 1) {
    return listArr[arrPosition + 1];
  } else {
    return -1;
  }
}

/*
* Event listener that identifies clicks anywhere on the card and calls the loadModalData function
*/
function addListenersForEachCard (elemCard) {
  elemCard.addEventListener('click', e => {
    if (e.currentTarget.getAttribute('data-index-number') > -1) {
      loadModalData(e.currentTarget.getAttribute('data-index-number'));
    }
  });
}

/* Creates an interval to call the rotation function to rotate user image in the modal
*/
function timeImageRotation (startValue) {
  currentRotation = startValue;
  setInterval(rotateUserImage, 20);
}

/* Rotates the user image in the modal
*/
function rotateUserImage () {
  if (currentRotation < totalincrement) {
    currentRotation += 20;
    document.querySelector('.modal-img').style.transform = 'rotate(' + currentRotation + 'deg)';
  }
};
/*
* Fetches use data from randomUser site
*/
function loadUsers () {
  fetch (LOAD_REMOTE_USER_URL)
    .then(checkStatus)
    .then(res => res.json())
    .then(data => processReturnedData(data));
}

/*
* call page init and get the party started
*/
initPage();
