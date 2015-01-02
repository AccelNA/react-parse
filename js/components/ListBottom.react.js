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

var ListBottom = React.createClass({

  propTypes: {
    allTasks: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var allTasks = this.props.allTasks;
    var total = Object.keys(allTasks).length;

    if (total === 0) {
      return null;
    }

    var completed = 0;
    for (var key in allTasks) {
      if (allTasks[key].complete) {
        completed++;
      }
    }

    var itemsLeft = total - completed;
    var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
    itemsLeftPhrase += 'left';

   
  	return (
      <div id="listbottom">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
      </div>
    );
  },

  /**
   * Event handler to delete all completed TASKs
   */
  _onClearCompletedClick: function() {
    TaskActions.destroyCompleted();
  }

});

module.exports = ListBottom;
