import React from "react";
import Button from "./Button";

function Book({ ...props }) {
    if (!props.books || props.books.length === 0) {
        return <p>Книг не найдено.</p>;
    }

    return (
        <div className="book_card">
            {props.books.map((book, id) => (
                <div key={id} className="card">
                    <img src={book.imageUrl} alt={book.title} />
                    <p>{book.title}</p>
                    <p className="Authors_text">{book.authors.join(', ')}</p>
                    <Button />
                </div>
            ))}
        </div>
        );
}

export default Book;

            