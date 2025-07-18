const db = require('../config/db');

const getAllGeneros = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM generos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createGenero = async (req, res) => {
  const { nombre, descripcion, idestatus = 1 } = req.body;

  // Validar que el nombre no esté vacío
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es requerido y debe ser una cadena válida' });
  }

  // Validar que idestatus sea 1 o 2 si se proporciona
  if (![1, 2].includes(Number(idestatus))) {
    return res.status(400).json({ error: 'El campo idestatus debe ser 1 (Activo) o 2 (Inactivo)' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO generos (nombre, descripcion, idestatus) VALUES (?, ?, ?)',
      [nombre, descripcion || null, idestatus]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      idestatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGenero = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, idestatus } = req.body;

  // Validar que al menos un campo esté presente
  if (!nombre && !descripcion && idestatus === undefined) {
    return res.status(400).json({
      error: 'Debe proporcionar al menos uno de los siguientes campos: nombre, descripcion, idestatus'
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

    if (idestatus !== undefined) {
      if (typeof idestatus !== 'number') {
        return res.status(400).json({ error: 'idestatus debe ser un número' });
      }
      fields.push('idestatus = ?');
      values.push(idestatus);
    }

    const sql = `UPDATE generos SET ${fields.join(', ')} WHERE idgenero = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Género no encontrado' });
    }

    // Devolver solo los campos actualizados
    const updatedFields = {};
    if (nombre !== undefined) updatedFields.nombre = nombre;
    if (descripcion !== undefined) updatedFields.descripcion = descripcion;
    if (idestatus !== undefined) updatedFields.idestatus = Number(idestatus);

    res.json(updatedFields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGenero = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM generos WHERE idgenero = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Género no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGeneroById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM generos WHERE idgenero = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Género no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getAllGeneros,
  getGeneroById, 
  createGenero,
  updateGenero,
  deleteGenero
};