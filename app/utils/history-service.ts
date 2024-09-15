import * as yup from 'yup';
import _ from 'lodash';

export const enum CLIENT_TYPE {
  rest = 'RestClient',
  graph = 'GraphQlClient',
}

export interface IHistoryItem {
  fullLink: string;
  viewLink: string;
  client: CLIENT_TYPE;
}

const historyItemSchema = yup.object().shape({
  fullLink: yup.string().required('NotValid'),
  viewLink: yup.string().required('NotValid'),
  client: yup.string().required('NotValid'),
});

class HistoryService {
  private localStorageKey = 'React2024q3AyakiHistoryKey';
  private storage: Record<string, IHistoryItem[]> | null = null;

  resetStorage() {
    this.storage = {};
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.storage));
  }

  initializeStorage() {
    if (!this.storage) {
      try {
        const storage: Record<string, IHistoryItem[]> = JSON.parse(localStorage.getItem(this.localStorageKey) ?? '');

        if (!_.isObject(storage)) {
          return this.resetStorage();
        }
        let isCorrupted = false;
        Object.entries(storage).forEach(([emailKey, items]: [string, IHistoryItem[]]) => {
          if (!Array.isArray(items)) {
            isCorrupted = true;
            storage[emailKey] = [];
          } else {
            if (
              items.some(item => {
                try {
                  historyItemSchema.validateSync(item);
                  return false;
                } catch (e) {
                  return true;
                }
              })
            ) {
              isCorrupted = true;
              storage[emailKey] = [];
            }
          }
        });
        if (isCorrupted) {
          localStorage.setItem(this.localStorageKey, JSON.stringify(storage));
        }
        this.storage = storage;
      } catch (error) {
        return this.resetStorage();
      }
    }
  }

  getItems(email: string): IHistoryItem[] {
    if (typeof window === 'undefined' || !email) {
      return [];
    }
    this.initializeStorage();

    return _.get(this.storage, email, []);
  }

  setItem(email: string, item: IHistoryItem) {
    this.initializeStorage();
    if (!this.storage) {
      this.storage = {};
    }

    const items: IHistoryItem[] = _.get(this.storage, email, []);
    items.unshift({ ...item });
    let hasError = false;
    let resetOthers = false;
    do {
      if (hasError && !resetOthers) {
        resetOthers = true;
        this.storage = {};
      } else if (hasError && resetOthers) {
        if (items.length > 0) {
          items.pop();
        } else {
          try {
            this.storage = {};
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.storage));
          } catch (error) {
            //TODO: add modal window
          }
          return;
        }
      }

      hasError = false;
      this.storage[email] = items;

      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.storage));
      } catch (error) {
        hasError = true;
      }
    } while (hasError);
  }

  setItems(email: string, items: IHistoryItem[]) {}
}

export const historyService: HistoryService = new HistoryService();
