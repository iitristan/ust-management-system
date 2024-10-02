import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import BorroSelectModal from '../components/borrower/borroselectmodal';

function BorrowerForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [coverLetter, setCoverLetter] = useState(null);
  const [contactNo, setContactNo] = useState("");
  const [activeAssets, setActiveAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('department', department);
      formData.append('purpose', purpose);
      formData.append('contactNo', contactNo);
      formData.append('coverLetter', coverLetter);
      formData.append('selectedAssets', JSON.stringify(selectedAssets));

      const response = await axios.post('http://localhost:5000/api/borrowing-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Borrowing request submitted:', response.data);
      // Reset form fields or show success message
    } catch (error) {
      console.error('Error submitting borrowing request:', error);
      // Show error message to user
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCoverLetter(file);
    } else {
      alert("Please upload a PDF file.");
      e.target.value = null;
    }
  };

  const fetchActiveAssets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assets/active');
      setActiveAssets(response.data);
    } catch (error) {
      console.error('Error fetching active assets:', error);
    }
  };

  useEffect(() => {
    fetchActiveAssets();
  }, []);

  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      <div className="w-1/2 bg-cover bg-center hidden lg:block" style={{ backgroundImage: "url('./ust-image.JPG')" }}></div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-6">Asset Request Form</h1>
        <p className="text-xl text-indigo-700 mb-10">
          Borrow Materials from UST-OSA Asset Management System
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Enter your name
            </label>
          </div>

          {/* Department Field */}
          <div className="relative">
            <input
              type="text"
              id="department"
              name="department"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="department"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Enter your department
            </label>
          </div>

          {/* Material Select Field */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 text-left"
            >
              {selectedAssets.length > 0
                ? selectedAssets.map(asset => `${asset.assetName} (Quantity: ${asset.quantity})`).join(', ')
                : "Select assets to borrow"}
            </button>
          </div>

          {/* Purpose Field */}
          <div className="relative">
            <textarea
              id="purpose"
              name="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="purpose"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Purpose of borrowing
            </label>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Enter your email
            </label>
          </div>

          {/* Contact Number Field */}
          <div className="relative">
            <input
              type="tel"
              id="contactNo"
              name="contactNo"
              required
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="contactNo"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Enter your contact number
            </label>
          </div>

          {/* Cover Letter Upload Field */}
          <div className="relative">
            <label
              htmlFor="coverLetter"
              className="block mb-2 text-sm font-medium text-indigo-700"
            >
              Upload Cover Letter (PDF only)
            </label>
            <input
              type="file"
              id="coverLetter"
              name="coverLetter"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-indigo-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-100 file:text-indigo-700
                hover:file:bg-indigo-200 transition-colors duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-medium py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
          >
            Submit Request
          </button>
        </form>

        {/* Back to Login */}
        <Link to="/" className="mt-8 text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
          ← Back to Login
        </Link>

        {/* Modal */}
        <BorroSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeAssets={activeAssets}
          onSelectMaterials={(selectedAssets) => {
            setSelectedAssets(selectedAssets);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default BorrowerForm;