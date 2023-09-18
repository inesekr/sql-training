import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("03", "04");
    }, minutes(1));

    it("should select count of apps which have free pricing plan", async done => {
        const query = `SELECT COUNT(*) AS count
            FROM PRICING_PLANS p
            JOIN APPS_PRICING_PLANS ap ON ap.pricing_plan_id = p.id
            WHERE price LIKE '%Free%'`;
        const result = await db.selectSingleRow(query);
        expect(result).toEqual({
            count: 1112
        });
        done();
    }, minutes(1));

    it("should select top 3 most common categories", async done => {
        const query = `SELECT COUNT(*) AS count, title as category
            FROM CATEGORIES c
            JOIN APPS_CATEGORIES ac ON ac.category_id = c.id
            GROUP BY title
            ORDER BY count DESC
            LIMIT 3`;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 1193, category: "Store design" },
            { count: 723, category: "Sales and conversion optimization" },
            { count: 629, category: "Marketing" }
        ]);
        done();
    }, minutes(1));

    it("should select top 3 prices by appearance in apps and in price range from $5 to $10 inclusive (not matters monthly or one time payment)", async done => {
        const query = `
            SELECT COUNT(*) AS count, 
            price as price, 
            CAST(REPLACE(SUBSTR(price, 2), '/', '') AS REAL) AS casted_price
            FROM PRICING_PLANS p
            JOIN APPS_PRICING_PLANS ap ON ap.pricing_plan_id = p.id
            WHERE CAST(REPLACE(SUBSTR(price, 2), '/', '') AS REAL) >= 5 AND
            CAST(REPLACE(SUBSTR(price, 2),  '/', '') AS REAL) <= 10
            GROUP BY casted_price
            ORDER BY count DESC
            LIMIT 3`;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 225, price: "$9.99/month", casted_price: 9.99 },
            { count: 135, price: "$5/month", casted_price: 5 },
            { count: 114, price: "$10/month", casted_price: 10 }
        ]);
        done();
    }, minutes(1));
});