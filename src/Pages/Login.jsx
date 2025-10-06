import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";
import { Link,useNavigate } from 'react-router-dom'
import { loginWithFBase } from "../Helper/firebaseHelper";
const Login = () => {
 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
 const dispatch = useDispatch();
  const handlelogin=()=>{
    navigate("/Dashboard")
  }
   const handleSignup=()=>{
    navigate("/Signup")
  }


    const completeLogin = async () => {
      
      if ( email === "" || password === "" ) {
        alert("Please fill all the fields");
        return;
      }
  
      const userData = await loginWithFBase(email, password, {
           role: "admin",
           password:password,
           Email: email,
      });
  
      if (userData?.uid) {
        dispatch(setUser(userData));
      }
    };

  return (
   <div style={{width:"230%",height:500,paddingLeft:370}}>
    <div style={{ width: "25%", backgroundColor: '#efccc0ff',height:500}}>
        <Link to="/Login"></Link>
      <a href="Login"></a>
     
      <div style={{ width: "60%", height: 50, borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center",marginLeft:70,marginBottom:40}} >
        <h5 style={{ fontSize: 20, fontWeight: "bold",  color:'#8E6652',marginTop:50}}>  Rent Clothes</h5>
      </div>
    

      <div style={{ marginTop:15}}>
        <h4 style={{ fontWeight: "bold", fontSize:18, textAlign: "center"}}>
          Sign in to your account
        </h4>
      </div>
      <h5 style={{ marginLeft: 40, marginTop: 20, fontSize: 13 }}>Email</h5>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="ex: jon.smith@email.com"
        style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: "80%", height: 40, marginLeft: 40, marginTop: 5, border: "none", paddingLeft: 10, }} />
        

      <h5 style={{ marginLeft: 40, marginTop: 10, fontSize: 13}}>Password</h5>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password"
        style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: "80%", height: 40, marginLeft: 40, marginTop: 5, border: "none", paddingLeft: 10, }} />

      {/* Forgot Password */}
      <button style={{ marginRight: 35, background: "none", border: "none", float: "right", cursor: "pointer", }} onClick={() => alert("Navigate to Forgot Password")}  >
        <h4 style={{ color: "#3b3b3b", fontWeight: "300", fontSize: 12, }} >   Forgot Password? </h4>
      </button>

      {/* Sign In */}
      <div style={{ textAlign: "center" }}>
        <button  onClick={completeLogin} style={{ backgroundColor: '#8E6652' , borderRadius: 8, width: "70%", height: 40, marginTop:5, cursor: "pointer", border: "none", }} >
          <h5 onClick ={handlelogin}  style={{ color: "#fff", fontWeight: "600", fontSize: 14, margin: 0 }} > SIGN IN </h5>
        </button>
      </div>

 

      {/* Signup */}
      <div style={{ textAlign: "center", marginTop:5}}>
        <h4 style={{ color: "#3b3b3b", fontWeight: "200", fontSize: 12, display: "inline", }}>
          Don’t have an account?
        </h4>
        <div>
        <button onClick ={handleSignup} style={{color: "rgba(164, 123, 104, 1)", fontWeight: 'bold', fontSize: 12,backgroundColor:'#efccc0ff'}}>  
            Signup
        </button>
        </div>
      </div>
    </div>
    
  </div>
  );
};

export default Login;

