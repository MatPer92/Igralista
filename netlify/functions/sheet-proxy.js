const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyvGhG3Jtf1TEDcgU8XF3BAnQ3J7H2uE6FivNfFxMD0G6_7xBBCYacC7ND6xGZjDUgc/exec';

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    const url = SHEET_URL + (event.rawQueryString ? '?' + event.rawQueryString : '');
    const fetchOptions = {
      method: event.httpMethod,
      headers: {}
    };

    if (event.body) {
      // Netlify may send body as string; forward as-is
      fetchOptions.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body;
      fetchOptions.headers['Content-Type'] = event.headers && (event.headers['content-type'] || event.headers['Content-Type']) ? (event.headers['content-type'] || event.headers['Content-Type']) : 'application/json';
    }

    const resp = await fetch(url, fetchOptions);
    const contentType = resp.headers.get('content-type') || 'text/plain';
    const body = await resp.text();

    return {
      statusCode: resp.status,
      headers: Object.assign({}, headers, { 'Content-Type': contentType }),
      body
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: String(err) })
    };
  }
};
