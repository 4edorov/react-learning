class News extends React.Component {
  render() {
    return (
      <div className="news">
        No News found
      </div>
    );
  }
};

class Comments extends React.Component {
  render() {
    return (
      <div className="comments">
        No news - No comments
      </div>
    );
  }
};

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        Hello World from App component! Here's my news!!!
        <News />
        <Comments />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);