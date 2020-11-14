import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data,casesType) => {
  let chartData = [];
  let timeline="timeline"
//   let casesType='cases'
  let lastDataPoint;
  console.log("hi",data.timeline.cases)
  for (let date in data.timeline.cases) {
    console.log("inside loop",date)
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[timeline][casesType][date]-lastDataPoint ,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[timeline][casesType][date];
  }
  return chartData;
};

function LineGraphC({ countries, casesType='cases' }) {
  const [data, setData] = useState({});
  console.log("abc",countries);
  useEffect(() => {
    // console.log("abc",countries);
    if (countries !== "worldwide"){
        const url =`https://disease.sh/v3/covid-19/historical/${countries}?lastdays=200`;
    const fetchData = async () => {
    //   await fetch("https://disease.sh/v3/covid-19/historical/India?lastdays=365")
      await fetch(url)
        .then((response) => {
                return  response.json();
        })
        .then((data) => {
            console.log("ok",data)

          let chartData = buildChartData(data,casesType);
          console.log("vvv",chartData)
          setData(chartData);
          
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    fetchData();}
  },[countries,casesType]);

  return (
    <div>
        {console.log("yay",data)}
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraphC;