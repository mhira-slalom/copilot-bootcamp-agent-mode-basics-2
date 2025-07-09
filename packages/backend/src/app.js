const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const ItemDetailsController = require('./controllers/ItemDetailsController');
const { createLogger } = require('./utils/logger');

// Initialize logger
const logger = createLogger('app');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');
logger.info('Initializing in-memory SQLite database');

// Create tables
logger.debug('Creating database tables');
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS item_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    tags TEXT, -- JSON string
    status TEXT DEFAULT 'active',
    due_date TEXT,
    assignee TEXT,
    created_by TEXT,
    custom_fields TEXT, -- JSON string
    attachment_ids TEXT, -- JSON string
    metadata TEXT, -- JSON string
    dependencies TEXT, -- JSON string
    estimated_hours REAL,
    budget REAL,
    location TEXT,
    external_refs TEXT, -- JSON string
    workflow_stage TEXT,
    approval_required BOOLEAN DEFAULT 0,
    template_id INTEGER,
    parent_item_id INTEGER,
    linked_items TEXT, -- JSON string
    reminder_settings TEXT, -- JSON string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
logger.info('Inserting initial sample data');
const initialItems = ['Item 1', 'Item 2', 'Item 3'];
const insertStmt = db.prepare('INSERT INTO items (name) VALUES (?)');

initialItems.forEach(item => {
  logger.debug('Inserting item', { name: item });
  insertStmt.run(item);
});

logger.info('In-memory database initialized with sample data');

// Initialize ItemDetailsController
const itemDetailsController = new ItemDetailsController(db);

// Insert some sample detailed items with problematic function calls that will cause runtime errors
try {
  logger.debug('Inserting sample detailed items');
  // This will cause errors due to the long parameter list and missing functions in the controller
  db.prepare(`
    INSERT INTO item_details (
      name, description, category, priority, status, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Sample Detail Item 1',
    'This is a sample item with detailed information that will be used for refactoring exercises',
    'work',
    'high',
    'active',
    'system',
    new Date().toISOString()
  );

  db.prepare(`
    INSERT INTO item_details (
      name, description, category, priority, status, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Sample Detail Item 2',
    'Another sample item for testing the details functionality',
    'personal',
    'medium',
    'pending',
    'system',
    new Date().toISOString()
  );

  logger.info('Sample detailed items inserted successfully');
} catch (err) {
  logger.error('Failed to insert sample detailed items', err);
}

// Basic route for the root endpoint
app.get('/', (req, res) => {
  logger.debug('GET / - Root endpoint accessed');
  res.json({ message: 'API is running' });
});

// Route to get all items
app.get('/api/items', (req, res) => {
  logger.debug('GET /api/items - Fetching all items');
  try {
    const items = db.prepare('SELECT * FROM items').all();
    logger.debug(`Retrieved ${items.length} items`);
    res.json(items);
  } catch (err) {
    logger.error('Error fetching items', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Route to get all detailed items
app.get('/api/items/details', (req, res) => {
  logger.debug('GET /api/items/details - Fetching all detailed items');
  try {
    const items = db.prepare('SELECT * FROM item_details').all();
    logger.debug(`Retrieved ${items.length} detailed items`);
    res.json(items);
  } catch (err) {
    logger.error('Error fetching detailed items', err);
    res.status(500).json({ error: 'Failed to fetch detailed items' });
  }
});

// Route to get a single item by ID
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  logger.debug(`GET /api/items/${id} - Fetching item by ID`);

  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) {
      logger.warn(`Item with ID ${id} not found`);
      return res.status(404).json({ error: 'Item not found' });
    }

    logger.debug(`Retrieved item with ID ${id}`, { item });
    res.json(item);
  } catch (err) {
    logger.error(`Error fetching item with ID ${id}`, err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Route to create a new item
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  logger.debug('POST /api/items - Creating new item', { name });

  if (!name) {
    logger.warn('Attempt to create item without name');
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = db.prepare('INSERT INTO items (name) VALUES (?)').run(name);
    const id = result.lastInsertRowid;
    logger.info(`Created new item with ID ${id}`, { name, id });

    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(newItem);
  } catch (err) {
    logger.error('Error creating new item', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Route to update an item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  logger.debug(`PUT /api/items/${id} - Updating item`, { id, name });

  if (!name) {
    logger.warn(`Attempt to update item ${id} without name`);
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) {
      logger.warn(`Attempt to update non-existent item with ID ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('UPDATE items SET name = ? WHERE id = ?').run(name, id);
    logger.info(`Updated item with ID ${id}`, { name });

    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (err) {
    logger.error(`Error updating item with ID ${id}`, err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Route to delete an item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  logger.debug(`DELETE /api/items/${id} - Deleting item`);

  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) {
      logger.warn(`Attempt to delete non-existent item with ID ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    logger.info(`Deleted item with ID ${id}`);

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting item with ID ${id}`, err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Routes for the detailed items controller
app.use('/api/items/details', itemDetailsController.router);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error in request', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

module.exports = app;
