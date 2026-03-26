import { Category, User} from "../models";
import sequelize from "../config/db";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
dotenv.config();

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
    const hashedPass = await bcrypt.hash(String(process.env.PASS),12);

    //define values for admin
    const Admin: Admin = {
      name: String(process.env.NAME),
      email: String(process.env.EMAIL),
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

    console.log(`${addedAdmin.name} as ${addedAdmin.role} & categories added`);
  } catch (err) {
    console.log(err);
  }
};

seedData();
