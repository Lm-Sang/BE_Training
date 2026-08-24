export const requireAuth = (req, res, next) => {
  const tokenHeaders = req.headers["token-auth"];

  //If token is not provided, return an error
  if (!tokenHeaders || tokenHeaders !== "secrets123") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Please provide a valid token.",
    });
  }

  // If token is valid, proceed to the next middleware or route handler
  console.log(
    "Token is valid. Proceeding to the next middleware or route handler.",
  );
  next();
};

export const requireAdminRole = (req, res, next) => {
  const tokenHeaders = req.headers["token-auth"];

  if (!tokenHeaders || tokenHeaders !== "adminsecrets123") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Please provide a valid token.",
    });
  }

  console.log(
    "Token is valid. Proceeding to the next middleware or route handler.",
  );
  next();
};
