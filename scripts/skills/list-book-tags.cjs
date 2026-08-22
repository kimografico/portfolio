#!/usr/bin/env node

// Extract unique genres and authors from books.json
// Usage: node scripts/skills/list-book-tags.cjs
// Output: JSON with "genres" and "authors" arrays

const path = require('path');
const books = require(path.join(__dirname, '..', '..', 'src', 'data', 'kimo', 'books.json'));

const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
const authors = [...new Set(books.map(b => b.author).filter(Boolean))].sort();

console.log(JSON.stringify({ genres, authors }, null, 2));
