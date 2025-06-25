const { app } = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3030;

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api/items`);
});
