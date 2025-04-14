import MenuItem from "../models/MenuItem.js"

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body)
    await menuItem.save()
    res.status(201).json({ success: true, data: menuItem })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get a menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" })
    }
    res.json({ success: true, data: menuItem })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" })
    }
    res.json({ success: true, data: menuItem })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id)
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" })
    }
    res.json({ success: true, message: "Menu item deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
