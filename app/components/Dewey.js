var React = require('react');

var Dewey = React.createClass({
  
  render: function() {
    
    var libStyle;
    
    if (this.props.book.avail === "Available") {
      libStyle = {color: "green"};
    } else if (this.props.book.avail === "Not Available") {
      libStyle = {color: "red"};
    } else if (this.props.book.avail === "Checked Out") { 
      libStyle = {color: "darkgoldenrod"};
    } else {
      libStyle = {"fontStyle": "italic"};
    }
    var linkText = '';
    
    if (this.props.book.avail !== 'Loading...' && this.props.book.avail !== 'Not Available') {
      if (this.props.book.avail === 'Available') {
        if (!this.props.book.availCopies) {
          var copies = `Loading...`;
        } else {
        var copies = `Available: ${this.props.book.availCopies} of ${this.props.book.libCopies}`;
        }
        linkText = 'Check Out Now';
      } else {
        if (!this.props.book.libCopies) {
          var copies = `Loading...`;
        } else {
        var copies = `Waiting List: ${this.props.book.holds}`;
        }
        linkText = 'Place Hold';
      }
    }
    
    var imgDiv = {backgroundImage: 'url(' + this.props.book.img + ')', backgroundRepeat: 'no-repeat', marginLeft: 50, style: 'inline-block', height: 80, float: 'left', width: 100};
    
    
    return (
      <div style={{border: '2px solid goldenrod', height: 80, "verticalAlign": "middle"}}> 
        <button onClick={this.props.unshow.bind(null, this.props.item)} style={{display: 'inline', float: 'left', height:75, width: 40}}>X </button>
        <div style={imgDiv}></div>
        <div style={{display: 'inline-block', width: 400}}>
          <p style={{marginBottom: 5}}><a href={this.props.book.link} target='_blank'>{this.props.book.title.slice(0,50)}</a></p>
          <p style={{marginBottom: 5}}>{this.props.book.author}</p>
          <p style={{marginBottom: 5}}>{this.props.book.published}</p>
        </div>
        <div style={{display: 'inline-block', width: 50, verticalAlign: 'top', marginLeft: 20, fontSize: 20}}>
          <p>{this.props.book.rating}</p>
        </div>
        <div style={{display: 'inline-block', width: 150, verticalAlign: 'top', marginLeft: 20, fontSize: 20}}>
          <p>{this.props.book.ratingsNum} Ratings</p>
        </div>
        <div style={{display: 'inline-block', width: 200, verticalAlign: 'top', marginLeft: 20, fontSize: 20}}>
          <p style={libStyle}>{this.props.book.avail}</p>
          <a href={this.props.book.libURL} target='_blank'>{linkText}</a>
        </div>    
        <div style={{display: 'inline-block', width: 200, verticalAlign: 'top', marginLeft: 20, fontSize: 20}}>
          {copies}
        </div>
      </div>
    )
  } 
});

module.exports = Dewey;