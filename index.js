import express from "express";
import cors from "cors";

const app = express(); // Create an instance of express

const PORT = process.env.PORT || 4000; // Set the port to either the environment variable PORT or 4000
// Start the server and listen on the specified port

app.use(express.json()); // 🔑 This line is required to parse JSON body // This is a Global Middleware and gets applied to all routes handeled by the app

app.use(cors()); // This is a Third Party Middleware and gets applied to all routes handeled by the app
// This line enables CORS (Cross-Origin Resource Sharing) for all routes, allowing requests from different origins but it can also be used for specific routes only

const reqlogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
}; // This is a custom middleware function that logs the request method, URL, and timestamp

app.use(reqlogger); // Apply the custom middleware to all routes handled by the app
// If we dont want to apply it to all the requests just remove this code line and then call it with the particaular request only as done below in one request
// This is very useful when we want to create private nad public routes in our application

app.get("/", (req, res) => {
  res.send("This is the main server and is a GET call"); // Responds to GET requests at the root URL
});

app.get("/hello", (req, res) => {
  res.status(200).json({ Message: "This is the HELLO route of the server" }); // Responds to GET requests at /hello with a JSON object
});

app.get("/health", reqlogger, (req, res) => {
  console.log(req.query);

  res.send("The server is HEALTHY"); // Responds to GET requests at /health with a health status message
});

// Here if we want the middleware we created above to be applied to this request only or for few requests only we can chain them in the request only in the parameters only but we have to make sure to disable it at the top where its applied using the use keyword

app.post("/api/users", (req, res) => {
  console.log("Name:", req.body.name); // Logs the name from the request body

  res.json({ Message: "Recieved the name from the request body" });
});

app.post("/api/company", (req, res) => {
  throw new error("Something broke!");

  res.json({ message: "This is the company route of the server" });
}); // This route is for handling POST requests to /api/company and will throw an error to demonstrate error handling

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({ message: "Something went wrong" });
}); // This is an error handling middleware that catches errors and sends a response with a 500 status code and a message indicating that something went wrong
// This middleware should be defined after all other routes and middleware to catch any errors that occur in the application
// It logs the error stack to the console and sends a JSON response with an error message
// This is also a Global Middleware and gets applied to all routes handeled by the app

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`)); // This will log a message to the console when the server starts
