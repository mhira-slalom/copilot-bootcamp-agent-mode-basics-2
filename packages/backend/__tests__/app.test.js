const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if items have the expected structure
      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('created_at');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'Test Item' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      // First create an item to delete
      const newItem = { name: 'Item to Delete' };
      const createResponse = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');

      expect(createResponse.status).toBe(201);
      const itemId = createResponse.body.id;

      // Now delete the item
      const deleteResponse = await request(app).delete(`/api/items/${itemId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message');
      expect(deleteResponse.body.message).toBe('Item deleted successfully');

      // Verify the item is no longer in the database
      const getResponse = await request(app).get('/api/items');
      const items = getResponse.body;
      const deletedItem = items.find((item) => item.id === itemId);
      expect(deletedItem).toBeUndefined();
    });

    it('should return 404 if item does not exist', async () => {
      const nonExistentId = 9999;
      const response = await request(app).delete(`/api/items/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app).delete('/api/items/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid item ID');
    });
  });
});
