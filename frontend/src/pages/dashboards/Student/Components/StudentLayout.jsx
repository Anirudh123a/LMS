import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function StudentLayout({ title, children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "'Inter', sans-serif", bgcolor: "#f8fafc", overflow: "hidden" }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title={title} />

        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default StudentLayout;