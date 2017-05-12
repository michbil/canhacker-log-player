import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import sample from './sample.js';
var entries = require('object.entries');


if (!Object.entries) {
  entries.shim();
}

window.testData = sample.split('\n').map(toJSON);

function toJSON(el) {
  const elements = el.split(" ");
  return {
    time: elements[0],
    id: elements[1],
    length: elements[2],
    data: elements.slice(3).filter((el) => el.length === 2)
  }
}

function reduceRecords(elements,prev) {
  return elements.reduce((acc,el,i) => {
    const count = !!acc[el.id] ? acc[el.id].count : 0;
    acc[el.id] =  {
      data: el.data,
      count: count+1
    };
    return acc;
  },prev)
}

//window.testRed = reduceRecords(window.testData,{});

const DrawRow = ({id,count,data,click}) => {
  const len = data.length;
  let index = 0;
  const emptyRows = Array(8-len).fill(<td key={"ts"+(index++)}/>);
  return (<tr  onClick={() => click(id)}>
    <td style={{width:"100px"}}>{id}</td>
      <td style={{width:"50px"}}>{data.length}</td>
    {data.map((x,i) => <td key={i}>{x}</td>)}
    {emptyRows}
    <td style={{width:"70px"}}>{count}</td>
  </tr>);
};

class DisplayTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masked: {}
    }
  }

  toggleVisible(id) {
    const mask = Object.assign({},this.state.masked);
    mask[id] = !this.state.masked[id];
    this.setState({masked:mask});
  }

  render () {
    const data = this.props.data;
    return (<table style={{fontFamily: "Courier new"}}>
      <tbody>
      {Object.entries(data).map((val) => {
        const id = val[0];
        const count = val[1].count;
        const data = val[1].data;
        return (this.state.masked[id] ?
            <tr click={(id) => {
                         this.toggleVisible(id);
                       }}>{id}</tr>
            : <DrawRow id={id}
                         count={count}
                         data={data}
                         key={id}
                         click={(id) => {
                         this.toggleVisible(id);
                       }}
            />);
      })}</tbody>
    </table>);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      step: 0,
    };
    const dataset = window.testData;
    const len = dataset.length;
    const step = 100;

    setInterval(()=> {
      let i = this.state.step;
      const chunk = dataset.slice(i,i+step);
      i+= step;
      if (i >= (len-1)) i = 0;
      const red = reduceRecords(chunk,this.state.data);
      this.setState({data:red,step:i});
    },100);
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.step} / {window.testData.length}</h2>
        </div>
        <DisplayTable data={this.state.data} />
      </div>
    );
  }
}

export default App;
