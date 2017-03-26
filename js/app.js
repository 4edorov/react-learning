var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

window.ee = new EventEmitter();

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      counter: 0
    };
  },

  counterClick: function(e) {
    e.preventDefault();
    this.setState({counter: ++this.state.counter})
  },

  render() {
    var data = this.props.data;
    var newsTemplate;
    if (data.length > 0) {
      newsTemplate = data.map((item, index) => {
        return (
          <div key={index}>
            <Article data={item}/>
          </div>
        );
      });
    } else {
      newsTemplate = <p>No News</p>
    }
    return (
      <div className="news">
        {newsTemplate}
        {data.length > 0 && <strong className="news__count">All News: {data.length}</strong>}
      </div>
    );
  }
});

var Article = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },

  getInitialState: function() {
    return {
      visible: false
    };
  },

  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({visible: true});
  },

  render: function() {
    var author = this.props.data.author,
      text = this.props.data.text,
      bigText = this.props.data.bigText,
      visible = this.state.visible;

    return (
      <div className='article'>
        <p className='news__author'>{author}:</p>
        <p className='news__text'>{text}</p>
        <a href="#" onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none' : '')}>More...</a>
        <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
      </div>
    )
  }
});

// Field to add new news

var Add = React.createClass({

  // Use controlled component

  /*getInitialState: function() {
    return {
      myValue: 'Enter value'
    };
  },

  onChangeHandler: function(e) {
    this.setState({myValue: e.target.value})
  },*/

  // Work with Button-Alert through State
  getInitialState: function() {
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    };
  },

  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },

  onBtnClickHandler: function(e) {
    e.preventDefault();
    var textE1 = ReactDOM.findDOMNode(this.refs.text);
    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var text = ReactDOM.findDOMNode(this.refs.text).value;

    var item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);

    textE1.value = '';
    this.setState({textIsEmpty: true});
  },

  onCheckRuleClick: function(e) {
    /*ReactDOM.findDOMNode(this.refs.alert_button).disabled = !e.target.checked;*/
    this.setState({agreeNotChecked: !this.state.agreeNotChecked});
  },

  /*onAuthorChange: function(e) {
    if (e.target.value.trim().length > 0) {
      this.setState({authorIsEmpty: false})
    } else {
      this.setState({authorIsEmpty: true})
    }
  },

  onTextChange: function(e) {
    if (e.target.value.trim().length > 0) {
      this.setState({textIsEmpty: false})
    } else {
      this.setState({textIsEmpty: true})
    }
  },*/

  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({['' + fieldName]: false})
    } else {
      this.setState({['' + fieldName]: true})
    }
  },

  render: function() {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty;
    return (
      <form className="add cf">
        <input
          type="text"
          className="add__author"
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          defaultValue=""
          placeholder="Enter your name"
          ref="author"
        />
        <textarea
          className="add__text"
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          defaultValue=""
          placeholder="Enter your news"
          ref="text"
        ></textarea>
        <label className="add__checkrule">
          <input
            type="checkbox"
            defaultChecked={false}
            ref="checkrule"
            onChange={this.onCheckRuleClick}
          />I agree with rules
        </label>
        <button
          className="add__btn"
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
          Add News
        </button>
      </form>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: my_news
    };
  },
  componentDidMount: function() {
    var self = this;
    window.ee.addListener('News.add', function(item) {
      var nextNews = item.concat(self.state.news);
      self.setState({news: nextNews});
    });
  },
  componentWillUnmount: function() {
    window.ee.removeListener('News.dd');
  },
  render: function() {
    return (
      <div className="app">
        <Add />
        <h3>News</h3>
        <News data={this.state.news}/> {/*add new prop*/}
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);