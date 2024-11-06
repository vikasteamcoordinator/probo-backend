// ** Types
import productSettingsType from "../Types/productSettingsType.js";

// ** Model
import { ProductSettings } from "../../models/productSettings.js";

const getProductSettings = {
  type: productSettingsType,
  description: "To get product settings value",
  resolve: async () => {
    try {
      const productSettings = await ProductSettings.findOne();

      return productSettings;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getProductSettings;
