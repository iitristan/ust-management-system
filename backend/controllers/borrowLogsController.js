const BorrowLogs = require('../models/borrowLogs');
const BorrowingRequest = require('../models/borrowingrequest');

exports.createBorrowLog = async (req, res) => {
  try {
    const { requestId } = req.body;
    const borrowingRequest = await BorrowingRequest.getBorrowingRequestById(requestId);

    if (!borrowingRequest) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    const logPromises = borrowingRequest.selected_assets.map(asset => 
      BorrowLogs.createBorrowLog({
        assetId: asset.asset_id,
        borrowerName: borrowingRequest.name,
        borrowerEmail: borrowingRequest.email,
        borrowerDepartment: borrowingRequest.department,
        dateBorrowed: borrowingRequest.created_at,
        dateReturned: null,
        borrowingRequestId: requestId
      })
    );

    await Promise.all(logPromises);

    res.status(201).json({ message: 'Borrow logs created successfully' });
  } catch (error) {
    console.error('Error creating borrow log:', error);
    res.status(500).json({ message: 'Error creating borrow log', error: error.message });
  }
};

exports.getBorrowLogs = async (req, res) => {
  try {
    const { assetId } = req.params;
    console.log('Fetching borrow logs for asset ID:', assetId);
    const logs = await BorrowLogs.getBorrowLogsByAssetId(assetId);
    console.log('Fetched logs:', logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching borrow logs:', error);
    res.status(500).json({ message: 'Error fetching borrow logs', error: error.message });
  }
};

exports.updateBorrowLogReturnDate = async (req, res) => {
  try {
    const { requestId, dateReturned } = req.body;
    const updatedLogs = await BorrowLogs.updateBorrowLogReturnDate(requestId, dateReturned);
    res.status(200).json(updatedLogs);
  } catch (error) {
    console.error('Error updating borrow log return date:', error);
    res.status(500).json({ message: 'Error updating borrow log return date', error: error.message });
  }
};

