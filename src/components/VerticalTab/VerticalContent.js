import { Wrap } from "@chakra-ui/react";
import React from "react";

function VTcontent(props) {
  return (
    <Wrap
      key={props.index}
      style={
        props.activeTabId === props.index
          ? { display: "block" }
          : { display: "none" }
      }
      bg={"white"}
      w={"100%"}
      borderRadius={"20px"}
    >
      {props.children}
    </Wrap>
  );
}

export default VTcontent;
