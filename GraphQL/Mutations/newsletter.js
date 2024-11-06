// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import newsletterType from "../Types/newsletterType.js";

// ** SIB
import SibApiV3Sdk from "sib-api-v3-sdk";

const newsletter = {
  type: newsletterType,
  description: "To add a customer to newsletter",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      let defaultClient = SibApiV3Sdk.ApiClient.instance;

      let apiKey = defaultClient.authentications["api-key"];

      apiKey.apiKey = process.env.SIB_API_KEY;

      let apiInstance = new SibApiV3Sdk.ContactsApi();

      let createContact = new SibApiV3Sdk.CreateContact();

      createContact.email = args.email;
      createContact.listIds = [2]; // May differ

      const response = await apiInstance.createContact(createContact);

      const contactId = JSON.parse(JSON.stringify(response)).id;

      if (contactId) {
        return {
          status: 200,
          message: "Success",
        };
      } else {
        return {
          status: 400,
          message: "Error occurred",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: "Error occurred",
      };
    }
  },
};

export default newsletter;
