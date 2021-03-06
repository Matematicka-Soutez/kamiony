/* eslint-disable id-length */
'use strict'

module.exports = {
  cities: [
    {
      id: 1,
      name: 'Cheb',
      price: { sell: 14, purchase: 16 },
      production: [
        { interval: [0, 10], fn: x => 0.1 + (0.0 * x) },
        { interval: [10, 20], fn: x => 0.15 + (-0.005 * x) },
        { interval: [20, 30], fn: x => -0.05 + (0.005 * x) },
        { interval: [30, 40], fn: x => 0.4 + (-0.01 * x) },
        { interval: [40, 50], fn: x => 0.2 + (-0.005 * x) },
        { interval: [50, 60], fn: x => 0.45 + (-0.01 * x) },
        { interval: [60, 70], fn: x => 0.45 + (-0.01 * x) },
        { interval: [70, 80], fn: x => -0.6 + (0.005 * x) },
        { interval: [80, 90], fn: x => 0.6 + (-0.01 * x) },
        { interval: [90, 100], fn: x => -0.3 + (0.0 * x) },
      ],
      position: { x: 69, y: 235 },
      connections: [1, 5],
    },
    {
      id: 2,
      name: 'Praha',
      price: { sell: 10, purchase: 14 },
      production: [
        { interval: [0, 10], fn: x => -0.2 + (0.01 * x) },
        { interval: [10, 20], fn: x => -0.1 + (0.0 * x) },
        { interval: [20, 30], fn: x => -0.2 + (0.005 * x) },
        { interval: [30, 40], fn: x => -0.35 + (0.01 * x) },
        { interval: [40, 50], fn: x => -0.55 + (0.015 * x) },
        { interval: [50, 60], fn: x => -0.3 + (0.01 * x) },
        { interval: [60, 70], fn: x => 0.6 + (-0.005 * x) },
        { interval: [70, 80], fn: x => 0.6 + (-0.005 * x) },
        { interval: [80, 90], fn: x => 0.6 + (-0.005 * x) },
        { interval: [90, 100], fn: x => 0.6 + (-0.005 * x) },
      ],
      position: { x: 388, y: 260 },
      connections: [4, 7, 8, 9, 18],
    },
    {
      id: 3,
      name: 'České Budějovice',
      price: { sell: 12, purchase: 13 },
      production: [
        { interval: [0, 10], fn: x => -0.15 + (-0.005 * x) },
        { interval: [10, 20], fn: x => -0.25 + (0.005 * x) },
        { interval: [20, 30], fn: x => -0.05 + (-0.005 * x) },
        { interval: [30, 40], fn: x => -0.35 + (0.005 * x) },
        { interval: [40, 50], fn: x => -0.35 + (0.005 * x) },
        { interval: [50, 60], fn: x => -0.35 + (0.005 * x) },
        { interval: [60, 70], fn: x => -0.65 + (0.01 * x) },
        { interval: [70, 80], fn: x => -0.65 + (0.01 * x) },
        { interval: [80, 90], fn: x => 0.15 + (0.0 * x) },
        { interval: [90, 100], fn: x => 0.6 + (-0.005 * x) },
      ],
      position: { x: 382, y: 540 },
      connections: [6, 7, 10],
    },
    {
      id: 4,
      name: 'Ostrava',
      price: { sell: 14, purchase: 15 },
      production: [
        { interval: [0, 10], fn: x => -0.15 + (0.0 * x) },
        { interval: [10, 20], fn: x => -0.1 + (-0.005 * x) },
        { interval: [20, 30], fn: x => -0.1 + (-0.005 * x) },
        { interval: [30, 40], fn: x => -0.1 + (-0.005 * x) },
        { interval: [40, 50], fn: x => -0.3 + (0.0 * x) },
        { interval: [50, 60], fn: x => -1.05 + (0.015 * x) },
        { interval: [60, 70], fn: x => -0.15 + (0.0 * x) },
        { interval: [70, 80], fn: x => -0.15 + (0.0 * x) },
        { interval: [80, 90], fn: x => -0.55 + (0.005 * x) },
        { interval: [90, 100], fn: x => -0.55 + (0.005 * x) },
      ],
      position: { x: 984, y: 307 },
      connections: [14, 17],
    },
    {
      id: 5,
      name: 'Zlín',
      price: { sell: 13, purchase: 15 },
      production: [
        { interval: [0, 10], fn: x => -0.25 + (-0.005 * x) },
        { interval: [10, 20], fn: x => -0.35 + (0.005 * x) },
        { interval: [20, 30], fn: x => -0.25 + (0.0 * x) },
        { interval: [30, 40], fn: x => -0.4 + (0.005 * x) },
        { interval: [40, 50], fn: x => -0.2 + (0.0 * x) },
        { interval: [50, 60], fn: x => -0.2 + (0.0 * x) },
        { interval: [60, 70], fn: x => -1.4 + (0.02 * x) },
        { interval: [70, 80], fn: x => -1.05 + (0.015 * x) },
        { interval: [80, 90], fn: x => -0.25 + (0.005 * x) },
        { interval: [90, 100], fn: x => -0.7 + (0.01 * x) },
      ],
      position: { x: 882, y: 452 },
      connections: [15, 16, 17],
    },
    {
      id: 6,
      name: 'Šumperk',
      price: { sell: 20, purchase: 22 },
      production: [
        { interval: [0, 10], fn: x => 0.1 + (0.005 * x) },
        { interval: [10, 20], fn: x => 0.15 + (0.0 * x) },
        { interval: [20, 30], fn: x => -0.05 + (0.01 * x) },
        { interval: [30, 40], fn: x => 0.4 + (-0.005 * x) },
        { interval: [40, 50], fn: x => 0.4 + (-0.005 * x) },
        { interval: [50, 60], fn: x => 0.4 + (-0.005 * x) },
        { interval: [60, 70], fn: x => -0.2 + (0.005 * x) },
        { interval: [70, 80], fn: x => 0.5 + (-0.005 * x) },
        { interval: [80, 90], fn: x => 0.5 + (-0.005 * x) },
        { interval: [90, 100], fn: x => 0.05 + (0.0 * x) },
      ],
      position: { x: 750, y: 300 },
      connections: [11, 12, 14, 16],
    },
    {
      id: 7,
      name: 'Trutnov',
      price: { sell: 20, purchase: 21 },
      production: [
        { interval: [0, 10], fn: x => 0.1 + (0.01 * x) },
        { interval: [10, 20], fn: x => 0.25 + (-0.005 * x) },
        { interval: [20, 30], fn: x => 0.25 + (-0.005 * x) },
        { interval: [30, 40], fn: x => -0.05 + (0.005 * x) },
        { interval: [40, 50], fn: x => -0.05 + (0.005 * x) },
        { interval: [50, 60], fn: x => -0.05 + (0.005 * x) },
        { interval: [60, 70], fn: x => 0.25 + (0.0 * x) },
        { interval: [70, 80], fn: x => 0.25 + (0.0 * x) },
        { interval: [80, 90], fn: x => 0.65 + (-0.005 * x) },
        { interval: [90, 100], fn: x => 0.65 + (-0.005 * x) },
      ],
      position: { x: 610, y: 141 },
      connections: [3, 8, 11],
    },
    {
      id: 8,
      name: 'Liberec',
      price: { sell: 14, purchase: 17 },
      production: [
        { interval: [0, 10], fn: x => 0.05 + (0.01 * x) },
        { interval: [10, 20], fn: x => 0.1 + (0.005 * x) },
        { interval: [20, 30], fn: x => 0.1 + (0.005 * x) },
        { interval: [30, 40], fn: x => 0.4 + (-0.005 * x) },
        { interval: [40, 50], fn: x => 0.2 + (0.0 * x) },
        { interval: [50, 60], fn: x => 0.2 + (0.0 * x) },
        { interval: [60, 70], fn: x => 0.5 + (-0.005 * x) },
        { interval: [70, 80], fn: x => 0.5 + (-0.005 * x) },
        { interval: [80, 90], fn: x => -0.3 + (0.005 * x) },
        { interval: [90, 100], fn: x => -0.3 + (0.005 * x) },
      ],
      position: { x: 482, y: 90 },
      connections: [2, 3],
    },
    {
      id: 9,
      name: 'Ústí nad Labem',
      price: { sell: 16, purchase: 17 },
      production: [
        { interval: [0, 10], fn: x => 0.25 + (-0.01 * x) },
        { interval: [10, 20], fn: x => 0.1 + (0.005 * x) },
        { interval: [20, 30], fn: x => 0.4 + (-0.01 * x) },
        { interval: [30, 40], fn: x => -0.05 + (0.005 * x) },
        { interval: [40, 50], fn: x => 0.55 + (-0.01 * x) },
        { interval: [50, 60], fn: x => 0.55 + (-0.01 * x) },
        { interval: [60, 70], fn: x => 0.55 + (-0.01 * x) },
        { interval: [70, 80], fn: x => 0.2 + (-0.005 * x) },
        { interval: [80, 90], fn: x => 0.2 + (-0.005 * x) },
        { interval: [90, 100], fn: x => 0.2 + (-0.005 * x) },
      ],
      position: { x: 283, y: 139 },
      connections: [1, 2, 4],
    },
    {
      id: 10,
      name: 'Klatovy',
      price: { sell: 16, purchase: 18 },
      production: [
        { interval: [0, 10], fn: x => 0.2 + (-0.01 * x) },
        { interval: [10, 20], fn: x => 0.1 + (0.0 * x) },
        { interval: [20, 30], fn: x => 0.2 + (-0.005 * x) },
        { interval: [30, 40], fn: x => 0.5 + (-0.015 * x) },
        { interval: [40, 50], fn: x => 0.1 + (-0.005 * x) },
        { interval: [50, 60], fn: x => 0.35 + (-0.01 * x) },
        { interval: [60, 70], fn: x => -0.25 + (0.0 * x) },
        { interval: [70, 80], fn: x => 0.1 + (-0.005 * x) },
        { interval: [80, 90], fn: x => -1.5 + (0.015 * x) },
        { interval: [90, 100], fn: x => -0.15 + (0.0 * x) },
      ],
      position: { x: 203, y: 410 },
      connections: [5, 6, 18],
    },
    {
      id: 11,
      name: 'Jihlava',
      price: { sell: 15, purchase: 16 },
      production: [
        { interval: [0, 10], fn: x => -0.25 + (0.0 * x) },
        { interval: [10, 20], fn: x => -0.2 + (-0.005 * x) },
        { interval: [20, 30], fn: x => -0.4 + (0.005 * x) },
        { interval: [30, 40], fn: x => -0.25 + (0.0 * x) },
        { interval: [40, 50], fn: x => -0.45 + (0.005 * x) },
        { interval: [50, 60], fn: x => -0.45 + (0.005 * x) },
        { interval: [60, 70], fn: x => 0.15 + (-0.005 * x) },
        { interval: [70, 80], fn: x => -0.55 + (0.005 * x) },
        { interval: [80, 90], fn: x => 0.25 + (-0.005 * x) },
        { interval: [90, 100], fn: x => -0.2 + (0.0 * x) },
      ],
      position: { x: 580, y: 406 },
      connections: [9, 10, 12, 13],
    },
    {
      id: 12,
      name: 'Brno',
      price: { sell: 22, purchase: 23 },
      production: [
        { interval: [0, 10], fn: x => 0.2 + (-0.005 * x) },
        { interval: [10, 20], fn: x => 0.15 + (0.0 * x) },
        { interval: [20, 30], fn: x => 0.15 + (0.0 * x) },
        { interval: [30, 40], fn: x => -0.15 + (0.01 * x) },
        { interval: [40, 50], fn: x => 0.45 + (-0.005 * x) },
        { interval: [50, 60], fn: x => 0.45 + (-0.005 * x) },
        { interval: [60, 70], fn: x => 0.15 + (0.0 * x) },
        { interval: [70, 80], fn: x => 0.85 + (-0.01 * x) },
        { interval: [80, 90], fn: x => -0.35 + (0.005 * x) },
        { interval: [90, 100], fn: x => 0.1 + (0.0 * x) },
      ],
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
    { id: 12, length: 2, cities: [6, 11] },
    { id: 13, length: 2, cities: [11, 12] },
    { id: 14, length: 2, cities: [4, 6] },
    { id: 15, length: 1, cities: [5, 12] },
    { id: 16, length: 2, cities: [5, 6] },
    { id: 17, length: 2, cities: [4, 5] },
    { id: 18, length: 3, cities: [2, 10] },
  ],
}
