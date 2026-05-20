/**
 * Controller para altas del espacio Kimo.
 * Gestiona persistencia en books.json, illustrations.json, places.json y places_markers.json.
 */

const {
  loadCollection,
  saveCollection,
  slugify,
  ensureUniqueStringId,
  generatePrefixedSequentialId,
  createUniqueSlugId,
  ensureNumeric,
} = require('../utils/kimoStore.cjs');

function assertNonEmptyString(value, fieldName, allowEmpty = false) {
  if (typeof value !== 'string') {
    const error = new Error(`Field "${fieldName}" must be a string`);
    error.status = 400;
    throw error;
  }

  if (!allowEmpty && value.trim() === '') {
    const error = new Error(`Field "${fieldName}" cannot be empty`);
    error.status = 400;
    throw error;
  }

  return value.trim();
}

function assertOptionalString(value, fieldName) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string') {
    const error = new Error(`Field "${fieldName}" must be a string`);
    error.status = 400;
    throw error;
  }

  return value.trim();
}

function assertOptionalArray(value, fieldName) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    const error = new Error(`Field "${fieldName}" must be an array`);
    error.status = 400;
    throw error;
  }

  return value;
}

function normalizeImageEntry(entry, index, fieldPrefix) {
  if (!entry || typeof entry !== 'object') {
    const error = new Error(`Invalid ${fieldPrefix}[${index}] entry`);
    error.status = 400;
    throw error;
  }

  const image = assertNonEmptyString(entry.image, `${fieldPrefix}[${index}].image`);
  const label = assertOptionalString(entry.label, `${fieldPrefix}[${index}].label`);

  return { image, label };
}

