export default function convertToSlug(str) {
  return str?.replace(/[^A-Z0-9]+/gi, '-').toLowerCase() ?? '';
}
