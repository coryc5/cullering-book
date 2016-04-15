var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');

var Dewey = require('./components/Dewey.jsx');

var App = React.createClass({

  unshownItems: 0,

  filterStock: function(event) {
    this.setState({filterStock: event.target.checked});
  },

  filterAvail: function(event) {
    this.setState({filterAvail: event.target.checked});
  },

  unshow: function(item) {
    console.log(item.target);
    // this.state.showStuff[item].unshow = true;
    // this.unshownItems++;
    // this.setState(this.state);

  },

  getCulled: function() {
    var self = this;
    clearInterval(this.interval);
    this.setState({location: '/culled'})
    this.interval = setInterval(function() {
      $.getJSON(self.state.location, function(data) {

          if (self.state.filterStock) {
            data = data.filter(function(input) {
              return input.avail !== 'Not Available'
            });
          }

          if (self.state.filterAvail) {
            data = data.filter(function(input) {
              return input.avail !== 'Checked Out';
            });
          }

        self.setState({items: data});
      })}, 750);
  },

  getInitialState: function() {
    return {
      items: [],
      filterStock: false,
      filterAvail: false,
      showStuff: [],
      location: '/db'
    }
  },

  startPhantom: function() {
    var self = this;
    clearInterval(this.interval);
    this.setState({location: '/db'});

    this.interval = setInterval(function() {
      $.getJSON(self.state.location, function(data) {

          if (self.state.filterStock) {
            data = data.filter(function(input) {
              return input.avail !== 'Not Available'
            });
          }

          if (self.state.filterAvail) {
            data = data.filter(function(input) {
              return input.avail !== 'Checked Out';
            });
          }

        self.setState({items: data});
      })}, 750);

    $.get('/phantom');
  },

  componentDidMount: function() {
    var self = this;
    $.getJSON('/db', function(data) {
      data.forEach(function(input) {
        self.state.showStuff.push(input);
      });
      self.setState({items: data});
    });


    // setInterval(function() {
    //   $.getJSON(this.state.location, function(data) {

    //       if (self.state.filterStock) {
    //         data = data.filter(function(input) {
    //           return input.avail !== 'Not Available'
    //         });
    //       }

    //       if (self.state.filterAvail) {
    //         data = data.filter(function(input) {
    //           return input.avail !== 'Checked Out';
    //         });
    //       }

    //     self.setState({items: data});
    //   })}, 750);
  },


  interval: function() {},

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
        <div style={{fontFamily: 'Georgia', fontSize: 80, textAlign: 'center', fontStyle: 'italic'}}>
          <p>The Cullering Book</p>
        </div>
        <div style={{textAlign: 'center', fontFamily: "Lucida Console", fontSize: 20}}>
          <p>cull (v.)</p>
          <p>to selectively slaughter</p>
        </div>

        <div style={{textAlign: 'right', 'paddingRight': 100, border: '2px solid mistyrose'}}>
          <button onClick={this.getCulled} style={{marginRight: 20, marginLeft: 20}}>cull from db</button>
          <button onClick={this.startPhantom} style={{marginRight: 20, marginLeft: 20}}>cull</button>
          <select style={{marginRight: 20, marginLeft: 20}}><option>1987</option></select>
          <span style={{margin: 20}}>Total items: {this.state.items.length - this.unshownItems}</span>
          <span style={{margin: 20}}>Library: <input type="checkbox" value="inStock" onChange={this.filterStock} /></span>
          <span style={{margin: 20}}>Availability: <input type="checkbox" value="inStock" onChange={this.filterAvail} /></span>
        </div>
        {items}
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));