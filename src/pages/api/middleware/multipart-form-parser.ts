import formidable from 'formidable';

const form = formidable({multiples: true}); // multiples means req.files will be an array

export default async function parseMultipartForm(req, _, next) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.body = JSON.parse(fields.bookingData);
        req.body.attachment = files.attachment;
      }
      next();
    });
  } else {
    next();
  }
}
