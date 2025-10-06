import { Link } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineHowToReg } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdLogout } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { CalendarDays } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { MdDashboard } from "react-icons/md";
import './Dashboard.css'
import Card from '../Components/Card';
import Button from '../Components/Button';
import Box from '../Components/Box';
import './Box.css';
function Dashboard(props) {
  return (
    <div>
      <Link to="/Dashboard"></Link>
      <a href="Dashboard"></a>
      <div style={{ width: 990, height: 580, backgroundColor: 'white', marginLeft: 230, marginTop: -550 }}>
      </div>
      <div style={{ height: 580, width: 1020, backgroundColor: "white", marginLeft: 230, marginTop: -581, padding: 10 }}>
        <div style={{ backgroundColor: 'white', width: 1010, height: 35, marginTop: -10 }}>
          <div style={{ float: 'right', marginRight: 90, marginTop: "8px" }}>
            <MdNotifications size={25} color="black" />
            <div style={{ width: 30, height: 30, backgroundColor: '#8E6652', borderRadius: '50%', textAlign: 'center', fontWeight: 'bold', marginLeft: 35, marginTop: -33, }}>A
              <h5 style={{ marginLeft: 40, marginTop: -20 }}>Admin</h5>
            </div>
          </div>
        </div>
        <h5 style={{ color: '#8E6652', padding: 3 }}>Dashboard Overview</h5>

        <div style={{ display: 'flex', padding: 3, gap: "25px" }}>
        
            <Card
               heading="Total Users"
            totalNumber={'1,254'}
            totalGrowth={"12% "}
            icon={ <FaUsers size={20} />}
            />
          
          <Card
          
            heading="Total Bookings"
            totalNumber={346}
            totalGrowth={"8% "}
            icon={<  CalendarDays size={20} />}
          />
          <Card
            heading="Total Revenue"
            totalNumber='$24,500'
            totalGrowth={"10% "}
            icon={<  BarChart3 size={20} />}
          />

        </div>

        <div style={{ width: 985, height: 285, backgroundColor: "white", borderRadius: "8px", gap: '2px' }}>
          <h5 style={{ padding: 7, fontWeight: 'bold', }}>Listing Approvals</h5>
          <div style={{ display: 'flex' }}>
            <Box
              hd1="All"
            />
            <Box
              hd1="Pending"
            />
            <Box
              hd1="Approved"
            />
            <Box
              hd1="Rejected"
            />
          </div>
          <div style={{ backgroundColor: "white", padding: 10, height: 150, width: 950, gap: 8, display: 'flex' }}>
            <table className='table ' style={{ borderCollapse: 'collapse', width: 900, backgroundColor: 'white' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Item</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Category</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Price</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Seller</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Status</th>
                  <th colSpan={3} style={{ border: '1px solid #ccc', padding: '10px', justifyItems: 'center' }}> Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Designer Wedding Dress</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Formal Wear</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> $75/day</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Ahmer</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgb(237, 237, 166)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>pending</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ height: 30 }}>View</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }} ><button style={{ height: 30, backgroundColor: 'rgb(169, 220, 169)', color: 'green', display: 'flex', alignItems: 'center' }}>Approve</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ height: 30, backgroundColor: 'rgb(249, 214, 220)', color: 'rgb(206, 53, 79)', display: 'flex', alignItems: 'center' }}>Reject</button> </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Luxury Tuxedo</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Formal Wear</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> $60/day</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}> Haya</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgb(237, 237, 166)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>pending</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ height: 30 }}>View</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ height: 30, backgroundColor: 'rgb(169, 220, 169)', color: 'green', display: 'flex', alignItems: 'center' }}>Approve</button></td>
                  <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ height: 30, backgroundColor: 'rgb(249, 214, 220)', color: 'rgb(206, 53, 79)', display: 'flex', alignItems: 'center' }}>Reject</button> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ width: 900, height: 126, backgroundColor: 'white', }}>
          <div style={{ display: 'flex', gap: "20px", }}>
            <div style={{ width: 484, height: 80, backgroundColor: 'white', borderRadius: 8, padding: 10, marginTop: 20, border: '1px solid #ccc', borderRadius: '3px' }}>
              <h4 style={{ color: '#8E6652' }}>Monthly Performance</h4>
              <p style={{ marginTop: -10 }}>Revenue and Bookings over the last 6 months</p>
            </div>
            <div style={{ width: 484, height: 80, backgroundColor: 'white', borderRadius: 8, padding: 10, marginTop: 20, border: '1px solid #ccc', borderRadius: '3px' }}>
              <h4 style={{ color: '#8E6652' }}>Monthly Performance</h4>
              <p style={{ marginTop: -10 }}>Top performing rental items by booking count</p>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
export default Dashboard;