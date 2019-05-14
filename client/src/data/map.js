module.exports = {
  cities: [
    {
      id: 1,
      name: 'Cheb',
      price: { sell: 14, purchase: 16 },
      position: { x: 69, y: 235 },
      connections: [1, 5],
    },
    {
      id: 2,
      name: 'Praha',
      price: { sell: 10, purchase: 14 },
      position: { x: 388, y: 260 },
      connections: [4, 7, 8, 9, 18],
    },
    {
      id: 3,
      name: 'České Budějovice',
      price: { sell: 12, purchase: 13 },
      position: { x: 382, y: 540 },
      connections: [6, 7, 10],
    },
    {
      id: 4,
      name: 'Ostrava',
      price: { sell: 14, purchase: 14 },
      position: { x: 984, y: 307 },
      connections: [14, 17],
    },
    {
      id: 5,
      name: 'Zlín',
      price: { sell: 13, purchase: 15 },
      position: { x: 882, y: 452 },
      connections: [15, 16, 17],
    },
    {
      id: 6,
      name: 'Šumperk',
      price: { sell: 20, purchase: 22 },
      position: { x: 750, y: 300 },
      connections: [11, 12, 14, 16],
    },
    {
      id: 7,
      name: 'Trutnov',
      price: { sell: 20, purchase: 21 },
      position: { x: 610, y: 141 },
      connections: [3, 8, 11],
    },
    {
      id: 8,
      name: 'Liberec',
      price: { sell: 14, purchase: 17 },
      position: { x: 482, y: 90 },
      connections: [2, 3],
    },
    {
      id: 9,
      name: 'Ústí nad Labem',
      price: { sell: 16, purchase: 17 },
      position: { x: 283, y: 139 },
      connections: [1, 2, 4],
    },
    {
      id: 10,
      name: 'Klatovy',
      price: { sell: 16, purchase: 18 },
      position: { x: 203, y: 410 },
      connections: [5, 6, 18],
    },
    {
      id: 11,
      name: 'Jihlava',
      price: { sell: 15, purchase: 16 },
      position: { x: 580, y: 406 },
      connections: [9, 10, 12, 13],
    },
    {
      id: 12,
      name: 'Brno',
      price: { sell: 22, purchase: 23 },
      position: { x: 740, y: 474 },
      connections: [13, 15],
    },
  ],

  connections: [
    { id: 1, length: 2, cities: [1, 9] },
    { id: 2, length: 2, cities: [8, 9] },
    { id: 3, length: 1, cities: [7, 8] },
    { id: 4, length: 1, cities: [2, 9] },
    { id: 5, length: 3, cities: [1, 10] },
    { id: 6, length: 2, cities: [3, 10] },
    { id: 7, length: 3, cities: [2, 3] },
    { id: 8, length: 2, cities: [2, 7] },
    { id: 9, length: 2, cities: [2, 11] },
    { id: 10, length: 3, cities: [3, 11] },
    { id: 11, length: 3, cities: [6, 7] },
    { id: 12, length: 3, cities: [6, 11] },
    { id: 13, length: 2, cities: [11, 12] },
    { id: 14, length: 2, cities: [4, 6] },
    { id: 15, length: 1, cities: [5, 12] },
    { id: 16, length: 2, cities: [5, 6] },
    { id: 17, length: 2, cities: [4, 5] },
    { id: 18, length: 3, cities: [2, 10] },
  ],
}
