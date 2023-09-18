import { APPS_CATEGORIES } from "../shopify-table-names";
import { CATEGORIES } from "../shopify-table-names";
import { REVIEWS } from "../shopify-table-names";
import { APPS } from "../shopify-table-names";

export const selectCount = (table: string): string => {
  return `SELECT COUNT(*) AS c FROM ${table}`;
}

export const selectRowById = (id: number, table: string): string => {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
};

export const selectCategoryByTitle = (title: string): string => {
 return `SELECT * FROM ${CATEGORIES} WHERE title = '${title}'`
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `SELECT A.title AS app_title, AC.category_id AS category_id, C.title AS category_title
  FROM ${APPS_CATEGORIES} AC
  JOIN ${APPS} A ON AC.app_id = A.id
  JOIN ${CATEGORIES} C ON AC.category_id = C.id
  WHERE AC.app_id = ${appId}`
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `SELECT COUNT(DISTINCT ${columnName}) AS c FROM ${tableName}`;
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `SELECT * FROM ${REVIEWS} WHERE app_id = ${appId} AND author = '${author}'`
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `SELECT ${columnName} FROM ${tableName}`;
};

