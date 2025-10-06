import React from 'react'
import Button from './Button'
import { MdLogout } from "react-icons/md";
import { FaUsers } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineHowToReg } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdDashboard } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Slices/HomeDataSlice';
export default function Sidebar() {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(setUser({}));
         navigate("/login"); 
    
    }
    return (
        <div style={{ height: 550, width: 230, backgroundColor: "#F1DCD1" }}>
            <div style={{ width: 229, height: 50, backgroundColor: "#F1DCD1" }}>
                <h5 style={{ color: '#8E6652', textAlign: 'center', fontWeight: 'bold' }}>Rent Clothes</h5>
            </div>
            <div style={{ width: 230, height: 524, backgroundColor: "#F1DCD1", marginTop: 8 }}>
                <Button
                    button="Dashboard"
                    url="Dashboard"
                    icon={< MdDashboard />}
                />
                <Button
                    button="Users"
                    icon={< FaUsers />}
                    url="Users"
                />
                <Button
                    button="Reports"
                    icon={<  HiOutlineDocumentReport />}
                    url="Reports"
                />
                <Button
                    button="Approvals"
                    icon={< MdOutlineHowToReg />}
                    url="Approvals"
                />
                 <Button
                    button="Complaints"
                    icon={<  FaCommentDots/>}
                    url="Complaints"
                />
              
                <Button
                    button="Settings"
                    icon={< IoSettingsSharp />}
                    url="Settings"
                />
                <div style={{ width: 230, height: 50, backgroundColor: "#F1DCD1", marginTop:60}}>
                    <button onClick={handleLogout} style={{ position: 'absolute', padding: '10px', color: 'white', backgroundColor: '#8E6652', marginLeft: 10, }}><MdLogout /> Logout </button>
                </div>
            </div>
        </div>
    )
}
