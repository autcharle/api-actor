import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class Staff extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        staffId: {
          autoIncrement: true,
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          field: "staff_id",
        },
        firstName: {
          type: DataTypes.STRING(45),
          allowNull: false,
          field: "first_name",
        },
        lastName: {
          type: DataTypes.STRING(45),
          allowNull: false,
          field: "last_name",
        },
        picture: {
          type: DataTypes.BLOB,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 1,
        },
        username: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        lastUpdate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "last_update",
        },
      },
      {
        sequelize,
        tableName: "staff",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "staff_id" }],
          },
          {
            name: "idx_fk_store_id",
            using: "BTREE",
            fields: [{ name: "store_id" }],
          },
          {
            name: "idx_fk_address_id",
            using: "BTREE",
            fields: [{ name: "address_id" }],
          },
        ],
      }
    );
  }
}
