import React from 'react';

const DataSet = ({
  headers = [],
  data = [],
  rowRenderer = (item) => Object.values(item).map((value) => <td>{value}</td>),
  headerRenderer = (header) => <th>{header.label}</th>,
  selectedRows = [],
  onRowSelect = () => {},
}) => {
  const defaultHeaders = headers.length > 0
    ? headers
    : data.length > 0
    ? Object.keys(data[0]).map((key) => ({ label: key }))
    : [];

  const handleRowClick = (index, event) => {
    const isCtrlPressed = event.ctrlKey;

    if (isCtrlPressed) {
      const updatedSelected = selectedRows.includes(index)
        ? selectedRows.filter((selectedIndex) => selectedIndex !== index)
        : [...selectedRows, index];
      onRowSelect(updatedSelected);
    } else {
      if (selectedRows.length === 1 && selectedRows[0] === index) {
        onRowSelect([]);
      } else {
        onRowSelect([index]);
      }
    }
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {defaultHeaders.map((header, index) => (
              <th className="headTable" key={index}>
                {headerRenderer(header)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={(event) => handleRowClick(index, event)}
              className={selectedRows.includes(index) ? 'selected' : ''}
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