import { useLoader } from "../app/LoaderContext";


export default function GlobalLoader() {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div style={overlay}>
      <div style={spinner}></div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backdropFilter: "blur(3px)",
};

const spinner: React.CSSProperties = {
  width: "60px",
  height: "60px",
  border: "6px solid #eee",
  borderTop: "6px solid #4F46E5",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};