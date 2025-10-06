import React from 'react'
import { Link } from 'react-router-dom'
import { MdNotifications } from "react-icons/md";

import Block from '../Components/Block';
function Complaints() {
    return (
        <div>
            <Link to="/Complaints"></Link>
            <a href="Complaints"></a>
            <div style={{ width: 990, height: 580, backgroundColor: 'white', marginLeft: 230, marginTop: -550 }}>
                <div style={{ backgroundColor: 'white', height: 35, marginTop: -10, }}>
                    <div style={{ float: 'right', marginRight: 90, marginTop: "8px" }}>
                        <MdNotifications size={25} color="black" />
                        <div style={{ width: 30, height: 30, backgroundColor: '#8E6652', borderRadius: '50%', textAlign: 'center', fontWeight: 'bold', marginLeft: 35, marginTop: -33, }}>A
                            <h5 style={{ marginLeft: 40, marginTop: -20 }}>Admin</h5>
                        </div>
                    </div>
                </div>
                <h4 style={{ color: '#8E6652', fontWeight: 'bold', marginLeft: '15px' }}>Complaints Management</h4>
                <div style={{ display: 'flex', gap: "25px", padding: '20px' }}>
                    <Block
                        heading="Total  Complaints"
                        totalNumber="4"
                        totalGrowth={"+2 from last week "}

                    />
                    <Block
                        heading="pending"
                        totalNumber="2"
                        totalGrowth={"need attention "}

                    />
                    <Block
                        heading="investigation"
                        totalNumber="1"
                        totalGrowth={"In progress "}
                    />
                    <Block
                        heading="Resolved"
                        totalNumber="1"
                        totalGrowth={"This week "}
                    />
                </div>
                <div style={{ width: 440, height: 30, backgroundColor: '#dae1e9f5', padding: '10px', marginLeft: '20px', display: 'flex', gap: 60, padding: '20px', marginTop: '5px' }}>
                    <button style={{ width: 200, height: 30, alignItems: 'center', borderRadius: '0', marginTop: '-15px', padding: '0px' }}>Buyer Complaints</button>
                    <button style={{ width: 200, height: 30, alignItems: 'center', borderRadius: '0', marginTop: '-15px', padding: '0px', backgroundColor: '#dae1e9f5' }}>seller Complaints</button>
                </div>
                <h5 style={{ color: '#8E6652', fontWeight: 'bold', marginLeft: '15px', padding: '5px' }}> Buyer Complaints</h5>
                <div style={{ backgroundColor: "white", padding: 10, height: 200, width: 950, gap: 8, display: 'flex', padding: '10px', marginLeft: '20px', marginTop: '20px' }}>

                    <table className='table ' style={{ borderCollapse: 'collapse', width: 900, height: 150, backgroundColor: 'white', marginTop: '0px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Buyer</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> seller</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> order</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Items</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}> Complaints</th>
                                <th colSpan={1} style={{ border: '1px solid #ccc', padding: '10px', justifyItems: 'center' }}>Status</th>
                                <th colSpan={1} style={{ border: '1px solid #ccc', padding: '10px', justifyItems: 'center' }}>Priority</th>
                                <th colSpan={1} style={{ border: '1px solid #ccc', padding: '10px', justifyItems: 'center' }}>Date</th>
                                <th colSpan={1} style={{ border: '1px solid #ccc', padding: '10px', justifyItems: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> sara johnson</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> fashion hub</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> ORD-001</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> Formal suit</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> Item has stained and....</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgb(237, 237, 166)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>pending</button></td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgba(241, 194, 223, 1)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>High</button></td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> 12-03-2024</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'hsla(60, 100%, 100%, 1.00)', borderRadius: "30px", color: 'rgba(21, 20, 20, 1)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>view</button></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> Emma </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> pectrus</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> ORD-002</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> Barat outfit</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> Item arrived late and has wrinckled</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgba(155, 230, 214, 1)', borderRadius: "30px", color: 'rgba(38, 81, 55, 1)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>resolved</button></td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: 'rgb(237, 237, 166)', borderRadius: "30px", color: 'rgb(205, 113, 113)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>medium</button></td>
                                <td style={{ border: '1px solid #ccc', padding: '10px' }}> 22-04-2025</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}><button style={{ backgroundColor: '#ffffffff', borderRadius: "30px", color: 'rgba(14, 13, 13, 1)', height: 30, marginTop: 10, padding: '10px', display: 'flex', alignItems: 'center' }}>view</button></td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default Complaints
