import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("refunds", {
        refund_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "orders",
                key: "order_id",
            },
        },
        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        reason_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refund_type: {
            type: DataTypes.ENUM("Full", "Partial"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("Pending", "Processed", "Failed"),
            defaultValue: "Pending",
        },
        stripe_refund_id: {
            type: DataTypes.STRING,
            allowNull: true,
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

    await queryInterface.addIndex("refunds", ["order_id"]);
    await queryInterface.addIndex("refunds", ["vendor_id"]);
    await queryInterface.addIndex("refunds", ["status"]);
    await queryInterface.addIndex("refunds", ["reason_type"]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("refunds");
};
