import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.resolve(__dirname, "../../../bikes (1).json");

const descriptions = [
  (model, year) =>
    `${year ? `${year} ` : ""}${model} — well maintained bike with smooth engine and clean condition.`,
  (model) =>
    `${model} offers good mileage and is ready for immediate delivery from our showroom.`,
  (model, year) =>
    `Excellent condition ${year ? `${year} ` : ""}${model}, recently serviced and inspected.`,
  (model) =>
    `${model} in showroom-ready condition with genuine parts and clear paperwork.`,
  (model, year) =>
    `Reliable ${year ? `${year} ` : ""}${model} with smooth ride quality and tidy finish.`,
  (model) =>
    `${model} — single-owner feel, clean bodywork, and strong engine performance.`,
  (model) =>
    `Popular choice: ${model} with balanced performance and everyday comfort.`,
  (model, year) =>
    `${year ? `${year} ` : ""}${model} available at AK Bikes with transparent pricing.`,
];

const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const updated = raw.map((bike) => {
  const year = bike.year;
  const model = bike.model || "Bike";
  const descFn = descriptions[bike.id % descriptions.length];
  return {
    id: bike.id,
    model: bike.model,
    year: bike.year,
    number: bike.number,
    price: bike.price,
    status: bike.status,
    description: descFn(model, year),
    images: ["", "", "", ""],
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2) + "\n", "utf8");
console.log(`Updated ${updated.length} bikes in bikes (1).json`);
