'use client'

import { useState } from "react";
import Link from "next/link";

export default function SingInComp() {

    const [popup,setPopup]=useState(false);
    const SingIn = (e) => {
        e.preventDefault();
        console.log('Sing In');
        fetch('http://127.0.0.1:8000/users/client/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: e.target[0].value,
                email: e.target[1].value,
                password: e.target[2].value,

            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPopup(true)
                
            });
    }
    return(
        popup? <div>your account created seccussefly, u can login now , click here to go to <Link href={'/Login'} style={{color: "blue"}}>login page </Link></div>
        : (<form onSubmit={SingIn}>
            <label >
                UserName
                <input type="text" />
            </label>
            <label >
                Email
                <input type="email" />
            </label>
            <label >
                PassWord
                <input type="password"/>
            </label>
            <button type="submit">Sing In</button>
        </form>)
        
    )
}