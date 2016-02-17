var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');

var Dewey = require('./components/Dewey');

var App = React.createClass({
  
  unshownItems: 0,
  
  filterStock: function(event) {
    this.setState({filterStock: event.target.checked});
  },
  
  unshow: function(item) {
    this.state.showStuff[item].unshow = true;
    this.unshownItems++;
    this.setState(this.state);
    
  },
  
  getInitialState: function() {
    return {
      items: [],
      filterStock: false,
      showStuff: []
    }
  },
  
  componentDidMount: function() {
    var self = this;
    $.getJSON('/db', function(data) {
      data.forEach(function(input) {
        self.state.showStuff.push(input);
      });
      self.setState({items: data});
    });
    
    $.get('/phantom');
    
    setInterval(function() {
      $.getJSON('/db', function(data) {
       
          if (self.state.filterStock) {
            data = data.filter(function(input) {
              return input.avail !== 'Not Available'
            });
          }
        self.setState({items: data});
      })}, 750);
  },
  
  render: function() {
    
    var items = [];
    var itemsLength = this.state.items.length;
        
    for (var i = 0; i < itemsLength; i++) {
      var book = this.state.items[i];
      
        if (!this.state.showStuff[i].unshow) { 
          items.push(<Dewey unshow={this.unshow} item={i} book={book} key={i}/>)
        }
    }
    
    
    return (
      <div>
        <div style={{textAlign: 'right', 'marginRight': 300, border: '2px solid mistyrose'}}>
          <span>Total items: {this.state.items.length - this.unshownItems}</span>
          <input type="checkbox" value="inStock" onChange={this.filterStock} />
        </div>
        Hello World!
        {items}
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));