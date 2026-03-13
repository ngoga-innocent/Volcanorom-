import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <h1 className="text-3xl text-green-700 font-bold">Hello World</h1>
    </div>
  );
}

export default App;
