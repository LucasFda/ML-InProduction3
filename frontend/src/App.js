import React, { useState, useEffect } from 'react';
import Garden from './components/Garden';
import TaskInput from './components/TaskInput';
import axios from 'axios';
import Plant from './components/Plant';
import './App.css';


function App() {
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    axios
      .get(`${API_URL}/tasks`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTask = (description) => {
    axios
      .post(`${API_URL}/tasks`, { description })
      .then((response) => {
        setTasks([response.data, ...tasks])
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  };

  const fetchDailyReport = () => {
    axios
      .get(`${API_URL}/tasks/report/daily`)
      .then((response) => setReport(response.data))
      .catch((error) => console.error(error));
  };

  const fetchWeeklyReport = () => {
    axios
      .get(`${API_URL}/tasks/report/weekly`)
      .then((response) => setReport(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Reverse Todo List</h1>
      </header>
      <main className="main-content">
        <TaskInput addTask={addTask} />
        <div className="button-group">
          <button onClick={fetchDailyReport}>Daily Report</button>
          <button onClick={fetchWeeklyReport}>Weekly Report</button>
        </div>
        {report && (
          <div className="report-section">
            <h2>Report</h2>
            <div className="report-stats">
              <div className="stat-card">
                <h3>Total Tasks</h3>
                <p>{report.totalTasks}</p>
              </div>
              <div className="stat-card">
                <h3>Completed Tasks</h3>
                <p>{report.completedTasks}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Tasks</h3>
                <p>{report.pendingTasks}</p>
              </div>
            </div>
          </div>
        )}
        <div className="garden-container">
          <Garden tasks={tasks} />
        </div>
        <div className="plant-container">
          <Plant taskCount={tasks.length} />
        </div>
      </main>
    </div>
  );
}

export default App;
