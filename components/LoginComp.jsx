// Example usage in a component (components/Login.js)
import { useDispatch } from "react-redux";
import { setTokens, setInfos } from "@/redux/slices/userSlice";
import { login } from "../utils/auth";
import { getInfo } from "../utils/user";
import { useRouter } from "next/navigation";

const LoginComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;

    try {
      const tokens = await login(username.value, password.value);
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      dispatch(
        setTokens({
          access: tokens.access,
          refresh: tokens.refresh,
        })
      );
      const info = await getInfo();
      dispatch(setInfos(info));
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginComp;
