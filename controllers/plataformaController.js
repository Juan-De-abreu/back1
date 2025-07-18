const db = require('../config/db');

const getAllPlataformas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plataformas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPlataformas = async (req, res) => {
  const { nombre, descripcion} = req.body;

  // Validar que el nombre no esté vacío
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es requerido y debe ser una cadena válida' });
  }


  try {
    const [result] = await db.query(
      'INSERT INTO plataformas (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePlataformas = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion} = req.body;

  // Validar que al menos un campo esté presente
  if (!nombre && !descripcion ) {
    return res.status(400).json({
      error: 'Debe proporcionar al menos uno de los siguientes campos: nombre, descripcion'
    });
  }

  try {
    const fields = [];
    const values = [];

    if (nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(nombre);
    }

    if (descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(descripcion);
    }

    const sql = `UPDATE plataformas SET ${fields.join(', ')} WHERE idplataforma = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'plataforma no encontrado' });
    }

    // Devolver solo los campos actualizados
    const updatedFields = {};
    if (nombre !== undefined) updatedFields.nombre = nombre;
    if (descripcion !== undefined) updatedFields.descripcion = descripcion;

    res.json(updatedFields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePlataformas = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM plataformas WHERE idplataforma = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'plataformas no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPlataformasById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM plataformas WHERE idplataforma = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'plataformas no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getAllPlataformas,
  getPlataformasById, 
  createPlataformas,
  updatePlataformas,
  deletePlataformas
};