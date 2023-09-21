import { useState } from "react";
import { parse } from "node-html-parser";

export default function Home() {
  const [html, setHtml] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const root = parse(html);
    const firstChild = root.firstChild;

    const selector = firstChild
      ? firstChild.classNames
        ? `.${firstChild.classNames}`
        : firstChild.id
        ? `#${firstChild.id}`
        : firstChild.rawTagName
      : "";

    const htmlElement = root.querySelector(selector);

    const result = parseHtmlElement(htmlElement);
    setResult(result);
  };

  const parseHtmlElement = (element) => {
    if (!element) return null;

    const { rawTagName, firstChild, id, classNames, attrs, childNodes } = element;

    const result = {
      tag: rawTagName?.toLowerCase(),
      text: firstChild?.rawText?.trim(),
      id,
      class: classNames,
      style: convertStyleStringToObject(attrs?.style),
      children: parseChildNodes(childNodes) || [],
    };

    return result;
  };

  const parseChildNodes = (children) => {
    if (!children) return null;

    return children.map((child) => child.rawTagName && parseHtmlElement(child)).filter(Boolean);
  };

  const convertStyleStringToObject = (styleString) => {
    if (!styleString) return {};

    const styleArray = styleString.split(";").filter(Boolean);
    const styleObject = {};

    styleArray.forEach((style) => {
      const [key, value] = style.split(":").map((item) => item.trim());
      const formattedKey = key.replace(/-(\w)/g, (_, letter) =>
        letter.toUpperCase()
      );

      styleObject[formattedKey] = value;
    });

    return styleObject;
  };

  return (
    <div className="text-white flex flex-col md:grid md:grid-cols-2 w-full bg-black text-sm p-3 gap-3">
      <div className="flex flex-col gap-3">
        <h1>HTML to Object Converter</h1>
        <textarea
          rows="14"
          cols="50"
          className="text-black p-3"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 hover:opacity-100 opacity-90 p-3"
          onClick={handleSubmit}
        >
          Convert
        </button>
      </div>
      {result && (
        <div className="flex flex-col gap-3 max-h-[95vh] overflow-auto">
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
