const bookSection = document.querySelector('.book-cards');
const add_item = document.querySelector('.add-item');
const overlay = document.querySelector('.overlay');
const bookForm = document.querySelector('.bookForm');
const submitBtn = document.querySelector('#submit');
const cancelBtn = document.querySelector('#cancel');
const bookIcons = document.querySelectorAll('.book-cards div.icon');

let bookCover = document.querySelector('#url');
let bookTitle = document.querySelector('#title');
let bookAuthor = document.querySelector('#author');
let bookPages = document.querySelector('#pages');
let haveRead = document.querySelector('#haveRead');

let myLibrary = [
  {
    title: "Lamb: The Gospel According to Biff, Christ's Childhood Pal",
    author: 'Chistopher Moore',
    pages: '464',
    haveRead: false,
    cover: 'https://www.chrismoore.com/wp-content/uploads/2013/08/LB_us_paperback2.jpg',
  },
];

// when page loads, display library
window.onload = displayBooks;

// if user presses '+', open form
add_item.addEventListener('click', openBookForm);

// if user presses cancel, close forrm
cancelBtn.addEventListener('click', closeForm);

submitBtn.addEventListener('click', () => {
  if (validForm()) {
    createNewBook();
    closeForm();
  }
});

function openBookForm() {
  // bring up overlay
  overlay.style.display = 'block';
  listenForOverlay();
}

function validForm() {
  return bookTitle.value != '' && bookAuthor.value != '' && bookPages.value != '';
}

function clearForm() {
  bookCover.value = bookAuthor.value = bookTitle.value = bookPages.value = '';
  haveRead.checked = false;
}

function closeForm() {
  overlay.style.display = 'none';
  bookForm.reset();
}

// if user clicks anywhere on overlay, close form
function listenForOverlay() {
  window.addEventListener('click', (e) => {
    if (e.target == overlay) closeForm();
  });
}

// BOOK CONSTRUCTOR AND FUNCTIONS

function Book(title, author, pages, haveRead, cover) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.haveRead = haveRead;
  this.cover = cover || 'https://angelofshiva.com/resources/assets/images/no-img.jpg';

  this.changeStatus = function () {
    this.haveRead = this.haveRead ? false : true;
  };
}

function displayBooks() {
  if (!myLibrary.length) return;

  myLibrary.forEach(loadBook);
}

function loadBook(book) {
  const libraryBook = new Book(book.title, book.author, book.pages, book.haveRead, book.cover);

  displayBook(libraryBook);
}

function createNewBook() {
  const newBook = new Book(
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
  displayBook(book);
}

function displayBook(book) {
  // create a div with class of card
  const card = document.createElement('div');
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

  // inside 'card-buttons', create an img with class of icon and remove with src of remove icon
  const removeIcon = document.createElement('img');
  removeIcon.classList.add('icon', 'remove');
  removeIcon.src = 'css/font/svg/008-remove.svg';
  cardButtons.appendChild(removeIcon);

  // remove book when user clicks removeIcon
  removeIcon.addEventListener('click', () => {
    const index = myLibrary.indexOf(book);
    myLibrary.splice(index, 1);

    card.remove();
  });

  // inside'card-buttons' create a div with class of icon and haveRead
  const readIcon = document.createElement('div');
  let status = book.haveRead ? 'completed' : 'reading';
  readIcon.classList.add('icon', status);
  // add event listener to icon

  // change status of book when user clicks readIcon
  readIcon.addEventListener('click', () => {
    book.changeStatus();
    readIcon.classList.toggle('completed');
    readIcon.classList.toggle('reading');
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
