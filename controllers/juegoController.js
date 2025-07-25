const db = require('../config/db');
const { getAllGeneros } = require('./generoController');

const getAllJuegos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT idjuego,b.nombre as ngenero, a.nombre as njuegos, a.descripcion as djuegos, precio, valoracion, imagen, fechapublicacion, c.nombre as nstatus FROM juegos as a INNER join generos as b ON a.idgenero=b.idgenero INNER join status as c on a.idestatus=c.id_status;');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createJuegos = async (req, res) => {
  const {
    nombre,
    descripcion,
    idestatus = 1,
    precio = 0,
    idgenero,
    valoracion,
    fechapublicacion = null,
    imagen = null
  } = req.body;
const existeGenero = async (idgenero) => {
  const [rows] = await db.query('SELECT idgenero FROM generos WHERE idgenero = ?', [idgenero]);
  return rows.length > 0;
};

  // 🧪 Validaciones
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena válida' });
  }

  if (![1, 2].includes(Number(idestatus))) {
    return res.status(400).json({ error: 'El idestatus debe ser 1 (Activo) o 2 (Inactivo)' });
  }

  if (!await existeGenero(idgenero)) {
    return res.status(400).json({ error: 'El idgenero no existe en la tabla generos' });
  }

  if (typeof valoracion !== 'number' || isNaN(valoracion)) {
    return res.status(400).json({ error: 'La valoración debe ser un número válido' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO juegos (nombre, descripcion, idestatus, precio, idgenero, valoracion, fechapublicacion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion || null, idestatus, precio, idgenero, valoracion, fechapublicacion, imagen]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      idestatus,
      precio,
      idgenero,
      valoracion,
      fechapublicacion,
      imagen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateJuegos = async (req, res) => {
  const { id } = req.params;
  const {
    idjuego,
    nombre,
    descripcion,
    precio,
    imagen,
    fechapublicacion,
    valoracion,
    idestatus
  } = req.body;

  // Validaciones iniciales
  if (!idjuego) {
    return res.status(400).json({ error: 'Se requiere el id del juego en los parámetros' });
  }

  const posiblesCampos = [nombre, descripcion, precio, imagen, fechapublicacion, valoracion, idestatus];
  if (posiblesCampos.every(campo => campo === undefined)) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
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

    if (precio !== undefined) {
      fields.push('precio = ?');
      values.push(precio);
    }

    if (imagen !== undefined) {
      fields.push('imagen = ?');
      values.push(imagen);
    }

    if (fechapublicacion !== undefined) {
      fields.push('fechapublicacion = ?');
      values.push(fechapublicacion);
    }

    if (valoracion !== undefined) {
      fields.push('valoracion = ?');
      values.push(valoracion);
    }

    if (idestatus !== undefined) {
      const estadoNum = Number(idestatus);
      if (![1, 2].includes(estadoNum)) {
        return res.status(400).json({ error: 'El idestatus debe ser 1 (Activo) o 2 (Inactivo)' });
      }
      fields.push('idestatus = ?');
      values.push(estadoNum);
    }

    const sql = `UPDATE juegos SET ${fields.join(', ')} WHERE idjuego = ?`[id];
    values.push(id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Juego no encontrado o sin cambios aplicables' });
    }

    // Retornar los campos actualizados como confirmación
    const updatedFields = {};
    fields.forEach((campo, idx) => {
      const key = campo.split(' = ')[0];
      updatedFields[key] = values[idx];
    });

    return res.json({
      message: 'Juego actualizado correctamente',
      cambios: updatedFields
    });

  } catch (err) {
    console.error('Error al actualizar juego:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




const deleteJuegos = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM juegos WHERE idjuego = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'juego no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJuegosById = async (req, res) => {
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
  getAllJuegos,
  createJuegos,
  updateJuegos,
  deleteJuegos
};