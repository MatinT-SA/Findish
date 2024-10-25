require('dotenv').config();

export const API_URL = process.env.API_URL || 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = Number(process.env.TIMEOUT_SEC) || 10;
export const RES_PER_PAGE_DEFAULT = Number(process.env.RES_PER_PAGE_DEFAULT) || 10;
export const RES_PER_PAGE_MEDIUM = Number(process.env.RES_PER_PAGE_MEDIUM) || 5;
export const RES_PER_PAGE_SMALL = Number(process.env.RES_PER_PAGE_SMALL) || 3;
export const API_KEY = process.env.API_KEY || '5e47f10d-aa86-44a1-81b5-a0f07055eb70';
export const MODAL_CLOSE_SEC = Number(process.env.MODAL_CLOSE_SEC) || 0.1;
