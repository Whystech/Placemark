import sanitizeHtml from "sanitize-html";

export function clean(input) {
  return sanitizeHtml(input, {
    allowedTags: [ "b", "i", "em", "strong", "p", "br", "a" ],
    allowedAttributes: { "a": [ "href" ]},
    disallowedTagsMode: "discard"
  });
}
