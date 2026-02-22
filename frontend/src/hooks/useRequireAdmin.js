import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/authStorage";
// Redirects to login if no admin token exists.
// Returns true when the user is authenticated.
export function useRequireAdmin() {
  //import required hooks and utils
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  //check if user is authenticated and redirect to login if not
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
