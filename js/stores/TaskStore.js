/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TaskStore
 */
var ConfigComp = require('../config/ConfigComp');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TaskConstants = require('../constants/TaskConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _tasks = {};
var _notes = {};

Parse.initialize(ConfigComp.APP_ID, ConfigComp.JS_ID);
/**
 * Create a TASK item.
 * @param  {string} text The content of the TASK
 */
function create(text) {
                     
    var Task            =   Parse.Object.extend("Task");
    var Note            =   Parse.Object.extend("Note");
    var taskObject      =   new Task();
    
    taskObject.set('name', text.name);
    taskObject.set('Priority', text.priority);
    taskObject.set('CompletedOn',new Date());
    taskObject.set('Description',text.description);
    taskObject.set('IsCompleted',false);
    
    /*var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
     */
                        
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    var currentUser = Parse.User.current();
    if (currentUser) {
         acl.setReadAccess( 'User', true );
    } else {
        acl.setReadAccess( 'Guest', true );
    }   
            
      allNotes=text.notes;
      for (var key in allNotes) {
          
           noteval = (allNotes[key]); 
           var noteObject      =   new Note();
           
           noteObject.set('note',noteval.note);
           noteObject.set('parent',taskObject);
           
           noteObject.setACL( acl );
           noteObject.save(null, {
                 success: function(taskResult) {                           
                           //console.log(taskResult.id);                           
                  },
                error: function(taskResult, error) {
                           console.log(error);   
                 }
        });               
      }
      
      taskObject.save(null, {
      success: function(taskResult) {
             _tasks[taskResult.id] = {
	                     id: taskResult.id,
	                     complete : false,    
	                     name : text.name,
	                     description : text.description,
	                     priority : text.priority
	                    };
       },
      error: function(taskResult, error) {
             console.log(error);   
      }
    });
}

function createNote(text) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _notes[id] = {note: text};
}
/**
 * Update a TASK item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, IsCompleted) {
	_tasks[id] = assign({}, _tasks[id], {complete: IsCompleted});
	var Task            =   Parse.Object.extend("Task");
	var query = new Parse.Query(Task);
	query.equalTo("objectId", id);
	query.first({
	  success: function(taskObject) {
	    taskObject.set('CompletedOn',new Date());
    	taskObject.set('IsCompleted',IsCompleted);
	    taskObject.save();
	   // _tasks[id] = assign({}, _tasks[id], {complete: IsCompleted});
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});

  
}

/**
 * Update all of the TASK items with the same object.
 *     the data to be updated.  Used to mark all TASKs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  for (var id in _tasks) {
    update(id, updates);
  }
}

/**
 * Delete a TASK item.
 * @param  {string} id
 */
function destroy(id) {
  delete _tasks[id];
  
	var Task            =   Parse.Object.extend("Task");
	var query1 = new Parse.Query(Task);
	query1.equalTo("objectId", id);
	query1.first({
	  success: function(taskObject) {
	     taskObject.destroy({
		  success: function(myObject) {		  	
		  	
		  },
		  error: function(myObject, error) {
		    // The delete failed.
		    // error is a Parse.Error with an error code and message.
		  }
		});
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
 
}

/**
 * Delete all the completed TASK items.
 */
function destroyCompleted() {
  for (var id in _tasks) {
    if (_tasks[id].complete) {
      destroy(id);
    }
  }
}
/*_todos[id] = {
    id: id,
    complete: false,
    text: text
  };*/
function getAllTasks() {
    var Task            =   Parse.Object.extend("Task");
    var query           =   new Parse.Query(Task); 
    query.find({
      success: function(tasks) {
      	
      	for(var index=0;index<tasks.length;index++){
                             
               var objectResult = tasks[index];               
                _tasks[objectResult.id] = {
                     id: objectResult.id,
                     complete : objectResult.get("IsCompleted"),    
                     name : objectResult.get("name"),
                     description : objectResult.get("Description"),
                     priority : objectResult.get("Priority")
                    }; 
                 
            }
            return _tasks;
      },
      error: function(obj, err) {
        console.error('getAll() error', obj, err);
      }
    });
    return '--';
  }
 
var TaskStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TASK items are marked as completed.
   * @return {boolean}
   */
  allComplete: function() {
    for (var id in _tasks) {
      if (!_tasks[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TASKs.
   * @return {object}
   */
  getAll: function() {  
    return _tasks;
  },
  getCallbackAllTasks: function(callback){  	
  
    var Task            =   Parse.Object.extend("Task");
    var query           =   new Parse.Query(Task); 
    query.find({
      success: function(tasks) {
      	for(var index=0;index<tasks.length;index++){
                             
               var objectResult = tasks[index];
               
                 _tasks[objectResult.id] = {
                     id: objectResult.id,
                     complete : objectResult.get("IsCompleted"),    
                     name : objectResult.get("name"),
                     description : objectResult.get("Description"),
                     priority : objectResult.get("Priority")
                    };
            } 

        callback(_tasks);
      },
      error: function(obj, err) {
        console.error('getAll() error', obj, err);
      }
    });
  },
  getAllNote: function() {
    return _notes;
  },
  delNote: function() {
	_notes = {};
	 return _notes;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {
  	
    case TaskConstants.TASK_CREATE:
      name= action.text['name'];
      text = action.text;
      if ( name.trim() !== '') {
        create(text);
      }
      break;
	case TaskConstants.NOTE_CREATE:
      note_desc = action.note_desc.trim();
      if (note_desc !== '') {
        createNote(note_desc);
      }
      break;
    case TaskConstants.TASK_TOGGLE_COMPLETE_ALL:
      if (TaskStore.allComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      break;

    case TaskConstants.TASK_UNDO_COMPLETE:
      update(action.id, false);
      break;

    case TaskConstants.TASK_COMPLETE:
      update(action.id, true);
      break;

    case TaskConstants.TASK_DESTROY:
      destroy(action.id);
      break;

    case TaskConstants.TASK_DESTROY_COMPLETED:
      destroyCompleted();
      break;

	case TaskConstants.TASK_GET_ALL:
      getAllTasks();
      break;
      
    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  TaskStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = TaskStore;
