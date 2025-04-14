import User from "../models/user.model.js"
import WalletTransaction from "../models/walletTransaction.model.js"
import { generateReferenceId } from "../lib/utils/helpers.js"

/**
 * Get wallet balance
 * @route GET /api/wallet/balance
 * @access Private
 */
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, data: { balance: user.walletBalance } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Get wallet transactions
 * @route GET /api/wallet/transactions
 * @access Private
 */
export const getWalletTransactions = async (req, res, next) => {
  try {
    const transactions = await WalletTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).select("-__v")

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add money to wallet
 * @route POST /api/wallet/add
 * @access Private
 */
export const addFunds = async (req, res) => {
  try {
    const { amount } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    user.walletBalance += amount
    await user.save()

    const transaction = new WalletTransaction({
      user: req.user.id,
      type: "credit",
      amount,
      description: "Funds added to wallet",
    })
    await transaction.save()

    res.status(201).json({ success: true, data: { balance: user.walletBalance } })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Withdraw money from wallet
 * @route POST /api/wallet/withdraw
 * @access Private
 */
export const withdrawMoney = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" })
    }

    if (!bankDetails) {
      return res.status(400).json({ success: false, message: "Bank details are required" })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Check if user has sufficient balance
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" })
    }

    // Deduct money from wallet
    user.walletBalance -= amount
    await user.save()

    // Create transaction record
    const transaction = await WalletTransaction.create({
      userId: req.user._id,
      amount,
      type: "DEBIT",
      description: "Withdrawn money from wallet",
      reference: generateReferenceId("WTH"),
      status: "COMPLETED",
    })

    res.status(201).json({
      success: true,
      message: "Money withdrawn from wallet successfully",
      balance: user.walletBalance,
      transaction,
    })
  } catch (error) {
    next(error)
  }
}

// Transfer funds from wallet
export const transferFunds = async (req, res) => {
  try {
    const { amount, recipient } = req.body
    const sender = await User.findById(req.user.id)
    const receiver = await User.findById(recipient)

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: "Sender or receiver not found" })
    }

    if (sender.walletBalance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" })
    }

    sender.walletBalance -= amount
    receiver.walletBalance += amount
    await sender.save()
    await receiver.save()

    const transaction = new WalletTransaction({
      user: req.user.id,
      type: "debit",
      amount,
      description: `Transferred to ${receiver.fullName}`,
    })
    await transaction.save()

    res.json({ success: true, data: { balance: sender.walletBalance } })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get wallet transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20)

    res.json({ success: true, data: transactions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
