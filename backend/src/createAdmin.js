import bcrypt from "bcrypt";
import { User } from "./models/index.js";

export async function createAdminIfNotExists() {
  try {
    const adminEmail = "admin@admin.pl";
    const adminName = "admin";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
      });

      console.log("Admin został utworzony domyślnie");
    } else {
      console.log("Admin już istnieje");
    }
  } catch (err) {
    console.error("Błąd przy tworzeniu admina:", err);
  }
}
