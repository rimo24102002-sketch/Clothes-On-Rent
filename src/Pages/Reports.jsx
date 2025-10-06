import React from 'react'
import { Link } from 'react-router-dom'
import { MdNotifications } from "react-icons/md";
import Box from '../Components/Box';
import Block from '../Components/Block';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
function Reports() {
  return (
    <div>
      <Link to="/Reports"></Link>
      <a href="Reports"></a>
      <div style={{ width: 990, height: 580, backgroundColor: 'white', marginLeft: 230, marginTop: -550 }}>
        <div style={{ backgroundColor: 'white', height: 35, marginTop: -10, }}>
          <div style={{ float: 'right', marginRight: 90, marginTop: "8px" }}>
            <MdNotifications size={25} color="black" />
            <div style={{ width: 30, height: 30, backgroundColor: '#8E6652', borderRadius: '50%', textAlign: 'center', fontWeight: 'bold', marginLeft: 35, marginTop: -33, }}>A
              <h5 style={{ marginLeft: 40, marginTop: -20 }}>Admin</h5>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'Space-between', alignItems: 'center', padding: '20px' }}>
          <h5 style={{ color: '#8E6652', fontWeight: 'bold' }}>Reports</h5>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Box
              hd1="Weekly"
            />
            <Box
              hd1="Monthly"
            />
            <Box
              hd1="Quarterly"
            />
            <Box
              hd1="Yearly"
            />
          </div>
        </div>
        <div style={{ width: 600, height: 30, backgroundColor: '#F5F8FC', padding: '10px', marginLeft: '20px', display: 'flex', gap: 60, padding: '10px' }}>
          <div style={{ backgroundColor: 'white', width: 90, height: 25, marginTop: '-8px' }}> <h7 style={{ marginTop: '5px' }}>Revenue</h7></div>
          <h7 style={{ marginTop: '-8px' }}>Popular Items</h7>
          <h7 style={{ marginTop: '-8px' }}>User Activity</h7>
          <h7 style={{ marginTop: '-8px' }}>Bookings</h7>
        </div>
        <div style={{ display: 'flex', padding: 3, gap: "25px", padding: '20px' }}>
          <Block
            heading="Total  Revenue"
            totalNumber="$ 83,800"
            totalGrowth={"+12.3% from previous period "}

          />
          <Block
            heading="Total  Bookings"
            totalNumber="488"
            totalGrowth={"+12.3% from previous period "}

          />
          <Block
            heading="Avg.Revenue per Booking"
            totalNumber="$172"
          />
          <Block
            heading="New Customers"
            totalNumber="146"
            totalGrowth={"30% of total booking "}
          />
        </div>
        <div style={{ width: 987, height: 300, backgroundColor: 'white', display: 'flex', padding: '15px', marginTop: '-10px' }}>
          <div style={{ width: 445, height: 300, backgroundColor: "white", marginLeft: '14px', border: '1px solid #ccc', borderRadius: '3px', marginTop: '-20px' }}>
            <h4 style={{ marginLeft: '10px', fontWeight: 'bold', color: '#8E6652' }}>Revenue Trend</h4>
            <p style={{ marginLeft: '10px', position: 'relative', bottom: '8px' }}>
              Revenue and Booking trends over time
            </p>
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                  label: 'Revenue',
                  data: [16500, 18000, 22000, 20500, 9000],
                  borderColor: '#8E6652',
                  backgroundColor: '#8E6652',
                  tension: 0.4,
                  pointBackgroundColor: '#8E6652',
                  pointBorderColor: '#fff'
                }]
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>
          <div style={{ width: 445, height: 300, backgroundColor: "white", marginLeft: '14px', border: '1px solid #ccc', borderRadius: '3px', marginTop: '-20px' }}>
            <h4 style={{ marginLeft: '10px', fontWeight: 'bold', color: '#8E6652' }}>Revenue by Category</h4>
            <p style={{ marginLeft: '10px', position: 'relative', bottom: '8px' }}>
              Distribution of Revenue across product Categories
            </p>
            <div style={{ marginTop: '-45px' }}></div>
            <Pie
              data={{
                labels: ['Electronics', 'Clothing', 'Groceries', 'Books', 'Others'],
                datasets: [{
                  data: [35, 25, 15, 10, 15],
                  backgroundColor: ['#8E6652', '#B08868', '#D7CCC8', '#A1887F', '#5D4037'],
                  borderWidth: 1,

                }]
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'right' } },

              }}
            />
          </div>
        </div>
      </div>
    </div>


  )
}

export default Reports
