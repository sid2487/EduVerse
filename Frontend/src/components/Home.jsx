import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import logo from "../../public/logo.webp"
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/utils';

const Home = () => {

  const [courses , setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if(user){
      setIsLoggedIn(true)
    } else{
      setIsLoggedIn(false)
    }
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await axios.get(
        `${BACKEND_URL}/course/get`, {
          withCredentials: true
        }
      );
      setCourses(response.data.courses)
      console.log(response.data)
    }
    fetchCourse();
  }, [])

  // logout
  const handleLogout = async () => {
    
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`, {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  }

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
      <div className=" min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt=""
              className="w-7 h-7 md:w-10 md:h-10 rounded-full"
            />
            <h1 className="md:text-2xl text-orange-500 font-bold">EduVerse</h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded cursor-pointer"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-semibold text-orange-500">EduVerse</h1>
          <br />
          <p className="text-gray-500">
            Sharpen your skills with cources crafted by experts
          </p>
          <div className="space-x-4 mt-8">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black cursor-pointer"
            >
              Explore courses
            </Link>
            <Link
              to={"https://x.com/siddocode"}
              className="bg-white text-black p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white cursor-pointer"
            >
              Courses videos
            </Link>
          </div>
        </section>
        <section className="px-4 md:px-10 py-10 bg-gray-950 overflow-hidden">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="px-3">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={course.image?.url}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-white text-lg md:text-xl font-semibold mb-2 truncate">
                      {course.title}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-400 font-bold text-lg">
                        ₹{course.price}
                      </span>
                      <Link
                        to={`/buy/${course._id}`}
                        className="bg-orange-500 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-full transition-colors duration-300"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* Footer */}
        <footer className="mt-12 mb-0.5">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">EduVerse</h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  youtube- EduVerse
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  telegram- EduVerse
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github- EduVerse
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2024
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home