// server/server.js

const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();

app.use(express.json());

app.get('/api/worklog', (req, res) => {
  const access_token = process.env.JIRA_ACCESS_TOKEN;
  const user_name = req.query['user-name'];
  const date_required = moment(req.query['date-required']).format('YYYY-MM-DD');

  const url = 'https://jira.mrs-electronic.com/rest/api/2/search';

  const query_params = {
    jql: `worklogAuthor = "${user_name}" and worklogDate = ${date_required}`,
    maxResults: 1000,
    fields: 'worklog,summary',
  };

  axios
    .get(url, {
      params: query_params,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((response) => {
      let total_work_hours = 0;
      let issues = [];
      response.data.issues.forEach((issue) => {
        let issue_work_hours = 0;
        let issue_name = issue.fields.summary;
        let issue_link = `https://jira.mrs-electronic.com/browse/${issue.key}`;
        issue.fields.worklog.worklogs.forEach((worklog) => {
          if (
            worklog.author.name === user_name &&
            worklog.started.startsWith(date_required)
          ) {
            const time_spent_seconds = worklog.timeSpentSeconds;
            const time_spent_hours = time_spent_seconds / 3600;
            total_work_hours += time_spent_hours;
            issue_work_hours += time_spent_hours;
          }
        });
        if (issue_work_hours > 0) {
          issues.push({
            name: issue_name,
            link: issue_link,
            hours: issue_work_hours,
          });
        }
      });

      res.send({ totalWorkHours: total_work_hours, issues: issues });
    })
    .catch((error) => res.status(500).send(error.toString()));
});

// Listen on all network interfaces to allow access from Nginx
app.listen(5000, '0.0.0.0', () => {
  console.log('API server listening on port 5000');
});
