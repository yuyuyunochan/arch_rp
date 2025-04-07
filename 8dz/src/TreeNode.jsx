import React, { useState } from "react";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderHeader = () => {
    return (
      <div className={`tree-header-${isOpen ? "Open" : ""}`} onClick={toggleOpen}>
        {node.header}
        {node.children ? (isOpen ? "▴" : "▾") : ""}
      </div>
    );
  };
  const renderChildren = () => {
    if (!node.children || !isOpen) return null;

    return (
      <ul className="tree-list">
        {node.children.map((child, index) => (
          <li  className="tree-item" key={index}>
            <TreeNode node={child} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {renderHeader()}
      {renderChildren()}
    </div>
  );
};

export default TreeNode;