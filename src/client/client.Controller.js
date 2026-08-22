import Client from "./client.model.js";

// ১. ক্লায়েন্ট লিস্ট পাওয়া (ডিফল্টভাবে active ক্লায়েন্ট, প্যারামস দিলে সব)
export const getClients = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };

    const clients = await Client.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Client logos fetch করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// ২. নতুন ক্লায়েন্ট তৈরি করা
export const createClient = async (req, res) => {
  try {
    const { name, logo, website, isActive } = req.body;

    if (!name || !logo) {
      return res.status(400).json({
        success: false,
        message: "Name এবং Logo আবশ্যক",
      });
    }

    const client = await Client.create({
      name,
      logo,
      website: website || "",
      isActive: isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Client সফলভাবে তৈরি হয়েছে",
      data: client,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Client তৈরি করতে ব্যর্থ হয়েছে",
      error: error.message,
    });
  }
};

// ৩. ক্লায়েন্ট ডিলিট করা
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client খুঁজে পাওয়া যায়নি",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client সফলভাবে ডিলিট করা হয়েছে",
      data: deletedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Client ডিলিট করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};