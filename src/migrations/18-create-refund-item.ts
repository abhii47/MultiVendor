import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("refund_items", {
        refund_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        refund_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "refunds",
                key: "refund_id",
            },
        },
        orderitem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "orderitems",
                key: "orderitem_id",
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
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

    await queryInterface.addIndex("refund_items", ["refund_id"]);
    await queryInterface.addIndex("refund_items", ["orderitem_id"]);
    await queryInterface.addIndex("refund_items", ["refund_id", "orderitem_id"]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("refund_items");
};
