import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("orderitems", {
        orderitem_id: {
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
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "products",
                key: "product_id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled", "Delivered", "Returned"),
            defaultValue: "Pending",
        },
        refunded_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
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

    await queryInterface.addIndex("orderitems", ["order_id"]);
    await queryInterface.addIndex("orderitems", ["product_id"]);
    await queryInterface.addIndex("orderitems", ["order_id", "product_id"]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("orderitems");
};
