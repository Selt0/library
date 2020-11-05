const bookSection = document.querySelector('.book-cards');
const add_item = document.querySelector('.add-item');
const overlay = document.querySelector('.overlay');
const formSection = document.querySelector('.form-content');
const bookForm = document.querySelector('.bookForm');
const submitBtn = document.querySelector('#submit');
const cancelBtn = document.querySelector('#cancel');
const bookIcons = document.querySelectorAll('.book-cards div.icon');

let bookCover = document.querySelector('#url');
let bookTitle = document.querySelector('#title');
let bookAuthor = document.querySelector('#author');
let bookPages = document.querySelector('#pages');
let haveRead = document.querySelector('#haveRead');

let myLibrary = [];

window.onload = displayBooks;

/*
===================
WEBSITE INTERACTION
===================
*/

// if user presses '+', open form
add_item.addEventListener('click', openBookForm);

// if user presses cancel, close forrm
cancelBtn.addEventListener('click', closeFormAnimation);

submitBtn.addEventListener('click', (e) => {
  if (validForm()) {
    // prevents validation triggering when reset()
    e.preventDefault();

    createNewBook();
    closeFormAnimation();
  }
});

/*
===================
FORM FUNCTIONS
===================
*/

function openBookForm() {
  // bring up overlay
  overlay.style.display = 'block';
  formSection.classList.add('animate__fadeInDown');
  formSection.classList.remove('animate__bounceOutDown');
  listenForOverlay();
}

function closeFormAnimation() {
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 700);
  formSection.classList.remove('animate__fadeInDown');
  formSection.classList.add('animate__bounceOutDown');
  bookForm.reset();
}

function validForm() {
  return bookTitle.value != '' && bookAuthor.value != '' && bookPages.value != '';
}

// if user clicks anywhere on overlay, close form
function listenForOverlay() {
  window.addEventListener('click', (e) => {
    if (e.target == overlay) closeFormAnimation();
  });
}

/*
===================
BOOK CONSTRUCTOR AND FUNCTIONS
===================
*/

function Book(id, title, author, pages, haveRead, cover) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.haveRead = haveRead;
  this.cover = cover || 'https://angelofshiva.com/resources/assets/images/no-img.jpg';
}

function displayBooks() {
  if (!localStorage.getItem('myLibrary')) {
    populateStorage();
  } else {
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    myLibrary.forEach(loadBook);
  }
}

function loadBook(book) {
  const libraryBook = new Book(
    book.id,
    book.title,
    book.author,
    book.pages,
    book.haveRead,
    book.cover
  );

  displayBook(libraryBook);
}

function createNewBook() {
  const newBook = new Book(
    myLibrary.length,
    bookTitle.value,
    bookAuthor.value,
    bookPages.value,
    haveRead.checked,
    bookCover.value
  );

  addBookToLibrary(newBook);
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  updateStorage(myLibrary);
  displayBook(book);
}

function changeBookStatus(book) {
  book.haveRead = book.haveRead ? false : true;
}

function displayBook(book) {
  // create a div with class of card
  const card = document.createElement('div');
  card.setAttribute('id', book.id);
  card.classList.add('card');

  // inside 'card', create a nested div with a class of img-box
  const imgBox = document.createElement('div');
  imgBox.classList.add('img-box');
  card.appendChild(imgBox);

  // inside 'img-box', create an img with src of book.cover and class of book-cover
  const cover = document.createElement('img');
  cover.src = book.cover;
  cover.classList.add('book-cover');
  imgBox.appendChild(cover);

  //inside 'img-box', create a div with class of card-buttons
  const cardButtons = document.createElement('div');
  cardButtons.classList.add('card-buttons');
  imgBox.appendChild(cardButtons);

  // inside 'card-buttons', create an img with class of icon and remove
  const removeIcon = document.createElement('img');
  removeIcon.classList.add('icon', 'remove');
  removeIcon.src = 'css/font/svg/008-remove.svg';
  cardButtons.appendChild(removeIcon);

  // remove book when user clicks removeIcon
  removeIcon.addEventListener('click', () => {
    myLibrary = myLibrary.filter((b) => b.id != book.id);
    updateStorage(myLibrary);
    card.remove();
  });

  // inside'card-buttons' create a div with class of icon and haveRead
  const readIcon = document.createElement('div');
  let status = book.haveRead ? 'completed' : 'reading';
  readIcon.classList.add('icon', status);

  // change status of book when user clicks readIcon
  readIcon.addEventListener('click', () => {
    changeBookStatus(myLibrary[book.id]);
    readIcon.classList.toggle('completed');
    readIcon.classList.toggle('reading');
    updateStorage(myLibrary);
  });

  cardButtons.appendChild(readIcon);

  // inside 'card', create an h2 with class of book-title
  const title = document.createElement('h2');
  title.classList.add('book-title');
  title.textContent = book.title;
  card.appendChild(title);

  // inside 'card', create an h3 with class of book-author
  const author = document.createElement('h3');
  author.classList.add('book-author');
  author.textContent = book.author;
  card.appendChild(author);

  //append card to section with class book-cards
  bookSection.appendChild(card);
}

// LOCAL STORAGE

// test for local storage
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

if (storageAvailable('localStorage')) {
  console.log('connected');
} else {
  console.log('no storage available');
}

function populateStorage() {
  const newUserBook = new Book(
    0,
    "Lamb: The Gospel According to Biff, Christ's Childhood Pal",
    'Chistopher Moore',
    464,
    false,
    'https://www.chrismoore.com/wp-content/uploads/2013/08/LB_us_paperback2.jpg'
  );

  addBookToLibrary(newUserBook);
}

function updateStorage(library) {
  localStorage.clear();
  localStorage.setItem('myLibrary', JSON.stringify(library));
}
