'use client'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import { DOMParser } from "xmldom";
import { parse } from 'node-html-parser';

export default function handler(req, res) {
  const html = req.body.html; // HTML input from the request body

  const parseHTML = (html) => {
    // Parse HTML and create the object as specified
    // (You can use the code from the previous response here)
      //const parser = new DOMParser();
      const doc = parse('<ul id="list"><li>Hello World</li></ul>');
      const element = doc.querySelector("#list");
    
      function parseElement(el) {
        const result = {
          tag: el.tagName.toLowerCase(),
          text: el.firstChild ? el.firstChild.textContent.trim() : "",
          style: {},
        };
    
        if (el.id) {
          result.id = el.id;
        }
    
        if (el.className) {
          result.class = el.className;
        }
    
        const computedStyle = window.getComputedStyle(el);
        for (let i = 0; i < computedStyle.length; i++) {
          const prop = computedStyle[i];
          result.style[prop] = computedStyle.getPropertyValue(prop);
        }
    
        if (el.children.length > 0) {
          result.children = Array.from(el.children).map((child) =>
            parseElement(child)
          );
        }
    
        return result;
      }
      parseElement(element);
  };

  const result = parseHTML(html);

  res.status(200).json(result);
}
