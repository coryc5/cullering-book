var React = require('react');

var Dewey = React.createClass({
  
  inlineStyle: {
    border: '2px solid black',
    display: 'inline-block',
    height: 30,
    width: 130,
    'vertical-align': 'top'
  },
  
  availStyle: {
    color: 'green',
    border: '2px solid black',
    display: 'inline-block',
    height: 30,
    width: 150
    },
    
    notStyle: {
      color: 'red',
      border: '2px solid black',
      display: 'inline-block',
      height: 30,
      width: 150
    },
    
    checkedStyle: {
      color: 'darkgoldenrod',
      border: '2px solid black',
      display: 'inline-block',
      height: 30,
      width: 150
    },
  
  render: function() {
    
    var libStyle;
    
    if (this.props.avail === "Available") {
      libStyle = this.availStyle;
    } else if (this.props.avail === "Not Available") {
      libStyle = this.notStyle;
    } else if (this.props.avail === "Checked Out") { 
      libStyle = this.checkedStyle;
    } else {
      libStyle = this.inlineStyle;
    }
    
    return (
      <div>
        <div style={{border: '2px solid black', display: 'inline-block', height: 30, width:600, 'vertical-align': 'top'}}>Title: {this.props.title}</div>
        <div style={{border: '2px solid black', display: 'inline-block', height: 30, width:250, 'vertical-align': 'top'}}>Author: {this.props.author}</div>
        <div style={this.inlineStyle}>Rating: {this.props.rating}</div>
        <div style={this.inlineStyle}>Ratings: {this.props.ratings}</div>
        <div style={libStyle}>Avail: {this.props.avail}</div>
        <a href={this.props.libURL}>Click Here</a>
      </div>
    )
  }
});

module.exports = Dewey;