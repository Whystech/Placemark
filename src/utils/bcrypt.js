import bcrypt from "bcrypt"

export const bcryptUtils = {
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  async checkPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
};