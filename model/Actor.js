import { DataTypes } from "sequelize";
import sequelize from "../utils/helper.js";

const Actor = sequelize.define(
  "Actor",
  {
    actorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "actor_id",
    },
    firstName: {
      type: DataTypes.STRING(45),
      primaryKey: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(45),
      primaryKey: false,
      field: "last_name",
    },
    lastUpdate: {
      type: DataTypes.DATE,
      primaryKey: false,
      defaultValue: DataTypes.NOW,
      field: "last_update",
    },
  },
  {
    tableName: "actor",
    timestamps: false,
  }
);

export default Actor;
