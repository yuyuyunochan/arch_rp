import React, { useEffect } from "react";
import Book from "./Book";
import './App.css';
import altPhoto from './img/altPhoto.png';

function App() {
  const [books, setBooks] = React.useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
    const response = await fetch('https://fakeapi.extendsclass.com/books');
    const data = await response.json();
    const booksWithImages = await Promise.all(data.map(async (book) => {
        const imageUrl = await fetchBookImage(book.isbn);
        return { ...book, imageUrl };
    }));
    setBooks(booksWithImages);
  };

  const fetchBookImage = async (isbn) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data = await response.json();
    return data.items && data.items.length > 0 ? data.items[0].volumeInfo.imageLinks.thumbnail : altPhoto;
  };

  fetchBooks();
}, []);
return (
  <div className="App">
    <Book books={books} />
  </div>
);
}

export default App;