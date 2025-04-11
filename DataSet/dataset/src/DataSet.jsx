// DataSet.jsx
import React from 'react';

const DataSet = ({
  headers = [],
  data = [],
  rowRenderer = (item) => Object.values(item).map((value) => <td>{value}</td>),
  selectedRows = [],
  onRowSelect = () => {},
}) => {
  const handleRowClick = (item, event) => {
    onRowSelect(item.id, event); // Передаем ID элемента и событие
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th className="headTable" key={index}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              onClick={(event) => handleRowClick(item, event)}
              className={selectedRows.includes(item.id) ? 'selected' : ''}
            >
              {rowRenderer(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataSet;