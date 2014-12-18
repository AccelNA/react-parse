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

var _todos = {};
var _notes = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {

    Parse.initialize(ConfigComp.APP_ID,
                     ConfigComp.JS_ID);
                     
    var Task            =   Parse.Object.extend("Task");
    var Note            =   Parse.Object.extend("Note");
    var taskObject      =   new Task();
    
    taskObject.set('name', text.name);
    taskObject.set('Priority', text.priority);
    taskObject.set('CompletedOn',new Date());
    taskObject.set('Description',text.description);
    taskObject.set('IsCompleted',false);
        
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
                           init();
                           TaskStore.getAll();
                  },
                error: function(taskResult, error) {
                           console.log(error);   
                 }
        });
               
      }
      
      
      
      taskObject.save(null, {
      success: function(taskResult) {
             init();
             TaskStore.getAll();
       },
      error: function(taskResult, error) {
             console.log(error);   
      }
    });

  console.log(text.notes);
}

function createNote(text) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _notes[id] = {note: text};
}
/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

var TaskStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _todos) {
      if (!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },
  
  getAllNote: function() {
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
    case TaskConstants.TODO_CREATE:
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
    case TaskConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TaskStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      break;

    case TaskConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      break;

    case TaskConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      break;

    case TaskConstants.TODO_DESTROY:
      destroy(action.id);
      break;

    case TaskConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
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


function init(){
    Parse.initialize(ConfigComp.APP_ID,
                     ConfigComp.JS_ID);
                     
    var Task            =   Parse.Object.extend("Task");
    var query           =   new Parse.Query(Task); 
    
    query.find({
        success: function(tasks){
                                      
            for(var index=0;index<tasks.length;index++){
                             
               var objectResult = tasks[index];
               
                 _todos[objectResult.id] = {
                     id: objectResult.id,
                     complete : false,    
                     name : objectResult.get("name"),
                     description : objectResult.get("Description"),
                     priority : objectResult.get("Priority")
                    }; 
                   
            }   
          console.log(_todos);
        }
        
    }); 
   }


module.exports = TaskStore;
