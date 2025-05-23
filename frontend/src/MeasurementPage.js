import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import Speedometer from 'react-d3-speedometer'; 


const MeasurementPage = () => {
    const [data, setData] = useState([]);
    const [gaugeValues, setGaugeValues] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchData = () => {
        axios.get('http://localhost:4000/modbus/read-mesaurement')
        .then(res => {
            setData(res.data.data);
            setGaugeValues(res.data.data.map(d => parseFloat(d.value))); 
            setLoading(false);
        })
        .catch(err => {
            console.error('API error:', err);
            setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
    }, []);



  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Measurement Data
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {data.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box boxShadow={3} p={2} borderRadius={2} bgcolor="#fff">
                <Typography variant="h6">{item.label}</Typography>
                <Speedometer
                    value={gaugeValues[idx] || 0} // eski değerden güncellenir
                    maxValue={400}
                    customSegmentStops={[0, 180, 210, 240, 400]}
                    segmentColors={['#b3b3b3', '#FFA500', '#00C853', '#D32F2F']}
                    currentValueText={`Value: ${item.value} ${item.unit}`}
                    height={200}
                    ringWidth={15}
                    needleHeightRatio={0.8}
                    needleColor="#333"
                    textColor="#222"
                />


              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MeasurementPage;
