/**
 * Header
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;

var Header = React.createClass({

  propTypes: {
    className: ReactPropTypes.string    
  },

  render: function() {
    return (
	      <div className="navbar"><div className="navbar-inner"><a className="brand">Task Manager</a></div></div>
    );
  }

});

module.exports = Header;
