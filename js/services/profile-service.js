import * as db from "../config/db.js";
import * as model from "../config/model.js";

// Lấy user từ Firestore theo userId
export async function getUserByEmail(email) {
  try {
    console.log("Fetching user with email:", email);
    const user = await db.getDbByQuery("users", {field: "email",
        operator: "==", value: email
    }, model.userConverter);
    return user[0] || null; // Trả về object User hoặc null nếu không có
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return null;
  }
}

export async function getFavouriteByUser(email) {
     try {
    console.log("Fetching user with email:", email);
    const user = await db.getDbByQuery("users", {field: "email",
        operator: "==", value: email
    }, model.userConverter);
    return user[0]?.favourite || null; // Trả về object User hoặc null nếu không có
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return null;
  }}