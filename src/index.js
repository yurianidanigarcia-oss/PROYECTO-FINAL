// Ruta raíz de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'API REST de Libros activa y lista para recibir peticiones.' });
});
app.get('/health', async (req, res) => {
  let client;
  try {
    // Pedimos un cliente al pool
    client = await pool.connect();
    // Ejecutamos la consulta de prueba
    await client.query('SELECT 1');
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED'
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'DISCONNECTED',
      error: error.message
    });
  } finally {
    // IMPORTANTE: Liberamos el cliente para no agotar el pool
    if (client) client.release();
  }
});

// 📚 Obtener todos los libros (GET)
app.get('/api/libros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.libros ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➕ Agregar un nuevo libro (POST)
app.post('/api/libros', async (req, res) => {
  const { titulo, autor, precio } = req.body;

  // Validación básica opcional
  if (!titulo || !autor) {
    return res.status(400).json({ error: 'El título y el autor son obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO public.libros (titulo, autor, precio) VALUES ($1, $2, $3) RETURNING *',
      [titulo, autor, precio || 0.00]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});