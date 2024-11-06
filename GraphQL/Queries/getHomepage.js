//** Types
import homepageType from "../Types/homepageType.js";

// ** Models
import Homepage from "../../models/homepage.js";

const getHomepage = {
  type: homepageType,
  description: "To get the homepage values",
  resolve: async () => {
    try {
      const homepage = await Homepage.findOne();

      return homepage;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getHomepage;
