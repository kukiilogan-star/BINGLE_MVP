import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

/**
 * UnityContainer Component
 * 
 * This component integrates a Unity WebGL build into the React application.
 * Note: Place your Unity build files in public/unity/Build/
 * Expected filenames: UnityBuild.loader.js, UnityBuild.data, UnityBuild.framework.js, UnityBuild.wasm
 */
const UnityContainer = () => {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "/unity/Build/UnityBuild.loader.js",
    dataUrl: "/unity/Build/UnityBuild.data",
    frameworkUrl: "/unity/Build/UnityBuild.framework.js",
    codeUrl: "/unity/Build/UnityBuild.wasm",
  });

  return (
    <div className="unity-wrapper" style={{ 
      width: "100%", 
      height: "100%", 
      minHeight: "500px",
      position: "relative",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      background: "#f0f2f5"
    }}>
      {!isLoaded && (
        <div className="loading-overlay" style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)"
        }}>
          <div className="loading-spinner" style={{
            width: "50px",
            height: "50px",
            border: "5px solid #e0e0e0",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px"
          }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#2c3e50" }}>
            Loading Ice Cube World... {Math.round(loadingProgression * 100)}%
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <Unity 
        unityProvider={unityProvider} 
        style={{ width: "100%", height: "100%", display: isLoaded ? "block" : "none" }} 
      />
    </div>
  );
};

export default UnityContainer;
