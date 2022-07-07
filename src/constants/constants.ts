// REGEX_PATTERN

export const password_regex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const WhiteSpace_regex = /^\S+$/;

export const username_regex = /^[a-zA-Z0-9._]+$/;

export const companyName_regex = /^[a-zA-Z0-9)(+=._-]+$/