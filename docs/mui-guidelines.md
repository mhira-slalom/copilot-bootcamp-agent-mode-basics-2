# Material-UI Guidelines

This document outlines the guidelines for using Material-UI (MUI) components in this project.

## General Principles

- Use MUI components whenever possible instead of raw HTML elements
- Follow the project's theme and styling conventions
- Ensure components are accessible by using appropriate ARIA attributes
- Keep components simple and focused on a single responsibility

## Component Usage

### Layout Components

- Use `Container` for main content areas with proper padding
- Use `Grid` for complex layouts rather than custom CSS
- Use `Box` for simple layout needs or custom styling
- Use `Paper` for card-like containers with elevation

```javascript
// Example of Grid layout
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Paper elevation={1}>Content</Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Paper elevation={1}>Content</Paper>
  </Grid>
</Grid>
```

### Data Display Components

- Use `Table` components for displaying tabular data
- Use `List` components for displaying lists of items
- Use `Card` for more complex content containers
- Use `Typography` for all text elements with appropriate variants

```javascript
// Example of Table usage
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

### Input Components

- Use MUI form components (`TextField`, `Select`, etc.) instead of native HTML elements
- Group form fields with `FormControl` and `FormGroup`
- Use `InputLabel` and `FormHelperText` for accessible form labels and hints

```javascript
// Example of form components
<FormControl fullWidth margin="normal">
  <InputLabel htmlFor="name">Name</InputLabel>
  <TextField
    id="name"
    value={name}
    onChange={handleChange}
    error={!!errors.name}
    helperText={errors.name}
  />
</FormControl>
```

### Feedback Components

- Use `Snackbar` or `Alert` for notifications and feedback
- Use `Dialog` for confirmations or user interactions that require focus
- Use `CircularProgress` or `LinearProgress` for loading states

```javascript
// Example of loading and feedback
{loading ? (
  <CircularProgress />
) : error ? (
  <Alert severity="error">{error}</Alert>
) : (
  <Content />
)}
```

## Styling Approaches

### Theme

- Use the project's theme for colors, spacing, and typography
- Access theme values through the `useTheme` hook or the `sx` prop
- Extend the theme when needed rather than using hardcoded values

```javascript
// Example of using the theme
const theme = useTheme();

// In component
<Box sx={{ 
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2)
}}>
  Content
</Box>
```

### Component Styling

- Prefer the `sx` prop for component-specific styling
- Use `styled` API for reusable styled components
- Keep styling close to the components that use it

```javascript
// Using sx prop
<Button 
  sx={{ 
    borderRadius: 2,
    textTransform: 'none',
    px: 3
  }}
>
  Custom Button
</Button>

// Using styled API
const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  padding: theme.spacing(0, 3)
}));
```

## Responsive Design

- Use MUI's breakpoints for responsive layouts
- Design for mobile-first, then adapt for larger screens
- Test components at various viewport sizes

```javascript
// Example of responsive styling
<Box
  sx={{
    width: '100%',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1, sm: 2, md: 4 }
  }}
>
  Content
</Box>
```

## Accessibility

- Ensure proper color contrast ratios
- Include appropriate ARIA attributes on interactive elements
- Test with keyboard navigation
- Use `VisuallyHidden` components when needed for screen readers

## Performance

- Import MUI components individually to reduce bundle size
- Consider using `React.lazy` for code splitting large component trees
- Be mindful of re-renders with MUI components in lists

## Best Practices

1. **Consistency**: Maintain consistent use of MUI components throughout the application
2. **Documentation**: Document custom MUI component usage or extensions
3. **Upgrades**: Be aware of breaking changes when upgrading MUI versions
4. **Testing**: Test MUI components like any other component in your test suite

Refer to the [MUI documentation](https://mui.com/material-ui/getting-started/overview/) for more detailed information on specific components and APIs.
