import React, { useState } from 'react';

const DataSet = ({
  headers = [],
  data = [],
  rowRenderer = (item) => Object.values(item).map((value) => <td>{value}</td>),
  headerRenderer = (header) => <th>{header.label}</th>,
  selectedRows = [],
  onRowSelect = () => {},
}) => {
  const defaultHeaders = headers.length > 0 ? headers : Object.keys(data[0] || {}).map((key) => ({ label: key }));

  const [selected, setSelected] = useState(selectedRows);

  const handleRowClick = (index, event) => {
    const isCtrlPressed = event.ctrlKey;

    if (isCtrlPressed) {
      const updatedSelected = selected.includes(index)
        ? selected.filter((selectedIndex) => selectedIndex !== index)
        : [...selected, index];
      setSelected(updatedSelected);
    } else {
      if (selected.length === 1 && selected[0] === index) {
        setSelected([]);
      } else {
        setSelected([index]);
      }
    }

    onRowSelect(index);
  };

  return (
    <div>
      <table className="data-table">
        <thead>
            {defaultHeaders.map((header, index) => (
              <th className='headTable' key={index}>{headerRenderer(header)}</th>
            ))}
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={(event) => handleRowClick(index, event)}
              className={selected.includes(index) ? 'selected' : ''}
              style={{borderLeft: selected.includes(index) ? '8px solid rgb(7, 59, 42)' : 'none'}} 
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