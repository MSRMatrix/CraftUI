import { useState } from "react";
import type { EditorElement } from "../../../types/editor";

type ElementEditorProps = {
  selectedElement: EditorElement | undefined;
  updateElementContent: (
    id: number,
    content: string,
  ) => void;
  updateElementClassName: (
    id: number,
    className: string,
  ) => void;
};

const ElementEditor = ({
  selectedElement,
  updateElementContent,
  updateElementClassName,
}: ElementEditorProps) => {
  /*
   * ==========================================
   * EDITOR STATE
   * ==========================================
   */

  const [openEditor, setOpenEditor] =
    useState(false);

  const [content, setContent] =
    useState(
      selectedElement?.content ?? "",
    );

  /*
   * ==========================================
   * ELEMENT NICHT AUSGEWÄHLT
   * ==========================================
   */

  if (!selectedElement) {
    return (
      <div className="element-editor">
        <h2>Element bearbeiten</h2>

        <p>
          Wähle ein Element aus.
        </p>
      </div>
    );
  }

  /*
   * ==========================================
   * CONTENT ÄNDERN
   * ==========================================
   */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateElementContent(
      selectedElement.id,
      content,
    );

    setOpenEditor(false);
  };

  /*
   * ==========================================
   * JSX
   * ==========================================
   */

  return (
    <div className="element-editor">
      <h2>Element bearbeiten</h2>

      {/*
       * ======================================
       * AUSGEWÄHLTES ELEMENT
       * ======================================
       */}

      <div className="selected-element">
        <span>Element:</span>

        <strong>
          &lt;
          {selectedElement.elementName}
          &gt;
        </strong>
      </div>

      {/*
       * ======================================
       * TEXT EDITOR
       * ======================================
       */}

      <form onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={() =>
            setOpenEditor(!openEditor)
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

      {/*
       * ======================================
       * CLASSNAME EDITOR
       * ======================================
       */}

      <div className="class-editor">
        <label htmlFor="className">
          Klassenname
        </label>

        <input
          id="className"
          type="text"
          value={
            selectedElement.className
          }
          onChange={(event) =>
            updateElementClassName(
              selectedElement.id,
              event.target.value,
            )
          }
        />
      </div>
    </div>
  );
};

export default ElementEditor;