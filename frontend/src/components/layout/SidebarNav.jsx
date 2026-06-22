import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useIsLight } from "../../hooks/useIsLight";

const navItems = [
  { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
  { icon: "timer", label: "Study Session", path: "/session" },
  { icon: "analytics", label: "Syllabus Analyzer", path: "/syllabus" },
  { icon: "calendar_today", label: "Study Planner", path: "/planner" },
  { icon: "description", label: "Notes Generator", path: "/notes" },
  { icon: "history_edu", label: "Smart Revision", path: "/revision" },
  { icon: "quiz", label: "Mock Tests", path: "/mocktest" },
  { icon: "smart_toy", label: "AI Chat", path: "/chat" },
  { icon: "query_stats", label: "Analytics", path: "/analytics" },
];

const bottomNavItems = [
  { icon: "settings", label: "Settings", path: "/settings" },
  { icon: "help", label: "Support", path: "/support" },
];

export function SidebarNav({ user }) {
  const location = useLocation(); //current path e.g. "/dashboard"
  const navigate = useNavigate();//use to navigate different pages, or function to redirect like when you click logout you will be browsed to landing page/login
  const dispatch = useDispatch(); //send action to redux store
  const isLight = useIsLight(); //return true if theme is light mode

  const handleLogoutClick = () => {
    dispatch(logout()); //clear Redux auth state, save user locally
    navigate('/'); // redirects to landing/login page
  };

  const handleNewSession = () => {
    navigate('/session');
  };

  // Theme-aware colors
  const bg = isLight ? "#f8f5ff" : "#0D0B1A";
  const border = isLight ? "rgba(194,186,201,0.4)" : "rgba(74,68,85,0.3)";
  const textPrimary = isLight ? "#1a1523" : "#e8dfee";
  const textMuted = isLight ? "#7a7581" : "#7A7581";
  const activeBg = isLight ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.15)";
  const hoverBg = isLight ? "rgba(124,58,237,0.06)" : "rgba(44,40,51,0.6)";
  const hoverText = isLight ? "#1a1523" : "#e8dfee";
  const subtitleColor = isLight ? "#7a7581" : "#958da1";
  const userCardBg = isLight ? "rgba(124,58,237,0.06)" : "rgba(44,40,51,0.5)";
  const userCardBorder = isLight ? "rgba(124,58,237,0.15)" : "rgba(74,68,85,0.2)";

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link key={item.path} to={item.path}
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "10px 16px", borderRadius: "10px",
          textDecoration: "none", position: "relative",
          backgroundColor: isActive ? activeBg : "transparent",
          color: isActive ? textPrimary : textMuted,
          transition: "all 0.15s ease",
          fontWeight: isActive ? 700 : 500, fontSize: "14px",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = hoverText;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = textMuted;
          }
        }}
      >
        {isActive && (
          <span style={{
            position: "absolute", left: 0, top: "8px", bottom: "8px",
            width: "3px", borderRadius: "0 4px 4px 0",
            background: "#7C3AED", boxShadow: "0 0 6px rgba(124,58,237,0.4)",
          }} />
        )}
        <span className="material-symbols-outlined" style={{
          fontSize: "20px",
          color: isActive ? "#7C3AED" : "inherit", flexShrink: 0,
        }}>
          {item.icon}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside style={{
      width: "288px", minWidth: "288px", height: "100vh",
      backgroundColor: bg,
      borderRight: `1px solid ${border}`,
      display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, zIndex: 50,
      fontFamily: "'Inter', sans-serif",
      overflowY: "auto", overflowX: "hidden",
      transition: "background-color 0.3s, border-color 0.3s",
    }}>

      {/* LOGO */}
      <div style={{ padding: "28px 24px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '18px' }}>rocket_launch</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontFamily: "Syne, sans-serif", fontWeight: 700,
                fontSize: "18px", color: textPrimary,
              }}>
                EduPilot
              </span>
              <span style={{
                fontSize: "10px", fontWeight: 700, padding: "2px 6px",
                borderRadius: "6px", background: "rgba(124,58,237,0.15)",
                color: "#d2bbff", border: "1px solid rgba(124,58,237,0.3)",
              }}>
                AI
              </span>
            </div>
          </div>
        </div>
        <p style={{
          fontSize: "10px", color: subtitleColor,
          textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700,
        }}>
          Academic Command Center
        </p>
      </div>

      {/* MAIN NAV */}
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(renderNavLink)}

        {/* DIVIDER */}
        <div style={{ margin: "8px 12px", height: "1px", backgroundColor: border }} />

        {/* BOTTOM NAV */}
        {bottomNavItems.map(renderNavLink)}
      </nav>

      {/* BOTTOM SECTION */}
      <div style={{ padding: "5px 16px 7px 16px" }}>
        <div style={{ height: "1px", backgroundColor: border, marginBottom: "16px" }} />

        {/* CTA Button */}
        <button
          onClick={handleNewSession}
          style={{
            width: "100%", padding: "10px", borderRadius: "10px",
            background: "#7C3AED", color: "#ede0ff",
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: "14px", border: "none", cursor: "pointer",
            marginBottom: "12px",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          + New Study Session
        </button>

        {/* USER CARD */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 12px", borderRadius: "12px",
            backgroundColor: userCardBg,
            border: `1px solid ${userCardBorder}`,
            transition: "background-color 0.15s, border-color 0.15s",
          }}
        >
          {/* Avatar - click to go to profile settings */}
          <div
            onClick={() => navigate('/settings')}
            title="Go to Profile Settings"
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(130deg, #7C3AED, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "14px", color: "#fff",
              border: "2px solid rgba(124,58,237,0.3)", flexShrink: 0,
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 0 0px rgba(124, 58, 237, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {user ? user.name.charAt(0).toUpperCase() : 'K'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user ? user.name : 'Khushi'}
            </p>
            <p style={{ fontSize: "10px", color: "#bea8ff", margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user ? user.branch || 'Premium Student' : 'Premium Student'}
            </p>
          </div>
          {/* Logout Icon */}
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "18px", color: "#ffb4ab", cursor: "pointer",
              transition: "transform 0.15s ease, color 0.15s ease"
            }}
            title="Log Out"
            onClick={handleLogoutClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.color = "#ff8e8e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#ffb4ab";
            }}
          >
            logout
          </span>
        </div>
      </div>
    </aside>
  );
}
