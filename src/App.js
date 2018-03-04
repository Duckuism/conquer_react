import React, { Component } from 'react';
import './App.css';


const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

//var url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;

console.log(url);

const largeColumn={
  width:'40%',
};

const midColumn = {
  width:'30%',
};

const smallColumn = {
  width: '10%',
};


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,    
    };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)//url 구성
      .then(response => response.json())//json데이터 구조로 변환
      .then(result => this.setSearchTopStories(result))//컴포넌트 내부 상태 result에 저장
      .catch(error => error);
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  componentDidMount(){
    const {searchTerm} = this.state;

    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id){

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result:{...this.state.result, hits: updatedHits}
    });

  }

  render(){

    const { searchTerm, result } = this.state;

    console.log(this.state);

    return(

      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result &&
          <Table 
            list={result.hits}          
            onDismiss={this.onDismiss}
          />          
        }
      </div>
    );
  }
}


    // const { value, onChange, children } = this.props;
    //const value = this.props.value;(searchTerm)
    //const onChange = this.props.onChange;(this.onSearchChange)
    //const children = this.props.children;(Search 컴포넌트의 자식 property인 Search가 children props가 된다.)
    //여기서 this는 제일 상위 컨텍스트 App 컴포넌트를 가리킨다!! 내가 생각하는 this랑 다르다.

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input 
      type="text"
      value={value}
      onChange={onChange}
    />      
    <button type="submit">
      {children}
    </button>
  </form>


const Table = ({list, onDismiss}) => 
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href="{item.url}">{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={()=>onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>



class Button extends Component {
  render(){
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    )
  }
}

export default App;
