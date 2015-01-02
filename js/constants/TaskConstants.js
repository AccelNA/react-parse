/*
 * 
 * TaskConstants
 */

var keyMirror = require('keymirror');

module.exports = keyMirror({
  TASK_CREATE: null,
  NOTE_CREATE: null,
  TASK_COMPLETE: null,
  TASK_DESTROY: null,
  TASK_DESTROY_COMPLETED: null,
  TASK_TOGGLE_COMPLETE_ALL: null,
  TASK_UNDO_COMPLETE: null
});
