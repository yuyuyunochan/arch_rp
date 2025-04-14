import React from "react";

const DataPage = ({ people }) => {
  return (
    <div>
      <h2>Введенные данные</h2>
      {people.length === 0 ? (
        <p>Нет данных</p>
      ) : (
        <ul>
          {people.map((person, index) => (
            <li className="person" key={index}>
              <strong>Имя:</strong> {person.name}, <strong>Возраст:</strong> {person.age},{" "}
              <strong>Email:</strong> {person.email}
              <ul>
                {person.pet.map((pet, petIndex) => (
                  <li className="pet" key={petIndex}>
                    <strong>Питомец:</strong> {pet.name}, <strong>Возраст:</strong> {pet.age}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataPage;