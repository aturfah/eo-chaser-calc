import './App.css';
import React, {Component} from 'react';

function sum(arr) {
  return arr.reduce((a, b) => {
    return Number(a) + Number(b);
  });
}

function cumulSum(arr) {
  const output = []
  let runningSum = 0;
  for (let idx = 0; idx < arr.length; ++idx) {
    runningSum += arr[idx];
    output.push(runningSum)
  }
  return output;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      numSimul: 1000,
      maxFollowUp: 4,
      chanceReduction: 0.25,
      numAttacks: 1,
      attackProbability: [1],
      running: false,
      simulationResults: null
    }
  }

  modifyOtherStateVariable(tgtVar, value) {
    if (value === '') {
      value = 0;
    }

    const newState = this.state;
    newState[tgtVar] = value;
    this.setState(newState);
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
    const totalProb = sum(this.state.attackProbability);

    const newState = this.state;
    newState.attackProbability.forEach((val, idx) => {
      newState.attackProbability[idx] = newState.attackProbability[idx] / totalProb;
    })
    this.setState(newState);
  }

  buildNumAttacksDropdownRows() {
    const output = []
    output.push(<tr>
      <td><label>Number of Attacks</label></td>
      <td><i>Probability as Decimal (ex: 0.5)</i></td>
      <td></td>
    </tr>)
    output.push(<tr>
      <td>1</td>
      <td><input
             value={this.state.attackProbability[0]} 
             onChange={(e) => this.modifyAttackProbability(0, e.target.value)}/></td>
      <td><button onClick={() => this.addAttack()}>Add Row</button></td>
    </tr>)

    const deleteButton = <button onClick={() => this.removeAttack()}>Del Row</button>
    for (let i = 1; i < this.state.numAttacks; ++i) {
      output.push(<tr>
        <td>{i+1}</td>
        <td><input value={this.state.attackProbability[i]}
                   onChange={(e) => this.modifyAttackProbability(i, e.target.value)} /></td>
        <td>{(i == 1 ? deleteButton : <></>)}</td>
      </tr>)
    }

    if (this.state.numAttacks > 1) {
      output.push(<tr>
        <td></td>
        <td><button onClick={() => this.normalizeAttackProbability()}>Normalize Probabilities</button></td>
        <td></td>
      </tr>)
    }

    return output;
  }

  runSimulation() {
    // Disable
    this.setState({running: true})

    // Validate Num Simulations
    const numSimul = parseInt(Number(this.state.numSimul));
    if (isNaN(numSimul)) {
      this.setState({running: false});
      alert("Invalid Parameter: Number of Simulations")
      return;
    }

    // Validate Max. Follow-ups
    const maxFollowUp = parseInt(Number(this.state.maxFollowUp));
    if (isNaN(maxFollowUp)) {
      this.setState({running: false});
      alert("Invalid Parameter: Maximum Follow-ups")
      return;
    }

    // Validate Reduction Chance
    const chanceReduction = parseFloat(Number(this.state.chanceReduction));
    if (isNaN(chanceReduction)) {
      this.setState({running: false});
      alert("Invalid Parameter: Chance Reduction")
      return;
    }
    
    // Verify that probability normalized
    if (sum(this.state.attackProbability) !== 1) {
      this.setState({running: false});
      alert("Check that Attack Probabilities sum to 1 (i.e. click the Normalize button)")
      return;
    }

    // Now we do the sampling
    const results = [];
    const probCDF = cumulSum(this.state.attackProbability);
    for (let index = 0; index < numSimul; ++index) {
      // First we draw the number of attacks
      let randVal = Math.random();
      let numAttacks = 0;
      while (probCDF[numAttacks] <= randVal) {
        numAttacks += 1;
      }
      numAttacks += 1; // Array is 0-indexed so map to number of attacks
      
      // Now calculate for each one
      let numProcs = 0;
      let remainingProb = 1;
      for (let i = 0; i < numAttacks; ++i) {
        const probDraw = Math.random();
        if (probDraw < remainingProb) {
          // We got a successful follow-up
          numProcs += 1;
          remainingProb -= chanceReduction;
        }

        if (numProcs >= maxFollowUp) {
          // No more procs we've maxed out
          break
        } if (remainingProb <= 0) {
          // Impossible to proc more so just stop
          break
        }
      }

      results.push(numProcs)
    }

    // Get the probability of the number of attacks
    const counter = {};
    results.forEach(ele => {
        if (counter[ele]) {
            counter[ele] += 1;
        } else {
            counter[ele] = 1;
        }
    });
    Object.keys(counter).forEach(val => {
      counter[val] = counter[val] / results.length
    })

    // Get the mean
    const meanValue = sum(results) / results.length
    
    this.setState({
      running: false,
      simulationResults: {
        mean: meanValue,
        probs: counter
      }
    });
  }

  generateSimulationResults() {
    console.log(this.state.simulationResults);
    const breakdownList = [];
    const breakdownKeys = Object.keys(this.state.simulationResults.probs);
    breakdownKeys.sort((a, b) => parseInt(a) - parseInt(b))
    breakdownKeys.forEach(bkdnKey => {
      breakdownList.push(<li><b>{bkdnKey}:</b> {this.state.simulationResults.probs[bkdnKey]}</li>)
    })

    return <div className='results-div'>
      <h2>Simulation Results:</h2>
      <p><b>Mean # Follow-Ups:</b> {Math.round(100 * this.state.simulationResults.mean) / 100}</p>
      <b>Breakdown (# Follow-Ups: Probability)</b>
        <ul>          
            {breakdownList}
        </ul>
    </div>
  }

  render() {
    return (
      <div className="App">
        <h1>Etrian Odyssey Follow-Up Attack Calculator</h1>
        <p>Please check out <a href="https://github.com/aturfah/eo-chaser-calc#readme">the project README</a> for details on what each argument means.</p>
        <table className='param-table'>
          <tr>
            <td><label>Number of Simulations:</label></td>
            <td><input value={this.state.numSimul}
                 onChange={e => this.modifyOtherStateVariable('numSimul', e.target.value)} /></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><label>Maximum Follow-Ups:</label></td>
            <td><input value={this.state.maxFollowUp}
                       onChange={e => this.modifyOtherStateVariable('maxFollowUp', e.target.value)} /></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><label>Chance Reduction (as decimal):</label></td>
            <td><input value={this.state.chanceReduction}
                       onChange={e => this.modifyOtherStateVariable('chanceReduction', e.target.value)} /></td>
            <td></td>
            <td></td>
          </tr>
          {this.buildNumAttacksDropdownRows()}
        </table>
        {(this.state.running ? <button className='run-button' disabled>Calculate!</button> :
                                    <button className='run-button' onClick={() => this.runSimulation()}>Calculate!</button>)}
        <div>
          {(this.state.simulationResults === null ? <i>Click Calculate button to get results</i> : this.generateSimulationResults())}
        </div>

      </div>
    );
  }
}


export default App;
