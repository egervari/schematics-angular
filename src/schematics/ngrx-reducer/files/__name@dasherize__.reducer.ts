import { Action } from '@ngrx/store';

import { <%= classify(name) %>State } from '../types/<%= dasherize(name) %>-state/<%= dasherize(name) %>-state.interface';

import { <%= classify(name) %>Actions } from './<%= dasherize(name) %>.actions';

export function <%= camelize(name) %>Reducer(
  state: <%= classify(name) %>State,
  action: Action
): <%= classify(name) %>State {
  switch (action.type) {
    case <%= classify(name) %>Actions.RETRIEVE:
      return {
        ...state,
      };
    default:
      return {
        ...state
      };
  }
}
