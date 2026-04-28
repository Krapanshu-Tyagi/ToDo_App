import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const MFASetup = ({ onSuccess }: any) => {
  const [qr, setQr] = useState("");
  const [token, setToken] = useState("");

  // 🔹 Step 1: Get QR code
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const data = await apiRequest("/api/auth/mfa/setup", {
          method: "POST",
        });
        setQr(data.qr);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQR();
  }, []);

  // 🔹 Step 2: Verify OTP
  const handleVerify = async () => {
    try {
      await apiRequest("/api/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      alert(" MFA Enabled");
      onSuccess();
    } catch (err) {
      alert(" Invalid OTP");
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "#1e293b",
        color: "white",
        borderRadius: "12px",
      }}
    >
      <h3> Setup MFA</h3>

      <p>Scan this QR with Google Authenticator:</p>

      {qr && (
        <img
          src={qr}
          alt="QR Code"
          style={{ width: "200px", margin: "10px 0" }}
        />
      )}

      <input
        type="text"
        placeholder="Enter OTP"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default MFASetup;