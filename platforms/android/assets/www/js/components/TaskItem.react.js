/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TaskActions = require('../actions/TaskActions');

var cx = require('react/lib/cx');

var TaskItem = React.createClass({

  propTypes: {
   todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var todo = this.props.todo;

    // 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <tr
        className={cx({
          'completed': todo.complete,
        })}
        key={todo.id}>
        <td>
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          </td>
          <td>
	          <label>
	            {todo.name}
	          </label>
	      </td>
	      <td>
	          <label>
	            {todo.description}
	          </label>
	      </td>
	      <td>
	          <label>
	            {todo.priority}
	          </label>
	      </td>
	      <td>
          	<button className="button-error pure-button button-xsmall" onClick={this._onDestroyClick}>X</button>
        </td>
      </tr>
    );
  },

  _onToggleComplete: function() {
    TaskActions.toggleComplete(this.props.todo);
  },

  _onDestroyClick: function() {
    TaskActions.destroy(this.props.todo.id);
  }

});

module.exports = TaskItem;
