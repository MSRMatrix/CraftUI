import { useRef, useState } from "react";
import type { DragEvent } from "react";

import type {
  DropType,
  EditorElement,
  HtmlElement,
} from "../types/editor";

const useEditor = () => {
  /*
   * ==========================================
   * STATE
   * ==========================================
   */

  const [editorArray, setEditorArray] = useState<
    EditorElement[]
  >([]);

  /*
   * ==========================================
   * ID
   * ==========================================
   *
   * useRef speichert die aktuelle ID,
   * ohne einen neuen Render auszulösen.
   */

  const currentId = useRef(0);

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
   *
   * Verhindert das Standardverhalten des Browsers,
   * damit die Canvas als Drop-Ziel funktioniert.
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
       * ======================================
       * ZIEL GEFUNDEN
       * ======================================
       */

      if (element.id === targetId) {
        /*
         * ==============================
         * INSIDE
         * ==============================
         *
         * Neues Element wird Kind des
         * gefundenen Elements.
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
         *
         * Neues Element wird vor das
         * Ziel-Element gesetzt.
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
         *
         * Neues Element wird nach das
         * Ziel-Element gesetzt.
         */

        if (dropType === "after") {
          return [
            element,
            newElement,
          ];
        }
      }

      /*
       * ======================================
       * REKURSIV IN KINDERN SUCHEN
       * ======================================
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
     * zusätzlich an übergeordnete Elemente
     * weitergegeben wird.
     */

    event.stopPropagation();

    /*
     * Welches HTML-Element wurde gezogen?
     */

    const element = event.dataTransfer.getData(
      "element",
    ) as HtmlElement;

    if (!element) {
      return;
    }

    /*
     * ======================================
     * NEUES ELEMENT
     * ======================================
     */

    const newElement: EditorElement = {
      id: ++currentId.current,
      elementName: element,
      className: element,
      content: "",
      children: [],
    };

    /*
     * ======================================
     * KEIN ZIEL
     * ======================================
     *
     * Das Element wird auf die oberste Ebene
     * der Canvas gesetzt.
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
   *
   * Wandelt unseren Editor-Baum in einen
   * HTML-String um.
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
     * Kinder ebenfalls in HTML umwandeln
     */

    const children = element.children
      .map((child) =>
        generateHtml(child),
      )
      .join("");

    /*
     * ======================================
     * IMG
     * ======================================
     *
     * img besitzt keinen schließenden Tag.
     */

    if (
      element.elementName === "img"
    ) {
      return `<img${classAttribute}>`;
    }

    /*
     * ======================================
     * NORMALE ELEMENTE
     * ======================================
     */

    return `<${element.elementName}${classAttribute}>${element.content}${children}</${element.elementName}>`;
  };

  /*
   * ==========================================
   * ELEMENT LÖSCHEN
   * ==========================================
   *
   * Noch nicht zwingend für das UI nötig,
   * aber bereits vorbereitet.
   */

  const removeElement = (
    elements: EditorElement[],
    id: number,
  ): EditorElement[] => {
    return elements
      .filter(
        (element) =>
          element.id !== id,
      )
      .map((element) => ({
        ...element,

        children: removeElement(
          element.children,
          id,
        ),
      }));
  };

  const deleteElement = (
    id: number,
  ) => {
    setEditorArray((prev) =>
      removeElement(prev, id),
    );
  };

  /*
   * ==========================================
   * RETURN
   * ==========================================
   *
   * Alles, was die Editor-Komponente
   * benötigt.
   */
const updateElementContent = (
  id: number,
  content: string,
) => {
  setEditorArray((prev) => {
    const updateChildren = (
      elements: EditorElement[],
    ): EditorElement[] => {
      return elements.map((element) => {
        if (element.id === id) {
          return {
            ...element,
            content,
          };
        }

        return {
          ...element,
          children: updateChildren(
            element.children,
          ),
        };
      });
    };

    return updateChildren(prev);
  });
};
  return {
    editorArray,
    handleDragStart,
    handleDragOver,
    handleDrop,
    generateHtml,
    deleteElement,
    updateElementContent
  };
};

export default useEditor;