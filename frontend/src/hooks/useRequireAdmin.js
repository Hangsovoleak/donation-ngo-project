/**
 * Software Framework: React (Frontend)
 * Description:
 *      Custom authentication hook that enforces administrator 
 *      access for protected routes.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/authStorage";

/*------------------------------------------------------------------------------
                                CUSTOM HOOKS
------------------------------------------------------------------------------*/

/**
 * @brief Enforce admin authentication.
 * 
 * Redirects to the login page if no valid session token is found.
 * 
 * @return boolean Authentication status.
 */
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
