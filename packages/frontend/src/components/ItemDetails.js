import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { createLogger } from '../utils/logger';

/**
 * Validates if the provided string is a valid date
 * 
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if the date is valid, false otherwise
 */
const validateDate = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Formats a date string into a readable format
 * 
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
const formatDateTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString();
};

/**
 * ItemDetails component for managing detailed item information
 * This component has several issues that need refactoring:
 * - Long parameter lists
 * - Missing error handling and logging
 * - Runtime errors
 */
function ItemDetails({
  open,
  onClose,
  itemId,
  itemName,
  itemDescription,
  itemCategory,
  itemPriority,
  itemTags,
  itemStatus,
  itemDueDate,
  itemAssignee,
  itemCreatedBy,
  itemCreatedAt,
  itemUpdatedAt,
  showAdvanced,
  enableNotifications,
  autoSave,
  readOnly,
  onSave,
  onDelete,
  onUpdate,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onTagsChange,
  onAssigneeChange,
  onDueDateChange,
  onDescriptionChange,
  onNameChange,
  allowEdit,
  allowDelete,
  showHistory,
  historyData,
  validationRules,
  customFields,
  permissions
}) {
  const logger = createLogger('ItemDetails');
  const [localName, setLocalName] = useState(itemName || '');
  const [localDescription, setLocalDescription] = useState(itemDescription || '');
  const [localCategory, setLocalCategory] = useState(itemCategory || '');
  const [localPriority, setLocalPriority] = useState(itemPriority || 'medium');
  const [localTags, setLocalTags] = useState(itemTags || []);
  const [localStatus, setLocalStatus] = useState(itemStatus || 'active');
  const [localDueDate, setLocalDueDate] = useState(itemDueDate || '');
  const [localAssignee, setLocalAssignee] = useState(itemAssignee || '');
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Fixed runtime error and added missing dependency
  useEffect(() => {
    logger.debug('ItemDetails component mounted or updated', { itemId });
    if (itemId) {
      logger.debug(`Using item details for ID: ${itemId}`);
      // Fixed by removing the undefined function call and using props directly
      // The component already receives all needed details through props
      if (itemName && itemDescription) {
        logger.debug('Item details available in props', { name: itemName });
      } else {
        logger.warn('Item details incomplete in props', { id: itemId });
      }
    }
  }, [itemId, itemName, itemDescription, logger]);

  // Missing error handling and logging in this function
  const handleSave = () => {
    logger.debug('Saving item details', { itemId });

    // No validation or error handling
    try {
      const updatedItem = {
        id: itemId,
        name: localName,
        description: localDescription,
        category: localCategory,
        priority: localPriority,
        tags: localTags,
        status: localStatus,
        dueDate: localDueDate,
        assignee: localAssignee
      };

      logger.debug('Item data prepared for save', { updatedItem });

      // This might fail but no error handling
      onSave(updatedItem);
      logger.info('Item saved successfully', { itemId });
      setIsDirty(false);
    } catch (error) {
      logger.error('Error saving item', error);
      // We could add error handling UI here
    }
  };

  // Function with long parameter list that should be refactored
  const validateAndUpdateItem = (
    name,
    description,
    category,
    priority,
    tags,
    status,
    dueDate,
    assignee,
    createdBy,
    permissions,
    validationRules,
    customFields,
    showAdvanced,
    enableNotifications,
    autoSave,
    readOnly,
    allowEdit,
    allowDelete
  ) => {
    // No logging of inputs or validation steps
    let valid = true;
    const newErrors = {};

    if (!name || name.trim().length === 0) {
      valid = false;
      newErrors.name = 'Name is required';
    }

    if (category && !['work', 'personal', 'urgent'].includes(category)) {
      valid = false;
      newErrors.category = 'Invalid category';
    }

    // This will cause a runtime error - undefined method
    if (dueDate && !validateDate(dueDate)) {
      valid = false;
      newErrors.dueDate = 'Invalid due date';
    }

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  };

  // Another function with too many parameters
  const processItemUpdate = (
    itemData,
    updateType,
    timestamp,
    userId,
    userRole,
    permissions,
    validationLevel,
    notificationSettings,
    auditEnabled,
    backupEnabled,
    versionControl,
    conflictResolution,
    retryCount,
    timeout,
    batchMode,
    asyncMode
  ) => {
    // No error handling or logging
    if (updateType === 'bulk') {
      // Process bulk update
      return processBulkUpdate(itemData, userId, permissions);
    } else if (updateType === 'single') {
      // Process single update
      return processSingleUpdate(itemData, userId, timestamp);
    }

    // Process generic update instead of undefined function
    return processGenericUpdate(itemData);
  };

  /**
   * Process a bulk update for multiple items
   * 
   * @param {Object} itemData - The item data to update
   * @param {string} userId - The ID of the user performing the update
   * @param {Object} permissions - User permissions
   * @returns {Promise<Object>} - The result of the update
   */
  const processBulkUpdate = (itemData, userId, permissions) => {
    logger.debug('Processing bulk update', { userId, items: itemData.length });

    try {
      // Placeholder for actual bulk update logic
      return Promise.resolve({
        success: true,
        updatedCount: Array.isArray(itemData) ? itemData.length : 0
      });
    } catch (error) {
      logger.error('Error in bulk update', { error });
      return Promise.reject(error);
    }
  };

  /**
   * Process a single item update
   * 
   * @param {Object} itemData - The item data to update
   * @param {string} userId - The ID of the user performing the update
   * @param {string} timestamp - The timestamp of the update
   * @returns {Promise<Object>} - The result of the update
   */
  const processSingleUpdate = (itemData, userId, timestamp) => {
    logger.debug('Processing single update', { userId, itemId: itemData.id });

    try {
      // Placeholder for actual single update logic
      return Promise.resolve({
        success: true,
        updatedItem: { ...itemData, updatedAt: timestamp, updatedBy: userId }
      });
    } catch (error) {
      logger.error('Error in single update', { error });
      return Promise.reject(error);
    }
  };

  /**
   * Process a generic update for an item
   * 
   * @param {Object} itemData - The item data to update
   * @returns {Promise<Object>} - The result of the update
   */
  const processGenericUpdate = (itemData) => {
    logger.debug('Processing generic update', { itemId: itemData.id });

    try {
      // Placeholder for actual generic update logic
      return Promise.resolve({ success: true, updatedItem: itemData });
    } catch (error) {
      logger.error('Error in generic update', { error });
      return Promise.reject(error);
    }
  };

  /**
   * Handles changes to input fields
   * 
   * @param {string} field - The name of the field that changed
   * @param {any} value - The new value of the field
   */
  const handleInputChange = (field, value) => {
    logger.debug('Input field changed', { field, value });
    setIsDirty(true);

    try {
      switch (field) {
        case 'name':
          setLocalName(value);
          if (typeof onNameChange === 'function') {
            onNameChange(value);
          }
          break;
        case 'description':
          setLocalDescription(value);
          if (typeof onDescriptionChange === 'function') {
            onDescriptionChange(value);
          }
          break;
        case 'category':
          setLocalCategory(value);
          if (typeof onCategoryChange === 'function') {
            onCategoryChange(value);
          }
          break;
        case 'priority':
          setLocalPriority(value);
          if (typeof onPriorityChange === 'function') {
            onPriorityChange(value);
          }
          break;
        case 'status':
          setLocalStatus(value);
          if (typeof onStatusChange === 'function') {
            onStatusChange(value);
          }
          break;
        case 'dueDate':
          setLocalDueDate(value);
          if (typeof onDueDateChange === 'function') {
            onDueDateChange(value);
          }
          break;
        case 'assignee':
          setLocalAssignee(value);
          if (typeof onAssigneeChange === 'function') {
            onAssigneeChange(value);
          }
          break;
        default:
          logger.warn('Unhandled input field', { field });
          break;
      }
    } catch (error) {
      logger.error('Error handling input change', { field, error });
    }
  };

  /**
   * Formats a created date for display
   * 
   * @param {string} date - The date string to format
   * @returns {string} - The formatted date string
   */
  const formatCreatedDate = (date) => {
    return formatDateTime(date);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {itemId ? 'Edit Item Details' : 'New Item Details'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={localName}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={readOnly}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={localCategory}
                  label="Category"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={readOnly}
                >
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={localDescription}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={readOnly}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={localPriority}
                  label="Priority"
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  disabled={readOnly}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={localStatus}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={readOnly}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={localDueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Assignee"
                value={localAssignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                disabled={readOnly}
              />
            </Grid>

            {showAdvanced && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Options
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableNotifications}
                        onChange={(e) => {
                          // Missing function call - this will cause an error
                          handleNotificationToggle(e.target.checked);
                        }}
                      />
                    }
                    label="Enable Notifications"
                    disabled={readOnly}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoSave}
                        onChange={(e) => {
                          // Missing function - will cause runtime error
                          handleAutoSaveToggle(e.target.checked);
                        }}
                      />
                    }
                    label="Auto Save"
                    disabled={readOnly}
                  />
                </Grid>
              </>
            )}

            {itemCreatedAt && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {/* This will cause an error because formatCreatedDate calls undefined function */}
                  Created: {formatCreatedDate(itemCreatedAt)} by {itemCreatedBy}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        {allowEdit && !readOnly && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!isValid || !isDirty}
          >
            Save Changes
          </Button>
        )}
        {allowDelete && (
          <Button
            onClick={() => {
              // Missing confirmation dialog - this could accidentally delete items
              onDelete(itemId);
            }}
            color="error"
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ItemDetails;
