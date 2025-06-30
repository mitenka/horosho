import React from "react";
import BoxBreathing from "./BoxBreathing";
import Cards from "./Cards";
import Checklist from "./Checklist";
import Heading from "./Heading";
import List from "./List";
import Note from "./Note";
import Paragraph from "./Paragraph";
import Quote from "./Quote";
import Quiz from "./Quiz";
import Scenario from "./Scenario";

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
      return <Note text={element.text} color={color} />;
    case "checklist":
      return <Checklist items={element.items} title={element.title} color={color} />;
    case "boxBreathing":
      return <BoxBreathing color={color} />;
    case "cards":
      return <Cards cards={element.cards} color={color} />;
    case "quiz":
      return <Quiz questions={element.questions} color={color} />;
    case "scenario":
      return <Scenario title={element.title} situation={element.situation} options={element.options} color={color} />;
    default:
      console.log(`Unknown element type: ${element.type}`);
      return null;
  }
}
