import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/authStorage";

// Redirects to login if no admin token exists.
// Returns true when the user is authenticated.
export function useRequireAdmin() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setIsAuthed(true);
  }, [navigate]);

  return isAuthed;
}
