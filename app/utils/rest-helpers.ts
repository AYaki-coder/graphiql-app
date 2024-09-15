import _ from 'lodash';
import { TRestVariables } from '~/models/rest-variables-selector';
import { encode as strToBase64, decode as Base64ToStr } from 'js-base64';
import { REST_VERBS_WITHOUT_BODY } from '~/consts/restful.consts';
import { THeaders } from '~/models/headers-selector';

export interface IUrlParserData {
  url: string;
  urlParseError: string | null;
}

export function urlParser(urlBase64: string): IUrlParserData {
  let url: string = '';
  let error: string | null = null;
  try {
    url = Base64ToStr(urlBase64);
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

export function isMethodWithoutBodyFunc(method: string) {
  const upperCasedMethod = method.toUpperCase();

  return REST_VERBS_WITHOUT_BODY.some(verb => upperCasedMethod === verb);
}

export function bodyParser(bodyBase64: string, skipEncode: boolean): IBodyParserData {
  let bodyObj: IBodyObj = { body: '', variables: {} };
  let error: string | null = null;
  if (skipEncode) {
    return { bodyObj, bodyParseError: error };
  }
  try {
    bodyObj = JSON.parse(Base64ToStr(bodyBase64));

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
  return strToBase64(s);
}

export function bodyObjToBase64(bodyObj: IBodyObj) {
  return strToBase64(JSON.stringify(bodyObj));
}

export function isJsonBody(headers: THeaders): boolean {
  const contentTypeHeader = Object.entries(headers).find(
    ([key]: [string, string]) => key.toLowerCase() === 'content-type',
  );
  return !!(contentTypeHeader && contentTypeHeader[1].toLowerCase().includes('application/json'));
}

export function prepareBodyToSend(bodyObj: IBodyObj, isBodyJson: boolean): string {
  let bodyText: string = bodyObj.body;

  Object.entries(bodyObj.variables).forEach(([key, value]: [string, string]) => {
    bodyText = bodyText.replaceAll(`{{${key}}}`, value);
  });

  if (isBodyJson) {
    return JSON.parse(bodyText);
  }
  return bodyText;
}

export function prettifyBody(bodyObj: IBodyObj) {
  let message = '';
  let body = '';
  try {
    body = JSON.stringify(JSON.parse(bodyObj.body), null, 2);
  } catch (error) {
    message = _.get(error, 'message', 'Something went wrong in json body');
  }

  return { newBody: body, errorMessage: message };
}
