import { useState } from "react";
import { parse } from "node-html-parser";
export default function Home() {
  const [html, setHtml] = useState(""); // State to hold HTML input
  const [result, setResult] = useState(null); // State to hold the parsed result

  function convertStyleStringToObject(styleString) {
    const styleArray = styleString?.split(";")?.filter(Boolean);
    const styleObject = {};

    styleArray?.forEach((style) => {
      const [key, value] = style.split(":").map((item) => item.trim());

      // Remove '-' and capitalize the character immediately following it

      const formattedKey = key.replace(/-(\w)/g, (_, letter) =>
        letter.toUpperCase()
      );

      styleObject[formattedKey] = value;
    });

    return styleObject;
  }

  function childrenParser(children) {
    let result = [];
    children?.map((child) => {
      if (child?.rawTagName) {
        result.push({
          tag: child?.rawTagName?.toLowerCase(),
          text: child?.firstChild?.rawText?.trim(),
          id: child?.id,
          class: child?.classNames,
          style: convertStyleStringToObject(child?.attrs?.style),
          children: childrenParser(child?.childNodes) || [],
        });
      }
    });
    return result;
  }

  const handleSubmit = async () => {
    const root = parse(html);
    console.log(root?.firstChild?.id, root?.firstChild?.classNames);
    const htmlElement = root.querySelector(
      root?.firstChild?.classNames
        ? `.${root?.firstChild?.classNames}`
        : root?.firstChild?.id
        ? `#${root?.firstChild?.id}`
        : root?.firstChild?.rawTagName
    );
    //console.log(htmlElement);
    const result = {
      tag: htmlElement?.rawTagName?.toLowerCase(),
      text: htmlElement?.firstChild?.rawText?.trim(),
      id: htmlElement?.id,
      class: htmlElement?.classNames,
      style: convertStyleStringToObject(htmlElement?.attrs?.style),
      children: childrenParser(htmlElement?.childNodes) || [],
    };
    setResult(result);
    //console.log(result);
  };

  return (
    <div className="text-white flex flex-col md:grid md:grid-cols-2 w-full bg-black text-sm p-3 gap-3">
      <div className="flex flex-col gap-3">
        <h1>HTML to Object Converter</h1>
        <textarea
          rows="14"
          cols="50"
          className="text-black p-3 "
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
