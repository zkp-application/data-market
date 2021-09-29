// types
const CHANGE_LANG = 'config/CHANGE_LANG';
const CHANGE_THEME = 'config/CHANGE_THEME';
const LOCALLANGKEY = 'LOCALLANGKEY';
const os_lang =
  localStorage.getItem(LOCALLANGKEY) || (navigator.language || navigator.userLanguage || 'en').substr(0, 2);
const user_lang = os_lang === 'zh' ? 'zh' : 'en';
const initState = {
  isloading: false,
  lang: user_lang,
  theme: 'light',
};
!window.env.lang && (window.env.lang = user_lang);
// reducers
const reducers = {
  config(state = initState, action = {}) {
    switch (action.type) {
      case CHANGE_LANG:
        window.env.lang = action.payload;
        return {
          ...state,
          isloading: false,
          lang: action.payload,
        };
      case CHANGE_THEME:
        return {
          ...state,
          theme: action.payload,
        };
      default:
        return state;
    }
  },
};

// action creators
const actions = {
  switchLang: (lang) => (dispatch) => {
    localStorage.setItem(LOCALLANGKEY, lang);
    dispatch({
      type: CHANGE_LANG,
      payload: lang,
    });
  },
  switchTheme: (theme) => (dispatch) => {
    dispatch({
      type: CHANGE_THEME,
      payload: theme,
    });
  },
};

export default reducers;
export { actions };
