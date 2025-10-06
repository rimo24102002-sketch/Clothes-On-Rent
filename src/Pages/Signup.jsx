import React, { useState } from "react";
import { handleSignUp } from "../Helper/firebaseHelper";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";

import { Link ,useNavigate} from 'react-router-dom'

const Signup = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");

  const [Password, setPassword] = useState("");
 const dispatch = useDispatch();
 const navigate = useNavigate();


    const handleSignUp=()=>{
    navigate("/Dashboard")
  }
   const handlelogin=()=>{
    navigate("/Login")
  }
  const completeSignUp = async () => {
   
    if (Name === "" || Email === "" || Password === "") {
      alert("Please fill all the fields");
      return;
    }

    const userData = await handleSignUp(Email, Password, {
      role: "admin",
      Name: "",
      Email: "",
    });

    if (userData?.uid) {
      dispatch(setUser(userData));
    }
  };

  return (
    <div style={{ width: "230%", height: 500, paddingLeft: 400 }}>
      <div style={{ width: "25%", backgroundColor: '#efccc0ff', height: 500 }}>
        <Link to="/Signup"></Link>
        <a href="signup"></a>

        <div style={{ width: "60%", height: 50, borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 70, marginBottom: 40 }} >
          <h5 style={{ fontSize: 20, fontWeight: "bold", color: '#8E6652', marginTop: 30 }}>  Rent Clothes</h5>
        </div>
        <div style={{ marginTop: '-7%' }}>
          <h4 style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
            Sign in to your account
          </h4>
        </div>

        <h5 style={{ marginLeft: 40, fontSize: 13, }}>Name</h5>
        <input type="Name" onChange={(e) => setName(e.target.value)} value={Name} placeholder="hayapectrus"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: "80%", height: 40, marginLeft: 40, border: "none", paddingLeft: 10, }} />

        <h5 style={{ marginLeft: 40, marginTop: 5, fontSize: 13 }}>Email</h5>
        <input type="Email" onChange={(e) => setEmail(e.target.value)} value={Email} placeholder="ex: jon.smith@email.com"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: "80%", height: 40, marginLeft: 40, border: "none", paddingLeft: 10, }} />



        <h5 style={{ marginLeft: 40, marginTop: 5, fontSize: 13 }}>Password</h5>
        <input type="Password" onChange={(e) => setPassword(e.target.value)} value={Password} placeholder="Enter your password"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: "80%", height: 40, marginLeft: 40, border: "none", paddingLeft: 10, }} />
        {/* Forgot Password */}
        <button style={{ marginRight: 35, background: "none", border: "none", float: "right", cursor: "pointer", }} >
          <h4 style={{ color: "#3b3b3b", fontWeight: "300", fontSize: 12, }} > Forgot Password? </h4>
        </button>

        {/* Sign In */}
        <div style={{ textAlign: "center" }}>
          <button onClick={completeSignUp} style={{ backgroundColor: '#8E6652', borderRadius: 8, width: "70%", height: 40, cursor: "pointer", border: "none", }} >
            <h5 onClick ={handleSignUp}  style={{ color: "#fff", fontWeight: "600", fontSize: 14, margin: 0 }} > SIGN UP </h5>
          </button>
        </div>
 {/* Signup */}
        <div style={{ textAlign: "center", }}>
          <h4 style={{ color: "#3b3b3b", fontWeight: "200", fontSize: 12, display: "inline", }}>
            Already have an account?
          </h4>
          <div>
            <button onClick ={handlelogin}  style={{ color: "rgba(164, 123, 104, 1)", fontWeight: 'bold', fontSize: 12, backgroundColor: '#efccc0ff' }}>
              Signin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

