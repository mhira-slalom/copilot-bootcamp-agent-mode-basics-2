import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      setData([...data, result]);
      setNewItem('');
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async id => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Update the UI by removing the deleted item
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      setError('Error deleting item: ' + err.message);
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="App">
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, backgroundColor: '#282c34', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Hello World
        </Typography>
        <Typography variant="body1">
          Connected to in-memory database
        </Typography>
      </Paper>

      <main style={{ padding: '0 16px' }}>
        <section className="add-item-section">
          <Typography variant="h5" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, marginBottom: 3 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="Enter item name"
                style={{ padding: '8px', flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newItem.trim()}
              >
                Add Item
              </Button>
            </form>
          </Paper>
        </section>

        <section className="items-section">
          <Typography variant="h5" component="h2" gutterBottom>
            Items from Database
          </Typography>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && (
            <TableContainer component={Paper} elevation={2}>
              <Table aria-label="items table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length > 0 ? (
                    data.map(item => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Delete ${item.name}`}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography>No items found. Add some!</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
