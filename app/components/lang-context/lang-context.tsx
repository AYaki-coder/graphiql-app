import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import EnLang from '../../i18n/en-US.json';
import RuLang from '../../i18n/ru-RU.json';

export const enum LANGS {
  en = 'English',
  ru = 'Русский',
}
const LANG_KEY = 'graphiql_rest_lang';

type TComponentName = string;
type TLangRecord = Record<TComponentName, Record<string, string>>;
export interface ILanguageContext {
  langType: LANGS;
  langRecord: TLangRecord;
  changeLang: (l: LANGS) => void;
}

export const LangContext = createContext<ILanguageContext>({
  changeLang: () => {},
  langRecord: EnLang,
  langType: LANGS.en,
});

export const LangProvider: FC<PropsWithChildren> = ({ children }) => {
  const [langType, setLangType] = useState<LANGS>(LANGS.en);

  const changeLang = useCallback(
    (lang: LANGS) => {
      setLangType(lang);
      localStorage.setItem(LANG_KEY, lang);
    },
    [setLangType],
  );

  useEffect(() => {
    const localLang = localStorage?.getItem?.(LANG_KEY);
    if (localLang) {
      switch (localLang) {
        case LANGS.en:
          changeLang(LANGS.en);
          break;
        case LANGS.ru:
          changeLang(LANGS.ru);
          break;
        default:
          break;
      }
    }
  }, []);

  let langRecord: TLangRecord;
  switch (langType) {
    case LANGS.en:
      langRecord = EnLang;
      break;
    case LANGS.ru:
      langRecord = RuLang;
      break;
    default:
      langRecord = EnLang;
      break;
  }

  const value = useMemo(() => {
    return {
      langType,
      langRecord,
      changeLang,
    };
  }, [langType, langRecord, changeLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};
