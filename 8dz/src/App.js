import React from "react";
import TreeComponent from "./TreeComponent"
import "./App.css"

const App = () => {
  const treeData1 = {
    header: "Data grid 1",
    children: [
      { header: "@mui/x-data-grid", children: null },
      { header: "@mui/x-data-grid-pro", children: null },
      { header: "@mui/x-data-grid-premium", children: null },
    ],
  };

  const treeData2 = {
    header: "Data grid 2",
    children: [
      {
        header: "@mui/x-data-grid",
        children: [
          { header: "list", children: null },
          { header: "list", children: null },
        ],
      },
      {
        header: "@mui/x-data-grid-pro",
        children: [
          { header: "list", children: null },
          { header: "list", children: null },
        ],
      },
    ],
  };

  const treeData3 = {
    header: "Data grid 3",
    children: [
      {
        header: "@mui/x-data-grid-premium",
        children: [
          {
            header: "@mui/x-data-grid-pro",
            children: [
              { header: "list", children: null },
              { header: "list", children: null },
            ],
          },
          { header: "list", children: null },
        ],
      },
      {
        header: "@mui/x-data-grid",
        children: [
          { header: "list", children: null },
          { header: "list", children: null },
        ],
      },
    ],
  };

  return (
    <div className="App">
      <div className="Tree1" > 
      <TreeComponent data={treeData1} /></div>
      <div className="Tree2" > 
      <TreeComponent data={treeData2} /></div>
      <div className="Tree3" > 
      <TreeComponent data={treeData3} /></div>
    </div>
  );
};

export default App;