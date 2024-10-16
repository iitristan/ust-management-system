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
  const [expectedReturnDate, setExpectedReturnDate] = useState(""); // New state for expected return date
  const [notes, setNotes] = useState(""); // New state for notes
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State for confirmation message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true
    setConfirmationMessage(""); // Reset confirmation message

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email); // Email field added
      formData.append('department', department);
      formData.append('purpose', purpose);
      formData.append('contactNo', contactNo);
      formData.append('coverLetter', coverLetter);
      formData.append('selectedAssets', JSON.stringify(selectedAssets));
      formData.append('expectedReturnDate', expectedReturnDate); // Append expected return date
      formData.append('notes', notes); // Append notes

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/borrowing-requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Borrowing request submitted:', response.data);
      setConfirmationMessage("Your borrowing request has been submitted successfully!"); // Set confirmation message
      resetForm();
    } catch (error) {
      console.error('Error submitting borrowing request:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const resetForm = () => {
    setName("");
    setEmail(""); // Reset email field
    setDepartment("");
    setPurpose("");
    setContactNo("");
    setCoverLetter(null);
    setSelectedAssets([]);
    setExpectedReturnDate("");
    setNotes("");
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/assets/active`);
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

          {/* Selected Assets Display and Select Asset Button */}
          <div className="relative flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Selected Assets:</h2>
            {selectedAssets.length > 0 ? (
              <ul className="list-disc pl-5 mb-4">
                {selectedAssets.map((asset, index) => (
                  <li key={index} className="text-indigo-700">{asset.assetName} (Quantity: {asset.quantity})</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-4">No assets selected.</p>
            )}
            <button
              type="button" // Added type attribute for clarity
              onClick={() => setIsModalOpen(true)} // Updated onClick to open modal
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Select Asset
            </button>
          </div>

          {/* Purpose Field */}
          <div className="relative">
            <input
              type="text"
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
              Enter the purpose of borrowing
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

          {/* Expected Date of Return Field */}
          <div className="relative">
            <input
              type="date"
              id="expectedReturnDate"
              name="expectedReturnDate"
              required
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300"
            />
            <label
              htmlFor="expectedReturnDate"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Expected Date of Return
            </label>
          </div>

          {/* Notes Field */}
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder=" "
              className="block w-full px-4 py-3 border-b-2 border-indigo-300 bg-transparent text-lg text-indigo-900 focus:border-indigo-500 focus:outline-none transition-colors duration-300 peer"
            />
            <label
              htmlFor="notes"
              className="absolute left-4 top-3 text-indigo-500 duration-300 transform -translate-y-8 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-8"
            >
              Additional Notes
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
            disabled={isSubmitting} // Disable button if submitting
            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600'} text-white text-lg font-medium py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        {/* Confirmation Message */}
        {confirmationMessage && (
          <div className="mt-4 text-green-600">
            {confirmationMessage}
          </div>
        )}

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