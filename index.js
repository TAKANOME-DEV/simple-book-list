// Book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI constructor
class UI {
  addBookToList(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;

    const list = document.getElementById("book-list");
    list.appendChild(row);
  }

  clearInput() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  showAlert(msg, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

// Local Storage Construtor
class Store {
  static getBooksFromLS() {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBookToLS(book) {
    const books = Store.getBooksFromLS();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static displayBooksToUI() {
    const books = Store.getBooksFromLS();

    books.forEach((book) => {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }

  static removeBookFromLS(isbn) {
    const books = Store.getBooksFromLS();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event Listener For Add Book
document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);
  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill all the fields!", "error");
  } else {
    const books = Store.getBooksFromLS();
    const check = books.map((book) => book.isbn);

    // Check if isbn already exist
    if (check[0] === isbn) {
      ui.showAlert("ISBN Already Exist!", "error");
    } else {
      ui.addBookToList(book);
      ui.clearInput();
      ui.showAlert("Book Added!", "success");
      Store.addBookToLS(book);
    }
  }
});

// Event Listener For Delete Book
document.getElementById("book-list").addEventListener("click", (e) => {
  const ui = new UI();
  ui.deleteBook(e.target);
  ui.showAlert("Book Removed!", "success");
  Store.removeBookFromLS(
    e.target.parentElement.previousElementSibling.textContent
  );
});

// Event Listener For Get Books
document.addEventListener("DOMContentLoaded", () => {
  Store.displayBooksToUI();
});
