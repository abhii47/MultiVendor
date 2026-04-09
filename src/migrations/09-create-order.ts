import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("orders", {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.ENUM("Pending", "Paid", "PartiallyRefunded", "Refunded"),
            defaultValue: "Pending",
        },
        refunded_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        status: {
            type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled", "Delivered", "Returned"),
            defaultValue: "Pending",
        },
        charge_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "coupons",
                key: "coupon_id",
            },
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

    await queryInterface.addIndex("orders", ["user_id"]);
    await queryInterface.addIndex("orders", ["status"]);
    await queryInterface.addIndex("orders", ["user_id", "status"]);
    await queryInterface.addIndex("orders", ["createdAt"]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("orders");
};
