import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

const Login = () => {

  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`, {
          email,
          password
        }, 
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log(response.data.message)
      toast.success(response.data.message)
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/")
    } catch (error) {
      console.log(error.response)
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Failed to Login");
      }
    }
  }

  


  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        {/* header */}
        <header className=" absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt=""
              className="w-10 h-10 md:w-10 md:h-10 rounded-full"
            />
            <Link to={"/"} className="md:text-2xl text-orange-500 font-bold">
              Course Heaven
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/signup"}
              className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Signup
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* login form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            welcom to <span className="text-orange-500">EduVerse</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Login To Avail Paid Courses
          </p>

          <form onSubmit={handleSubmit}>
            <div className=" mb-4">
              <label className=" text-gray-400 p-2" htmlFor="lastname">
                Email
              </label>
              <input
                id="email"
                className=" mt-1 w-full p-3 rounded-md bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className=" mb-4">
              <label className=" text-gray-400 p-2" htmlFor="lastname">
                Passowrd
              </label>
              <div className="relative">
                <input
                  id="password"
                  className=" mt-1 w-full p-3 rounded-md bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full cursor-pointer bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
