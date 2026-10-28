const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const DISPLAY_LOGS: boolean = IS_DEVELOP;
export const MOCK_USER: boolean = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_VERIFY_INPUT = 'VERIFY_INPUT';

// Unlike the common-frontend regexp, the TLD length is not capped (e.g. ".solutions")
export const emailRegexp = /^[\w.+-]+@([\w-]+\.)+[A-Za-z]{2,}$/;
