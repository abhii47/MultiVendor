import express from 'express';
import sequelize from './config/db';
import './models';
import cookieParser from 'cookie-parser';
import errHandler from './middlewares/errorMiddleware';
import { requestLogger } from './middlewares/logMiddleware';
import { startCronJobs } from './jobs/cronJobs';
import { loadEnv } from './config/env';

loadEnv();

const app = express();

//Parsing middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(requestLogger);

//Import Routes
import authRoutes from './routes/authRoute';
import vendorRoute from './routes/vendorRoute';
import categoryRoute from './routes/categoryRoute';
import productRoute from './routes/productRoute';
import cartRoute from './routes/cartRoute';
import userRoute from './routes/userRoute';
import orderRoute from './routes/orderRoute';
import adminRoute from './routes/adminRoute';
import reviewRoute from './routes/reviewRoute';
import couponRoute from './routes/couponRoute';

//Used Routes Middleware
app.use('/api/auth',authRoutes);
app.use('/api/vendor',vendorRoute);
app.use('/api/category',categoryRoute);
app.use('/api/product',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/user',userRoute);
app.use('/api/order',orderRoute);
app.use('/api/admin',adminRoute);
app.use('/api/review',reviewRoute);
app.use('/api/coupon',couponRoute);

//Global Error Handler
app.use(errHandler);

//ServerSetup
const serverStart = async() =>{
    try {
        //check databse connection
        await sequelize.authenticate();
        console.log("Database connected");

        // Sync all the table
        await sequelize.sync();
        console.log("Table Synced");

        //create server connection 
        const PORT = Number(process.env.PORT) || 3000;
        app.listen(PORT,()=>{
            console.log(`Server listening on ${PORT}`);
            if(process.env.NODE_ENV === "production"){
                startCronJobs();   
            }
        });

    } catch (err) {
        console.log("server can't connected",err);
    }
}

serverStart();
