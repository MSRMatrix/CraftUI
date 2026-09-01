import type { EditorElement } from "../../../types/editor";

type PreviewProps = {
  editorArray: EditorElement[];

  generateHtml: (
    element: EditorElement,
  ) => string;
};

const Preview = ({
  editorArray,
  generateHtml,
}: PreviewProps) => {
  return (
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
  );
};

export default Preview;