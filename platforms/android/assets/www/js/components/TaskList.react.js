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
  	allTasks: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTasks).length < 1) {
      return null;
    }

    var allTasks = this.props.allTasks;
    var todos = [];
    for (var key in allTasks) {
      todos.push(<TaskItem key={key} todo={allTasks[key]} />);
    }

    return (
      <div id="listing">
        
        <table className="pure-table pure-table-bordered">
        <thead>
	        <tr>
	            <th>
		            
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
   * Event handler to mark all TASKs as complete
   */
  _onToggleCompleteAll: function() {
    TaskActions.toggleCompleteAll();
  }

});

module.exports = TaskList;
