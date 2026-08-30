import { useRef, useState } from "react";
import type { DragEvent } from "react";
import type { DropType, EditorElement, HtmlElement } from "../../types/editor";

const Editor = () => {
  const [editorArray, setEditorArray] = useState<
    EditorElement[]
  >([]);

  /*
   * ==========================================
   * ID
   * ==========================================
   *
   * useRef speichert die aktuelle ID,
   * ohne bei jeder Änderung einen Render
   * auszulösen.
   */

  const currentId = useRef(0);

  /*
   * ==========================================
   * HTML ELEMENTE
   * ==========================================
   */

  const htmlElements: HtmlElement[] = [
    "header",
    "nav",
    "main",
    "section",
    "article",
    "aside",
    "footer",
    "div",
    "h1",
    "h2",
    "h3",
    "p",
    "a",
    "button",
    "img",
  ];

  /*
   * ==========================================
   * DRAG START
   * ==========================================
   */

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    element: HtmlElement,
  ) => {
    event.dataTransfer.setData(
      "element",
      element,
    );
  };

  /*
   * ==========================================
   * DRAG OVER
   * ==========================================
   */

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
  };

  /*
   * ==========================================
   * ELEMENT HINZUFÜGEN
   * ==========================================
   */

  const addElement = (
    elements: EditorElement[],
    targetId: number,
    newElement: EditorElement,
    dropType: DropType,
  ): EditorElement[] => {
    return elements.flatMap((element) => {
      /*
       * Ziel gefunden
       */

      if (element.id === targetId) {
        /*
         * ==============================
         * INSIDE
         * ==============================
         */

        if (dropType === "inside") {
          return [
            {
              ...element,
              children: [
                ...element.children,
                newElement,
              ],
            },
          ];
        }

        /*
         * ==============================
         * BEFORE
         * ==============================
         */

        if (dropType === "before") {
          return [
            newElement,
            element,
          ];
        }

        /*
         * ==============================
         * AFTER
         * ==============================
         */

        if (dropType === "after") {
          return [
            element,
            newElement,
          ];
        }
      }

      /*
       * ==============================
       * REKURSIV IN KINDERN SUCHEN
       * ==============================
       */

      return [
        {
          ...element,
          children: addElement(
            element.children,
            targetId,
            newElement,
            dropType,
          ),
        },
      ];
    });
  };

  /*
   * ==========================================
   * DROP
   * ==========================================
   */

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    targetId?: number,
    dropType?: DropType,
  ) => {
    event.preventDefault();

    /*
     * Verhindert, dass das Drop-Event
     * zusätzlich an die Canvas weitergegeben wird.
     */

    event.stopPropagation();

    const element = event.dataTransfer.getData(
      "element",
    ) as HtmlElement;

    if (!element) {
      return;
    }

    /*
     * Neue ID erzeugen
     */

    const newElement: EditorElement = {
      id: ++currentId.current,
      elementName: element,
      className: "",
      content: "",
      children: [],
    };

    /*
     * ======================================
     * KEIN ZIEL
     * ======================================
     *
     * Element kommt auf die oberste Ebene.
     */

    if (!targetId || !dropType) {
      setEditorArray((prev) => [
        ...prev,
        newElement,
      ]);

      return;
    }

    /*
     * ======================================
     * ELEMENT EINFÜGEN
     * ======================================
     */

    setEditorArray((prev) =>
      addElement(
        prev,
        targetId,
        newElement,
        dropType,
      ),
    );
  };

  /*
   * ==========================================
   * HTML GENERIEREN
   * ==========================================
   */

  const generateHtml = (
    element: EditorElement,
  ): string => {
    /*
     * Class-Attribut erzeugen
     */

    const classAttribute =
      element.className
        ? ` class="${element.className}"`
        : "";

    /*
     * Kinder in HTML umwandeln
     */

    const children = element.children
      .map((child) =>
        generateHtml(child),
      )
      .join("");

    /*
     * IMG besitzt keinen schließenden Tag.
     */

    if (
      element.elementName === "img"
    ) {
      return `<img${classAttribute}>`;
    }

    /*
     * Normale HTML-Elemente
     */

    return `<${element.elementName}${classAttribute}>${element.content}${children}</${element.elementName}>`;
  };

  /*
   * ==========================================
   * ELEMENT RENDERN
   * ==========================================
   */

  const renderElement = (
    element: EditorElement,
  ) => {
    return (
      <div
        key={element.id}
        className="canvas-element"
      >
        {/*
         * ==================================
         * BEFORE
         * ==================================
         */}

        <div
          className="drop-zone drop-before"
          onDragOver={handleDragOver}
          onDrop={(event) =>
            handleDrop(
              event,
              element.id,
              "before",
            )
          }
        >
          Vorher einfügen
        </div>

        {/*
         * ==================================
         * ELEMENT
         * ==================================
         */}

        <div className="element-box">
          <div className="element-label">
            &lt;{element.elementName}&gt;
          </div>

          {/*
           * ==================================
           * INSIDE
           * ==================================
           */}

          {element.elementName !== "img" && (
            <div
              className="drop-zone drop-inside"
              onDragOver={handleDragOver}
              onDrop={(event) =>
                handleDrop(
                  event,
                  element.id,
                  "inside",
                )
              }
            >
              {element.children.length ===
              0 ? (
                "Hier hineinziehen"
              ) : (
                element.children.map(
                  renderElement,
                )
              )}
            </div>
          )}
        </div>

        {/*
         * ==================================
         * AFTER
         * ==================================
         */}

        <div
          className="drop-zone drop-after"
          onDragOver={handleDragOver}
          onDrop={(event) =>
            handleDrop(
              event,
              element.id,
              "after",
            )
          }
        >
          Nachher einfügen
        </div>
      </div>
    );
  };

  /*
   * ==========================================
   * JSX
   * ==========================================
   */

  return (
    <div className="editor">

      {/*
       * ======================================
       * ELEMENT LIST
       * ======================================
       */}

      <div className="element-list">
        <h2>HTML Elemente</h2>

        {htmlElements.map((item) => (
          <div
            key={item}
            className="div-elements"
            draggable
            onDragStart={(event) =>
              handleDragStart(
                event,
                item,
              )
            }
          >
            {item}
          </div>
        ))}
      </div>

      {/*
       * ======================================
       * CANVAS
       * ======================================
       */}

      <div
        className="editor-canvas"
        onDragOver={handleDragOver}
        onDrop={(event) =>
          handleDrop(event)
        }
      >
        {editorArray.length === 0 && (
          <p>
            Ziehe ein HTML-Element hier
            hinein.
          </p>
        )}

        {editorArray.map(
          renderElement,
        )}
      </div>

      {/*
       * ======================================
       * HTML AUSGABE
       * ======================================
       */}

      <div className="editor-window">
        <h2>HTML</h2>

        <pre>
          {editorArray
            .map((element) =>
              generateHtml(element),
            )
            .join("\n")}
        </pre>
      </div>

    </div>
  );
};

export default Editor;