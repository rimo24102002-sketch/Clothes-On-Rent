import React from 'react'
import { Link } from 'react-router-dom'
import { MdNotifications } from "react-icons/md";
import Box from '../Components/Box';
function Approvals() {
  return (
    <div>
      <Link to="/Approvals"></Link>
      <a href="Approvals"></a>
      <div style={{ width: 990, height: 580, backgroundColor: 'white', marginLeft: 230, marginTop: -550 }}>
        <div style={{ backgroundColor: 'white', height: 35, marginTop: -10, }}>
          <div style={{ float: 'right', marginRight: 90, marginTop: "8px" }}>
            <MdNotifications size={25} color="black" />
            <div style={{ width: 30, height: 30, backgroundColor: '#8E6652', borderRadius: '50%', textAlign: 'center', fontWeight: 'bold', marginLeft: 35, marginTop: -33, }}>A
              <h5 style={{ marginLeft: 40, marginTop: -20 }}>Admin</h5>
            </div>
          </div>
        </div>
        <h5 style={{ color: '#8E6652', fontWeight: 'bold', marginLeft: '15px' }}>Approvals Management</h5>
        <div style={{ width: 500, height: 30, backgroundColor: '#dae1e9f5', padding: '10px', marginLeft: '20px', display: 'flex', gap: 60, padding: '20px', marginTop: '20px' }}>
          <div style={{ backgroundColor: 'white', width: 200, height: 25, marginTop: '-12px' }}> <h7 style={{ marginTop: '5px' }}>Revenue</h7></div>
          <h7 style={{ marginTop: '-12px' }}>Seller Approvals</h7>
        </div>
        <div style={{ width: 985, height: 300, backgroundColor: "white", borderRadius: "8px", gap: '2px', padding: '30px', marginTop: '35px', }}>
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
          <div style={{ backgroundColor: "white", padding: 10, height: 200, width: 950, gap: 8, display: 'flex' }}>
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
      </div>
    </div>
  )
}

export default Approvals
