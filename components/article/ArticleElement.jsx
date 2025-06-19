import React from "react";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

export default function ArticleElement({ element }) {
  switch (element.type) {
    case "heading":
      return <Heading text={element.text} />;
    case "paragraph":
      return <Paragraph text={element.text} />;
    default:
      console.log(`Unknown element type: ${element.type}`);
      return null;
  }
}
