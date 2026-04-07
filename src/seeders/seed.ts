import { Category, User} from "../models";
import sequelize from "../config/db";
import bcrypt from 'bcrypt';
import { getEnv, loadEnv } from "../config/env";
import logger from "../utils/logger";

loadEnv();

type Admin = {
  name: string;
  email: string;
  password: string;
  role:number;
};

const seedData = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    //hashed password
    const hashedPass = await bcrypt.hash(getEnv("PASS"),12);

    //define values for admin
    const Admin: Admin = {
      name: getEnv("NAME"),
      email: getEnv("EMAIL"),
      password: hashedPass,
      role:1,
    };

    //and seed admin data in DB
    const [addedAdmin] = await User.findOrCreate({
      where:{email:Admin.email},
      defaults:{
        name: Admin.name,
        email: Admin.email,
        password: Admin.password,
        role: Admin.role,
      }
    });

    //seed some category in DB
    await Category.bulkCreate([
      {category_id:1,name:'Electronic'},
      {category_id:2,name:'Fashion'},
      {category_id:3,name:'Books'},
      {category_id:4,name:'Home & kitchen'},
      {category_id:5,name:'Sports'},
      {category_id:6,name:'Beauty'},
      {category_id:7,name:'Grocery'},
      {category_id:8,name:'Baby Product'},
    ]);

    logger.info("Seed completed", {
      adminName: addedAdmin.name,
      role: addedAdmin.role,
    });
  } catch (err) {
    logger.error("Seed failed", { err });
  }
};

seedData();
