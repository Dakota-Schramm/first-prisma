interface Params {
  [key: string]: string;
}

const queryStringRegex = /(?:[?&])([^?&=]+)(?:=([^&]*))/g;

export function getQueryParameters(url: string) {
  const params: Params = {};
  let match;
  
  while ((match = queryStringRegex.exec(url)) !== null) {
    const key = decodeURIComponent(match[1]);
    const value = decodeURIComponent(match[2]);
    params[key] = value;
  }
  
  return params;
}

const exampleUrl = "https://example.com/page?name=John&age=30&occupation=Engineer";
const exampleQueryParameters = getQueryParameters(exampleUrl);
console.log(exampleQueryParameters);
