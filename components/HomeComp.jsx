import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getInfo, refreshTokens, setTokens } from "@/redux/slices/userSlice";

function HomeComp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const access = useSelector((state) => state.user.access);
  const role = useSelector((state) => state.user.role);
  const error = useSelector((state) => state.user.error);

  // Load tokens from local storage and set them in Redux state
  useEffect(() => {
    console.log("Start - Component Mounted");
    if (access == "") {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      if (access && refresh) {
        console.log("Setting tokens from local storage", access, refresh);

        dispatch(setTokens({ access, refresh }));
      } else {
        router.push("/login");
      }
    }
  }, [access, dispatch, router]);

  // Fetch user info and handle token refresh if necessary
  useEffect(() => {
    if (access) {
      console.log("Fetching user info");
      dispatch(getInfo());
    }
  }, [access, dispatch]);

  // Handle role-based redirection
  useEffect(() => {
    if (role === "ADMIN") {
      console.log("Redirecting to /seller");
      router.push("/seller");
    } else if (role === "CLIENT") {
      console.log("Redirecting to /client");
      router.push("/client");
    } else if (error) {
      // If there's an error, attempt to refresh tokens
      console.log("Error fetching user info, trying to refresh tokens");
      dispatch(refreshTokens())
        .then((refreshAction) => {
          if (refreshAction.payload?.access) {
            console.log("Tokens refreshed, fetching user info again");
            dispatch(getInfo());
          } else {
            console.log("Token refresh failed");
            //router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Token refresh failed: ", error);
          //router.push("/login");
        });
    }
  }, [role, error, dispatch, router]);

  return <div>Loading...</div>;
}

export default HomeComp;
