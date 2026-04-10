import { DataTypes, QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn("otps", "deletedAt");
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn("otps", "deletedAt", {
    allowNull: true,
    type: DataTypes.DATE,
  });
};