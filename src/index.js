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