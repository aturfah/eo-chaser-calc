import './App.css';
import React, {Component} from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      numAttacks: 1,
      attackProbability: [1]
    }
  }

  addAttack() {
    const newState = this.state;
    newState.numAttacks += 1;
    newState.attackProbability.push(0);
    this.setState(newState);
  }

  removeAttack() {
    if (this.state.numAttacks === 1) {
      alert("Cannot have less than 1 attack.") 
    } else {
      const newState = this.state;
      newState.numAttacks -= 1;
      newState.attackProbability.pop();

      if (newState.numAttacks === 1) {
        newState.attackProbability = [1];
      }

      this.setState(newState);
    }
  }

  modifyAttackProbability(index, newValue) {
    let newVal = 0;
    if (newValue === '') {
      newVal = 0;
    } else if (!newValue.endsWith(".")) {
      newVal = Number(newValue);
      if (isNaN(newVal)) {
        return;
      }
    } else {
      newVal = newValue;
    }

    const newState = this.state;
    newState.attackProbability[index] = newVal;
    this.setState(newState);
  }

  normalizeAttackProbability() {
    const totalProb = this.state.attackProbability.reduce((a, b) => {
      return Number(a) + Number(b);
    })

    const newState = this.state;
    newState.attackProbability.forEach((val, idx) => {
      console.log("IDX", idx)
      newState.attackProbability[idx] = newState.attackProbability[idx] / totalProb;
    })
    this.setState(newState);
  }

  buildNumAttacksDropdownRows() {
    const output = []
    output.push(<tr>
      <td><label>Number of Attacks:</label></td>
      <td><i>Number</i></td>
      <td><i>Probability as Decimal (ex: 0.5)</i></td>
    </tr>)
    output.push(<tr>
      <td><button onClick={() => this.addAttack()}>Add Row</button></td>
      <td>1</td>
      <td><input
             value={this.state.attackProbability[0]} 
             onChange={(e) => this.modifyAttackProbability(0, e.target.value)}/></td>
    </tr>)

    const deleteButton = <button onClick={() => this.removeAttack()}>Remove Row</button>
    for (let i = 1; i < this.state.numAttacks; ++i) {
      output.push(<tr>
        <td>{(i == 1 ? deleteButton : <></>)}</td>
        <td>{i+1}</td>
        <td><input value={this.state.attackProbability[i]}
                   onChange={(e) => this.modifyAttackProbability(i, e.target.value)} /></td>
      </tr>)
    }

    if (this.state.numAttacks > 1) {
      output.push(<tr>
        <td></td><td></td>
        <td><button onClick={() => this.normalizeAttackProbability()}>Normalize Probabilities</button></td>
      </tr>)
    }

    return output;
  }

  render() {
    return (
      <div className="App">
        <h1>Hello world!</h1>
        <p>Please check out <a href="https://github.com/aturfah/eo-chaser-calc#readme">the project README</a> for details on what each argument means.</p>
        <p>{this.state.numAttacks}</p>
        <p>{this.state.attackProbability}</p>
        <table>
          <tr>
            <td><label>Maximum Follow-Ups:</label></td>
            <td><input placeholder='ex: 3' /></td>
            <td></td>
          </tr>
          <tr>
            <td><label>Chance Reduction:</label></td>
            <td><input placeholder='ex: 0.13' /></td>
            <td></td>
          </tr>
          {this.buildNumAttacksDropdownRows()}
        </table>
      </div>
    );
  }
}


export default App;
