export const round2 = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

// Convert MongoDB Doc to JavaScript Object:
export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}