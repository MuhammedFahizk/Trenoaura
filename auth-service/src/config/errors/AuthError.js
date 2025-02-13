
import { GraphQLError } from "graphql";

class AuthError extends GraphQLError {
  constructor(message = "Authentication failed", feedback = "User is not authenticated.") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
        feedback,
      },
    });
  }
}

export default AuthError;


//   /**
//    * Converts authParams object into a formatted `key=value` string for headers
//    * @returns {string}
//    */
//   _stringifyAuthParams() {
//     let { realm = "Access to user account", ...others } = this.authParams;
//     let str = `realm="${realm}"`;

//     Object.entries(others).forEach(([key, value]) => {
//       str += `, ${key}="${value}"`;
//     });
//     console.log('str', str);
    
//     return str;
//   }
// }

// export default AuthorizationError;
