import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["span", "br", "strong", "em", "b", "i", "u"];
const ALLOWED_ATTR = ["class"];

/**
 * Sanitize HTML strings before injecting into the DOM to avoid XSS.
 * Keeps only minimal formatting tags and class attributes for styling.
 */
export const sanitizeHtml = (value = "") =>
  DOMPurify.sanitize(value, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });

export default sanitizeHtml;
