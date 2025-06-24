import React from "react";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import List from "./List";
import Quote from "./Quote";
import Note from "./Note";
import Checklist from "./Checklist";

export default function ArticleElement({ element, color = "#7CB342" }) {
  switch (element.type) {
    case "heading":
      return <Heading text={element.text} />;
    case "paragraph":
      return <Paragraph text={element.text} />;
    case "list":
      return <List items={element.items} title={element.title} color={color} />;
    case "quote":
      return <Quote text={element.text} author={element.author} color={color} />;
    case "note":
      return <Note text={element.text} />;
    case "checklist":
      return <Checklist items={element.items} title={element.title} color={color} />;
    default:
      console.log(`Unknown element type: ${element.type}`);
      return null;
  }
}
