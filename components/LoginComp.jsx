"use client"
import { login,getInfo } from "@/redux/slices/userSlice";
import store from "@/redux/store";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation'

export default function LoginComp(){

    const router = useRouter()
    const dispatch = useDispatch();
    const Login = (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:8000/api-token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: e.target[0].value,
                password: e.target[1].value,

            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                let token = data.token
                let username = e.target[0].value
                dispatch(login({token,username} ))
                dispatch(getInfo(token))
                router.push('/')

                
            });
    }
    return(
        <form On onSubmit={Login}>

             <label >
                UserName
                <input type="text" />
            </label>
            <label >
                PassWord
                <input type="password"/>
            </label>
            <button type="submit">Login</button>
        </form>
    )
}