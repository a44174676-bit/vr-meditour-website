const fs = require('fs');
const path = require('path');

exports.handler = async function (event) {
  const originalPath = event.headers['x-netlify-original-pathname'] || event.rawPath || event.path || '';
  const originalSearch = event.headers['x-netlify-original-search'] || '';

  if (originalPath === '/medical-mydata-ai') {
    return {
      statusCode: 301,
      headers: {
        Location: `/medical-mydata-ai/${originalSearch}`,
        'Cache-Control': 'no-cache',
      },
      body: '',
    };
  }

  if (originalPath === '/medical-mydata-ai/lang-preview.html') {
    return notFound();
  }

  if (originalPath === '/medical-mydata-ai/translations.js') {
    return serveFile('public/medical-mydata-ai/translations.js', 'text/javascript; charset=utf-8');
  }

  if (originalPath === '/medical-mydata-ai/' || originalPath.startsWith('/medical-mydata-ai/')) {
    return serveFile('public/medical-mydata-ai/index.html', 'text/html; charset=utf-8');
  }

  return notFound();
};

function serveFile(relativePath, contentType) {
  const filePath = path.join(process.cwd(), relativePath);
  const body = fs.readFileSync(filePath, 'utf8');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    },
    body,
  };
}

function notFound() {
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
    body: 'Not found',
  };
}
