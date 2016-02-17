var React = require('react');

var Dewey = React.createClass({
  
  inlineStyle: {
    border: '2px solid black',
    display: 'inline-block',
    height: 30,
    width: 130,
    'verticalAlign': 'top'
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
        <div style={{border: '2px solid black', display: 'inline-block', height: 30, width:600, 'verticalAlign': 'top'}}><button onClick={this.props.unshow.bind(null, this.props.item)}/>Title: {this.props.book.title}</div>
        <div style={{border: '2px solid black', display: 'inline-block', height: 30, width:250, 'verticalAlign': 'top'}}>Author: {this.props.book.author}</div>
        <div style={this.inlineStyle}>Rating: {this.props.book.rating}</div>
        <div style={this.inlineStyle}>Ratings: {this.props.book.ratings}</div>
        <div style={libStyle}>Avail: {this.props.book.avail}</div>
        <a href={this.props.book.libURL}>Click Here</a>
        <span>{this.props.book.availCopies} available</span>
      </div>
    )
  }
});

module.exports = Dewey;