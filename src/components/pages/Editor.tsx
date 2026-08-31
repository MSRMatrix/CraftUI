import { useState, type DragEvent } from "react";

import type {
  EditorElement,
  HtmlElement,
} from "../../types/editor";

import useEditor from "../../services/useEditor";

const Editor = () => {
  /*
   * ==========================================
   * EDITOR LOGIK
   * ==========================================
   */

  const {
    editorArray,
    handleDragStart,
    handleDragOver,
    handleDrop,
    generateHtml,
    deleteElement,
    updateElementContent,
  } = useEditor();

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
   * EDITOR STATE
   * ==========================================
   */

  const [selectedElement, setSelectedElement] =
    useState<number | null>(null);

  const [openEditor, setOpenEditor] =
    useState(false);

  const [content, setContent] =
    useState("");

  /*
   * ==========================================
   * ELEMENT AUSWÄHLEN
   * ==========================================
   */

  const selectElement = (
    element: EditorElement,
  ) => {
    setSelectedElement(element.id);
    setContent(element.content);
    setOpenEditor(true);
  };

  /*
   * ==========================================
   * CONTENT ÄNDERN
   * ==========================================
   */

  const changeElementContent = (
    id: number,
    newContent: string,
  ) => {
    updateElementContent(
      id,
      newContent,
    );
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
          onDrop={(
            event: DragEvent<HTMLDivElement>,
          ) =>
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

        <div
          className="element-box"
          onClick={() =>
            selectElement(element)
          }
        >
          {/*
           * ELEMENT LABEL
           */}

          <div className="element-label">
            &lt;{element.elementName}&gt;
          </div>

          {/*
           * CONTENT
           */}

          {element.content && (
            <div className="element-content">
              {element.content}
            </div>
          )}

          {/*
           * ==================================
           * INSIDE
           * ==================================
           */}

          {element.elementName !== "img" && (
            <div
              className="drop-zone drop-inside"
              onDragOver={handleDragOver}
              onDrop={(
                event: DragEvent<HTMLDivElement>,
              ) => {
                handleDrop(
                  event,
                  element.id,
                  "inside",
                );
              }}
            >
              {element.children.length === 0
                ? "Hier hineinziehen"
                : element.children.map(
                    renderElement,
                  )}
            </div>
          )}

          {/*
           * ==================================
           * DELETE
           * ==================================
           */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              deleteElement(
                element.id,
              );

              if (
                selectedElement ===
                element.id
              ) {
                setSelectedElement(null);
                setOpenEditor(false);
                setContent("");
              }
            }}
          >
            Löschen
          </button>
        </div>

        {/*
         * ==================================
         * AFTER
         * ==================================
         */}

        <div
          className="drop-zone drop-after"
          onDragOver={handleDragOver}
          onDrop={(
            event: DragEvent<HTMLDivElement>,
          ) =>
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
            onDragStart={(
              event: DragEvent<HTMLDivElement>,
            ) =>
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
        onDrop={(
          event: DragEvent<HTMLDivElement>,
        ) =>
          handleDrop(event)
        }
      >
        {editorArray.length === 0 && (
          <p>
            Ziehe ein HTML-Element
            hier hinein.
          </p>
        )}

        {editorArray.map(
          renderElement,
        )}
      </div>

      {/*
       * ======================================
       * ELEMENT EDITOR
       * ======================================
       */}

      <div className="element-editor">

        <h2>Element bearbeiten</h2>

        {selectedElement === null ? (
          <p>
            Wähle ein Element aus.
          </p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (
                selectedElement === null
              ) {
                return;
              }

              changeElementContent(
                selectedElement,
                content,
              );

              setOpenEditor(false);
            }}
          >
            {/*
             * ==================================
             * TEXT EDITOR
             * ==================================
             */}

            <button
              type="button"
              onClick={() =>
                setOpenEditor(
                  !openEditor,
                )
              }
            >
              Text einfügen
            </button>

            {openEditor && (
              <>
                <input
                  type="text"
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value,
                    )
                  }
                />

                <button type="submit">
                  Ändern
                </button>
              </>
            )}
          </form>
        )}
      </div>

      {/*
       * ======================================
       * HTML VORSCHAU
       * ======================================
       */}

      <div className="editor-window">
        <h2>Vorschau</h2>

        <div
          className="preview"
          dangerouslySetInnerHTML={{
            __html: editorArray
              .map((element) =>
                generateHtml(element),
              )
              .join(""),
          }}
        />
      </div>
    </div>
  );
};

export default Editor;