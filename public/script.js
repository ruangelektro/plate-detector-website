var myChart=null;

function generateIncrementalArray(arr) {
    return Array.from({ length: arr.length }, (_, index) => index);
}

function replaceUndefinedWithZero(arr) {
    return arr.map(value => (value === undefined ? 0 : value));
}

document.addEventListener('DOMContentLoaded', function () {
  updateValues(); // Call updateValues on page load

  document.getElementById('queryForm').addEventListener('submit', function (event) {
    event.preventDefault();
    updateValues();
  });
});

function updateValues() {
    if(myChart!=null){
        myChart.destroy();
    }

  const param1 = document.getElementById("param1").value;
  const param2 = document.getElementById("param2").value;
  const apiUrl = "https://plate-despro.onrender.com/api/data?bgn=" + param1 + "&end=" + param2;

  fetch(apiUrl, {
      method: 'GET',
      mode: 'no-cors' }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const totalDisplay = document.getElementById('totalDisplay');
      const dishLeftDisplay = document.getElementById('dishLeftDisplay');

      const ctx = document.getElementById('dataChart').getContext('2d');

      const totalLabel = data.totalData;
      const yValues = data.dishLeftData;

      const incrementalArray = generateIncrementalArray(yValues);
      const newArray = replaceUndefinedWithZero(totalLabel);

      totalDisplay.textContent = `Total: ${newArray[0]}`;
      dishLeftDisplay.textContent = `Dish Left: ${yValues[0]}`;

      newArray.reverse();
      yValues.reverse();

      const xValues = incrementalArray;

      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [{
            label: 'Total',
            data: newArray,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }, {
            label: 'Dish Left',
            data: yValues,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Timestamp',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value',
              },
            },
          },
        },
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Error fetching data.');
      const totalDisplay = document.getElementById('totalDisplay');
      totalDisplay.textContent = 'Error fetching data.';
      const dishLeftDisplay = document.getElementById('dishLeftDisplay');
      dishLeftDisplay.textContent = 'Error fetching data.';
    });
}
