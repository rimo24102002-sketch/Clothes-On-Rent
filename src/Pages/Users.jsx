import React from 'react';
import { Link } from 'react-router-dom'
import { MdNotifications } from "react-icons/md";
import Box from '../Components/Box';
import { AlignJustify, Space } from 'lucide-react';
export default function Users(props) {
  return (
    <div>
      <Link to="/Users"></Link>
      <a href="Users"></a>
      <div style={{ width: 990, height: 580, backgroundColor: 'white', marginLeft: 230, marginTop: -550 }}>
        <div style={{ backgroundColor: 'white', height: 35, marginTop: -10, }}>
          <div style={{ float: 'right', marginRight: 90, marginTop: "8px" }}>
            <MdNotifications size={25} color="black" />
            <div style={{ width: 30, height: 30, backgroundColor: '#8E6652', borderRadius: '50%', textAlign: 'center', fontWeight: 'bold', marginLeft: 35, marginTop: -33, }}>A
              <h5 style={{ marginLeft: 40, marginTop: -20 }}>Admin</h5>
            </div>
          </div>
        </div>
        <h4 style={{ color: '#8E6652', padding: 3, fontWeight: 'bold' }}>User Management</h4>
        <div style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'Space-between', alignItems: 'center', padding: '10px' }}>
          <h5 style={{ color: '#8E6652', fontWeight: 'bold' }}>User Management</h5>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Box
              hd1="All"
            />
            <Box
              hd1="Active"
            />
            <Box
              hd1="Pending"
            />
            <Box
              hd1="Blocked"
            />
          </div>
        </div>
        <div style={{ height: 400, backgroundColor: 'white', marginLeft: '20px' }}>
          <table style={{ border: '1px solid #ccc' }} className='table'>
            <thead>
              <tr>
                <th >Name</th>
                <th >Status</th>
                <th >Role</th>
                <th >Date Joined</th>
                <th >Listings</th>
                <th >Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td >
                  <div style={{ fontWeight: 'bold' }} class='grid-item'>sarah johnson</div>
                  <div class>sara.j@kkk.com</div>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(169, 220, 169)', borderRadius: "30px", color: 'green', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Active</button></td>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(137, 147, 223)', borderRadius: "30px", color: 'blue', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Seller</button></td>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6>May 4,2005</h6>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6 style={{ marginLeft: '15px' }}>8</h6>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'white', borderRadius: "30px", color: 'black', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>View</button></td>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 'bold' }} class='grid-item'>Michal Smith</div>
                  <div class>michal.smith@kkk.com</div>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(169, 220, 169)', borderRadius: "30px", color: 'green', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Active</button></td>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(137, 147, 223)', borderRadius: "30px", color: 'blue', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Seller</button></td>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6>May 3,2025</h6>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6 style={{ marginLeft: '15px' }}>12</h6>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'white', borderRadius: "30px", color: 'black', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>View</button></td>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 'bold' }} class='grid-item'>Emily Devis</div>
                  <div class>emily.devis@kkk.com</div>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(237, 237, 166)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>pending</button></td>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(137, 147, 223)', borderRadius: "30px", color: 'blue', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Seller</button></td>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6 >May 2,2025</h6>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }} >
                  <h6 style={{ marginLeft: '15px' }}>0</h6>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'white', borderRadius: "30px", color: 'black', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>View</button></td>
                  <td style={{ padding: '10px', textAlign: 'left' }}><button style={{ height: 30, backgroundColor: 'rgb(169, 220, 169)', color: 'green', display: 'flex', alignItems: 'center' }}>Approve</button></td>
                  <td style={{ padding: '10px', textAlign: 'left' }}><button style={{ height: 30, backgroundColor: 'rgb(249, 214, 220)', color: 'rgb(206, 53, 79)', display: 'flex', alignItems: 'center' }}>Reject</button> </td>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 'bold' }} class='grid-item'>James Wilson</div>
                  <div class>james.wilsonj@kkk.com</div>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: ' rgb(249, 214, 220)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Blocked</button></td>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(184, 156, 238)', borderRadius: "30px", color: 'purple', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Buyer</button></td>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6>May 12,2025</h6>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6 style={{ marginLeft: '15px' }}>0</h6>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'white', borderRadius: "30px", color: 'black', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>View</button></td>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 'bold' }} class='grid-item'>Olivia Brown</div>
                  <div class>olivia.brown@kkk.com</div>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: ' rgb(169, 220, 169)', borderRadius: "30px", color: 'green', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Active</button></td>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'rgb(184, 156, 238)', borderRadius: "30px", color: 'purple', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>Buyer</button></td>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6>May 14,2025</h6>
                </td>
                <td style={{ padding: '10px', textAlign: 'left' }}>
                  <h6 style={{ marginLeft: '15px' }}>0</h6>
                </td>
                <td>
                  <td ><button style={{ backgroundColor: 'white', borderRadius: "30px", color: 'black', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>View</button></td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>




  )
}