"use client";
import { login } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function LoginComp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLog = useSelector((state) => state.user.isLog);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    if (isLog) {
      router.push("/");
    }
  }, [isLog, router]);

  const Login = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    dispatch(login({ username, password }));
  };

  return (
    <div>
      <form onSubmit={Login}>
        <label>
          UserName
          <input type="text" />
        </label>
        <label>
          PassWord
          <input type="password" />
        </label>
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>Login failed</p>}

      <Link href="/register">Register</Link>
    </div>
  );
}
