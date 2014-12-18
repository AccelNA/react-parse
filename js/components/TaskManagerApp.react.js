/**
 * App
 */
var ListBottom = require('./ListBottom.react');
var Header = require('./Header.react');
var Form = require('./Form.react');
var TaskList = require('./TaskList.react');
var React = require('react');
var TaskStore = require('../stores/TaskStore');

/**
 * Retrieve the current TODO data from the TaskStore
 */
function getTodoState() {
  return {
    allTodos: TaskStore.getAll(),
    areAllComplete: TaskStore.areAllComplete()
  };
}

var TaskApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
  	  
      <div id="layout" className="pure-g">
      <Header />    
       <div className="pure-u-1 pure-u-md-1-5"></div>    
       <div className="pure-u-1 pure-u-md-3-5">          
        <Form />
        <TaskList
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <ListBottom allTodos={this.state.allTodos} />       
       </div>
       <div className="pure-u-1 pure-u-md-1-5"></div>    
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TaskStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});

module.exports = TaskApp;
