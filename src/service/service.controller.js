import Service from "./service.model.js";
// Create Single or Multiple Services
export const createService = async (req, res) => {
  try {
    let savedServices;
    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array with at least one service",
        });
      }
      savedServices = await Service.insertMany(req.body);
    } else {
      const newService = new Service({ ...req.body });
      savedServices = await newService.save();
    }

    return res.status(201).json({
      success: true,
      message: "Service(s) created successfully",
      data: savedServices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// Get All Services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// Update Service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    // new: true (আপডেটেড ডাটা রিটার্ন করবে)
    // runValidators: true (Mongoose Schema এর রুলস চেক করবে)
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};