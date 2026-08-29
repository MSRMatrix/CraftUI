import { useState } from "react";
import type { DragEvent } from "react";

type HtmlElement =
  | "header"
  | "nav"
  | "main"
  | "section"
  | "article"
  | "div"
  | "h1"
  | "h2"
  | "p"
  | "a"
  | "button"
  | "img";

const Editor = () => {
  const [droppedElements, setDroppedElements] = useState<string[]>([]);

  const htmlElements: HtmlElement[] = [
    "header",
    "nav",
    "main",
    "section",
    "article",
    "div",
    "h1",
    "h2",
    "p",
    "a",
    "button",
    "img",
  ];

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    element: HtmlElement,
  ) => {
    event.dataTransfer.setData("element", element);
  };

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    const element = event.dataTransfer.getData("element");

    if (!element) return;

    const htmlElement = `<${element}></${element}>`;

    setDroppedElements((prev) => [
      ...prev,
      htmlElement,
    ]);
  };

  return (
    <div className="editor">

      <div className="element-list">
        {htmlElements.map((item) => (
          <div
            className="div-elements"
            key={item}
            draggable
            onDragStart={(event) =>
              handleDragStart(event, item)
            }
          >
            {item}
          </div>
        ))}
      </div>

      <div
        className="editor-canvas"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >test
        {droppedElements.map((element, index) => (
          <div key={index}>
            {element}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Editor;