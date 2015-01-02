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
 * Retrieve the current TASK data from the TaskStore
 */
function getTodoState() {
  return {
    allTasks: TaskStore.getAll(),
    areAllComplete: TaskStore.allComplete()
  };
}
var TaskApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {  	
  	TaskStore.getAllTasks(this._getSate);
    TaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._getSate);
  },
   /*shouldComponentUpdate : function() {  	
  	 return getTodoState();
  },*/
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
          allTasks={this.state.allTasks}
          areAllComplete={this.state.areAllComplete}
        />
        <ListBottom allTasks={this.state.allTasks} />       
       </div>
       <div className="pure-u-1 pure-u-md-1-5"></div>    
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TaskStore
   */
  _getSate: function() {
    this.setState(getTodoState());
  },
  
  _onChange : function(){
	TaskStore.getAllTasks(this._getSate);
  }
});

module.exports = TaskApp;
