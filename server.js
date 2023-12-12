const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', async (req, res) => {
    const beginDate = req.query.bgn;
    const endDate = req.query.end;
  const externalApiUrl = "https://platform.antares.id:8443/~/antares-cse/antares-id/desproKhalid/desproCam?ty=4&fu=1&drt=2&cra=" + beginDate + "&crb=" + endDate; // Replace with the actual URL

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'X-M2M-Origin': '870f1680796438f0:71e9fc8c307a7e39',
        'Content-Type': 'application/json;ty=4',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    const dataList = data['m2m:list'];

    // Extracting data for plotting
    const labels = dataList.map(item => item['m2m:cin'].ct);
    const totalData = dataList.map(item => JSON.parse(item['m2m:cin'].con).total);
    const dishLeftData = dataList.map(item => JSON.parse(item['m2m:cin'].con).dishLeft);

    console.log(labels);
    console.log(totalData);
    console.log(dishLeftData);


    res.json({ labels, totalData, dishLeftData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
