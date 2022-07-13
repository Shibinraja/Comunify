// REGEX_PATTERN

export const password_regex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const whiteSpace_regex = /^\S+$/;

export const username_regex = /^[a-zA-Z0-9._]+$/;

export const companyName_regex = /^[a-zA-Z0-9_ )(-;:.#$@&]+$/

// Window_Object

export const maximum_screen_height = 1024