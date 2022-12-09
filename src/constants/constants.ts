/* eslint-disable no-useless-escape */
// REGEX_PATTERN

export const password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const whiteSpace_regex = /^\S+$/;

export const whiteSpace_single_regex = /^(\w+\s)*\w+$/;

export const userName_regex = /^[a-zA-Z0-9._]+$/;

export const companyName_regex = /^[a-zA-Z0-9_ )(-;:.#$@&]+$/;

export const alphanumeric_regex = /^[a-zA-Z0-9 ]+$/;

export const alphabet_regex = /^[a-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

export const alphabets_only_regex_with_single_space = /^[a-zA-Z ]*$/;

// eslint-disable-next-line no-useless-escape

export const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Window_Object

export const maximum_screen_height = 1024;

// Skeleton_Loader

export const count_3 = 3;

export const count_5 = 5;

export const width_90 = 90;

export const width_70 = 70;
