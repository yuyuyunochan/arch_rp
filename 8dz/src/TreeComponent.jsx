import React from "react";
import TreeNode from "./TreeNode";

const TreeComponent = ({ data }) => {
  return (
    <div className="Node">
      <h1>Tree Component</h1>
      <TreeNode  className="node"  node={data}/>
    </div>
  );
};

export default TreeComponent;