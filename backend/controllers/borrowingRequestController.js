const BorrowingRequest = require('../models/borrowingrequest');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.createBorrowingRequest = [
  upload.single('coverLetter'),
  async (req, res) => {
    try {
      console.log('Received request:', {
        body: req.body,
        file: req.file,
        headers: req.headers,
        method: req.method,
        url: req.url
      });

      const { name, email, department, purpose, contactNo, selectedAssets } = req.body;
      
      if (!name || !email || !department || !purpose || !contactNo) {
        console.log('Missing required fields:', { name, email, department, purpose, contactNo });
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let coverLetterPath = null;
      if (req.file) {
        coverLetterPath = req.file.path;
      }

      let parsedSelectedAssets;
      try {
        parsedSelectedAssets = selectedAssets ? JSON.parse(selectedAssets) : [];
      } catch (error) {
        console.error('Error parsing selectedAssets:', error);
        parsedSelectedAssets = [];
      }

      const newRequest = await BorrowingRequest.createBorrowingRequest({
        name,
        email,
        department,
        purpose,
        contactNo,
        coverLetterPath,
        selectedAssets: parsedSelectedAssets
      });

      console.log('New borrowing request created:', newRequest);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error('Error creating borrowing request:', error);
      res.status(500).json({ message: 'Error creating borrowing request', error: error.message });
    }
  }
];

exports.getAllBorrowingRequests = async (req, res) => {
  try {
    const requests = await BorrowingRequest.getAllBorrowingRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowing requests', error: error.message });
  }
};

exports.updateBorrowingRequestStatus = async (req, res) => {
  try {
    const updatedRequest = await BorrowingRequest.updateBorrowingRequestStatus(req.params.id, req.body.status);
    if (updatedRequest) {
      res.status(200).json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Borrowing request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating borrowing request status', error: error.message });
  }
};

exports.getCoverLetter = async (req, res) => {
  try {
    const request = await BorrowingRequest.getBorrowingRequestById(req.params.id);
    if (!request || !request.cover_letter_path) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }
    const absolutePath = path.resolve(request.cover_letter_path);
    
    // Check if the file exists
    await fs.access(absolutePath);
    
    // Set the correct content type for PDF
    res.contentType("application/pdf");
    
    // Stream the file instead of sending it all at once
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    res.status(500).json({ message: 'Error fetching cover letter', error: error.message });
  }
};
