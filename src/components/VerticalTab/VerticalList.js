import { Button } from "@chakra-ui/react";
import React from "react";

function VTlist({ onClick, data, index, activeTabId }) {
  const handleClickButton = () => {
    onClick(data.infor.tab);
  };

  return (
    <li key={index} style={{ listStyle: "none", textAlign: "left" }}>
      <Button
        flex={"auto"}
        gap={"10px"}
        onClick={handleClickButton}
        bg={activeTabId === data.infor.tab ? "gray.100" : "transparent"}
        style={
          activeTabId === data.infor.tab
            ? { color: "#3182ce" }
            : { color: "#8892b0" }
        }
      >
        {data.infor.iconMenu}
        {data.infor.name}
      </Button>
    </li>
  );
}

export default VTlist;
