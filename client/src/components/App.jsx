import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      scoreData: [],
      companiesData: [],
      search: '',
      currentCandidate: '',
      codingPercentile: 0,
      communicationPercentile: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get('/api/scores')
      .then(res => res.data)
      .then(scores => this.setState({ scoreData: scores }));

    axios
      .get('/api/companies')
      .then(res => res.data)
      .then(companies => this.setState({ companiesData: companies }));
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { scoreData, companiesData } = this.state;

    let candidateIdVal = ev.target.candidateId.value;

    const findCandidate = candidateId => {
      return scoreData.find(candidate => Number(candidateId) === candidate.candidate_id);
    };

    const candidateToFilterWith = findCandidate(candidateIdVal);

    const filterScoreDataByTitle = title => {
      return scoreData.filter(candidate => title === candidate.title);
    };

    const filteredScoreDataArr = filterScoreDataByTitle(candidateToFilterWith.title);

    //Fractal Index companies
    const filteredCompaniesDataArr = candidate => {
      return companiesData.filter(company => candidate.company_id === company.company_id);
    };

    const candidatesCompanyInfo = filteredCompaniesDataArr(candidateToFilterWith)[0];

    let companiesInFractalRange = companiesData.filter(company => {
      return Math.abs(Number(candidatesCompanyInfo.fractal_index) - Number(company.fractal_index));
    });

    const fractalRangeCompanyIdList = [];

    companiesInFractalRange.forEach(company => {
      fractalRangeCompanyIdList.push(company.company_id);
    });

    //Filter down data to only include what overlaps with fractal index and title
    let communicationScoreArr = [];
    let codingScoreArr = [];

    filteredScoreDataArr.forEach(obj => {
      if (fractalRangeCompanyIdList.includes(obj.company_id)) {
        communicationScoreArr.push(obj.communication_score);
        codingScoreArr.push(obj.coding_score);
      }
    });

    communicationScoreArr = communicationScoreArr.sort((a, b) => a - b);
    codingScoreArr = codingScoreArr.sort((a, b) => a - b);

    function percentile(candidate, communicationArr, codingArr) {
      let repeatedNumsCom = 1;
      let repeatedNumsCod = 1;
      let communicationIndexVal = communicationArr.indexOf(candidate.communication_score);
      let codingIndexVal = codingArr.indexOf(candidate.coding_score);
      let communicationPercentile;
      let codingPercentile;

      for (let i = communicationIndexVal, n = communicationArr.length; i < n; i++) {
        repeatedNumsCom++;
      }

      for (let i = codingIndexVal, n = codingArr.length; i < n; i++) {
        repeatedNumsCod++;
      }

      communicationPercentile = Math.floor(
        (communicationIndexVal + 0.5 * repeatedNumsCom) / communicationArr.length * 100
      );
      codingPercentile = Math.floor((codingIndexVal + 0.5 * repeatedNumsCod) / codingArr.length * 100);

      return { communicationPercentile, codingPercentile };
    }

    let percentiles = percentile(candidateToFilterWith, communicationScoreArr, codingScoreArr);

    this.setState({
      codingPercentile: percentiles.codingPercentile,
      communicationPercentile: percentiles.communicationPercentile,
      currentCandidate: this.state.search,
      search: ''
    });
  }

  render() {
    const {
      scoreData,
      companiesData,
      search,
      codingPercentile,
      communicationPercentile,
      currentCandidate
    } = this.state;
    const { handleSubmit } = this;

    return (
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="candidateId"
            onChange={ev => this.setState({ search: ev.target.value })}
            autoFocus
            value={search}
          />
          <button>Candidate Id Search</button>
        </form>

        <section>
          <h1>Candidate {currentCandidate} Percentiles:</h1>
          <h3>Coding Percentile: {codingPercentile}</h3>
          <h3>Communication Percentile: {communicationPercentile}</h3>
        </section>

        <table>
          <thead>
            <tr>
              <th>Candidate ID:</th>
              <th>Title:</th>
              <th>Communications Score:</th>
              <th>Coding Score:</th>
              <th>Company ID</th>
            </tr>
          </thead>
          <tbody>
            {scoreData.map(scores => {
              return (
                <tr key={scores.id}>
                  <td>{scores.candidate_id}</td>
                  <td>{scores.title}</td>
                  <td>{scores.communication_score}</td>
                  <td>{scores.coding_score}</td>
                  <td>{scores.company_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table id="companiesData">
          <thead>
            <tr>
              <th>Company Id:</th>
              <th>Fractal Index:</th>
            </tr>
          </thead>
          <tbody>
            {companiesData.map(companies => (
              <tr key={companies.id}>
                <td>{companies.company_id}</td>
                <td>{companies.fractal_index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    );
  }
}
