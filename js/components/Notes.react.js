/**
 * Notes
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TaskActions = require('../actions/TaskActions');
var TaskStore = require('../stores/TaskStore');
var Notes = React.createClass({
  /**
   * @return {object}
   */
  render: function() {
    allNotes = TaskStore.getAllNote();   
	if (Object.keys(allNotes).length < 1) {
      return null;
    }
	    
    var moreNotes = [];
    for (var key in allNotes) {
		noteval = (allNotes[key]);
		txtArea = <tr><td><label>{noteval.note}</label></td></tr>
		moreNotes.push(txtArea);
	}
	
    return (
      <div id="note-listing">        
        <table className="pure-table pure-table-striped">
    	<tbody>
    	{moreNotes}
        </tbody>
        </table>
      </div>
    );
  }

});

module.exports = Notes; 
