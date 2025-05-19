// Enhanced frontend component with better error handling and debugging
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

const UpdateCourse = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/course/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Course data loaded:", data.course);
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImagePreview(data.course.image.url);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching course:", error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file.name, file.type, file.size);

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);

    // Only append image if a new one was selected
    if (image) {
      console.log("Appending image to form data:", image.name);
      formData.append("image", image);
    } else {
      console.log("No new image selected, using existing image");
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    setSubmitting(true);

    try {
      console.log("Sending update request for course:", id);
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Important: Let axios set the correct Content-Type for multipart/form-data
          },
          withCredentials: true,
        }
      );
      console.log("Update response:", response.data);
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error("Update failed:", error);
      const errorMessage =
        error.response?.data?.errors || "Failed to update course";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Course</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Course"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/avif"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
