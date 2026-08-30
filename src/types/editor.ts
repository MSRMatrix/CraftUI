export type HtmlElement =
  | "header"
  | "nav"
  | "main"
  | "section"
  | "article"
  | "aside"
  | "footer"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "a"
  | "button"
  | "img";

export type EditorElement = {
  id: number;
  elementName: HtmlElement;
  className: string;
  content: string;
  children: EditorElement[];
};

export type DropType =
  | "before"
  | "inside"
  | "after";