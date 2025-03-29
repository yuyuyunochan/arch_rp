import React from 'react';
import DataSet from './DataSet';
import './App.css'
import hamster from "./hamster.jpg"

const App = () => {
  const data = [
    { id: 1, Month: "January", Days: 31},
    { id: 2, Month: 'February', Days: 28 },
    { id: 3, Month: 'March', Days: 31 },
    { id: 4, Month: 'April', Days: 30 },
    { id: 5, Month: 'May', Days: 31 },

  ];

  const headers = [
    { label: 'ID' },
    { label: 'Month' },
    { label: 'Days' },
  ];

  const rowRenderer = (item) => (
    <>
      <td>{item.id}</td>
      <td>{item.Month}</td>
      <td>{item.Days}</td>
    </>
  );

  return (
    <div className='App'>
      <h1>DataSet
      <img src={hamster} alt="Описание" style={{ width: '50px', height: 'auto' }} />
      </h1>
      <DataSet
        headers={headers}
        data={data}
        rowRenderer={rowRenderer}
        onRowSelect={() => {}}
      />
    </div>
  );
};

export default App;