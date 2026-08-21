import HeroBanner from "./heroBanner.model.js";

// Get Hero Banner Data
export const getHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findOne();
    
    if (!banner) {
      return res.status(200).json({ 
        success: true, 
        message: "No Hero Banner data found", 
        data: null 
      });
    }

    return res.status(200).json({ success: true, data: banner });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch Hero Banner", 
      error: error.message 
    });
  }
};

// Create or Update Hero Banner Data (Upsert)
export const updateHeroBanner = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // _id ডিলিট
    delete updateData._id;

    // 🔴 ১. যদি নতুন ইমেজ ফাইল আপলোড হয়ে থাকে (Multer / Cloudinary)
    if (req.file) {
      // Cloudinary হলে req.file.path অথবা req.file.secure_url
      updateData.imageUrl = req.file.path || req.file.secure_url;
    } 
    // 🔴 ২. ফাইল না থাকলে এবং req.body.imageUrl খালি ("") আসলে
    // আগের সেভ হওয়া ইমেজ যেন ডিলিট না হয়ে যায় সে জন্য এটি রিমুভ করে দিন
    else if (updateData.imageUrl !== undefined && updateData.imageUrl.trim() === "") {
      delete updateData.imageUrl;
    }

    const banner = await HeroBanner.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hero Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Hero Banner",
      error: error.message,
    });
  }
};