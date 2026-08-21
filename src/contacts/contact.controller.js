import Contact from "./contact.model.js";

// Create Contact Message (Single or Multiple)
export const createContact = async (req, res) => {
  try {
    let savedContacts;
    if (Array.isArray(req.body)) {
      savedContacts = await Contact.insertMany(req.body);
    } else {
      const newContact = new Contact({ ...req.body });
      savedContacts = await newContact.save();
    }

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: savedContacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get All Contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    // ✅ data কি-তে রেসপন্স পাঠানো হচ্ছে যা ফ্রন্টএন্ডের সাথে সরাসরি মিলবে
    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

// Delete Contact Message
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};