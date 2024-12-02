// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

function App() {
  const [userName, setUserName] = useState('');
  const [dateRequired, setDateRequired] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get('/api/worklog', {
      params: {
        'user-name': userName,
        'date-required': dateRequired
      }
    })
    .then(response => {
      setResult(response.data);
    })
    .catch(error => console.error(error));
  };

  return (
    <div className="container">
      <h1>MRS Jira Worklog Query</h1>
      <form id="worklog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user-name">User Name:</label>
          <input
            type="text"
            className="form-control"
            id="user-name"
            name="user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date-required">Date:</label>
          <input
            type="date"
            className="form-control"
            id="date-required"
            name="date-required"
            value={dateRequired}
            onChange={(e) => setDateRequired(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <br />
      {result && (
        <div id="result">
          <p>
            Total work hours logged by {userName} on {dateRequired}:{' '}
            <strong>{result.totalWorkHours.toFixed(2)} hours</strong>
          </p>
          <hr />
          <h2>Issues</h2>
          {result.issues.map((issue, index) => (
            <p key={index}>
              Issue:{' '}
              <a href={issue.link} target="_blank" rel="noopener noreferrer">
                {issue.name}
              </a>
              <br />
              Work logged: {issue.hours.toFixed(2)} hours
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
