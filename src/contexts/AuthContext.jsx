import { createContext, useEffect, useState } from "react";
import axios from '../config/axios';
import { addAccessToken, getAccessToken, removeAccessToken } from "../utils/local-storage";
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    // ตรวจสอบ token และดึงข้อมูลผู้ใช้เมื่อ component โหลด
    useEffect(() => {
        const fetchUser = async () => {
            const token = getAccessToken();
            if (!token) {
                setInitialLoading(false);
                return;
            }

            try {
                const res = await axios.get('/PromotionProposal/api/auth/me');
                setAuthUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                removeAccessToken();
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ฟังก์ชันล้าง token และข้อมูลผู้ใช้
    const clearAuthData = () => {
        document.cookie = "accessToken=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=None";
        localStorage.clear();
        sessionStorage.clear();
        setAuthUser(null);
    };

    // แสดง Swal alert
    const showAlert = async (config) => {
        return Swal.fire(config);
    };

  const login = async (objUser) => {
  try {
    console.log("🔄 เริ่มต้นกระบวนการล็อกอิน (Internal Only)");

    // เรียก Internal API เท่านั้น
    const res = await axios.post(
      "/PromotionProposal/api/auth/login",
      objUser,
      { withCredentials: true }
    );

    if (res.status !== 200) {
      clearAuthData();
      throw new Error(res.data?.message || "Login Failed");
    }

    // จัดการข้อมูลผู้ใช้จาก Internal API
    addAccessToken(res.data.accessToken);
    setAuthUser(res.data.user);

    // แจ้งเตือนผลลัพธ์
    await showAlert(
      res.data.isFirstLogin
        ? {
            title: "เข้าสู่ระบบครั้งแรก",
            text:
              "ระบบได้จัดส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของท่านแล้ว กรุณาตรวจสอบอีเมล",
            icon: "info",
            confirmButtonText: "ตกลง",
          }
        : {
            position: "center",
            icon: "success",
            title: "Login Successful",
            text: "เข้าสู่ระบบสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          }
    );

    return res.data;
  } catch (error) {
    console.error("❌ Login failed:", error);

    // เคลียร์ token / user ถ้าล้มเหลว
    clearAuthData?.();

    await showAlert({
      position: "center",
      icon: "error",
      title: "Login failed",
      text: error.response?.data?.message || "รหัสพนักงาน หรือ รหัสผ่านไม่ถูกต้อง",
      showConfirmButton: true,
    });

    throw error;
  } finally {
    setInitialLoading(false);
  }
};


    const logout = () => {
        setInitialLoading(true);
        removeAccessToken();
        setAuthUser(null);
        setInitialLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, authUser, initialLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
