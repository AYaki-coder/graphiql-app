import _ from 'lodash';
import { TRestVariables } from '~/models/rest-variables-selector';

export interface IUrlParserData {
  url: string;
  urlParseError: string | null;
}

export function urlParser(urlBase64: string): IUrlParserData {
  let url: string = '';
  let error: string | null = null;
  try {
    url = atob(urlBase64);
  } catch (e) {
    error = 'Base64 url corrupted, reset to default values';
    if (e instanceof Error) {
      error += e.message;
    }
  }
  return { url, urlParseError: error };
}

export interface IBodyObj {
  body: string;
  variables: TRestVariables;
}

export interface IBodyParserData {
  bodyObj: IBodyObj;
  bodyParseError: string | null;
}

export function bodyParser(bodyBase64: string, skipEncode: boolean): IBodyParserData {
  let bodyObj: IBodyObj = { body: '', variables: {} };
  let error: string | null = null;
  if (skipEncode) {
    return { bodyObj, bodyParseError: error };
  }
  try {
    bodyObj = JSON.parse(atob(bodyBase64));

    if (!_.isString(bodyObj?.body) || !_.isObject(bodyObj?.variables)) {
      throw new Error('body or variables is not valid');
    }
  } catch (e) {
    error = 'Base64 body corrupted, reset to default values';
    if (e instanceof Error) {
      error += e.message;
    }
    bodyObj = { body: '', variables: {} };
  }
  return { bodyObj, bodyParseError: error };
}

export function stringToBase64(s: string) {
  return btoa(s);
}

export function bodyObjToBase64(bodyObj: IBodyObj) {
  return btoa(JSON.stringify(bodyObj));
}
