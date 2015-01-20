/*
 * TaskActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TaskConstants = require('../constants/TaskConstants');

var TaskActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.TASK_CREATE,
      text: text
    });
  },

 addNotes: function(note_desc) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.NOTE_CREATE,
      note_desc: note_desc
    });
  }, 
  /**
   * Toggle whether a single Task is complete
   * @param  {object} task
   */
  toggleComplete: function(task) {
    var id = task.id;
    if (task.complete) {
      AppDispatcher.handleViewAction({
        actionType: TaskConstants.TASK_UNDO_COMPLETE,
        id: id
      });
    } else {
      AppDispatcher.handleViewAction({
        actionType: TaskConstants.TASK_COMPLETE,
        id: id
      });
    }
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.TASK_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.TASK_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.TASK_DESTROY_COMPLETED
    });
  },
  getAllTasks: function() {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.TASK_GET_ALL
    });
  }

};

module.exports = TaskActions;
