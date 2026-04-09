import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("coupons", {
        coupon_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        coupon_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        coupon_type: {
            type: DataTypes.ENUM("Percentage", "Fixed"),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        max_user_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        deletedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    });

    await queryInterface.addIndex("coupons", ["coupon_code"], { unique: true });
    await queryInterface.addIndex("coupons", ["user_id"]);
    await queryInterface.addIndex("coupons", ["expiry_date"]);
    await queryInterface.addIndex("coupons", ["coupon_code", "expiry_date"]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("coupons");
};
