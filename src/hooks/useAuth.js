import { useState, useEffect } from "react";
import axios from "axios";
import { API_SERVER } from "@/utils/constants";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/is-auth");
        console.log({ response });
        setIsLoggedIn(response.data?.isloggedIn);
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  return isLoggedIn;
}

export default useAuth;
