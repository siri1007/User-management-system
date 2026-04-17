const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE USER (Admin)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    createdBy: req.user.id,
  });

  res.json(user);
};

// GET ALL USERS (paginated, searchable, filterable)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    const query = {
      status: { $ne: 'inactive' },
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .populate('createdBy updatedBy', 'name')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE USER
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('createdBy updatedBy', 'name')
    .select("-password");
  res.json(user);
};

// UPDATE USER (RBAC)
exports.updateUser = async (req, res) => {
  let targetUserId = req.params.id || req.user.id;
  const actor = req.user;
  
  // Self update check
  if (!req.params.id) {
    if (actor.role !== 'user') {
      return res.status(403).json({ message: 'Profile endpoint for self only' });
    }
  }
  
  // Find target user
  const targetUser = await User.findOne({ _id: targetUserId, status: 'active' }).select('-password');
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email, password, role, status } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  
  // Password handling
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updates.password = hashed;
  }
  
  // RBAC logic
  if (actor.role === 'user') {
    if (actor.id !== targetUserId.toString()) {
      return res.status(403).json({ message: 'Can only update own profile' });
    }
    // Users can only update name/password (email immutable), no role/status
  } else if (actor.role === 'manager') {
    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Cannot update admin users' });
    }
    // Managers cannot change role/password
    if (password) {
      return res.status(403).json({ message: 'Cannot change password' });
    }
    updates.role = undefined;
  } else if (actor.role === 'admin') {
    // Full access
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
  }

  updates.updatedBy = actor.id;
  
  const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, {
    new: true,
    runValidators: true
  }).select('-password').populate('createdBy updatedBy', 'name');

  res.json(updatedUser);
};


// DELETE (SOFT)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { 
    status: 'inactive',
    updatedBy: req.user.id 
  });
  res.json({ message: "User soft deleted successfully" });
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('createdBy updatedBy', 'name')
    .select("-password");
  res.json(user);
};
