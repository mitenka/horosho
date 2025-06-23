import React from "react";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import List from "./List";

export default function ArticleElement({ element, color = "#7CB342" }) {
  switch (element.type) {
    case "heading":
      return <Heading text={element.text} />;
    case "paragraph":
      return <Paragraph text={element.text} />;
    case "list":
      return <List items={element.items} color={color} />;
    default:
      console.log(`Unknown element type: ${element.type}`);
      return null;
  }
}
