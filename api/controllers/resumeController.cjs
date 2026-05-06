/**
 * Controlador para gestionar resume.json
 * Permite leer y sobrescribir el curriculum desde el backend.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || 'src/data';
const RESUME_PATH = path.join(process.cwd(), DATA_DIR, 'resume.json');

function readResume() {
  try {
    const data = fs.readFileSync(RESUME_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading resume.json: ${error.message}`);
  }
}

function writeResume(data) {
  try {
    const dir = path.dirname(RESUME_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RESUME_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    throw new Error(`Error writing resume.json: ${error.message}`);
  }
}

function getResume(req, res) {
  try {
    const resume = readResume();
    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

function updateResume(req, res) {
  try {
    const { data } = req.body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'El campo "data" debe ser un objeto',
      });
    }

    writeResume(data);

    res.json({
      success: true,
      message: 'resume.json actualizado correctamente',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  getResume,
  updateResume,
};
