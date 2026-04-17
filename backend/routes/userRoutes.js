const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
} = require("../controllers/userController");

// ✅ PROFILE (all roles)
router.get("/me", auth, getProfile);
router.put("/me", auth, updateUser); // Reuse RBAC logic for self-update


// ADMIN / MANAGER ROUTES - VIEW
router.get("/", auth, role.requireRole("admin", "manager"), getUsers);
router.get("/:id", auth, role.requireRole("admin", "manager"), getUser);

// MODIFY (RBAC in controller)
router.put("/:id", auth, role.requireRole("admin", "manager"), updateUser);
router.delete("/:id", auth, role.isAdmin, deleteUser);

// User profile update
router.put("/profile", auth, updateUser); // uses same RBAC logic


// ADMIN CREATE
router.post("/", auth, role.isAdmin, createUser);

module.exports = router;
