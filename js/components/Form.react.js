/**
 * Form
 */

var React = require('react');
var TaskActions = require('../actions/TaskActions');
var ReactPropTypes = React.PropTypes;
var Notes = require('./Notes.react');
var TaskStore = require('../stores/TaskStore');
var TaskApp = require('../components/TaskManagerApp.react');
var ENTER_KEY_CODE = 13;

var Header = React.createClass({

  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    value: ReactPropTypes.string
  },

  getInitialState: function() {
    return {
      name: this.props.value || '',
      description: this.props.description || '',
      priority_opt: [],
      priority: 0,
      note_desc:''
    };    
  },
  render: function() {
  	this.state.priority_opt.push(<option key={0} value={0}>Select</option>);
  	/*for (var i = 1; i <= 5; i++) {
        this.state.priority_opt.push(
            <option key={i} value={i}>{i}</option>
        );
    }*/
     this.state.priority_opt.push( <option key={1} value={'High'}>{'High'}</option> );
     this.state.priority_opt.push( <option key={2} value={'Medium'}>{'Medium'}</option> );
     this.state.priority_opt.push( <option key={3} value={'Low'}>{'Low'}</option> );
    return (     
    	
	      <div className="pure-form pure-form-stacked" id="main">
	       <fieldset>
	        <legend><b>Add Task</b></legend>
	        <label>Name</label>
	        <input
		        id="name"
		        onChange={this._onChange}
		        value={this.state.name}
		        autoFocus={true}
		        className="pure-input-1-3"
		      />
		      <label>Description</label>
		     <textarea
		        id="description"
		        onChange={this._onChange}
		        value={this.state.description}
		         className="pure-input-1-3"
		      />
		      <label>Priority</label>
	         <select id="priority" onChange={this._onChange} value={this.state.priority} >
	         	{this.state.priority_opt}
	         </select>	   
	         <label>Notes</label>       
	         <textarea
		        id="note_desc"
		        onChange={this._onChange}
		        value={this.state.note_desc}
		         className="pure-input-1-3"
		      />
		      <button
	          id="save"
	          className="button-secondary pure-button button-xsmall"
	          onClick={this.addNotes}>
	          Add Notes +
	        </button>
	         <Notes />
	        <label className="br10"></label>
	        <button
	          id="save"
	          className="pure-button pure-button-primary"
	          onClick={this.onSave}>
	          Save
	        </button>
	       </fieldset>
	      </div>
    );
  },

  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
   onSave: function() {
   	
   allNotes = TaskStore.getAllNote();
	   	var text = {
	   		name:this.state.name, 
	   		description:this.state.description,
	   		priority:this.state.priority,
	   		notes:allNotes
	   		}; 
	   	name = text['name'];
	    if (name.trim()){	    	
	      TaskActions.create(text);
	      this.setState( {
	   		name:'', 
	   		description:'',
	   		priority:0,
	   		note_desc:''
	   		});
	   	  TaskStore.delNote();
	   	  //TaskActions.getAllTasks();
	    }
	    
    },
    
	addNotes: function() {
		var note_desc = this.state.note_desc;
    	if (note_desc.trim()){
      		TaskActions.addNotes(note_desc);
      	}
    },
  /**
   * @param {object} event
   */
  _onChange: function(/*object*/ event) {
  	if(event.target.id == 'name'){
		this.setState({name: event.target.value });
	}
  	if(event.target.id == 'description'){
		this.setState({description: event.target.value });
	}
    if(event.target.id == 'priority'){
		this.setState({priority: event.target.value });
	}
	if(event.target.id == 'note_desc'){
		this.setState({note_desc: event.target.value });
	}
  }
});

module.exports = Header;
