import express from "express";
import addQuestion from "../api/user-login";

const router = express.Router();
router.post("/login", addQuestion);
