import React, {useState} from "react";

const Auth= () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onChange = (event) => {
//        console.log(event.target.name);
        const { target: {name, value}} = event;
        if(name === "email"){
//            console.log(value);
            setEmail(value);
        } else if (name === "password"){
//            console.log(value);
            setPassword(value);
        }
    }
    const onSubmit = (event) => {
        event.preventDefault();
    }
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input 
            name="email"
            type="email" 
            placeholder="Email" 
            required
            value={email}
            onChange={onChange} />
            <input 
            name="password"
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={onChange}/>
            <input type="submit" value="Login" />
        </form>
        <div>
            <button>Continue with Google</button>
            <button>Continue with Github</button>
        </div>
    </div>
    )
};

export default Auth;