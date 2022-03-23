import './login.css';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { loginUser } from "../../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const initalLoginCreds = {
        email: '',
        password: ''
    }
    const testLoginCreds = {
        email: 'shikhasingh@gmail.com',
        password: 'shikhasingh123'
    };
    const [loginCreds, setLoginCreds] = useState(initalLoginCreds);
    const { dispatch } = useAuth();

    const setLoginFields = (e) => {
        const { value, name } = e.target;
        setLoginCreds((login) => ({ ...login, [name]: value }));
    }

    //login handler with actual login credentials
    const loginFormHandler = async (e, loginCreds) => {
        e.preventDefault();
        try{
        const { data: { encodedToken, foundUser }, status } = await loginUser(loginCreds);
        setLoginCreds(initalLoginCreds);
        if (status === 200){
            localStorage.setItem("token", JSON.stringify(encodedToken));
            localStorage.setItem("User", JSON.stringify(foundUser));
        }
        if(status===500)
            throw new Error("Internal server error!");
        dispatch({ type: "login", payload:{token: encodedToken, user: foundUser} });
        navigate('/');
        }catch(error){
            console.error(e);
        }
    }

    //login handler with test login credentials
    const testLoginFormHandler = async (e, loginCreds) => {
        e.preventDefault();
        setLoginCreds(testLoginCreds);
        try {
            const { data: { encodedToken, foundUser }, status } = await loginUser(loginCreds);
            setLoginCreds(initalLoginCreds);
            if (status === 200){
                localStorage.setItem("token", JSON.stringify(encodedToken));
                localStorage.setItem("User", JSON.stringify(foundUser));
            }
            if(status===500)
                throw new Error("Internal server error!");
            dispatch({ type: "login", payload:{token: encodedToken, user: foundUser} });
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="breadcrumb">

            </div>
            <div className="login-modal">
                <form className="login-form" onSubmit={(e) => loginFormHandler(e, loginCreds)}>
                    <h3 className="login-title">Log in</h3>
                    <p className="login-subtitle text-center">Enter email and password</p>
                    <div className="input-container">
                        <label className="input-label" for="userName">Email</label>
                        <input
                            className="input-section"
                            type="text"
                            id="userName"
                            placeholder="Email"
                            name="email"
                            value={loginCreds.email}
                            onChange={(e) => setLoginFields(e)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label" for="pwd">Password</label>
                        <input
                            className="input-section"
                            type="password"
                            id="pwd"
                            placeholder="Password"
                            name="password"
                            value={loginCreds.password}
                            onChange={(e) => setLoginFields(e)}
                            required
                        />
                    </div>
                    <div className="login-help">
                        <div>
                            <label className="input-label text-sm" for="pwd-store">
                                <input type="checkbox" name="" id="pwd-store" />
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm">Forgot Password?</a>
                    </div>
                    <button className="bttn bttn-primary bttn-block">LOG IN</button>
                    <button className="bttn bttn-primary bttn-block my-4" onClick={(e) => testLoginFormHandler(e, testLoginCreds)}>LOG IN WITH TEST CREDENTIALS</button>
                    <p className="sub-text text-sm text-center">Don't have an account?
                        <Link className="text-sm bold link-text-primary" to='/Signup'>Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export { Login };