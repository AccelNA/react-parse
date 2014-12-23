/**
 * Task List
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TaskActions = require('../actions/TaskActions');
var TaskItem = require('./TaskItem.react');
var TaskStore = require('../stores/TaskStore');
var TaskList = React.createClass({

  propTypes: {
  	allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodos = this.props.allTodos;
    var todos = [];
    for (var key in allTodos) {
      todos.push(<TaskItem key={key} todo={allTodos[key]} />);
    }

    return (
      <div id="listing">
        
        <label htmlFor="toggle-all">Mark all as complete</label>
        <table className="pure-table pure-table-bordered">
        <thead>
	        <tr>
	            <th>
		            <input
			          id="toggle-all"
			          type="checkbox"
			          onChange={this._onToggleCompleteAll}
			          checked={this.props.areAllComplete ? 'checked' : ''}
			        />
		        </th>
	            <th>Name</th>
	            <th>Description</th>
	            <th>Priority</th>
	            <th>Delete</th>
	        </tr>
	    </thead>
    	<tbody>
        	{todos}
        </tbody>
        </table>
      </div>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TaskActions.toggleCompleteAll();
  }

});

module.exports = TaskList;
