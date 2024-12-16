import { Point } from "../module/points/points.model";

const data = [
  {
    type: "Low-Content Books (e.g., coloring books, workbooks)",
    points: 6,
  },
  {
    type: "Medium-Length Non-Fiction (100-200 pages, such as self-help, guides)",
    points: 15,
  },
  {
    type: "Long Fiction Books (200+ pages, novels or complex non-fiction)",
    points: 25,
  },
  {
    type: "Kindle Unlimited Review",
    points: 5,
  },
  {
    type: "Low-Cost eBook (up to $0.99)",
    points: 10,
  },
  {
    type: "Mid-Range eBook ($1.00 - $3.99)",
    points: 15,
    __v: 0,
  },
  {
    type: "High-Cost eBook ($4.00 and above)",
    points: 20,
  },
  {
    type: "Referral Bonus",
    points: 50,
  },
  {
    type: "5x Referral Bonus",
    points: 100,
  },
  {
    type: "10x Referral Bonus",
    points: 200,
  },
  {
    type: "Reviewer of the month",
    points: 50,
  },
];

 export const createPoints = async () => {
  const result = await Point.find();

  if (!result.length) {
    await Point.insertMany(data);
    console.log("Points data inserted successfully");
  }
  
  return;
};
