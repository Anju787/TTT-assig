import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { saveAs } from 'file-saver';

function App() {
  const [histogramData, setHistogramData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://www.terriblytinytales.com/test.txt'
      );
      const words = response.data.toLowerCase().match(/\b\w+\b/g);
      const wordCount = {};

      words.forEach((word) => {
        wordCount[word] = wordCount[word] ? wordCount[word] + 1 : 1;
      });

      const sortedWords = Object.keys(wordCount).sort(
        (a, b) => wordCount[b] - wordCount[a]
      );
      const top20Words = sortedWords.slice(0, 20);

      const chartData = top20Words.map((word) => ({
        word,
        frequency: wordCount[word],
      }));

      setHistogramData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportToCSV = () => {
    if (histogramData) {
      const csvData = [
        ['Word', 'Frequency'],
        ...histogramData.map((data) => [data.word, data.frequency]),
      ];

      const csvContent = csvData
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'histogram_data.csv');
    }
  };

  return (
    <div className="App">
      <button onClick={fetchData}>Submit</button>
      {histogramData && (
        <>
          <BarChart
            width={600}
            height={400}
            data={histogramData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis type="number" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
          <button onClick={exportToCSV}>Export</button>
        </>
      )}
    </div>
  );
}

export default App;