function createBook(req, res) {
  try {
    const books = loadCollection('books.json');
    const idInput = assertOptionalString(req.body.id, 'id');
    const title = assertNonEmptyString(req.body.title, 'title');
    const author = assertNonEmptyString(req.body.author, 'author');
    const language = assertNonEmptyString(req.body.language, 'language');
    const cover = assertNonEmptyString(req.body.cover, 'cover');
    const dateRead = assertOptionalString(req.body.dateRead, 'dateRead');
    const genre = assertOptionalString(req.body.genre, 'genre');
    const isbn = assertOptionalString(req.body.isbn, 'isbn');
    const series = assertOptionalString(req.body.series, 'series');
    const synopsis = assertOptionalString(req.body.synopsis, 'synopsis');

    const id = idInput || createUniqueSlugId(books, title, 'book');
    ensureUniqueStringId(books, id, 'Book');

    const newBook = {
      id,
      title,
      author,
      language,
      cover,
      dateRead,
      genre,
      isbn,
      series,
      synopsis,
    };

    books.push(newBook);
    saveCollection('books.json', books);

    res.status(201).json({
      success: true,
      data: newBook,
      message: 'Book created successfully',
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

function createIllustration(req, res) {
  try {
    const illustrations = loadCollection('illustrations.json');
    const idInput = assertOptionalString(req.body.id, 'id');
    const nombre = assertNonEmptyString(req.body.nombre, 'nombre');
    const image = assertNonEmptyString(req.body.image, 'image');
    const fecha = assertOptionalString(req.body.fecha, 'fecha');
    const cliente = assertOptionalString(req.body.cliente, 'cliente');
    const descripcion = assertOptionalString(req.body.descripcion, 'descripcion');
    const imagenesExtraRaw = assertOptionalArray(req.body.imagenesExtra, 'imagenesExtra');

    const imagenesExtra = imagenesExtraRaw.map((entry, index) =>
      normalizeImageEntry(entry, index, 'imagenesExtra'),
    );

    const id = idInput || createUniqueSlugId(illustrations, nombre, 'illustration');
    ensureUniqueStringId(illustrations, id, 'Illustration');

    const newIllustration = {
      id,
      nombre,
      image,
      fecha,
      cliente,
      descripcion,
      imagenesExtra,
    };

    illustrations.push(newIllustration);
    saveCollection('illustrations.json', illustrations);

    // Generar thumbnail automáticamente para ilustraciones
    const { spawn } = require('child_process');
    const child = spawn(
      'node',
      ['scripts/generate-thumbs.cjs', '--collection', 'illustrations', '--id', String(id)],
      {
        stdio: 'ignore',
        cwd: process.cwd(),
        detached: true,
      },
    );
    child.unref();
    child.on('error', (err) => {
      console.error('Failed to spawn generate-thumbs for new illustration:', err.message);
    });
    console.log(`Spawned generate-thumbs (pid=${child.pid}) for illustration id=${id}`);

    res.status(201).json({
      success: true,
      data: newIllustration,
      message: 'Illustration created successfully',
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

function createPlace(req, res) {
  try {
    const places = loadCollection('places.json');
    const city = assertOptionalString(req.body.city, 'city');
    const place = assertNonEmptyString(req.body.place, 'place');
    const country = assertNonEmptyString(req.body.country, 'country').toLowerCase();
    const date = assertOptionalString(req.body.date, 'date');
    const people = assertOptionalString(req.body.people, 'people');

    const id = generatePrefixedSequentialId(places, 'place');
    ensureUniqueStringId(places, id, 'Place');

    const newPlace = {
      id,
      city,
      place,
      country,
      date,
      people,
    };

    places.push(newPlace);
    saveCollection('places.json', places);

    res.status(201).json({
      success: true,
      data: newPlace,
      message: 'Place created successfully',
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

function createPlaceMarker(req, res) {
  try {
    const markers = loadCollection('places_markers.json');
    const name = assertNonEmptyString(req.body.name, 'name');
    const country = assertNonEmptyString(req.body.country, 'country').toUpperCase();
    const lat = ensureNumeric(req.body.lat, 'lat');
    const lon = ensureNumeric(req.body.lon, 'lon');

    const id = generatePrefixedSequentialId(markers, 'marker');
    ensureUniqueStringId(markers, id, 'Place marker');

    const newMarker = {
      id,
      name,
      country,
      lat,
      lon,
    };

    markers.push(newMarker);
    saveCollection('places_markers.json', markers);

    res.status(201).json({
      success: true,
      data: newMarker,
      message: 'Place marker created successfully',
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    throw error;
  }
}

function uploadKimoImages(req, res) {
  try {
    const collection = assertNonEmptyString(req.body.collection, 'collection');
    const title = assertNonEmptyString(req.body.title, 'title');

    if (!req.files || req.files.length === 0) {
      const error = new Error('No se han recibido archivos');
      error.status = 400;
      throw error;
    }

    let destCollection;
    if (collection === 'books') {
      destCollection = 'books';
    } else if (collection === 'illustrations') {
      destCollection = 'illustrations';
    } else {
      const error = new Error('Invalid Kimo image collection');
      error.status = 400;
      throw error;
    }

    const uploadRoot =
      destCollection === 'illustrations'
        ? require('path').join(process.cwd(), 'public', 'images', 'illustrations')
        : require('path').join(process.cwd(), 'public', 'images', 'kimo', destCollection);
    const fs = require('fs');
    const path = require('path');
    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        const error = new Error(
          `Extensión no permitida: ${ext}. Permitidas: ${ALLOWED_EXTENSIONS.join(', ')}`,
        );
        error.status = 400;
        throw error;
      }
      if (file.size > MAX_FILE_SIZE) {
        const error = new Error(
          `El archivo "${file.originalname}" excede el tamaño máximo de 10 MB`,
        );
        error.status = 400;
        throw error;
      }
    }

    fs.mkdirSync(uploadRoot, { recursive: true });
    const slug = slugify(title) || destCollection;

    const existingFiles = fs.existsSync(uploadRoot) ? fs.readdirSync(uploadRoot) : [];
    let serial = 1;
    for (const file of existingFiles) {
      const parsed = path.parse(file).name;
      if (parsed.startsWith(slug)) {
        const suffix = parsed.slice(slug.length);
        const num = Number(suffix);
        if (Number.isInteger(num) && num >= serial) {
          serial = num + 1;
        }
      }
    }

    const savedImages = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const fileName = `${slug}${String(serial).padStart(3, '0')}${ext}`;
      const destPath = path.join(uploadRoot, fileName);
      fs.writeFileSync(destPath, file.buffer);

      savedImages.push({
        ruta: `/images/kimo/${destCollection}/${fileName}`,
        label: file.originalname.replace(/\.[^.]+$/, ''),
      });
      serial += 1;
    }

    res.status(200).json({
      success: true,
      data: savedImages,
      message: `${savedImages.length} imagen(es) subida(s) correctamente`,
    });
  } catch (error) {
    if (!error.status) error.status = 500;
    throw error;
  }
}

module.exports = {
  createBook,
  createIllustration,
  createPlace,
  createPlaceMarker,
  uploadKimoImages,
};
