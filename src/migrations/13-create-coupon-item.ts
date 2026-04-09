import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("couponitems", {
        couponitem_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "coupons",
                key: "coupon_id",
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

    await queryInterface.addIndex("couponitems", ["coupon_id"]);
    await queryInterface.addIndex("couponitems", ["product_id"]);
    await queryInterface.addIndex("couponitems", ["coupon_id", "product_id"], { unique: true });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("couponitems");
};
